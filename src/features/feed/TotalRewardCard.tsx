import { Button, Card, Statistic } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

//GMXP Total Reward= Total rewards from day 1 (sum up all rewards)
interface IProps {
  active: boolean
  totalRewards: number | string
  loading: boolean
  name?: string
  symbol?: string
}
export const TotalRewardCard = ({
  active,
  totalRewards,
  loading,
  name,
  symbol,
}: IProps) => {
  const handleHowToStart = () => {
    overwolf.utils.openUrlInDefaultBrowser(
      'https://gamersxp.io/docs-category/getstarted/',
    )
  }

  return (
    <Card
      type="inner"
      title={`${symbol ?? ''} Total Reward`}
      style={{ borderRadius: 8, marginTop: active ? 20 : 22 }}
      actions={[
        <Button
          key="howTostart"
          icon={<InfoCircleOutlined />}
          type="primary"
          onClick={handleHowToStart}
        >
          How to Start
        </Button>,
      ]}
    >
      <Statistic
        loading={!active || loading}
        title={active ? `${name ?? '...'} (${symbol ?? '...'})` : null}
        value={totalRewards}
      />
    </Card>
  )
}
