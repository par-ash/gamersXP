import { Col, Row } from 'antd'
import { Challenges } from './Challenges'
import { UserProgressCard } from './UserProgressCard'

import { LevelUPYourGamesCard } from './LevelUPYourGamesCard'
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
import { Button } from 'antd'
import { useAWSCognitoUser } from 'hooks'
//import { openAWSCognitoSignIn } from 'features/auth/Auth'
import { useWeb3AWSCognito } from 'features/auth/Auth'

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
  //bonus: IChallengeCard[] | undefined
  //free: IChallengeCard[] | undefined
  guilds: IChallengeCard[] | undefined
}

interface IuserBalanceCard {
  value: number
  tokensAvaible: number
  tokensAcquired: BigNumber
  percentage: number
  //displayBonusCard: boolean
  displayGuildsCard: boolean
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

export function Guilds() {
  const [isVerifed, setIsVerified] = useState(false)
  const [hasRole, setHasRole] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const { gameEvents } = useGetGameEvents()
  const { user, loading: userLoading } = useAWSCognitoUser()
  const [currentGame, setCurrentGame] = useState<number>(21216) //Fortnite
  const [challenges, setChallenges] = useState<IChallenges>({
    //bonus: [],
    //free: [],
    guilds: [],
  })
  const [userBalance, setUserBalance] = useState<IuserBalanceCard>({
    tokensAcquired: BigNumber.from(0),
    tokensAvaible: 0,
    value: 0,
    percentage: 0,
   // displayBonusCard: false,
    displayGuildsCard: false,
  })
  const [method, setMethod] = useState("")

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
    const checkDiscord = async () => {
      if (user) {
        const username = user.username.split('_')
        if (username[0] === 'google') {
          setMethod('Google')
          setIsVerified(false)
        } else if (username[0] === 'discord') {
          setMethod('Discord')
          setIsVerified(true)
          if (user.isJoined) {
            setIsJoined(true)
            if (user.roles?.includes((process.env.REACT_APP_ROLE_ID as string))) {
              setHasRole(true)
            } else {
              setHasRole(false)
            }
          } else {
            setIsJoined(false)
          }
        } else {
          setMethod('Email')
          setIsVerified(false)
        }
      }
    }
    checkDiscord();
  }, [user])

  useEffect(() => {
    async function getChallenges() {
      try {
        if (!gameEvents) return

        const updatedChallenges: IChallenges = {
          //bonus: [],
          guilds: [],
          //free: [],
        }
        const userBalanceCardStats: IuserBalanceCard = {
          tokensAcquired: BigNumber.from(0),
          tokensAvaible: 0,
          value: 0,
          percentage: 0,
          //displayBonusCard: false,
          displayGuildsCard: false,
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
            if (isCompleted && gameEvent.challengeId === GAME_EVENTS_TYPE.GUILDS_CHALLENGE) //add extra && to filter out the SkillTest from Gulds
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
                gameEvent.challengeId === GAME_EVENTS_TYPE.GUILDS_CHALLENGE
              )
                userBalanceCardStats.displayGuildsCard = true
              /*if (
                isActivated &&
                gameEvent.challengeId === GAME_EVENTS_TYPE.BONUS_CHALLENGE
              )
                userBalanceCardStats.displayBonusCard = true*/

              return {
                ...currentScheme,
                isActivated,
              }
            }),
          }

          switch (gameEvent.challengeId) {
            /*case GAME_EVENTS_TYPE.FREE_CHALLENGE:
              updatedChallenges?.free?.push(updateData)
              userBalanceCardStats.tokensAvaible += updateData.rewardAmount
              return
            case GAME_EVENTS_TYPE.GUILDS_CHALLENGE:
              updatedChallenges?.guilds?.push(updateData)
              if (userBalanceCardStats.displayGuildsCard)
                userBalanceCardStats.tokensAvaible += updateData.rewardAmount
              return
            case GAME_EVENTS_TYPE.BONUS_CHALLENGE:
              updatedChallenges?.bonus?.push(updateData)
              if (userBalanceCardStats.displayBonusCard)
                userBalanceCardStats.tokensAvaible += updateData.rewardAmount
                  return*/
              case GAME_EVENTS_TYPE.GUILDS_CHALLENGE:
                  updatedChallenges?.guilds?.push(updateData)
                  if (userBalanceCardStats.displayGuildsCard)
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
    <div style={{ height: '100%', position: 'relative' }}>
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
                disabled={!userBalance.displayGuildsCard}
                title="Guilds Challenges"
                data={challenges.guilds}
                loading={loading}
                currentGameId={currentGame}
              />
            </Col>
            <Col span={5}>
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
            </Col>
            <Col span={5} />
            <Col span={5}>
              <OwAd />
            </Col>
          </Row>
          {!isVerifed && !userLoading &&
            <div style={{ height: '100%', width: '100%', position: 'absolute', top: '0', backgroundColor: 'rgb(0,0,0,0.7)', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%', textAlign: 'center', }}>
                <p>Please verify your discord account.</p>
                <p>You signed in by using your {method}.</p>
                <p>{window.location.href}</p>
                <Button
                  type="primary"
                  color="ccff00"
                  onClick={useWeb3AWSCognito}
                >
                  Verify
                </Button>
              </div>
            </div>
          }
          {userLoading &&
            <div style={{ height: '100%', width: '100%', position: 'absolute', top: '0', backgroundColor: 'rgb(0,0,0,0.7)', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%', textAlign: 'center', }}>
                <p>Verifying your account...</p>
              </div>
            </div>
          }
          {isVerifed && !isJoined &&
            <div style={{ height: '100%', width: '100%', position: 'absolute', top: '0', backgroundColor: 'rgb(0,0,0,0.7)', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%', textAlign: 'center', }}>
                <p>Please join our discord server</p>
                <Button
                  type="primary"
                  color="ccff00"
                  href="https://discord.gg/34VYPGar"
                >
                  Join
                </Button>
              </div>
            </div>
          }
          {isVerifed && isJoined && !hasRole &&
            <div style={{ height: '100%', width: '100%', position: 'absolute', top: '0', backgroundColor: 'rgb(0,0,0,0.7)', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%', textAlign: 'center', }}>
                <p>You don't have any role for this feature...</p>
                {user?.roles && <p>Your role: {user.roles[0]}</p>}
              </div>
            </div>
          }
    </div>
  )
}
