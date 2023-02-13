import { ApolloError, useLazyQuery } from '@apollo/client'
import { useDisclosure } from '@chakra-ui/react'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'

import { AUTH_SERVICE_ENDPOINT } from '../constants'
import { defaultUser } from '../defaults'
import { ME } from '../graphql'
import { User } from '../types/generated/graphql'

const defaultContext: AuthContextProps = {
  isLoggedIn: false,
  user: defaultUser,
  loading: false,
  error: undefined,
  logout() {},
  isAuthModalOpen: false,
  isUserAProjectCreator: false,
  loginOnOpen() {},
  loginOnClose() {},
  setIsLoggedIn() {},
  queryCurrentUser() {},
  setUser(user: User) {},
}

export type NavContextProps = {
  projectName: string
  projectTitle: string
  projectPath: string
  projectOwnerIDs: number[]
}

type AuthContextProps = {
  isLoggedIn: boolean
  user: User
  loading: boolean
  error?: ApolloError
  logout: () => void
  isAuthModalOpen: boolean
  loginOnOpen: () => void
  loginOnClose: () => void
  isUserAProjectCreator: boolean
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
  queryCurrentUser: () => void
  setUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextProps>(defaultContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(false)

  const [user, setUser] = useState<User>(defaultUser)

  const [isUserAProjectCreator, setIsUserAProjectCreator] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [queryCurrentUser, { loading: loadingUser, error }] = useLazyQuery(ME, {
    onCompleted(data: { me: User }) {
      if (data && data.me) {
        setUser({ ...defaultUser, ...data.me })
        setIsLoggedIn(true)
        setIsUserAProjectCreator(data.me.ownerOf?.length > 0)
      }
    },
  })

  const {
    isOpen: loginIsOpen,
    onOpen: loginOnOpen,
    onClose: loginOnClose,
  } = useDisclosure()

  const logout = () => {
    setUser(defaultUser)

    fetch(`${AUTH_SERVICE_ENDPOINT}/logout`, {
      credentials: 'include',
    }).catch((error) => console.error(error))
  }

  useEffect(() => {
    try {
      queryCurrentUser()
    } catch (_) {
      setIsLoggedIn(false)
    }

    setInitialLoad(true)
  }, [])

  useEffect(() => {
    if (user.id === 0) {
      setIsLoggedIn(false)
    } else {
      setIsLoggedIn(true)
    }
  }, [user])

  useEffect(() => {
    if (initialLoad) {
      setLoading(loadingUser)
    }
  }, [loadingUser])

  return (
    <AuthContext.Provider
      value={{
        user,
        queryCurrentUser,
        setUser,
        loading,
        error,
        isLoggedIn,
        setIsLoggedIn,
        isUserAProjectCreator,
        logout,
        isAuthModalOpen: loginIsOpen,
        loginOnOpen,
        loginOnClose,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
