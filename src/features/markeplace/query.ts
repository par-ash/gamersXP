import { gql } from '@apollo/client'

export interface ISmartContractSchemeQuery {
  purchaseAmount: string
  schemeId: string
  schemeType: number
  schemeValue: string
  validThru: string
  expirationDays: string
}

export interface ISchemesData {
  schemes: ISmartContractSchemeQuery[]
}

export const SCHEMES = gql`
  query {
    schemes(orderBy: schemeId, orderDirection: asc) {
      schemeId
      schemeType
      schemeValue
      purchaseAmount
      validThru
      expirationDays
    }
  }
`

export interface IUserScheme {
  expirationDays: number
  purchasedDate: string
  schemeId: string
}

export interface IUserSchemesData {
  schemeAssigneds: IUserScheme[]
}

export const USER_SCHEMES_ASSGIED = gql`
  query SchemesAssined($player: String!) {
    schemeAssigneds(where: { player: $player }) {
      schemeId
      purchasedDate
      expirationDays
    }
  }
`
