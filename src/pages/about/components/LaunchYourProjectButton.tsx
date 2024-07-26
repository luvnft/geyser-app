import { Button, ButtonProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAuthContext } from '../../../context'
import { getPath } from '../../../shared/constants'

export const LaunchYourProjectButton = (props: ButtonProps) => {
  const { t } = useTranslation()

  const { isLoggedIn } = useAuthContext()
  return (
    <Button as={Link} to={isLoggedIn ? getPath('launch') : getPath('launchStart')} {...props}>
      {t('Launch your project')}
    </Button>
  )
}
