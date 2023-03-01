import { hearthstone } from './hearthstone'
import { heroesOfTheStorm } from './heroesOfTheStorm'
import { leagueOfLegends } from './leagueOfLegends'
import { valorant } from './valorant'
import { fortnite } from './fortnite'
import { minecraft } from './minecraft'
import { rainbowSixSiege } from './rainbowSixSiege'
import { rocketLeague } from './rocketLeague'
import { worldOfTanks } from './worldOfTanks'
import { worldOfWarships } from './worldOfWarships'
import { overwatch } from './overwatch'
import { pubg } from './pubg'
import { apexLegends } from './apexLegends'
import { csgo } from './csgo'
import { callOfDutyWarzone } from './callOfDutyWarzone'

type TFeatures =
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
  | WorldOfWarships.IJSON
  | Overwatch.IJSON
  | PUBG.IJSON
  | ApexLegends.IJSON
  | CSGO.IJSON
  | CallOfDutyWarzone.IJSON

const featuresById = new Map<number, TFeatures>()

featuresById.set(hearthstone.id ?? 0, hearthstone)
featuresById.set(heroesOfTheStorm.id ?? 1, heroesOfTheStorm)
featuresById.set(leagueOfLegends.id ?? 2, leagueOfLegends)
featuresById.set(valorant.id ?? 3, valorant)
featuresById.set(fortnite.id ?? 4, fortnite)
featuresById.set(minecraft.id ?? 5, minecraft)
featuresById.set(rainbowSixSiege.id ?? 6, rainbowSixSiege)
featuresById.set(rocketLeague.id ?? 7, rocketLeague)
featuresById.set(worldOfTanks.id ?? 8, worldOfTanks)
featuresById.set(worldOfWarships.id ?? 9, worldOfWarships)
featuresById.set(overwatch.id ?? 10, overwatch)
featuresById.set(pubg.id ?? 11, pubg)
featuresById.set(apexLegends.id ?? 12, apexLegends)
featuresById.set(csgo.id ?? 13, csgo)
featuresById.set(callOfDutyWarzone.id ?? 14, callOfDutyWarzone)

export { featuresById }
