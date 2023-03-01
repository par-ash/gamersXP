import { gql } from '@apollo/client'

export interface IBalance {
  value: string
  valueExact: string
}

interface IRewardedBalance {
  amount: string
}
interface IuserSchemesAssigneds {
  expirationDays: number
  purchasedDate: string
  schemeId: string
}

export interface IRewardBalanceQueryData {
  erc20Contract: {
    balances: IBalance[]
  }
  rewardeds: IRewardedBalance[]

  schemeAssigneds: IuserSchemesAssigneds[]
}

const USER_BASIC_INFO_QUERY = gql`
  query UserBasicInfoQuery($player: String!, $contract: String!) {
    erc20Contract(id: $contract) {
      balances(
        orderBy: valueExact
        orderDirection: desc
        where: { account: $player }
      ) {
        account {
          id
        }
        value
        valueExact
      }
    }
    rewardeds(
      where: { player: $player }
      orderBy: rewardedAt
      orderDirection: desc
    ) {
      amount
    }

    schemeAssigneds(orderBy: schemeId, where: { player: $player }) {
      schemeId
      purchasedDate
      expirationDays
    }
  }
`

export { USER_BASIC_INFO_QUERY }
