/**
 * Apex Legends Available Features
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-apex-legends
 */

declare module ApexLegends {
  type TfeatureID = 21566
  type Tname = 'Apex Legends'
  type TshortName = 'Apex'
  type TavailableFeatures =
    | 'me'
    | 'team'
    | 'kill'
    | 'damage'
    | 'death'
    | 'revive'
    | 'match_state'
    | 'match_info'
    | 'inventory'
    | 'location'
    | 'match_summary'
    | 'roster'
    | 'rank'
    | 'kill_feed'

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
