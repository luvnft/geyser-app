import { useQuery } from '@apollo/client'

import { useFilterContext } from '../../../../context'
import {
  OrderByOptions,
  Project,
  ProjectsGetQueryInput,
  ProjectsResponse,
  Tag,
} from '../../../../types'
import { QUERY_PROJECTS_FOR_LANDING_PAGE } from '../../projects.graphql'
import { ProjectDisplayBody } from '../elements'

interface ProjectDisplayProps {
  tag?: Tag
}

const NO_OF_PROJECT_TO_LOAD = 3

export const ProjectsDisplay = ({ tag }: ProjectDisplayProps) => {
  const { updateFilter, updateSort } = useFilterContext()

  const { data, loading } = useQuery<
    { projects: ProjectsResponse },
    { input: ProjectsGetQueryInput }
  >(QUERY_PROJECTS_FOR_LANDING_PAGE, {
    variables: {
      input: {
        where: {
          tagIds: tag ? [tag.id] : [],
        },
        pagination: { take: NO_OF_PROJECT_TO_LOAD },
      },
    },
  })

  const onSeeAllClick = () => {
    if (tag) {
      updateFilter({ tagIds: [tag.id] })
      updateSort({ createdAt: OrderByOptions.Desc })
    } else {
      updateFilter({ recent: true })
      updateSort({ createdAt: OrderByOptions.Desc })
    }
  }

  const projectList = (data?.projects.projects.slice(0, 3) as Project[]) || []

  if (loading) {
    return null
  }

  return (
    <ProjectDisplayBody
      title={tag?.label || 'Recent Projects'}
      subtitle={tag?.label ? 'Trending in' : ''}
      projects={projectList}
      onSeeAllClick={onSeeAllClick}
    />
  )
}
