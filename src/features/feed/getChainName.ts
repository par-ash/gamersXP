export const getChainName = (chainId: number): string => {
  if (!!chainId && chainId > 9) {
    return 'local'
  }
  switch (chainId) {
    case 1:
      return 'mainnet'
    case 3:
      return 'ropsten'
    case 4:
      return 'rinkeby'
    case 5:
      return 'goerli'
    case 42:
      return 'kovan'
    default:
      return `unknown`
  }
}
