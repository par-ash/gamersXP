import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Web3 from "web3";
import { useContract } from './useContract'
import { useDispatch } from 'react-redux'
import { setCurrentWalletID } from 'features/background'
import { web3auth, web3authProvider } from "../pages/DesktopWindow"
import { WALLET_ADAPTERS } from "@web3auth/base";

export function useWallet() {
  const [injectedProvider, setInjectedProvider] = useState<any>()
  const [address, setAddress] = useState<string>('')
  const [networkId, setNetworkId] = useState<number>(0)
  const [etherBalance, setEtherBalance] = useState<ethers.BigNumber>(
      ethers.BigNumber.from(0),
  )

  const dispatch = useDispatch()

  let contract = useContract(injectedProvider, address, networkId)

  const getBalance = async (provider:any) => {
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    if (accounts !== null && accounts.length > 0) {
      const balance = await web3.eth.getBalance(accounts[0]);
      setEtherBalance(ethers.BigNumber.from(balance))
      return balance
    }
    return 0
  }

  const getNetwork = async (provider:any) => {
    const web3 = new Web3(provider);
    let network = await web3.eth.getChainId();
    if (network !== null) {
      setNetworkId(network)
    }
    return network
  }

  async function getAddress(provider:any) {
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    if (accounts !== null && accounts.length > 0) {
      setAddress(accounts[0])
      dispatch(setCurrentWalletID(accounts[0]))
      return accounts[0]
    }
    return null
  }

  const logoutOfWeb3Modal = useCallback(async () => {
    console.log("logout")
    if (web3auth && web3authProvider) {
      await web3auth.logout()
      await web3auth.clearCache()
    }
    setAddress('')
    dispatch(setCurrentWalletID(''))
    setInjectedProvider(null)

    setTimeout(() => {
      window.location.reload()
    }, 1)
  }, [injectedProvider, dispatch])

  const loadWeb3Modal = useCallback(async () => {
    let provider;
    if (web3auth && web3authProvider) {
      provider = web3authProvider;
    } else {
      provider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "jwt",
        extraLoginOptions: {
          domain: "https://overwolf-integration.auth.us-east-1.amazoncognito.com",
          verifierIdField: "email",
          response_type: "token",
          scope: "email profile openid",
        },
      });
    }
    await getAddress(provider);
    await getNetwork(provider);
    await getBalance(provider);
    setInjectedProvider(provider);
  }, [logoutOfWeb3Modal, dispatch])

  useEffect(() => {
    console.log(web3auth.status)
    if (web3auth && (web3auth.status === "connected" || web3auth.status === "ready")) { //(web3auth.status == "connected" || web3auth.status == "ready")
      loadWeb3Modal()
    }
  }, [loadWeb3Modal])

  return {
    logoutOfWeb3Modal,
    loadWeb3Modal,
    address,
    selectedChainId: networkId,
    balance: etherBalance,
    ...contract,
  }
}