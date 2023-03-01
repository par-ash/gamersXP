/**
 * Rocket League Available Featurest.
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-rocket-league
 */

declare module RocketLeague {
  type TfeatureID = 10798
  type Tname = 'Rocket League'
  type TshortName = 'RL'
  type TavailableFeatures =
    | 'stats'
    | 'teamGoal'
    | 'opposingTeamGoal'
    | 'match'
    | 'roster'
    | 'me'
    | 'match_info'
    | 'death'
    | 'game_info'

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
