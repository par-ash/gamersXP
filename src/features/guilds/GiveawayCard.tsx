import { Button, Card, Col, Row, Typography } from 'antd'
import GiveawayImage from 'assets/images/GiveawayImage.png'
import './GiveawayCard.less'

export const GiveawayCard = () => {
    return (
        <div>
            <Card
                id="giveaway-card"
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
                            <Typography.Title level={5}>Giveaway</Typography.Title>
                            <Typography.Text> {/* On the Typography.Text it can be followed by type="secondary"*/}
                                Get your chance to win unique prizes!
                            </Typography.Text>
                        </Typography.Paragraph>
                        <Button
                            type="primary"
                            size="large"
                            shape="round"
                            onClick={() => overwolf.utils.openUrlInDefaultBrowser('app.gamersxp.io/giveaway')}
                            disabled
                        >
                            Coming Soon
                        </Button>
                    </Col>
                    <Col span={8} pull={3}>
                        <img
                            draggable={false}
                            src={GiveawayImage}
                            alt="Giveaway Pass"
                            style={{ marginTop: 60, marginLeft: 0, height: '50%' }}
                        />
                    </Col>
                </Row>
            </Card>
        </div>
    )
}
