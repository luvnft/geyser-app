import { HStack, Image, StackProps } from '@chakra-ui/react'

import { SatoshiPng } from '../../../../assets'
import { Caption, MonoBody1 } from '../../../../components/typography'
import { Project } from '../../../../types'

interface LeaderboardFundingStatsProps extends StackProps {
  funders: Project['fundersCount']
  funded: Project['balance']
}

export const LeaderboardFundingStats = ({
  funders,
  funded,
  ...rest
}: LeaderboardFundingStatsProps) => {
  return (
    <HStack w="full" spacing="20px" {...rest}>
      <HStack spacing="4px">
        <MonoBody1 semiBold>{funders}</MonoBody1>
        <Caption>FUNDERS</Caption>
      </HStack>
      <HStack spacing="4px">
        <Image src={SatoshiPng} height="18px" />
        <MonoBody1 semiBold>{funded}</MonoBody1>
        <Caption>FUNDED</Caption>
      </HStack>
    </HStack>
  )
}
