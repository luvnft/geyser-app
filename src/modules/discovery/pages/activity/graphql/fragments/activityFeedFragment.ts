import { gql } from '@apollo/client'

export const ACTIVITY_FEED_FRAGMENT = gql`
  fragment ActivityFeedFragment on Activity {
    activityType
    createdAt
    id
    project {
      id
      title
      name
      thumbnailImage
    }
    resource {
      ... on Project {
        id
        title
        name
        thumbnailImage
      }
      ... on Entry {
        id
        title
        entryDescription: description
        content
        entryImage: image
      }
      ... on FundingTx {
        id
        amount
        projectId
        isAnonymous
        funder {
          user {
            id
            username
            imageUrl
          }
        }
      }
      ... on ProjectReward {
        id
        category
        cost
        projectRewardDescription: description
        rewardCurrency
        sold
        stock
        projectRewardImage: images
      }
      ... on ProjectGoal {
        currency
        goalDescription: description
        title
        targetAmount
        status
      }
    }
  }
`
