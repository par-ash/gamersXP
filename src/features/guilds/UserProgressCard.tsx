import { Card, Col, Progress, Row, Space, Statistic, Typography } from 'antd'

import gtIcon from 'assets/images/TokenLogo.png'
import { BigNumber, ethers } from 'ethers'
import { IRewardBalanceQueryData } from './userProgressQuery'

interface IuserProgressCardProps {
  tokenAvailable?: number
  percentage?: number
  loading: boolean
  tokensAcquired: BigNumber
  data?: IRewardBalanceQueryData
}

export function UserProgressCard({
  tokenAvailable,
  percentage,
  loading,
  data,
  tokensAcquired,
}: IuserProgressCardProps) {
  return (
    <Card
      loading={loading}
      title={'Your progress'}
      headStyle={{
        background: 'transparent',
        border: 'unset',
      }}
      bordered={false}
      style={{
        height: 320,
        borderRadius: 8,
      }}
      bodyStyle={{ padding: '2px 10px' }}
    >
      <Row>
        <Col span={24}>
          <Space
            direction="horizontal"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Progress
              width={105}
              strokeWidth={5}
              type="circle"
              percent={Math.ceil(percentage ?? 0)}
              strokeColor="#ccff00"
              gapPosition="bottom"
              status="active"
            />
          </Space>
        </Col>
        <Col span={24}>
          <Statistic
            title={
              <Typography.Text type="secondary" style={{ fontSize: 10 }}>
                Your Balance
              </Typography.Text>
            }
            value={data?.erc20Contract?.balances?.[0]?.value ?? 0}
            valueStyle={{ fontSize: 16 }}
            suffix={
              <img
                draggable={false}
                src={gtIcon}
                alt="coin icon"
                style={{ width: '1.2rem', marginBottom: 1 }}
              />
            }
          />
        </Col>

        <Col span={24}>
          <Statistic
            title={
              <Typography.Text type="secondary" style={{ fontSize: 10 }}>
                Acquired
              </Typography.Text>
            }
            value={ethers.utils.formatUnits(tokensAcquired, 10) ?? 0}
            valueStyle={{ fontSize: 16 }}
            suffix={
              <img
                draggable={false}
                src={gtIcon}
                alt="coin icon"
                style={{ width: '1.2rem', marginBottom: 1 }}
              />
            }
          />
        </Col>
        <Col span={24}>
          <Statistic
            title={
              <Typography.Text type="secondary" style={{ fontSize: 10 }}>
                Available in Guilds
              </Typography.Text>
            }
            value={
              ethers.utils.formatUnits(
                BigNumber.from(Math.ceil(tokenAvailable ?? 0)) ??
                  BigNumber.from(0),
                10,
              ) ?? 0
            }
            valueStyle={{ fontSize: 16 }}
            suffix={
              <img
                draggable={false}
                src={gtIcon}
                alt="coin icon"
                style={{ width: '1.2rem', marginBottom: 1 }}
              />
            }
          />
        </Col>
      </Row>
    </Card>
  )
}
