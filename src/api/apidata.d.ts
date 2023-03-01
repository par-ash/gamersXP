interface IScheme {
  id: string
  name: string
  description: string
  logoSrc: string
  validThru: string
  overwolfInfo?: { line: string }[]
}

interface IChallenges {
  id: string
  name: string
  type: string
}
interface ITriggerEventStatus {
  events: Record<string, any>[]
  tokenReward: number
}

interface IEvent {
  id?: string
  name: string
  description: string
  schemes: string[]
  game: {
    id: number
    name: string
  }
  triggerEventStatus: ITriggerEventStatus
  dateOfActivation: string
  activationHours: number
  challengeId: string
}

interface IEventModified extends IEvent {
  schemes: { name: string; id: string }[]
}

type Tattributes = 'addition' | 'multiplier' | 'percentage' | 'services'
