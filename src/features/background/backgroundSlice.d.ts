interface IoverwolfEventPayload {
  event: HearthStone.TgameEvents[]
}
interface IoverwolfInfoPayload {
  info: HearthStone.IgameInfo
}

interface IThunkAPi<RootReducer> {
  getState: () => RootReducer
}

interface IoverwolfHeaderPayload {
  id: number | null
  title: string | null
  timestamp: number | null
  features: string[]
}

interface IUser {
  userID: string | null
  wallet: string | null
}

type TbackgroundState = IUser &
  (
    | HearthStone.IJSON
    | HeroesOfTheStorm.IJSON
    | LeagueOfLegends.IJSON
    | Valorant.IJSON
    | Fortnite.IJSON
    | Minecraft.IJSON
    | RainbowSixSiege.IJSON
    | RocketLeague.IJSON
    | WorldOfTanks.IJSON
    | WorldOfWarships.IJSON
    | Overwatch.IJSON
    | PUBG.IJSON
    | ApexLegends.IJSON
    | CSGO.IJSON
  )
