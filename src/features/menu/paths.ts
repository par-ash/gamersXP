import { FC } from 'react'


import { Feed } from 'features/feed'
import { Settings } from 'features/settings'
import { SkillTest } from 'features/skilltest'
import { Guilds } from 'features/guilds'
import {
  HoldersIcon,
  WalletIcon,
  LevelUpIcon,
  StakesIcon,
  UserLogIcon,
  GuildsIcon,
} from './icons'
import { Empty } from 'antd'

interface IPath {
  name?: string
  path: string
  Component: FC
  Icon?: FC<{ style: Record<string, string | number> }>
  disabled?: boolean
  isDiscordAuth: boolean
}
const paths: IPath[] = [
  {
    name: 'Wallet',
    path: '/wallet',
    Icon: WalletIcon,
    Component: Feed,
    disabled: false,
    isDiscordAuth: false,
  },
  {
    name: 'Skill Test',
    path: '/skill-test',
    Icon: LevelUpIcon,
    Component: SkillTest,
    disabled: false,
    isDiscordAuth: false,
  },
  {
    name: 'Guilds',
    path: '/guilds',
    Icon: GuildsIcon,
    Component: Guilds,
    disabled: false,
    isDiscordAuth: false,
  },
  {
    name: 'Holders',
    path: '/holders',
    Icon: HoldersIcon,
    Component: Empty,
    disabled: true,
    isDiscordAuth: false,
  },
  {
    name: 'User Log',
    path: '/user-log',
    Icon: UserLogIcon,
    Component: Empty,
    disabled: true,
    isDiscordAuth: false,
  },
  {
    name: 'Stakes',
    path: '/stakes',
    Icon: StakesIcon,
    Component: Empty,
    disabled: true,
    isDiscordAuth: false,
  },
  {
    name: 'Settings',
    Component: Settings,
    path: '/settings',
    isDiscordAuth: false,
  },
]

const defaultSelectedKeys = [paths[0].path]

export { paths, defaultSelectedKeys }
