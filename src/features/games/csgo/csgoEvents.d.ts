/**
 * Apex Legends Available Features
 * TRUSTED MODE
When running this game in trusted mode (without any launch parameters), OW can't go into an "exclusive mode" once the game is in a fullscreen state. This means - there is no way to interact with your OW app window when this issue occurs. Read our Exclusive Mode guide to understand how to get a relevant indications for this unique state, so you'll be able to notify the user / change the app flow accordingly if needed.
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-csgo
 */

declare module CSGO {
  type TfeatureID = 7764
  type Tname = 'Counter-Strike: Global Offensive'
  type TshortName = 'CS:GO'
  type TavailableFeatures =
    | 'match_info'
    | 'kill'
    | 'death'
    | 'assist'
    | 'headshot'
    | 'round_start'
    | 'match_start'
    | 'match_info'
    | 'match_end'
    | 'team_round_win'
    | 'bomb_planted'
    | 'bomb_change'
    | 'reloading'
    | 'fired'
    | 'weapon_change'
    | 'weapon_acquired'
    | 'info'
    | 'roster'
    | 'player_activity_change'
    | 'team_set'
    | 'replay'
    | 'counters'
    | 'mvp'
    | 'scoreboard'
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
