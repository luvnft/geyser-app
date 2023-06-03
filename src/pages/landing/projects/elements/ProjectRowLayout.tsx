import { ChevronRightIcon } from '@chakra-ui/icons'
import { Box, HStack, StackProps, VStack } from '@chakra-ui/react'

import { H3 } from '../../../../components/typography'
import { ButtonComponent } from '../../../../components/ui'

export interface ProjectRowLayoutProps extends StackProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  onSeeAllClick?: () => void
  seeAllText?: string
}

export const ProjectRowLayout = ({
  title,
  subtitle,
  children,
  onSeeAllClick,
  seeAllText,
  ...rest
}: ProjectRowLayoutProps) => {
  return (
    <VStack alignItems="start" spacing="10px" {...rest}>
      <HStack width="100%" justifyContent="space-between">
        <H3 color="primary.600">
          {subtitle && (
            <Box as="span" color="neutral.800" paddingRight="10px">
              {subtitle}
            </Box>
          )}
          {title}
        </H3>
        {onSeeAllClick && (
          <ButtonComponent
            size="sm"
            noBorder
            rightIcon={<ChevronRightIcon fontSize="25px" />}
            onClick={onSeeAllClick}
          >
            {seeAllText || 'See all'}
          </ButtonComponent>
        )}
      </HStack>
      {children}
    </VStack>
  )
}
