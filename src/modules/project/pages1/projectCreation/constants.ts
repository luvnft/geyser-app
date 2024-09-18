import {
  ArtworkImageUrl,
  BookImageUrl,
  CollectibleImageUrl,
  CourseImageUrl,
  DigitalContentImageUrl,
  ExperienceImageUrl,
  GameImageUrl,
  GiftImageUrl,
  MembershipImageUrl,
  MerchImageUrl,
  NostrBadgeImageUrl,
  PhysicalProductImageUrl,
  RaffleImageUrl,
  ServiceImageUrl,
  ShoutoutImageUrl,
  SponsorshipImageUrl,
  TicketImageUrl,
} from '../../../../shared/constants/platform/url'
import { RewardTemplateType } from './types'

export enum RewardCategory {
  Membership = 'Membership',
  Gift = 'Gift',
  Ticket = 'Ticket',
  NostrBadge = 'Nostr Badge',
  Collectible = 'Collectible',
  Book = 'Book',
  Course = 'Course',
  Game = 'Game',
  Merch = 'Merch',
  Raffle = 'Raffle',
  Sponsorship = 'Sponsorship',
  Service = 'Service',
  Shoutout = 'Shoutout',
  DigitalContent = 'Digital Content',
  Artwork = 'Artwork',
  PhysicalProduct = 'Physical Product',
  Experience = 'Experience',
  Event = 'Event',
  Song = 'Song',
}

export const rewardTemplates: RewardTemplateType[] = [
  {
    title: 'Membership',
    category: RewardCategory.Membership,
    description: 'Allow your users to be part of your membership club',
    image: MembershipImageUrl,
  },
  {
    title: 'Gift',
    category: RewardCategory.Gift,
    description: 'Give your contributors a gift',
    image: GiftImageUrl,
  },
  {
    title: 'Ticket',
    category: RewardCategory.Ticket,
    description: 'Offer a ticket to an event or experience',
    image: TicketImageUrl,
  },
  {
    title: 'Nostr Badge',
    category: RewardCategory.NostrBadge,
    description: 'Award a unique nostr badge',
    image: NostrBadgeImageUrl,
  },
  {
    title: 'Collectible',
    category: RewardCategory.Collectible,
    description: 'Offer a unique collectible item',
    image: CollectibleImageUrl,
  },
  {
    title: 'Book',
    category: RewardCategory.Book,
    description: 'Reward with a special edition book',
    image: BookImageUrl,
  },
  {
    title: 'Course',
    category: RewardCategory.Course,
    description: 'Provide access to an exclusive course',
    image: CourseImageUrl,
  },
  {
    title: 'Game',
    category: RewardCategory.Game,
    description: 'Grant a new game or in-game items',
    image: GameImageUrl,
  },
  {
    title: 'Merch',
    category: RewardCategory.Merch,
    description: 'Send out exclusive merchandise',
    image: MerchImageUrl,
  },
  {
    title: 'Raffle',
    category: RewardCategory.Raffle,
    description: 'Enter contributors into a raffle draw',
    image: RaffleImageUrl,
  },
  {
    title: 'Sponsorship',
    category: RewardCategory.Sponsorship,
    description: 'Provide sponsorship opportunities',
    image: SponsorshipImageUrl,
  },
  {
    title: 'Service',
    category: RewardCategory.Service,
    description: 'Offer a service from your portfolio',
    image: ServiceImageUrl,
  },
  {
    title: 'Shoutout',
    category: RewardCategory.Shoutout,
    description: 'Give a public thank you or mention',
    image: ShoutoutImageUrl,
  },
  {
    title: 'Digital Content',
    category: RewardCategory.DigitalContent,
    description: 'Distribute exclusive digital content',
    image: DigitalContentImageUrl,
  },
  {
    title: 'Artwork',
    category: RewardCategory.Artwork,
    description: 'Share original artwork or prints',
    image: ArtworkImageUrl,
  },
  {
    title: 'Physical Product',
    category: RewardCategory.PhysicalProduct,
    description: 'Send a physical product to your supporters',
    image: PhysicalProductImageUrl,
  },
  {
    title: 'Experience',
    category: RewardCategory.Experience,
    description: 'Create an unforgettable experience',
    image: ExperienceImageUrl,
  },
]

export const tagToRewardCategoryMapping: { [key: string]: RewardCategory[] } = {
  education: [RewardCategory.Book, RewardCategory.Course, RewardCategory.Gift, RewardCategory.Raffle],
  community: [RewardCategory.NostrBadge, RewardCategory.Shoutout],
  culture: [
    RewardCategory.Merch,
    RewardCategory.Sponsorship,
    RewardCategory.Shoutout,
    RewardCategory.Game,
    RewardCategory.PhysicalProduct,
    RewardCategory.Artwork,
    RewardCategory.Ticket,
  ],
  filmmaker: [
    RewardCategory.Sponsorship,
    RewardCategory.Ticket,
    RewardCategory.NostrBadge,
    RewardCategory.Merch,
    RewardCategory.DigitalContent,
  ],
  startup: [RewardCategory.Merch],
  developers: [RewardCategory.Membership, RewardCategory.Shoutout, RewardCategory.Experience],
  charity: [
    RewardCategory.Gift,
    RewardCategory.NostrBadge,
    RewardCategory.Merch,
    RewardCategory.Ticket,
    RewardCategory.Raffle,
    RewardCategory.Shoutout,
  ],
  openSource: [RewardCategory.NostrBadge, RewardCategory.Shoutout],
  games: [
    RewardCategory.Sponsorship,
    RewardCategory.NostrBadge,
    RewardCategory.Merch,
    RewardCategory.Shoutout,
    RewardCategory.Game,
    RewardCategory.Artwork,
    RewardCategory.PhysicalProduct,
  ],
  films: [
    RewardCategory.Sponsorship,
    RewardCategory.Merch,
    RewardCategory.Ticket,
    RewardCategory.Shoutout,
    RewardCategory.Artwork,
    RewardCategory.DigitalContent,
  ],
  humanitarian: [RewardCategory.Gift, RewardCategory.NostrBadge, RewardCategory.Shoutout, RewardCategory.Experience],
  events: [RewardCategory.Ticket, RewardCategory.Shoutout, RewardCategory.Raffle],
  podcasts: [RewardCategory.Shoutout, RewardCategory.NostrBadge, RewardCategory.Sponsorship],
  artists: [RewardCategory.NostrBadge, RewardCategory.Merch, RewardCategory.Membership, RewardCategory.Artwork],
  music: [RewardCategory.Song, RewardCategory.Merch, RewardCategory.Artwork, RewardCategory.DigitalContent],
  creative: [
    RewardCategory.Artwork,
    RewardCategory.Shoutout,
    RewardCategory.Membership,
    RewardCategory.PhysicalProduct,
  ],
  book: [RewardCategory.Book, RewardCategory.Gift, RewardCategory.Membership, RewardCategory.DigitalContent],
  translation: [RewardCategory.Gift, RewardCategory.Shoutout, RewardCategory.Course],
  content: [RewardCategory.Collectible, RewardCategory.Shoutout, RewardCategory.Sponsorship],
  circularEconomy: [RewardCategory.Gift, RewardCategory.Course, RewardCategory.NostrBadge, RewardCategory.Membership],
  meetup: [RewardCategory.Merch, RewardCategory.Gift, RewardCategory.Experience],
  videomaking: [RewardCategory.Merch, RewardCategory.Shoutout, RewardCategory.Service],
  lifestyle: [RewardCategory.Merch, RewardCategory.Gift, RewardCategory.Experience, RewardCategory.Membership],
  journalism: [
    RewardCategory.Merch,
    RewardCategory.Shoutout,
    RewardCategory.Experience,
    RewardCategory.Membership,
    RewardCategory.Course,
  ],
  collectible: [
    RewardCategory.NostrBadge,
    RewardCategory.PhysicalProduct,
    RewardCategory.DigitalContent,
    RewardCategory.Collectible,
  ],
  nonProfits: [
    RewardCategory.Gift,
    RewardCategory.NostrBadge,
    RewardCategory.Merch,
    RewardCategory.Ticket,
    RewardCategory.Raffle,
    RewardCategory.Shoutout,
  ],
  entrepreneurship: [RewardCategory.PhysicalProduct, RewardCategory.Membership, RewardCategory.Course],
  gaming: [
    RewardCategory.Sponsorship,
    RewardCategory.NostrBadge,
    RewardCategory.Merch,
    RewardCategory.Shoutout,
    RewardCategory.Game,
    RewardCategory.Artwork,
    RewardCategory.PhysicalProduct,
  ],
  kids: [RewardCategory.Game, RewardCategory.Merch, RewardCategory.Experience],
  meetups: [
    RewardCategory.Event,
    RewardCategory.Ticket,
    RewardCategory.Membership,
    RewardCategory.Experience,
    RewardCategory.Merch,
  ],
  bitcoinMining: [RewardCategory.PhysicalProduct, RewardCategory.Membership, RewardCategory.Collectible],
  finance: [RewardCategory.Gift, RewardCategory.Course],
  boardGames: [
    RewardCategory.PhysicalProduct,
    RewardCategory.Collectible,
    RewardCategory.Game,
    RewardCategory.Shoutout,
    RewardCategory.Gift,
  ],
  research: [RewardCategory.DigitalContent, RewardCategory.Membership, RewardCategory.Course],
  collectibles: [
    RewardCategory.NostrBadge,
    RewardCategory.PhysicalProduct,
    RewardCategory.DigitalContent,
    RewardCategory.Collectible,
    RewardCategory.Collectible,
  ],
  fashion: [RewardCategory.PhysicalProduct, RewardCategory.DigitalContent, RewardCategory.Gift],
  politics: [RewardCategory.Gift, RewardCategory.Shoutout, RewardCategory.Book],
  farming: [RewardCategory.PhysicalProduct],
  learning: [RewardCategory.Experience, RewardCategory.Service, RewardCategory.Course],
  blog: [RewardCategory.Experience, RewardCategory.DigitalContent],
  students: [RewardCategory.Course, RewardCategory.Gift, RewardCategory.Raffle],
  economics: [RewardCategory.Experience, RewardCategory.DigitalContent, RewardCategory.Membership],
  art: [
    RewardCategory.PhysicalProduct,
    RewardCategory.DigitalContent,
    RewardCategory.Membership,
    RewardCategory.Shoutout,
  ],
  orangePilling: [
    RewardCategory.Gift,
    RewardCategory.NostrBadge,
    RewardCategory.DigitalContent,
    RewardCategory.Membership,
  ],
  youtube: [RewardCategory.DigitalContent, RewardCategory.Membership],
  women: [RewardCategory.NostrBadge, RewardCategory.Experience, RewardCategory.Membership],
  newsletter: [
    RewardCategory.Shoutout,
    RewardCategory.Membership,
    RewardCategory.Sponsorship,
    RewardCategory.NostrBadge,
  ],
  workshop: [RewardCategory.Course, RewardCategory.Ticket],
  store: [RewardCategory.PhysicalProduct],
  merch: [RewardCategory.Merch, RewardCategory.PhysicalProduct],
  clothes: [RewardCategory.Merch, RewardCategory.PhysicalProduct, RewardCategory.Course],
  ecash: [RewardCategory.NostrBadge, RewardCategory.DigitalContent, RewardCategory.Course],
  cashu: [RewardCategory.NostrBadge, RewardCategory.Membership, RewardCategory.DigitalContent],
  animation: [RewardCategory.DigitalContent],
  bitcoinmusic: [RewardCategory.DigitalContent, RewardCategory.NostrBadge],
  books: [RewardCategory.Book, RewardCategory.Course],
  studybitcoin: [RewardCategory.Book, RewardCategory.DigitalContent, RewardCategory.Ticket, RewardCategory.Course],
  economy: [RewardCategory.DigitalContent, RewardCategory.Course],
  digitalArt: [RewardCategory.DigitalContent, RewardCategory.NostrBadge, RewardCategory.Artwork],
  empoweringYouth: [RewardCategory.Course, RewardCategory.Gift, RewardCategory.Book],
  hackerspace: [RewardCategory.Course, RewardCategory.Membership, RewardCategory.Ticket, RewardCategory.Sponsorship],
  magazine: [RewardCategory.DigitalContent, RewardCategory.Book, RewardCategory.Artwork],
  cartoon: [RewardCategory.DigitalContent, RewardCategory.Book, RewardCategory.Artwork],
  philosophy: [RewardCategory.DigitalContent, RewardCategory.Course, RewardCategory.Book, RewardCategory.Gift],
  dPrinting: [RewardCategory.DigitalContent, RewardCategory.PhysicalProduct, RewardCategory.Gift],
  v4v: [RewardCategory.Gift, RewardCategory.Shoutout, RewardCategory.Sponsorship, RewardCategory.DigitalContent],
  musicians: [
    RewardCategory.DigitalContent,
    RewardCategory.PhysicalProduct,
    RewardCategory.Shoutout,
    RewardCategory.Artwork,
    RewardCategory.Experience,
  ],
  bitcoinMeme: [RewardCategory.DigitalContent, RewardCategory.Gift],
  racing: [RewardCategory.Gift],
  lawsuit: [RewardCategory.Gift, RewardCategory.Membership, RewardCategory.Shoutout],
  unschooling: [RewardCategory.Shoutout, RewardCategory.Course, RewardCategory.Experience],
  homeschooling: [RewardCategory.Shoutout, RewardCategory.Course, RewardCategory.Experience],
  minecraft: [RewardCategory.Game],
}

export const ProjectCountryCodesThatAreRestricted = ['UA', 'PSE', 'YE', 'RU']
