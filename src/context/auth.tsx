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
import { ME, ME_PROJECT_FOLLOWS } from '../graphql'
import { Project, User } from '../types/generated/graphql'

const defaultContext: AuthContextProps = {
  isLoggedIn: false,
  user: defaultUser,
  loading: false,
  error: undefined,
  login() {},
  logout() {},
  isAuthModalOpen: false,
  isUserAProjectCreator: false,
  loginOnOpen() {},
  loginOnClose() {},
  setIsLoggedIn() {},
  queryCurrentUser() {},
  async getAuthToken() {
    return false
  },
  setUser(user: User) {},
  followedProjects: [],
  queryFollowedProjects() {},
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
  login: (me: User) => void
  logout: () => void
  isAuthModalOpen: boolean
  loginOnOpen: () => void
  loginOnClose: () => void
  isUserAProjectCreator: boolean
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
  queryCurrentUser: () => void
  getAuthToken: () => Promise<boolean>
  setUser: (user: User) => void
  followedProjects: Project[]
  queryFollowedProjects: () => void
}

export const AuthContext = createContext<AuthContextProps>(defaultContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(false)

  const [user, setUser] = useState<User>(defaultUser)
  const [followedProjects, setFollowedProjects] = useState<Project[]>([])

  const [isUserAProjectCreator, setIsUserAProjectCreator] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [queryCurrentUser, { loading: loadingUser, error }] = useLazyQuery(ME, {
    onCompleted(data: { me: User }) {
      if (data && data.me) {
        login(data.me)
      }
    },
  })

  const login = (me: User) => {
    setUser({ ...defaultUser, ...me })
    setIsLoggedIn(true)
    setIsUserAProjectCreator(me.ownerOf?.length > 0)
  }

  const getAuthToken = async () => {
    try {
      const response = await fetch(`${AUTH_SERVICE_ENDPOINT}/auth-token`, {
        credentials: 'include',
        redirect: 'follow',
      })

      if (response.status >= 200 && response.status < 400) {
        return true
      }

      return false
    } catch (e) {
      return false
    }
  }

  const [queryFollowedProjects] = useLazyQuery<{ me: User }>(
    ME_PROJECT_FOLLOWS,
    {
      fetchPolicy: 'network-only',
      onCompleted(data) {
        if (data?.me?.projectFollows) {
          setFollowedProjects(data?.me.projectFollows as Project[])
        }
      },
    },
  )

  const {
    isOpen: loginIsOpen,
    onOpen: loginOnOpen,
    onClose: loginOnClose,
  } = useDisclosure()

  const logout = () => {
    setUser(defaultUser)
    setFollowedProjects([])

    fetch(`${AUTH_SERVICE_ENDPOINT}/logout`, {
      credentials: 'include',
    }).catch((error) => console.error(error))
  }

  useEffect(() => {
    try {
      queryCurrentUser()
      queryFollowedProjects()
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
        login,
        logout,
        isAuthModalOpen: loginIsOpen,
        loginOnOpen,
        loginOnClose,
        followedProjects,
        queryFollowedProjects,
        getAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
