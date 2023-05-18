import { Image } from '@chakra-ui/image'
import { Box, BoxProps } from '@chakra-ui/layout'
import { useBreakpointValue } from '@chakra-ui/media-query'
import { useColorMode } from '@chakra-ui/system'
import { createUseStyles } from 'react-jss'
import { Link } from 'react-router-dom'

import LogoSmall from '../../assets/logo-brand.svg'
import LogoDark from '../../assets/logo-dark.svg'
import { LogoNameBrand } from '../../constants'

type Props = BoxProps & {
  className?: string
  imageClassName?: string
  full?: boolean
  small?: boolean
}

const useStyles = createUseStyles({
  container: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

export const NavBarLogo = ({
  className,
  imageClassName,
  full,
  small,
  ...rest
}: Props) => {
  const classes = useStyles()
  const { colorMode } = useColorMode()

  const isLg = useBreakpointValue({ lg: true, base: false })

  const useFullOne = (isLg || full) && !small

  const imageToUse =
    colorMode === 'light'
      ? useFullOne
        ? LogoNameBrand
        : LogoSmall
      : useFullOne
      ? LogoNameBrand
      : LogoDark

  return (
    <Box {...rest} className={`${classes.container} ${className}`}>
      <Link to="/">
        <Image
          className={imageClassName}
          height="32px"
          src={imageToUse}
          alt="geyser logo image"
          objectFit="contain"
        />
      </Link>
    </Box>
  )
}
