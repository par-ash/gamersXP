/**
 * Minecraft Available Features
 * The events are currently available only to the standard game. We do not support modded clients.
 * GEP supports the following Minecraft versions:
 * 1.12.2
 * 1.16.0 ~ present.
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-minecraft
 */

declare module Minecraft {
  type TfeatureID = 8032
  type Tname = 'Minecraft'
  type TshortName = 'Minecraft'
  type TavailableFeatures = 'game_info' | 'match_info'

  interface ImatchStartEvent {
    name: 'match_start'
    data: null
  }

  interface ImatchEndEvent {
    name: 'match_end'
    data: null
  }

  type TgameEvents = ImatchStartEvent | ImatchEndEvent

  interface IgameInfo {
    feature: TavailableFeatures
    match_info?: Record<string, any>
  }

  interface IJSON {
    id: TfeatureID | null | number
    title: Tname | null | string
    timestamp: number | null
    features: TavailableFeatures[] | string[]
    data: {
      events: {
        timestamp: number
        event: TgameEvents[]
      }[]
      infos: {
        timestamp: number
        info: IgameInfo
      }[]
    }
  }
}
