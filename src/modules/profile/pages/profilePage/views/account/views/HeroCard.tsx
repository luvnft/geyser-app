import { Box, forwardRef, VStack } from '@chakra-ui/react'
import { t } from 'i18next'

import { ImageWithReload } from '@/components/ui'
import { Body } from '@/shared/components/typography'
import {
  HeroCardContributedEnabledRaised,
  HeroCardContributedRaisedEnabled,
  HeroCardEmpty,
  HeroCardEnabledContributedRaised,
  HeroCardEnabledRaisedContributed,
  HeroCardRaisedContributedEnabled,
  HeroCardRaisedEnabledContributed,
} from '@/shared/constants'
import { fonts, lightModeColors } from '@/shared/styles'

import { UserForProfilePageFragment, UserHeroStats } from '../../../../../../../types'
import { getShortAmountLabel } from '../../../../../../../utils'

const heroBackgroundMap = {
  raisedEnabledContributed: HeroCardRaisedEnabledContributed,
  raisedContributedEnabled: HeroCardRaisedContributedEnabled,
  enabledRaisedContributed: HeroCardEnabledRaisedContributed,
  enabledContributedRaised: HeroCardEnabledContributedRaised,
  empty: HeroCardEmpty,
  contributedEnabledRaised: HeroCardContributedEnabledRaised,
  contributedRaisedEnabled: HeroCardContributedRaisedEnabled,
}

export const HeroCard = forwardRef(
  ({ user, stats }: { user: UserForProfilePageFragment; stats: UserHeroStats }, ref) => {
    const amabassadorRank = stats.ambassadorStats.rank
    const creatorRank = stats.creatorStats.rank
    const contributorRank = stats.contributorStats.rank

    const ambassadorAmount = stats.ambassadorStats.contributionsTotal
    const creatorAmount = stats.creatorStats.contributionsTotal
    const contributorAmount = stats.contributorStats.contributionsTotal

    const getHeroBackground = () => {
      if (
        stats.ambassadorStats.contributionsTotal > 0 ||
        stats.creatorStats.contributionsTotal > 0 ||
        stats.contributorStats.contributionsTotal > 0
      ) {
        if (creatorAmount > ambassadorAmount && ambassadorAmount > contributorAmount) {
          return heroBackgroundMap.raisedEnabledContributed
        }

        if (creatorAmount > contributorAmount && contributorAmount > ambassadorAmount) {
          return heroBackgroundMap.raisedContributedEnabled
        }

        if (ambassadorAmount > creatorAmount && creatorAmount > contributorAmount) {
          return heroBackgroundMap.enabledRaisedContributed
        }

        if (ambassadorAmount > contributorAmount && contributorAmount > creatorAmount) {
          return heroBackgroundMap.enabledContributedRaised
        }

        if (contributorAmount > ambassadorAmount && ambassadorAmount > creatorAmount) {
          return heroBackgroundMap.contributedEnabledRaised
        }

        if (contributorAmount > creatorAmount && creatorAmount > ambassadorAmount) {
          return heroBackgroundMap.contributedRaisedEnabled
        }

        return heroBackgroundMap.empty
      }
    }

    return (
      <VStack
        ref={ref}
        w="330px"
        h="430px"
        py={10}
        position="relative"
        backgroundImage={`url(${getHeroBackground()})`}
        backgroundSize="contain"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        color="blackAlpha.800"
        justifyContent={'space-between'}
        fontFamily={fonts.hubotSans}
      >
        <Body
          as="span"
          position="absolute"
          top={'7px'}
          backgroundColor="transparent"
          color="white"
          paddingX="2"
          fontSize="xs"
        >
          Block: 800,345
        </Body>
        <VStack>
          <VStack spacing="0" mt={4}>
            {/* User info */}
            <Box w="80px" h="80px" borderRadius="full" overflow="hidden">
              <ImageWithReload src={user?.imageUrl} alt="Profile" w="100%" h="100%" objectFit="cover" />
            </Box>
            <Body fontSize="2xl" fontWeight="bold" color={lightModeColors.neutralAlpha[11]}>
              {user?.username || 'Anonymous Hero'}
            </Body>
          </VStack>
        </VStack>

        {/* Stats */}
        <VStack spacing={4} align="stretch" alignItems="center" alignContent="center">
          <VStack spacing={0} w="full">
            <Body fontSize="lg" color={lightModeColors.neutralAlpha[11]}>
              {t('Contributor Ranking')}:{' '}
              <Body as="span" color={lightModeColors.neutralAlpha[12]}>
                {contributorRank}
              </Body>
            </Body>
            <Body fontSize="sm" color={lightModeColors.neutralAlpha[9]}>
              Contributed {getShortAmountLabel(stats.contributorStats.contributionsTotal)} sats ($
              {getShortAmountLabel(stats.contributorStats.contributionsTotalUsd)}) to{' '}
              {stats.contributorStats.projectsCount} projects
            </Body>
          </VStack>

          <VStack spacing={0} w="full">
            <Body fontSize="lg" color={lightModeColors.neutralAlpha[11]}>
              {t('Ambassador Ranking')}:{' '}
              <Body as="span" color={lightModeColors.neutralAlpha[12]}>
                {amabassadorRank}
              </Body>
            </Body>
            <Body fontSize="sm" color={lightModeColors.neutralAlpha[9]}>
              Enabled {getShortAmountLabel(stats.ambassadorStats.contributionsTotal)} sats ($
              {getShortAmountLabel(stats.ambassadorStats.contributionsTotalUsd)}) to{' '}
              {stats.ambassadorStats.projectsCount} projects
            </Body>
          </VStack>

          <VStack spacing={0} w="full">
            <Body fontSize="lg" color={lightModeColors.neutralAlpha[11]}>
              {t('Creator Ranking')}:{' '}
              <Body as="span" color={lightModeColors.neutralAlpha[12]}>
                {creatorRank}
              </Body>
            </Body>
            <Body fontSize="sm" color={lightModeColors.neutralAlpha[9]}>
              Raised {getShortAmountLabel(stats.creatorStats.contributionsTotal)} sats ($
              {getShortAmountLabel(stats.creatorStats.contributionsTotalUsd)}) to {stats.creatorStats.projectsCount}{' '}
              projects
            </Body>
          </VStack>
        </VStack>
      </VStack>
    )
  },
)
