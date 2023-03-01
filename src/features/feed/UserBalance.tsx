import { Button, Card, Col, Divider, Row, Statistic, Tag, Alert } from 'antd'
import { EllipsisMiddle } from './EllipsisMiddle'

import { RootReducer } from 'app/rootReducer'
import { useSelector } from 'react-redux'
import { BigNumber } from '@ethersproject/bignumber'
import { ethers } from 'ethers'
import {
  IRewardBalanceQueryData,
  USER_BASIC_INFO_QUERY,
} from 'features/skilltest/userProgressQuery'
import { CONTRACT } from 'app/constants'
import { useQuery } from '@apollo/client'

const { Meta } = Card

interface IProps {
  active: boolean
  chainName?: string
  chainId?: number
  desconnect: () => void
  connect: () => void
  name?: string
  symbol?: string
  balance?: BigNumber
  tokenBalance?: BigNumber
  decimals?: number
}

export function UserBalance({
  active,
  connect,
  desconnect,
  chainId,
  balance,
  name,
  symbol,
}: IProps) {
  const account = useSelector((state: RootReducer) => state.background.wallet)

  const { data } = useQuery<IRewardBalanceQueryData>(USER_BASIC_INFO_QUERY, {
    variables: {
      player: account?.toLocaleLowerCase() ?? '',
      contract: CONTRACT.toLocaleLowerCase(),
    },
    pollInterval: 7000,
  })

  const isValidChain = active && chainId === 137

  return (
    <Card
      type="inner"
      title="Account Balance"
      style={{ borderRadius: 8 }}
      extra={
        <>
          <Tag color={isValidChain ? 'success' : 'red'}>
            {isValidChain ? 'connected' : 'disconnected'}
          </Tag>

          <Tag color={isValidChain ? 'purple' : 'default'}>Polygon Mainnet</Tag>
        </>
      }
      actions={[
        <Button
          key="qrcode"
          type="primary"
          danger={active}
          onClick={() => window.open('https://polygon.tor.us/', '_blank', 'noreferrer')}
        >
          Go to your wallet
        </Button>,
      ]}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Statistic
            loading={
              !isValidChain || name === undefined || symbol === undefined
            }
            value={data?.erc20Contract?.balances?.[0]?.value ?? 0}
            title={
              isValidChain
                ? `${name ?? '...'} (${symbol ?? '...'})`
                : 'Please, connect to Polygon Mainnet Network'
            }
          />
        </Col>

        <Col span={24}>
          <Statistic
            loading={!active || name === undefined || symbol === undefined}
            title="Polygon (Matic)"
            suffix="MATIC"
            value={(parseFloat(
                ethers.utils.formatEther(balance ?? BigNumber.from(0))).toFixed(3)
            )}
          />
        </Col>
      </Row>
          <Divider />
          <Meta
        description={
          active ? (
            <EllipsisMiddle suffixCount={12} copyable={false}>
              {account ?? '.....'}
            </EllipsisMiddle>
                  ) : (     
                          <Alert
                        message="Click on connect your social login wallet to login to your wallet using social login"
                        type="warning"
                    />
          )
        }
      />
    </Card>
  )
}
