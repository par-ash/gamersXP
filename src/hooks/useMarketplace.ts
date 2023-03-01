import { notification } from 'antd'
import { ethers } from 'ethers'
import { useCallback } from 'react'
import ABI from 'assets/abis/gamersxp.abi.json'
import { CONTRACT } from 'app/constants'
import { web3auth, web3authProvider } from "../pages/DesktopWindow"

export const useMarkeplace = () => {
  const buyScheme = useCallback(async (schemeId: number): Promise<
    string | undefined
  > => {
    try {
      if (schemeId < 0) return
      if (web3auth && web3authProvider) {
        const ethersProvider = new ethers.providers.Web3Provider(web3authProvider);
        const signedContract = new ethers.Contract(
          CONTRACT,
          ABI,
          ethersProvider.getSigner()
        )

        const transation = await signedContract.buyScheme(schemeId)
        console.log('transation', transation)
        notification.warning({
          message: '1 - Transaction being processed',
          description: `t.hash: ${transation.hash}`,
          duration: 5000,
        })

        const response = await transation.wait()

        notification.warning({
          message: '2 - Transaction being confirmed',
          description: `waiting for confirmations in the blocks`,
          duration: 5000,
        })
        response?.events?.forEach((currentBlockEvent: any) => {
          if (currentBlockEvent?.event === 'SchemeAssigned') {
            notification.success({
              message: 'Success',
              description: `scheme is active in your wallet!`,
            })
          }
        })
      }
    } catch (error) {
      const currentError = error as Error
      console.log(currentError)

      if (currentError?.message?.includes('Scheme: invalid transaction')) {
        notification.error({
          message: 'Error',
          description: `You do not have enough tokens to buy this scheme`,
        })
      } else {
        notification.error({
          message: 'Error',
          description: `Unable to confirm your transaction, please try again later or try to reconnect your wallet`,
        })
      }
    }
  }, [])

  return { buyScheme }
}
