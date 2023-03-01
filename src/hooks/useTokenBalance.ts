import { gql, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'

interface IERC20balances {
  contract: {
    decimals: number
    symbol: string
    name: string
  }
  value: string
}

interface IMembership {
  accesscontrolrole: {
    contract: {
      id: string
    }
    role: {
      id: string
    }
  }
}

interface ItokenBalanceData {
  account: {
    ERC20balances: IERC20balances[]
    membership: IMembership[]
  }
}

export const TOKEN_BALANCE = gql`
  query AccountTks($account: String!) {
    account(id: $account) {
      membership {
        accesscontrolrole {
          contract {
            id
          }
          role {
            id
          }
        }
      }
    }
  }
`

const {
  REACT_APP_ADMIN_ROLE: ADMIN_ROLE,
  REACT_APP_DAILY_OPERATIONS_ROLE: DAILY_OPERATIONS_ROLE,
  REACT_APP_CONTRACT_ADDRESS: CONTRACT,
} = process.env

export function useTokenBalance() {
  const [account, setAccount] = useState('')
  const { data, loading, error } = useQuery<ItokenBalanceData>(TOKEN_BALANCE, {
    variables: {
      account: account.toLowerCase(),
    },
  })
  const isAdmin: boolean = useMemo(() => {
    const contract = CONTRACT?.toLowerCase()
    const role = ADMIN_ROLE?.toLowerCase()
    return (
      data?.account?.membership?.some(
        (currentData: IMembership) =>
          currentData?.accesscontrolrole?.contract?.id === contract &&
          currentData?.accesscontrolrole?.role?.id === role,
      ) || false
    )
  }, [data])

  const isDailyOperation: boolean = useMemo(() => {
    const contract = CONTRACT?.toLowerCase()
    const role = DAILY_OPERATIONS_ROLE?.toLowerCase()
    return (
      data?.account?.membership?.some(
        (currentData: IMembership) =>
          currentData?.accesscontrolrole?.contract?.id === contract &&
          currentData?.accesscontrolrole?.role?.id === role,
      ) || false
    )
  }, [data])

  return {
    isAdmin,
    isDailyOperation,
    loading,
    error,
    setAccount,
  }
}
