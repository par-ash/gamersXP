import { BigNumber, ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { CONTRACT } from 'app/constants'
import ABI from 'assets/abis/gamersxp.abi.json'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { web3auth, web3authProvider } from "../pages/DesktopWindow"

async function getBalance(contract: ethers.Contract, walletID: string) {
  let bal = 0;
  if (contract !== null) {
    try {
      bal = await contract.balanceOf(walletID);
    } catch (e) {
      return BigNumber.from(bal)
      //console.log(e)
    }
  }
  return BigNumber.from(bal)
}

export const useContract = (
    injectedProvider: ethers.providers.Web3Provider | WalletConnectProvider,
    walletID: string,
    chainId: number,
) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [meta, setMeta] = useState<{
    name: string
    symbol: string
    tokenBalance: BigNumber
    decimals: number
  } | null>(null)

  useEffect(() => {
    if (web3auth && web3authProvider) {
      const ethersProvider = new ethers.providers.Web3Provider(web3authProvider);
      setContract(new ethers.Contract(CONTRACT, ABI, ethersProvider.getSigner()))
    }
  }, [injectedProvider])

  useEffect(() => {
    async function fetchMeta() {
      if (
          contract &&
          chainId === 137 &&
          injectedProvider
      ) {
        try {
          const [name, symbol, decimals, tokenBalance] = await Promise.all([
            contract?.name() ?? '',
            contract?.symbol() ?? '',
            contract?.decimals() ?? 0,
            walletID.length > 0
                ? getBalance(contract, walletID)
                : BigNumber.from(0),
          ])

          setMeta({ name, symbol, tokenBalance, decimals })
        } catch (err) {
          console.info('name() ', contract.name())
          console.info('symbol() ', contract.symbol())
          console.info('decimals() ', contract.decimals())
          console.info('walletID ', walletID)
          console.info('Error: ', err)
        }
      }
    }
    fetchMeta()
  }, [contract, walletID, injectedProvider, chainId])

  return { ...meta }
}