import 'websocket-polyfill'

import { Filter, getEventHash, Relay, relayInit } from 'nostr-tools'
import { Event } from 'nostr-tools'
import { useEffect, useState } from 'react'

import { VITE_APP_GEYSER_NOSTR_PUBKEY } from '../constants'
import { signEvent } from '../utils/nostr/nip07'
import { useDebounce } from './useDebounce'

const relayUri = 'wss://relay.damus.io'
// [
//   ,
//   'wss://relay.snort.social',
//   // 'wss://nos.lol',
// ]

export type ClaimABadgeProps = {
  badgeId: string
  badgeAwardId: string
  onFail?: any
  isClaiming?: (claiming: boolean) => void
}

export const useNostrBadges = (pubKey: string) => {
  const [relay, setRelay] = useState<Relay>()

  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(true)

  const [badgeIds, setBadgeIds] = useState<string[]>([])
  const [badges, setBadges] = useState<NostrBadges[]>([])

  const debouncedBadgeIds = useDebounce(badgeIds, 1000)

  useEffect(() => {
    const handleFetchBadges = async () => {
      const badgeFilter = {} as Filter

      badgeFilter.kinds = [30009]
      badgeFilter.authors = [VITE_APP_GEYSER_NOSTR_PUBKEY]
      badgeFilter['#d'] = debouncedBadgeIds

      const events = await relay?.list([badgeFilter])

      if (events) {
        const parsedBadges = parseBadgesFromDefinitionEvent(events)
        setBadges(parsedBadges)
      }

      setLoading(false)
    }

    if (debouncedBadgeIds.length > 0) {
      handleFetchBadges()
    }
  }, [debouncedBadgeIds])

  useEffect(() => {
    const handleEventsInit = async () => {
      const relayInstance = relayInit(relayUri)
      console.log(' is it here', relay)
      relayInstance.on('connect', async () => {
        console.log('connected')
        setRelay(relayInstance)
        const event = await relayInstance.get({
          kinds: [30008],
          authors: [pubKey],
        })
        const parsedBadges = event ? parseBadgesFromProfileEvents(event) : []
        setBadgeIds(parsedBadges)

        if (parsedBadges.length === 0) {
          setLoading(false)
        }
      })
      relayInstance.on('error', () => {
        setLoading(false)
      })
      await relayInstance.connect()
    }

    handleEventsInit()
  }, [pubKey])

  const claimABadge = async ({
    badgeId,
    badgeAwardId,
    onFail,
    isClaiming,
  }: ClaimABadgeProps) => {
    if (relay) {
      setClaiming(true)
      isClaiming?.(true)
      const event = await relay.get({
        kinds: [30008],
        authors: [pubKey],
      })
      console.log('checking event', event)
      const eventToPublish = {
        kind: 30008,
        pubkey: pubKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['d', 'profile_badges']],
        content: '',
      } as any
      const badgeToAdd = [
        ['a', `30009:${VITE_APP_GEYSER_NOSTR_PUBKEY}:${badgeId}`],
        ['e', badgeAwardId],
      ]
      if (!event) {
        eventToPublish.tags = [['d', 'profile_badges'], ...badgeToAdd]
      } else {
        eventToPublish.tags = [...event.tags, ...badgeToAdd]
      }

      eventToPublish.id = getEventHash(eventToPublish)
      eventToPublish.sig = await signEvent(eventToPublish) // this is where you sign with private key replaccing pubkey

      const pub = relay.publish(eventToPublish) // this is where you sign with private key replaccing pubkey

      pub.on('ok', () => {
        console.log('publishing was okay.')
        setClaiming(false)
        isClaiming?.(false)
        setBadgeIds([...badgeIds, badgeId])
      })
      pub.on('failed', (reason: any) => {
        console.log('checking daild', reason)
        setClaiming(false)
        isClaiming?.(false)
        if (onFail) {
          onFail(reason)
        }
      })
    }
  }

  return { badges, claimABadge, loading, claiming }
}

const parseBadgesFromProfileEvents = (event: Event): string[] => {
  const badges: string[] = []

  event.tags.map((tag, index) => {
    if (tag[0] === 'a' && event.tags[index + 1]) {
      const id = tag[1].split(':')[2]
      badges.push(id)
    }
  })

  return badges
}

const parseBadgesFromDefinitionEvent = (events: Event[]): NostrBadges[] => {
  const badges = [] as NostrBadges[]

  events.map((event) => {
    const badge = {} as NostrBadges
    event.tags.map((tag) => {
      if (tag[0] === 'd') {
        badge.id = tag[1]
      } else {
        badge[tag[0] as keyof NostrBadges] = tag[1]
      }
    })

    badges.push(badge)
  })

  return badges
}

export type NostrBadges = {
  id: string
  name: string
  description: string
  image: string
  thumb: string
}
