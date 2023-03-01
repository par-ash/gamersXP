import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export function useBurnerSigner(provider: any) {
  const key = 'metaPrivateKey'

  const [signer, setSigner] = useState<ethers.Wallet>()
  const [storedValue, setStoredValue] = useState()

  const setValue = (value: any) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, value)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const storedKey = window.localStorage.getItem(key)
    if (!storedKey) {
      const _newWallet = ethers.Wallet.createRandom()
      const _newKey = _newWallet.privateKey
      setValue(_newKey)
    } else {
      setValue(storedKey)
    }
  }, [])

  useEffect(() => {
    let wallet
    if (storedValue && provider) {
      wallet = new ethers.Wallet(
        (storedValue as unknown) as ethers.utils.SigningKey,
      )
      const _signer = wallet.connect(provider)
      setSigner(_signer)
    }
  }, [storedValue, provider])

  return signer
}
