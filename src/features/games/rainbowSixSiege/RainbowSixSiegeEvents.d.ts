/**
 * Rainbow Six Siege Available Featurest.
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-rainbow-six
 */

declare module RainbowSixSiege {
  type TfeatureID = 10826
  type Tname = 'RainbowSixSiege'
  type TshortName = 'R6'
  type TavailableFeatures =
    | 'game_info'
    | 'match'
    | 'match_info'
    | 'roster'
    | 'kill'
    | 'death'
    | 'me'
    | 'defuser'

  interface ImatchEndEvent {
    name: 'matchOutcome'
    data: 'defeat' | 'victory'
  }

  type TgameEvents = ImatchEndEvent

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
