import { gql } from '@apollo/client'

interface IuserSchemesAssigneds {
  expirationDays: number
  purchasedDate: string
  schemeId: string
}

export interface IUserSchemesAssignedsQueryData {
  schemeAssigneds: IuserSchemesAssigneds[]
}

const USER_SCHEMES_ASSIGNEDS_QUERY = gql`
  query UserSchemesAssignedsQuery($player: String!, $contract: String!) {
    schemeAssigneds(orderBy: schemeId, where: { player: $player }) {
      schemeId
      purchasedDate
      expirationDays
    }
  }
`

export { USER_SCHEMES_ASSIGNEDS_QUERY }
