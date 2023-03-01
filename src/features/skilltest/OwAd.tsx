import { Card, Space } from 'antd'

export const OwAd = () => {
  return (
    <Card
      type="inner"
      bordered={false}
      style={{
        width: 410,
        height: 324,
        borderRadius: 8,
      }}
    >
      <Space
        direction="horizontal"
        style={{
          width: '100%',
          justifyContent: 'center',
          marginTop: 100,
        }}
      ></Space>
    </Card>
  )
}
