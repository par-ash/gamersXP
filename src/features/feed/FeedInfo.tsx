import { Card, Typography, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { useGetGameEvents } from 'api'
import { BigNumber, ethers } from 'ethers'
import { useMemo } from 'react'

import './FeedInfo.less'

interface IReward {
  id: string
  player: string
  amount: number
  challengeId: string
  rewardedAt: number
}

interface IRewardQueryData {
  rewardeds: IReward[]
}

const { Text } = Typography

interface IProps extends IRewardQueryData {
  loading: boolean
}

const columns: ColumnsType<IReward> = [
  {
    title: 'Completed Challenges',
    dataIndex: 'challengeId',
    key: 'type',
    width: '50%',
  },
  {
    title: 'Date',
    dataIndex: 'rewardedAt',
    key: 'date',
    render: (rewardedAt: number) =>
    new Date(Number(rewardedAt * 1000)).toUTCString().toLocaleString()
  },
  {
    title: 'Amount (GMXP)',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount: number) => (
      <Text>{ethers.utils.formatUnits(amount ?? BigNumber.from(0), 10)}</Text>
    ),
  },
]

export function FeedInfo({ loading, rewardeds }: IProps) {
  const { gameEvents } = useGetGameEvents()

  const dataTable: IReward[] = useMemo(() => {
    return rewardeds.map((reward) => {
      const gameEvent = gameEvents?.find(
        (event) => event.id === reward.challengeId,
      )

      return {
        ...reward,
        challengeId: gameEvent?.name ?? reward.challengeId,
      }
    })
  }, [rewardeds, gameEvents])

  return (
    <Card
      key="feed-info"
      type="inner"
      title="Challenge Rewards History"
      style={{ height: '80vh', borderRadius: 8 }}
      bodyStyle={{ padding: 1 }}
    >
      <Table
        scroll={{ y: 400, scrollToFirstRowOnChange: true }}
        loading={loading}
        rowKey={(record) => record.id}
        showSorterTooltip
        bordered={false}
        columns={columns}
        dataSource={dataTable}
        pagination={{
          style: { marginRight: 10 },
          defaultPageSize: 10,
          //total: rewardeds.length,
          //showTotal: (total) => `Total ${total}`,
        }}
      />
    </Card>
  )
}
