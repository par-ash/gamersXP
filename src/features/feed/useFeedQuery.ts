import { gql } from '@apollo/client'

export interface IReward {
  id: string
  player: string
  amount: number
  challengeId: string
  rewardedAt: number
}

export interface IRewardQueryData {
  rewardeds: IReward[]
}

const FEED_INFO_QUERY = gql`
  query FeedInfoQuery($player: String!) {
    rewardeds(
      where: { player: $player }
      orderBy: rewardedAt
      orderDirection: desc
    ) {
      id
      player
      amount
      challengeId
      rewardedAt
    }
  }
`

export { FEED_INFO_QUERY }
