/**
 * Valorant Available Features
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-valorant
 */

declare module Valorant {
  type TfeatureID = 21640
  type Tname = 'League of Legends'
  type TshortName = 'Lol'
  type TavailableFeatures = 'me' | 'game_info' | 'match_info' | 'kill' | 'death'

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
    match_info?: {
      pseudo_match_id?: string
    }
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
