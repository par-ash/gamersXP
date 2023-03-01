/**
 * PlayerUnkown's Battlegrounds  Available Features
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-pubg
 */

declare module PUBG {
  type TfeatureID = 10906
  type Tname = 'PlayerUnkown s Battlegrounds'
  type TshortName = 'PUBG'
  type TavailableFeatures =
    | 'kill'
    | 'revived'
    | 'death'
    | 'killer'
    | 'match'
    | 'match_info'
    | 'rank'
    | 'counters'
    | 'location'
    | 'me'
    | 'team'
    | 'phase'
    | 'map'
    | 'roster'

  interface ImatchStartEvent {
    name: 'matchStart'
    data: null
  }

  interface ImatchEndEvent {
    name: 'matchEnd'
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
