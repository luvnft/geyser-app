import { RefObject, useMemo } from 'react'

import { ProjectFragment } from '../../../../../../../types'

export type ProjectAnchorRefs = {
  header: RefObject<HTMLDivElement>
  entries: RefObject<HTMLDivElement>
  rewards: RefObject<HTMLDivElement>
}

export type ProjectDetails = {
  entriesLength: number
  rewardsLength: number
}

export const useProjectDetails = (
  project: Pick<ProjectFragment, 'entries' | 'rewards'> | null = null,
): ProjectDetails => {
  const entriesLength = useMemo(() => (project && project.entries ? project.entries.length : 0), [project])
  const rewardsLength = useMemo(() => {
    const activeProjectRewards =
      project && project.rewards && project.rewards.filter((reward) => reward.isHidden === false)
    return activeProjectRewards ? activeProjectRewards.length : 0
  }, [project])
  // const milestonesLength = useMemo(() => (project && project.milestones ? project.milestones.length : 0), [project])

  return {
    entriesLength,
    rewardsLength,
  }
}
