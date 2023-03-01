import { ethers } from 'ethers'

export const REGISTER_RETRY_TIMEOUT = 10000
export const WINDOW_NAMES = {
  BACKGROUND: 'background',
  DEVELOPMENT: 'development',
  DESKTOP: 'desktop',
}

export const {
  NODE_ENV = 'development',
  REACT_APP_INFURA_ID = '',
  REACT_APP_CONTRACT_ADDRESS: CONTRACT = '',
  REACT_APP_POPUP_WINDOW_SIGNIN = '',
} = process.env

export const localProvider = new ethers.providers.StaticJsonRpcProvider(
  `https://polygon-mainnet.infura.io/v3/${REACT_APP_INFURA_ID}`,
)

export const { DESKTOP } = WINDOW_NAMES
export const CONDITIONS_TO_FINNISH = [
  'match_end',
  'matchEnd',
  'matchOutcome',
  'match_outcome',
]

export const CONDITIONS_TO_START = ['match_start', 'matchStart']

export const GAME_EVENTS_TYPE = {
  FREE_CHALLENGE: 'Free Challenge',
  BONUS_CHALLENGE: 'Bonus Challenges',
  CHALLENGE: 'Challenges',
  GUILDS_CHALLENGE: 'Guilds Challenges',
}
export const CONFIG_HOOKS = { displayLog: true }
