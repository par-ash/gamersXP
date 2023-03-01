/**
 * World of Tanks Available Features
 * In WoT, due to technical reasons, Overwolf API starts to work only if the game was launched before, at least one time (because only then, we identify the location of the game installation). So, if you identify an error when you try to register to the game events (and in particular - when you get the “failed after 11 tries” error when calling setRequiredFeatures ) - on that case, notify the user that she has to relaunch the game. Not ideal - but working. And cover those cases.
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-wot
 */

declare module WorldOfTanks {
  type TfeatureID = 6365
  type Tname = 'World of Tanks'
  type TshortName = 'WoT'
  type TavailableFeatures = 'kill' | 'death' | 'game_info' | 'match_info'

  interface ImatchEndEvent {
    name: 'match_outcome'
    data: null
  }

  type TgameEvents = ImatchEndEvent

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
