import {
  Card,
  Checkbox,
  Col,
  Empty,
  Popover,
  Progress,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd'

import gtIcon from 'assets/images/logo-gmxp.svg'
import { BigNumber, ethers } from 'ethers'
import { useMemo } from 'react'

interface IChallengeCard {
  userChallengeValue: number
  challengeValue: number
  rewardAmount: number
  content: string
  id?: string
  gameId: number
  schemes: { name: string; id: string; isActivated?: boolean }[]
}

const ChallengesCard = ({
  userChallengeValue,
  rewardAmount,
  content,
  schemes,
}: IChallengeCard) => {
  const currentPercent = Math.ceil(userChallengeValue)

  return (
    <Card
      size="small"
      headStyle={{
        background: 'transparent',
        border: 'unset',
      }}
      extra={
        <Row>
          <Col span={24}>
            <Space size={'small'} align="center" style={{ float: 'right' }}>
              <Typography.Text
                strong
                type={rewardAmount >= 1 ? 'secondary' : 'danger'}
              >
                {rewardAmount >= 1
                  ? ethers.utils.formatUnits(
                      BigNumber.from(`${Math.ceil(rewardAmount)}`),
                      10,
                    )
                  : 'too small value'}
              </Typography.Text>
              <img
                draggable={false}
                src={gtIcon}
                alt="GT Icon"
                style={{
                  filter: `grayscale(${Math.abs(
                    (currentPercent <= 100 ? currentPercent : 100) - 100,
                  )}%)`,
                  width: '1.2rem',
                  marginBottom: 1,
                }}
              />
            </Space>
          </Col>
          <Col span={24}>
            <Popover
              content={
                <Space size={[8, 36]} wrap>
                  {schemes.map((scheme) => (
                    <Tag
                      key={scheme.id}
                      color={
                        scheme?.isActivated ||
                        scheme.id === process.env.REACT_APP_DAILY_FREE_SCHEME_ID
                          ? 'gold'
                          : 'default'
                      }
                    >
                      {scheme.name}
                    </Tag>
                  ))}
                </Space>
              }
              title="Purchase a Level Up scheme, of your favorite game, to maximize your rewards"
            >
              <Typography.Link
                delete={schemes.length === 0}
                disabled={schemes.length === 0}
                style={{ float: 'right' }}
              >
                Available In
              </Typography.Link>
            </Popover>
          </Col>
        </Row>
      }
      style={{ width: '100%', borderLeft: 0, borderTop: 0, borderRight: 0 }}
    >
      <Space size={'small'} align="baseline">
        <Checkbox checked={currentPercent >= 100} />
        <Typography.Text>{content}</Typography.Text>
      </Space>
      <Progress
        size="small"
        percent={currentPercent}
        strokeColor="#ccff00"
        status={currentPercent >= 100 ? 'active' : 'normal'}
      />
    </Card>
  )
}

interface IChallenges {
  title: string
  data: IChallengeCard[] | undefined
  loading: boolean
  disabled: boolean
  currentGameId: number
}

export function Challenges({
  title,
  data,
  loading,
  disabled,
  currentGameId,
}: IChallenges) {
  const challengeData = useMemo(() => {
    if (!data) return []
    return data.filter((challenge) => challenge.gameId === currentGameId)
  }, [currentGameId, data])
  return (
    <Card
      title={title}
      loading={loading}
      type="inner"
      headStyle={{
        background: 'transparent',
        border: 'unset',
      }}
      bordered={false}
      style={{
        height: 320,
        borderRadius: 8,
        padding: 0,
        overflow: 'hidden',
        opacity: disabled || challengeData.length === 0 ? '60%' : '100%',
      }}
      bodyStyle={{ paddingLeft: 3, paddingRight: 0, paddingBottom: 0 }}
    >
      <div
        style={{
          overflow: 'scroll',
          overflowX: 'hidden',
          height: 320,
          marginTop: -30,
          paddingBottom: 40,
        }}
      >
        {challengeData.length > 0 ? (
          challengeData.map(
            ({
              id,
              challengeValue,
              rewardAmount,
              userChallengeValue,
              content,
              schemes,
            }) => (
              <ChallengesCard
                key={id}
                challengeValue={challengeValue}
                rewardAmount={rewardAmount}
                userChallengeValue={userChallengeValue}
                content={content}
                gameId={currentGameId}
                schemes={schemes}
              />
            ),
          )
        ) : (
                      <Empty description="Guild members only" style={{ marginTop: 60 }} />
        )}
      </div>
    </Card>
  )
}
