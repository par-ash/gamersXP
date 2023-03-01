interface ISmartContractScheme {
  id?: string
  schemeId?: string
  schemeType: 1 | 2 | 3 | 4
  schemeValue: number
  purchaseAmount: number
  validThru: number
  expirationDays: number
}

type IMarketplace = IScheme & ISmartContractScheme & { purchased: boolean }
