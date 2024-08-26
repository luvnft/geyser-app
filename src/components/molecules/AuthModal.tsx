import { Box, Stack, Text } from '@chakra-ui/layout'
import { HStack, VStack } from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { Modal } from '@/shared/components/layouts'

import { useAuthContext } from '../../context'
import { SocialAccountType } from '../../pages/auth'
import { ConnectWithLightning } from '../../pages/auth/ConnectWithLightning'
import { ConnectWithNostr } from '../../pages/auth/ConnectWithNostr'
import {
  ConnectWithSocial,
  TWITTER_AUTH_ATTEMPT_KEY,
  TWITTER_AUTH_ATTEMPT_MESSAGE_TIME_MILLIS,
} from '../../pages/auth/ConnectWithSocial'
import { useRefreshAuthToken } from '../../pages/auth/useAuthToken'
import {
  hasFacebookAccount,
  hasGithubAccount,
  hasGoogleAccount,
  hasNostrAccount,
  hasTwitterAccount,
  useMobileMode,
} from '../../utils'
import { Body2, Caption } from '../typography'
import { ButtonComponent } from '../ui'

interface IAuthModal {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  showTwitter?: boolean
  showNostr?: boolean
  showLightning?: boolean
  showFacebook?: boolean
  showGoogle?: boolean
  showGithub?: boolean
  privateRoute?: boolean
}

const ConnectAccounts = ({
  onClose,
  showTwitter,
  showFacebook,
  showNostr,
  showLightning,
  showGoogle,
  showGithub,
}: any) => {
  const { t } = useTranslation()
  const { user } = useAuthContext()

  const [failedTwitter, setFailedTwitter] = useState(false)

  useEffect(() => {
    const val = localStorage.getItem(TWITTER_AUTH_ATTEMPT_KEY)

    const previousAttemptTimeStamp = Number(val)
    const currentTimestamp = DateTime.now().toMillis()

    if (
      previousAttemptTimeStamp &&
      currentTimestamp - previousAttemptTimeStamp < TWITTER_AUTH_ATTEMPT_MESSAGE_TIME_MILLIS
    ) {
      setFailedTwitter(true)
    } else {
      setFailedTwitter(false)
    }
  }, [])

  return (
    <VStack justifyContent="center" alignItems="center">
      <Stack width="100%" spacing="10px">
        {!hasNostrAccount(user) && showNostr && <ConnectWithNostr onClose={onClose} />}
        {!hasTwitterAccount(user) && showTwitter && (
          <ConnectWithSocial accountType={SocialAccountType.twitter} onClose={onClose} />
        )}
        {!hasFacebookAccount(user) && showFacebook && (
          <ConnectWithSocial accountType={SocialAccountType.facebook} onClose={onClose} />
        )}
        {/* <ConnectWithEmail onClose={onClose} /> */}

        <Body2 color="neutral.900">{t('More connect options')}</Body2>
        <HStack w="full" spacing="20px">
          {!hasGoogleAccount(user) && showGoogle && (
            <ConnectWithSocial accountType={SocialAccountType.google} onClose={onClose} isIconOnly flex={1} />
          )}

          {showLightning && <ConnectWithLightning flex={1} onClose={onClose} isIconOnly />}
          {!hasGithubAccount(user) && showGithub && (
            <ConnectWithSocial flex={1} accountType={SocialAccountType.github} onClose={onClose} isIconOnly />
          )}
        </HStack>
      </Stack>
      {failedTwitter && (
        <Caption paddingTop="5px">
          {t(
            "If you're having trouble connecting with Twitter on Mobile, first try logging in on Twitter.com on your browser, then try again.",
          )}
        </Caption>
      )}
    </VStack>
  )
}

export const AuthModal = (authModalProps: IAuthModal) => {
  const { t } = useTranslation()
  const isMobile = useMobileMode()
  const {
    isOpen,
    onClose,
    title,
    description,
    showTwitter = true,
    showNostr = true,
    showLightning = true,
    showFacebook = true,
    showGoogle = true,
    showGithub = true,
    privateRoute = false,
  } = authModalProps

  const navigate = useNavigate()
  const location = useLocation()

  useRefreshAuthToken(isOpen)

  const handlePrivateRouteModalClose = () => {
    if (privateRoute) {
      if (location.key) {
        navigate(-1)
      } else {
        navigate('/')
      }
    }
  }

  const modalTitle = t(title || 'Login')
  const modalDescription = t(
    description ||
      'Connect your social account with the biggest social proof, allowing users to discover you and verify your reputation more easily',
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={!privateRoute ? onClose : () => {}}
      size="sm"
      closeOnOverlayClick={!privateRoute}
      closeOnEsc={!privateRoute}
      onOverlayClick={handlePrivateRouteModalClose}
      onEsc={handlePrivateRouteModalClose}
      title={modalTitle}
    >
      <Box justifyContent="center" alignItems="center" paddingTop={3}>
        {modalDescription && <Text marginBottom={5}>{modalDescription}</Text>}
        <ConnectAccounts
          onClose={onClose}
          showNostr={showNostr && !isMobile}
          showTwitter={showTwitter}
          showLightning={showLightning}
          showFacebook={showFacebook}
          showGoogle={showGoogle}
          showGithub={showGithub}
        />
      </Box>
      {privateRoute && (
        <Box display="flex" justifyContent="center" alignItems="center" marginTop={5}>
          <ButtonComponent onClick={handlePrivateRouteModalClose}>
            {t(location.key ? 'Go back' : 'Go home')}
          </ButtonComponent>
        </Box>
      )}
    </Modal>
  )
}
