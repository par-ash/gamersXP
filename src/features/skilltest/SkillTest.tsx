import { Col, Row } from 'antd'
import { Challenges } from './Challenges'
import { UserProgressCard } from './UserProgressCard'

import { LevelUPYourGamesCard } from './LevelUPYourGamesCard'
//import { InviteYourFriendsCard } from './InviteYourFriendsCard'
import { GiveawayCard } from './GiveawayCard'
import { GameList } from './GameList'
import { OwAd } from './OwAd'
import { useGetGameEvents } from 'api'
import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { FEED_INFO_QUERY, IRewardQueryData } from 'features/feed/useFeedQuery'
import { RootReducer } from 'app/rootReducer'
import { useSelector } from 'react-redux'
import {
  IRewardBalanceQueryData,
  USER_BASIC_INFO_QUERY,
} from './userProgressQuery'
import { CONTRACT, GAME_EVENTS_TYPE } from 'app/constants'
import { BigNumber } from 'ethers'

//!TODO: display challenge with correct date of activation

interface IChallengeCard {
  userChallengeValue: number
  challengeValue: number
  rewardAmount: number
  content: string
  id?: string
  gameId: number
  schemes: { name: string; id: string; isActivated?: boolean }[]
}
interface IChallenges {
  bonus: IChallengeCard[] | undefined
  free: IChallengeCard[] | undefined
  daily: IChallengeCard[] | undefined
}

interface IuserBalanceCard {
  value: number
  tokensAvaible: number
  tokensAcquired: BigNumber
  percentage: number
  displayBonusCard: boolean
  displayDailyCard: boolean
}

const HOURS_IN_MS = 3600000

const getMilliseconds = (time: string, days: number): number =>
  Number(time) * 1000 + 86400000 * days

const isValidDate = (dateOfActivation: string, activationHours: number) => {
  const now = Date.now()
  const startOfActivation = new Date(`${dateOfActivation} 00:00`).getTime()
  const endOfActivation = startOfActivation + activationHours * HOURS_IN_MS
  //Start here, view Date of challenges!
  const isActivated = now > startOfActivation && now < endOfActivation

  return isActivated
}

export function SkillTest() {
  const { gameEvents } = useGetGameEvents()
  const [currentGame, setCurrentGame] = useState<number>(21216) //Fortnite
  const [challenges, setChallenges] = useState<IChallenges>({
    bonus: [],
    free: [],
    daily: [],
  })
  const [userBalance, setUserBalance] = useState<IuserBalanceCard>({
    tokensAcquired: BigNumber.from(0),
    tokensAvaible: 0,
    value: 0,
    percentage: 0,
    displayBonusCard: false,
    displayDailyCard: false,
  })

  const account = useSelector((state: RootReducer) => state.background.wallet)
  const { data, loading } = useQuery<IRewardQueryData>(FEED_INFO_QUERY, {
    variables: { player: account?.toLocaleLowerCase() ?? '' },
    pollInterval: 5000,
  })
  const {
    data: userRewardBalance,
    loading: userRewardBalanceLoading,
  } = useQuery<IRewardBalanceQueryData>(USER_BASIC_INFO_QUERY, {
    variables: {
      player: account?.toLocaleLowerCase() ?? '',
      contract: CONTRACT.toLocaleLowerCase(),
      pollInterval: 5000,
    },
  })

  useEffect(() => {
    async function getChallenges() {
      try {
        if (!gameEvents) return

        const updatedChallenges: IChallenges = {
          bonus: [],
          daily: [],
          free: [],
        }
        const userBalanceCardStats: IuserBalanceCard = {
          tokensAcquired: BigNumber.from(0),
          tokensAvaible: 0,
          value: 0,
          percentage: 0,
          displayBonusCard: false,
          displayDailyCard: false,
        }

        gameEvents.forEach((gameEvent) => {
          if (
            !isValidDate(gameEvent.dateOfActivation, gameEvent.activationHours)
          )
            return
          const isCompleted = data?.rewardeds.some(
            (rewarded) =>
              rewarded.challengeId === gameEvent.id ||
              (rewarded.challengeId === gameEvent.id &&
                `${rewarded.amount}` ===
                  `${gameEvent.triggerEventStatus.tokenReward}`),
          )
            if (
                isCompleted && (gameEvent.challengeId === GAME_EVENTS_TYPE.CHALLENGE
                    || gameEvent.challengeId === GAME_EVENTS_TYPE.BONUS_CHALLENGE
                    || gameEvent.challengeId === GAME_EVENTS_TYPE.FREE_CHALLENGE)
            ) //to filter the rewarded of Guilds tab
            userBalanceCardStats.tokensAcquired = userBalanceCardStats.tokensAcquired.add(
              gameEvent.triggerEventStatus.tokenReward,
            )

          const updateData: IChallengeCard = {
            id: gameEvent.id,
            userChallengeValue: isCompleted ? 100 : 0,
            challengeValue: gameEvent.triggerEventStatus.tokenReward,
            rewardAmount: gameEvent.triggerEventStatus.tokenReward,
            content: gameEvent.name,
            gameId: gameEvent.game.id,
            schemes: gameEvent.schemes.map((currentScheme) => {
              const isActivated =
                currentScheme.id === process.env.REACT_APP_SCHEME_ID ||
                userRewardBalance?.schemeAssigneds.some(
                  ({ purchasedDate, expirationDays, schemeId }) =>
                    schemeId === currentScheme.id &&
                    getMilliseconds(purchasedDate, expirationDays) >=
                      Date.now(),
                )

              if (
                isActivated &&
                gameEvent.challengeId === GAME_EVENTS_TYPE.CHALLENGE
              )
                userBalanceCardStats.displayDailyCard = true
              if (
                isActivated &&
                gameEvent.challengeId === GAME_EVENTS_TYPE.BONUS_CHALLENGE
              )
                userBalanceCardStats.displayBonusCard = true

              return {
                ...currentScheme,
                isActivated,
              }
            }),
          }

          switch (gameEvent.challengeId) {
            case GAME_EVENTS_TYPE.FREE_CHALLENGE:
              updatedChallenges?.free?.push(updateData)
              userBalanceCardStats.tokensAvaible += updateData.rewardAmount
              return
            case GAME_EVENTS_TYPE.CHALLENGE:
              updatedChallenges?.daily?.push(updateData)
              if (userBalanceCardStats.displayDailyCard)
                userBalanceCardStats.tokensAvaible += updateData.rewardAmount
              return
            case GAME_EVENTS_TYPE.BONUS_CHALLENGE:
              updatedChallenges?.bonus?.push(updateData)
              if (userBalanceCardStats.displayBonusCard)
                userBalanceCardStats.tokensAvaible += updateData.rewardAmount
              return
            default:
              return
          }
        })
        const tokensAcquired = userBalanceCardStats.tokensAcquired.toNumber()
        const tokensAvaible = userBalanceCardStats.tokensAvaible

        userBalanceCardStats.percentage =
          tokensAvaible === 0
            ? tokensAcquired
            : (userBalanceCardStats.tokensAcquired.toNumber() / tokensAvaible) *
              100

        setChallenges(updatedChallenges)
        setUserBalance(userBalanceCardStats)
      } catch (error) {
        console.log(error)
      }
    }
    getChallenges()
  }, [gameEvents, data, userRewardBalance])

  return (
    <div style={{ height: '100%' }}>
      <Row gutter={10}>
        <Col span={5}>
          <UserProgressCard
            percentage={userBalance.percentage}
            tokenAvailable={userBalance.tokensAvaible}
            loading={loading || userRewardBalanceLoading}
            data={userRewardBalance}
            tokensAcquired={userBalance.tokensAcquired}
          />
        </Col>
        <Col span={5}>
          <Challenges
            disabled={!userBalance.displayDailyCard}
            title="Challenges"
            data={challenges.daily}
            loading={loading}
            currentGameId={currentGame}
          />
        </Col>
        <Col span={5}>
          <Challenges
            disabled={!userBalance.displayBonusCard}
            title="Bonus Challenges"
            data={challenges.bonus}
            loading={loading}
            currentGameId={currentGame}
          />
        </Col>
        <Col span={9}>
          <LevelUPYourGamesCard />
          {/* <InviteYourFriendsCard />*/}
          <GiveawayCard />
        </Col>
      </Row>
      <Row gutter={10} style={{ marginTop: 8 }}>
        <Col span={5}>
          <GameList currentGame={currentGame} setCurrentGame={setCurrentGame} />
        </Col>
        <Col span={5}>
          <Challenges
            disabled={false}
            title="Daily Free Challenges"
            data={challenges.free}
            loading={loading}
            currentGameId={currentGame}
          />
        </Col>
        <Col span={5} />
        <Col span={5}>
          <OwAd />
        </Col>
      </Row>
    </div>
  )
}
