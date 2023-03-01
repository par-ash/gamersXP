import { Card, Col, Empty, Row } from 'antd'
import { useQuery } from '@apollo/client'
import { FC } from 'react'

import { UserBalance } from './UserBalance'
import { FeedInfo } from './FeedInfo'
import { TotalRewardCard } from './TotalRewardCard'
import { useWallet } from 'hooks/useWallet'
import { FEED_INFO_QUERY, IRewardQueryData } from './useFeedQuery'
import { BigNumber, ethers } from 'ethers'

export const Feed: FC = () => {
  const {
    loadWeb3Modal,
    logoutOfWeb3Modal,
    name,
    symbol,
    address,
    balance,
    tokenBalance,
    selectedChainId,
    decimals,
  } = useWallet()

  const { loading, data } = useQuery<IRewardQueryData>(FEED_INFO_QUERY, {
    variables: { player: address?.toLowerCase() ?? '' },
    pollInterval: 5000,
  })

  return (
    <Card
      title="... lets make a living out of it"
      bordered={false}
      style={{ height: '92vh', borderRadius: 8 }}
    >
      <Row gutter={20}>
        <Col span={9}>
          <UserBalance
            decimals={decimals}
            active={address.length > 0}
            balance={balance}
            tokenBalance={tokenBalance}
            name={name}
            symbol={symbol}
            chainId={selectedChainId}
            connect={loadWeb3Modal}
            desconnect={logoutOfWeb3Modal}
          />
          <TotalRewardCard
            name={name}
            symbol={symbol}
            active={address.length > 0}
            totalRewards={ethers.utils.formatUnits(
              data?.rewardeds.reduce(
                (prev, curr) => prev.add(Math.ceil(curr.amount)),
                BigNumber.from(0),
              ) ?? BigNumber.from(0),
              decimals ?? 10,
            )}
            loading={loading}
          />
        </Col>

        <Col span={15}>
          {address.length > 0 ? (
            <FeedInfo rewardeds={data?.rewardeds ?? []} loading={loading} />
          ) : (
            <Empty description="Connect your Wallet to view your previous rewards " />
          )}
        </Col>
      </Row>
    </Card>
  )
}
