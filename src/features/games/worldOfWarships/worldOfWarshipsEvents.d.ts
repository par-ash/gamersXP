/**
 * World of Warships Available Features
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-wows
 */

declare module WorldOfWarships {
  type TfeatureID = 10746
  type Tname = 'World of Warships'
  type TshortName = 'WoWs'
  type TavailableFeatures =
    | 'game_info'
    | 'account_info'
    | 'match'
    | 'match_info'
    | 'kill'
    | 'death'

  interface ImatchStartEvent {
    name: 'matchStart'
    data: null
  }

  interface ImatchEndEvent {
    name: 'matchEnd' | 'matchOutcome'
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
