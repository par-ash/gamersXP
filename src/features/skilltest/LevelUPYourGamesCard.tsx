import { Button, Card, Col, Row, Typography } from 'antd'
import { useState } from 'react'
import { Marketplace } from 'features/markeplace'
import lvlUpCardImage from 'assets/images/LevelUpCard.png'
import './LevelUPYourGamesCard.less'

export const LevelUPYourGamesCard = () => {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <Marketplace visible={visible} onClose={() => setVisible(false)} />
          <Card
        id="levelup-card"
        type="inner"
        bordered={false}
        style={{
          height: 155,
          borderRadius: 8,
          marginBottom: 5,
        }}
      >
        <Row>
          <Col span={16}>
            <Typography.Paragraph>
              <Typography.Title level={5}>Level Up your Game</Typography.Title>
              <Typography.Text> {/* On the Typography.Text it can be followed by type="secondary"*/}
                Earn more Tokens based on your gaming skills
              </Typography.Text>
            </Typography.Paragraph>
            <Button
              type="primary"
              size="large"
              shape="round"
              onClick={() => setVisible(true)}
            >
              Level Up
            </Button>
          </Col>
          <Col span={8} pull={3}>
            <img
              draggable={false}
              src={lvlUpCardImage}
              alt="premium acc"
              style={{ marginTop: 28, marginLeft: -15, height: '80%' }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  )
}
