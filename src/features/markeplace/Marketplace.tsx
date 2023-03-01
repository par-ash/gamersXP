import {
  Button,
  Card,
  Col,
  Drawer,
  Row,
  Space,
  Spin,
  List,
  notification,
  Tooltip,
} from 'antd'
import { useSchemes } from 'api'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@apollo/client'
import {
  ISchemesData,
  IUserSchemesData,
  SCHEMES,
  USER_SCHEMES_ASSGIED,
} from './query'

import { useCallback, useEffect, useState } from 'react'
import { useMarkeplace } from 'hooks/useMarketplace'

import { useSelector } from 'react-redux'
import { RootReducer } from 'app/rootReducer'

interface IStoreProps {
  onClose: () => void
  visible: boolean
}

const { Meta } = Card
const Item = ({
  name,
  description,
  overwolfInfo,
  logoSrc,
  schemeValue,
  validThru,
  buyScheme,
  schemeId,
  purchased,
}: IMarketplace & {
  buyScheme: (schemeId: number) => Promise<string | undefined>
}) => {
  return (
    <Space
      direction="horizontal"
      style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} //where the images are in the black screen
    >
      <Card
        id={`schemes-card`}
        bordered={false}
        style={{
          width: 226, //image height and width
          height: '70vh',
          borderRadius: 8,
        }}
        cover={
          <img
            draggable={false}
            alt={name}
            src={logoSrc}
            style={{
              height: 160, //the image itself of each game
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />
        }
        actions={[
            <div key="purchase">
            {purchased ? (
              <Tooltip
              title="This scheme is already active"
              color="yellow"
              >
                <Button disabled={purchased} type="primary">
                  Activated
                </Button>
              </Tooltip>
            ) : (
              <Button
                type="primary"
                onClick={async () => {
                  if (Number(schemeId) < 0) return
                  notification.info({
                    message: `Wallet Confirmation`,
                    description:
                      'Awaiting signature and confirmation of your wallet',
                    duration: 10,
                  })

                  await buyScheme(Number(schemeId))
                }}
              >
                Purchase
              </Button>
            )}
          </div>,
        ]}
        bodyStyle={{ padding: 14, height: 275, paddingRight: 1 }} //where the 'Purchase button is 
      >
        <Meta
          title={name}
          description={
            <List
              bordered={false}
              dataSource={overwolfInfo ?? []}
              style={{ height: 255, overflowY: 'scroll' }} //how much space for the text to fit in the card
              renderItem={(item, position) => (
                <List.Item key={`${item.line}${position}`}>
                  <CheckCircleOutlined
                    style={{ paddingRight: 8, color: '#ccff00' }}
                  />
                  {item.line}
                </List.Item>
              )}
            />
          }
        />
      </Card>
    </Space>
  )
}

export const Marketplace = ({ onClose, visible }: IStoreProps) => {
  const walletId = useSelector((state: RootReducer) => state.background.wallet)

  const {
    data: smartSchemes,
    loading: smartLoading,
    refetch: refetchSmart,
  } = useQuery<ISchemesData>(SCHEMES, { pollInterval: 5000 })
  const {
    data: userSchemesData,
    loading: userSchemesLoading,
    refetch: userSchemesRefetch,
  } = useQuery<IUserSchemesData>(USER_SCHEMES_ASSGIED, {
    variables: { player: walletId?.toLocaleLowerCase() },
    pollInterval: 5000,
  })

  const { data: cloudSchemes, loading: cloudLoading } = useSchemes()
  const [marketplace, setMarketplaceItem] = useState<IMarketplace[]>([])
  const [marketPlaceLoading, setMarketplaceLoading] = useState(false)

  const { buyScheme } = useMarkeplace()
  const fetchAWSschmes = useCallback(async () => {
    //@ts-ignore
    const normalizedSchemes: IMarketplace[] =
      smartSchemes?.schemes
        .filter(
          (schemeToFilter) => Number(schemeToFilter.validThru) <= Date.now(),
        )
        .map((scheme) => {
          const schemeMeta = cloudSchemes?.find(
            (awsScheme) => awsScheme.id === scheme.schemeId,
          )
          if (!schemeMeta)
            return { ...scheme, name: '', description: '', logoSrc: '' }
          return {
            ...scheme,
            ...schemeMeta,
          }
        }) ?? []
    setMarketplaceItem(normalizedSchemes)
  }, [smartSchemes, cloudSchemes])

  const loadMarketPlace = useCallback(async () => {
    setMarketplaceLoading(true)
    await refetchSmart()
    await userSchemesRefetch()
    await fetchAWSschmes()
    setMarketplaceLoading(false)
  }, [refetchSmart, fetchAWSschmes, userSchemesRefetch])

  useEffect(() => {
    loadMarketPlace()
  }, [loadMarketPlace])

    const isExpired = (item:any) => {
        let fromDate = new Date(item.purchasedDate * 1000);
        let toDate = new Date(fromDate.getTime());
        toDate.setDate(toDate.getDate() + item.expirationDays);
        return toDate.getTime() <= new Date().getTime();
    };

  return (
    <Drawer
      bodyStyle={{ background: '#000' }}
          //width={'100%'} //width of the drawer, in case the placement is left/right
          height={'100%'} //in case the placement is top/bottom then the 'width' must be replaced with 'height'
          placement="bottom"
          onClose={onClose}
          visible={visible}
          title="Purchase a Scheme to earn more..."
      >
          <p style={{ marginBottom: 30 }}></p> {/*moves the images up-down */}
      {userSchemesLoading ||
      cloudLoading ||
      smartLoading ||
      marketPlaceLoading ? (
        <div
          style={{
            margin: '20px 0',
            marginBottom: 20,
            padding: '250px 50px',
            textAlign: 'center',
          }}
        >
          <Spin tip="Loading..." spinning />
        </div>
      ) : (
        <Row gutter={16}>
            {marketplace?.map((item, position) => {
                let tst = userSchemesData?.schemeAssigneds.find(schemaAssign => schemaAssign.schemeId === item.schemeId);
                return (
                    <Col
                        span={6}
                        key={`#${item.schemeId}#
                        ${position}`}
                    >
                    <Item
                        buyScheme={buyScheme}
                        {...item}
                        purchased={
                            !(
                                userSchemesData?.schemeAssigneds.findIndex(
                                ({ schemeId }) => item.schemeId === schemeId && !isExpired(tst),
                                ) === -1
                            )
                            }
                        />
                    </Col>
                          )
                      }
                      )}
        </Row>
      )}
    </Drawer>
  )
}
