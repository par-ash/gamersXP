/**
 * Heroes of the Storm Available Features
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-hots
 */

declare module HeroesOfTheStorm {
  type TfeatureID = 10624
  type Tname = 'Heroes of the Storm'
  type TshortName = 'Hots'
  type TavailableFeatures =
    | 'match_info'
    | 'me'
    | 'game_info'
    | 'roster'
    | 'death'
    | 'kill'

  type TmatchType = 'GT_CASUAL' | 'GT_BATTLEGROUNDS'

  interface ImatchStartEvent {
    name: 'match_start'
    data: null
  }

  interface ImatchEndEvent {
    name: 'match_end'
    data: 'victory' | 'defeat'
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
