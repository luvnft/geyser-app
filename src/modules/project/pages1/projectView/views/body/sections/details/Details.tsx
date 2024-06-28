import { Badge, Button, HStack, Wrap } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { DateTime } from 'luxon'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useProjectAtom } from '@/modules/project/hooks/useProjectAtom'
import { projectDetailsLoadingAtom } from '@/modules/project/state/projectAtom'
import { Body } from '@/shared/components/typography'

import { getPath, ID } from '../../../../../../../../constants'
import { SortType } from '../../../../../../../../context'
import { CardLayout } from '../../../../../../../../shared/components/layouts'
import { BodySectionLayout } from '../../components'
import { CreatorSocial } from '../header/components/CreatorSocial'
import { ProjectLinks } from './components/ProjectLinks'

export const Details = () => {
  const { t } = useTranslation()
  const { loading, project } = useProjectAtom()
  const projectDetailsLoading = useAtomValue(projectDetailsLoadingAtom)

  if (loading || projectDetailsLoading) {
    return null
  }

  return (
    <BodySectionLayout title={t('Project details')}>
      <CardLayout w="full" id={ID.project.details.container}>
        <DetailLine title={t('Creator')}>
          <CreatorSocial />
        </DetailLine>
        <DetailLine title={t('Project links')} empty={!project.links.length}>
          <ProjectLinks links={project.links} />
        </DetailLine>

        <DetailLine title={t('Tags')} empty={!project.tags.length}>
          <Wrap>
            {project.tags.map((tag) => {
              return (
                <Link
                  key={tag.id}
                  to={getPath('landingPage')}
                  state={{
                    filter: { tagIds: [tag.id], sort: SortType.balance },
                  }}
                >
                  <Badge size="sm" variant="surface" colorScheme={tagColorScheme(tag.id)}>
                    {tag.label}
                  </Badge>
                </Link>
              )
            })}
          </Wrap>
        </DetailLine>

        <DetailLine title={t('Location')} empty={!project?.location?.country?.name && !project?.location?.region}>
          <Wrap spacing="5px">
            {project?.location?.country?.name && project.location.country.name !== 'Online' && (
              <Button
                as={Link}
                to={getPath('landingPage')}
                state={{
                  filter: {
                    countryCode: project?.location?.country?.code,
                    sort: SortType.balance,
                  },
                }}
                size="xs"
                variant="outline"
                colorScheme="neutral1"
              >
                {project?.location?.country?.name}
              </Button>
            )}
            {project?.location?.region && (
              <Button
                as={Link}
                to={getPath('landingPage')}
                state={{
                  filter: {
                    region: project?.location?.region,
                    sort: SortType.balance,
                  },
                }}
                size="xs"
                variant="outline"
                colorScheme="neutral1"
              >
                {project?.location?.region}
              </Button>
            )}
          </Wrap>
        </DetailLine>

        <DetailLine title={t('Location')}>
          <Body size="xs" medium dark>{`${t('Launched')} ${DateTime.fromMillis(Number(project.createdAt)).toFormat(
            'dd LLL yyyy',
          )}`}</Body>
        </DetailLine>
      </CardLayout>
    </BodySectionLayout>
  )
}

export const DetailLine = ({ title, empty, children }: PropsWithChildren<{ title: string; empty?: boolean }>) => {
  if (empty) {
    return null
  }

  return (
    <HStack w="full">
      <Body size="xs" medium light>
        {`${title}: `}
      </Body>
      {children}
    </HStack>
  )
}

const tagColorScheme = (id: number) => {
  const list = [
    'primary1',
    'neutral1',
    'error',
    'success',
    'info',
    'warning',
    'tomato',
    'ruby',
    'crimson',
    'pink',
    'plum',
    'purple',
    'violet',
    'iris',
    'indigo',
    'blue',
    'cyan',
    'teal',
    'green',
    'jade',
    'grass',
    'orange',
    'brown',
    'mint',
    'yellow',
    'bronze',
    'gold',
  ]

  const index = id % list.length
  return list[index]
}
