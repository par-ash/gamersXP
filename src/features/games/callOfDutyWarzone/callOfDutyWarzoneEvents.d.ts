/**
 * Call of Duty: Warzone Available Features
 * his game requires enabling exclusive mode on your OW app's windows. Read more about OW exclusive mode.

In addition, when developing your app, you must comply with Activision’s Call of Duty:Warzone terms and conditions. Supporting que dodging, interfering with matchmaking or any such behavior is strictly prohibited, and will not be approved. If you have any doubt, please contact us directly before starting development.

For more information check our Game compliance principles
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-warzone
 */

declare module CallOfDutyWarzone {
  type TfeatureID = 21626
  type Tname = 'Call of Duty: Warzone'
  type TshortName = 'CoD:Warzone'
  type TavailableFeatures = 'match_info' | 'game_info' | 'kill' | 'death'

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
