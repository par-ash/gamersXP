import { Button, Card, Col, Row, Typography } from 'antd'

import referalImage from 'assets/images/GMXP-referral.png'
import './InviteYourFriendsCard.less'

export const InviteYourFriendsCard = () => {
  return (
    <Card
      id={'referal-card'}
      type="inner"
      bordered={false}
      style={{
        height: 155,
        borderRadius: 8,
        marginTop: 10,
      }}
    >
      <Row>
        <Col span={16}>
          <Typography.Paragraph>
            <Typography.Title level={5}>Invite your teammates</Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Gaming is always better&nbsp; 
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              with friends!
            </Typography.Text>
          </Typography.Paragraph>
          <Button
            type="primary" 
            size="large" 
            disabled
          >
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Read More
            </Typography.Text>
          </Button>
        </Col>
        <Col span={8} pull={4}>
          <img
            draggable={false}
            src={referalImage}
            alt="referal"
            style={{ marginTop: -5, marginLeft: 11, height: '62%' }}
          />
        </Col>
      </Row>
    </Card>
  )
}
