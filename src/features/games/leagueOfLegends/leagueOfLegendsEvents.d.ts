/**
 * League Of Lengends Available Features
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-lol
 */

declare module LeagueOfLegends {
  type TfeatureID = 5426
  type Tname = 'League of Legends'
  type TshortName = 'Lol'
  type TavailableFeatures =
    | 'live_client_data'
    | 'matchState'
    | 'match_info'
    | 'death'
    | 'respawn'
    | 'abilities'
    | 'kill'
    | 'assist'
    | 'gold'
    | 'minions'
    | 'summoner_info'
    | 'gameMode'
    | 'teams'
    | 'level'
    | 'announcer'
    | 'counters'
    | 'damage'
    | 'heal'

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
