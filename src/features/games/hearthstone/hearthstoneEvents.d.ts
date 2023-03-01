/**
 * HearthStone Available Features
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-hearthstone
 */

declare module HearthStone {
  type TfeatureID = 9898
  type Tname = 'Hearthstone: Heroes of Warcraft'
  type TshortName = 'HS'
  type TavailableFeatures =
    | 'scene_state'
    | 'collection'
    | 'decks'
    | 'match'
    | 'match_info'

  type TmatchType = 'GT_CASUAL' | 'GT_BATTLEGROUNDS'

  interface ImatchStartEvent {
    name: 'match_start'
    data: 'wild' | 'standard'
  }

  interface ImatchEndEvent {
    name: 'match_end'
    data: 'win' | 'lose' | 'tie'
  }

  interface ImatchOutComeEvent {
    name: 'match_outcome'
    data: 'WON' | 'LOST'
  }

  type TgameEvents = ImatchStartEvent | ImatchEndEvent | ImatchOutComeEvent

  interface IgameInfo {
    feature: TavailableFeatures
    match_info?: {
      match_type?: TmatchType
      battlegrounds_rating?: string
      adventure_stats?: Record<string, string>
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
