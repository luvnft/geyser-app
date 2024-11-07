import { IconType } from 'react-icons'
import { PiCompass, PiRanking, PiRocketLaunch, PiTrophy, PiTShirt, PiWaveform } from 'react-icons/pi'

import { PathsMap } from '@/shared/constants'

export enum DiscoveryNavItemKey {
  Discover = 'discover',
  MyProjects = 'myProjects',
  Activity = 'activity',
  Leaderboard = 'leaderboard',
  Grants = 'grants',
  Merch = 'merch',
}

export type DiscoveryNavItem = {
  label: string
  key: DiscoveryNavItemKey
  path: keyof PathsMap
  icon: IconType
  bottomNav: boolean
}

export const discoveryNavItems: DiscoveryNavItem[] = [
  {
    label: 'Discover',
    key: DiscoveryNavItemKey.Discover,
    path: 'discoveryLanding',
    icon: PiCompass,
    bottomNav: true,
  },
  {
    label: 'My Projects',
    key: DiscoveryNavItemKey.MyProjects,
    path: 'discoveryMyProjects',
    icon: PiRocketLaunch,
    bottomNav: true,
  },
  {
    label: 'Activity',
    key: DiscoveryNavItemKey.Activity,
    path: 'discoveryActivity',
    icon: PiWaveform,
    bottomNav: true,
  },
  {
    label: 'Leaderboard',
    key: DiscoveryNavItemKey.Leaderboard,
    path: 'discoveryLeaderboard',
    icon: PiRanking,
    bottomNav: true,
  },
  {
    label: 'Grants',
    key: DiscoveryNavItemKey.Grants,
    path: 'discoveryGrants',
    icon: PiTrophy,
    bottomNav: true,
  },
  {
    label: 'Merch',
    key: DiscoveryNavItemKey.Merch,
    path: 'discoveryMerch',
    icon: PiTShirt,
    bottomNav: false,
  },
]
