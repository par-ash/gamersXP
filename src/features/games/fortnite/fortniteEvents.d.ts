/**
 * Fortnite Available Features
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-fortnite
 */

declare module Fortnite {
  type TfeatureID = 21216
  type Tname = 'Fortnite'
  type TshortName = 'Fortnite'
  type TavailableFeatures =
    | 'kill'
    | 'killed'
    | 'killer'
    | 'revived'
    | 'death'
    | 'match'
    | 'match_info'
    | 'rank'
    | 'me'
    | 'phase'
    | 'location'
    | 'team'
    | 'items'
    | 'counters'

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
