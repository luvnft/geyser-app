import { Box, HStack, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BsImage } from 'react-icons/bs'
import { createUseStyles } from 'react-jss'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { FileUpload } from '../../../../components/molecules'
import { ImageWithReload } from '../../../../components/ui'
import Loader from '../../../../components/ui/Loader'
import { getPath, ID } from '../../../../constants'
import { ProjectEntryValidations } from '../../../../constants'
import { AppTheme, useAuthContext, useNavContext } from '../../../../context'
import { useDebounce } from '../../../../hooks'
import { useEntryState } from '../../../../hooks/graphqlState'
import { Entry, EntryStatus, EntryType, Owner, Project } from '../../../../types'
import { toInt, useMobileMode, useNotification } from '../../../../utils'
import { CreateNav } from './CreateNav'
import { ProjectEntryEditor } from './ProjectEntryEditor'

const useStyles = createUseStyles(({ colors }: AppTheme) => ({
  uploadContainer: {
    width: '100%',
    minHeight: '65px',
    borderRadius: '4px',
    backgroundColor: colors.neutral[100],
    justifyContent: 'center',
    transition: 'background-color 0.5s ease',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'neutral.400',
      transition: 'background-color 0.5s ease',
    },
  },
}))

export const defaultEntry = {
  id: 0,
  title: '',
  description: '',
  image: '',
  content: '',
  status: EntryStatus.Unpublished,
  type: EntryType.Article,
  createdAt: '',
  updatedAt: '',
  fundersCount: 0,
  amountFunded: 0,
  creator: { id: 0, username: '' },
  project: { id: 0, name: '', title: '' },
  publishedAt: '',
}

export const entryTemplateForGrantApplicants = {
  title: 'Application to Bitcoin Circular Economies',
  // eslint-disable-next-line prettier/prettier
  content: "{\"ops\":[{\"insert\":\"Only Bitcoin Circular Economies will be considered for this grant. Note the following:\\nYou must share a vision and plan for the Bitcoin circular economy you are building. \"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"Applications that are looking to only focus on education, events, content creation, travel, or other such requests do not quality for this grant. These should be part of a Bitcoin circular project.\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"Your application must provide the information requested within the four sections below. All applications will be evaluated according to information provided. Each application will receive an overall score out of 100%, with sections weighted as indicated below (ie, 10%, 30%, 30%, 30%). \"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"\\n\"},{\"attributes\":{\"color\":\"var(--chakra-colors-chakra-body-text)\",\"bold\":true},\"insert\":\"Core Project Details:\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"attributes\":{\"color\":\"var(--chakra-colors-chakra-body-text)\"},\"insert\":\"Where is your Bitcoin Circular Economy located (town, community, state, region)?\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"What problems and challenges are you and your community experiencing?\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"How can Bitcoin support your community? \"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"Why are you creating a Bitcoin Circular Economy? What inspired you to start it?\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"\\n\"},{\"attributes\":{\"color\":\"var(--chakra-colors-chakra-body-text)\",\"bold\":true},\"insert\":\"Proof of Work\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"attributes\":{\"color\":\"var(--chakra-colors-chakra-body-text)\"},\"insert\":\"Can you showcase your Circular Economy’s work and traction so far?\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"What activities have been done to date to build and advance a local Bitcoin circular economy? (Education, outreach with merchants to accept BTC, etc.)\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"\\n\"},{\"attributes\":{\"color\":\"var(--chakra-colors-chakra-body-text)\",\"bold\":true},\"insert\":\"Vision & Plan\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"attributes\":{\"color\":\"var(--chakra-colors-chakra-body-text)\"},\"insert\":\"What’s your vision and plan for evolving this circular economy? Provide some steps and goals that you are setting to grow the circular economy. \"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"What are the next steps/activities from your plan that this grant funding will enable?\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"What is the projected timeframe for using these funds to carry out these steps/activities? \"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"What amount are you requesting (5M sats, 2M sats, 1M sats)? Include a budget with some breakdown of projected costs (see sample budget on next page)\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"\\n\"},{\"attributes\":{\"color\":\"var(--chakra-colors-chakra-body-text)\",\"bold\":true},\"insert\":\"Impact & Sustainability\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"attributes\":{\"color\":\"var(--chakra-colors-chakra-body-text)\"},\"insert\":\"What are the projected outcomes of activities covered by the grant?\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"How will this funding and activities contribute to sustainability of your BTC circular economy project?\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"Are there other sources of funding that this grant will enable you to pursue?\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"\\n\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Sample Budget\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"insert\":\"The following is a sample budget for a project requesting a 2,000,000 sats grant to be used over a period of 8 months. This provides a sense of the minimum level of details we require for the budget. All amounts listed below are hypothetical and not based on actual costs in any particular region of the world. They are strictly for the purpose of illustrating the details we are requesting. Please provide additional description of the proposed activities within the four sections of the application as described above. The more detail you can provide about any targets you are aiming for, the better. \\n\\n-----\\n\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Timeline: Aug 2024 – March 2025\"},{\"attributes\":{\"header\":2},\"insert\":\"\\n\"},{\"insert\":\"\\nEDUCATION SESSIONS (3) & MEET-UPS (6)\\nSpace and food \\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t460,000 sats\\nMaterials \\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t350,000 sats\\nSats give away / cards \\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t225,000 sats\\n\\nMERCHANT EDUCATION / ADOPTION\\nMaterials (stickers, signs, handouts, etc) \\t\\t\\t\\t\\t175,000 sats\\nPromotion (small purchases at stores) \\t\\t\\t\\t\\t\\t115,000 sats\\n\\nPROJECT MANAGEMENT / VOLUNTEERS\\nHonoraria for volunteers\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t200,000 sats\\nPhone data, printing/promotion, other project costs\\t450,000 sats\\n\\nTOTAL\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t1,975,000 sats\\n\\n\\n\"}]}",
}

export const EntryCreateEdit = () => {
  const { t } = useTranslation()
  const isMobile = useMobileMode()
  const { toast } = useNotification()
  const navigate = useNavigate()
  const params = useParams<{ entryId: string; projectId: string }>()
  const { user } = useAuthContext()
  const { setNavData } = useNavContext()

  const location = useLocation()
  const { state } = location as { state: { grantId: number } }

  const entryTemplate = state?.grantId ? (entryTemplateForGrantApplicants as Entry) : undefined

  const classes = useStyles()

  const [isEdit, setIsEdit] = useState(false)
  const [focusFlag, setFocusFlag] = useState('')

  const { loading, saving, updateEntry, hasDiff, entry, saveEntry } = useEntryState(
    toInt(user?.ownerOf?.find((project) => project?.project?.name === params.projectId)?.project?.id || ''),
    params.entryId,
    {
      fetchPolicy: 'network-only',
      onError() {
        navigate(getPath('notFound'))
      },
      onCompleted(data) {
        if (data.entry === null) {
          navigate(getPath('notFound'))
        }

        const project = data.entry.project as Project

        if (!project.owners.some((owner) => owner.user.id === user.id)) {
          navigate(getPath('notAuthorized'))
        }

        setNavData({
          projectName: project.name,
          projectTitle: project.title,
          projectPath: getPath('project', project.name),
          projectOwnerIDs:
            project.owners.map((ownerInfo: Owner) => {
              return Number(ownerInfo.user.id || -1)
            }) || [],
        })
      },
    },
    entryTemplate,
  )
  const debouncedUpdateEntry = useDebounce(entry, entry.id ? 500 : 1000)

  useEffect(() => {
    if (debouncedUpdateEntry && debouncedUpdateEntry.status !== EntryStatus.Published) {
      saveEntry()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUpdateEntry])

  useEffect(() => {
    if (entry.id) {
      setIsEdit(true)
    }
  }, [entry])

  const handleContentUpdate = (name: string, value: string) => {
    updateEntry({ [name]: value })
  }

  const handleInput = (event: any) => {
    const { name, value } = event.target

    if (name === 'title' && value.length > ProjectEntryValidations.title.maxLength) {
      return
    }

    if (name === 'description' && value.length > ProjectEntryValidations.description.maxLength) {
      return
    }

    if (name) {
      updateEntry({ [name]: value })
    }
  }

  const onPreview = () => {
    if (isEdit) {
      navigate(getPath('projectEntryPreview', `${params.projectId}`, `${entry.id}`))
    } else {
      toast({
        title: 'Cannot preview',
        description: 'Please edit your content before preview',
        status: 'info',
      })
    }
  }

  const onBack = () => {
    navigate(getPath('project', params.projectId || ''))
  }

  const onImageUpload = (url: string) => updateEntry({ image: url })

  const handleKeyDown = (event: any) => {
    if (event) {
      if (event.target.name === 'title') {
        if (event.key === 'ArrowDown' || event.key === 'Enter') {
          event.preventDefault()
          document.getElementById('entry-description-input')?.focus()
        }
      } else if (event.target.name === 'description') {
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          document.getElementById('entry-title-input')?.focus()
        } else if (event.key === 'ArrowDown' || event.key === 'Tab' || event.key === 'Enter') {
          event.preventDefault()
          const newDate = new Date()
          setFocusFlag(newDate.toISOString())
        }
      }
    }
  }

  const getSaveButtonText = () => {
    if (saving) {
      return 'Saving'
    }

    if (isEdit) {
      if (hasDiff) {
        return 'Save'
      }

      return 'Saved'
    }

    return 'Save draft'
  }

  if (loading) {
    return <Loader />
  }

  const isPublished = entry.status === EntryStatus.Published

  return (
    <>
      <CreateNav
        isSaving={saving}
        saveText={t(getSaveButtonText())}
        onSave={saveEntry}
        onPreview={!isPublished ? onPreview : undefined}
        onBack={onBack}
      />
      <VStack
        background={'neutral.0'}
        position="relative"
        paddingTop={isMobile ? '0px' : '15px'}
        height="100%"
        justifyContent="space-between"
      >
        <Box
          id={ID.entry.editEntryScrollContainer}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          overflowY="auto"
          marginBottom="70px"
        >
          <VStack
            spacing="20px"
            width="100%"
            height="100%"
            maxWidth="1080px"
            padding={isMobile ? '0px 10px' : '0px 40px'}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            paddingBottom="80px"
          >
            <Box marginTop="20px" width="100%" px="15px">
              <FileUpload onUploadComplete={onImageUpload}>
                <>
                  {entry.image ? (
                    <HStack
                      width={'100%'}
                      justifyContent="center"
                      maxHeight="400px"
                      borderRadius="4px"
                      overflow="hidden"
                    >
                      <ImageWithReload width="100%" objectFit="cover" src={entry.image} />
                    </HStack>
                  ) : (
                    <HStack className={classes.uploadContainer}>
                      <BsImage />
                      <Text> {t('Select a header image')}</Text>
                    </HStack>
                  )}
                </>
              </FileUpload>
            </Box>

            <VStack width="100%">
              <Input
                id={'entry-title-input'}
                border="none"
                _focus={{ border: 'none' }}
                _focusVisible={{}}
                placeholder={t('The Entry Title')}
                color="neutral.700"
                fontSize={isMobile ? '35px' : '40px'}
                fontWeight={700}
                paddingBottom="5px"
                paddingX="15px"
                name="title"
                value={entry.title}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
              />

              <Textarea
                id={'entry-description-input'}
                border="none"
                _focus={{ border: 'none' }}
                _focusVisible={{}}
                placeholder={t('The summary of this entry')}
                color="neutral.700"
                fontSize={isMobile ? '20px' : '26px'}
                paddingX="15px"
                fontWeight={600}
                name="description"
                value={entry.description}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
              />
            </VStack>

            <Box flex={1} width="100%">
              <ProjectEntryEditor
                name="content"
                handleChange={handleContentUpdate}
                value={entry.content as string}
                focusFlag={focusFlag}
                placeholder={t('The body of this entry')}
              />
            </Box>
          </VStack>
        </Box>
      </VStack>
    </>
  )
}
