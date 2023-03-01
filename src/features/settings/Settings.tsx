import { useQuery } from '@apollo/client'
import {
  PageHeader,
  Tag,
  Row,
  Popover,
  Checkbox,
  Spin,
  Card,
  Typography,
  Button,
  message,
} from 'antd'
import { RootReducer } from 'app/rootReducer'
import { USER_SCHEMES_ASSGIED } from 'features/markeplace/query'
import { changeUserGDPRaccpetance } from 'api'

import { useAWSCognitoUser } from 'hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { IUserSchemesAssignedsQueryData } from './settingsQuery'
import { userInfo } from "../../pages/DesktopWindow"

const { Paragraph } = Typography

const BodyContent = ({
  checked,
  provider,
  changeGDPR,
}: {
  checked: boolean
  provider: string
  changeGDPR: () => void
}) => (
  <>
    <Paragraph>Wallet Provider: {provider}</Paragraph>
    <br />
    <br />
    <Checkbox checked={checked} onChange={changeGDPR}>
      I want to receive more targeted messages{' '}
      <Popover
        overlayStyle={{
          width: '30vw',
        }}
        content={
          <div>
            <p>
              By checking this box, you agree to receive targeted messages about
              GamersXP events and partner projects, and also about games that do not
              use a GamersXP account.
            </p>
            <p>
              You can unsubscribe from targeted messages, at any time, in the
              Account Management section
            </p>
          </div>
        }
        title="About"
      >
        ⓘ
      </Popover>{' '}
      from EXP Gaming Technologies Ltd Company
    </Checkbox>
  </>
)

const Content = ({
  children,
  extraContent,
}: {
  children: any
  extraContent: any
}) => (
  <Row>
    <div style={{ flex: 1 }}>{children}</div>
    <div className="image">{extraContent}</div>
  </Row>
)

const getMilliseconds = (time: string, days: number): number =>
  Number(time) * 1000 + 86400000 * days

export function Settings() {
  const user  = userInfo;
  const { loading } = useAWSCognitoUser()
  const walletId = useSelector((state: RootReducer) => state.background.wallet)
  const [gdpr, setGdpr] = useState(false)
  const [loadingGDPR, setLoadingGDPR] = useState(false)

  useEffect(() => {
    if (user) {
      //setGdpr(Boolean(Number(user?.['custom:GDPR-acceptance'] ?? '1')))
    }
  }, [user])

  const { data, loading: schemesLoading } = useQuery<
    IUserSchemesAssignedsQueryData
  >(USER_SCHEMES_ASSGIED, {
    variables: { player: walletId?.toLocaleLowerCase() ?? '' },
  })

  const currentProvider = localStorage.getItem('walletconnect')
  const provider =
    typeof currentProvider === 'string'
      ? (JSON.parse(currentProvider) as {
          peerMeta: { description: string }
        })
      : null

  const isPremium = useMemo(() => {
    return data?.schemeAssigneds.some(
      ({ purchasedDate, expirationDays }) =>
        getMilliseconds(purchasedDate, expirationDays) >= Date.now(),
    )
  }, [data])

  const changeGDPR = useCallback(async () => {
    setLoadingGDPR(true)
    if (user) {
      const res = await changeUserGDPRaccpetance(user.name, gdpr)
      if (res) message.success('Updated successfully')
      else message.error('There was a problem updating')
    }
    setLoadingGDPR(false)
  }, [gdpr, user])

  return loading || schemesLoading ? (
    <div
      key="loading"
      style={{
        margin: '20px 0',
        marginBottom: 20,
        padding: '250px 50px',
        textAlign: 'center',
      }}
    >
      <Spin tip="Loading..." />
    </div>
  ) : (
    <Card title="... lets make a living out of it" style={{ height: '85vh' }}>
      <PageHeader
        title={user?.name ?? '...'}
        tags={
          isPremium ? (
            <Tag color="gold">Premium</Tag>
          ) : (
            <Tag color="lime">Free</Tag>
          )
        }
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={async () => changeGDPR()}
            loading={loadingGDPR}
          >
            Save
          </Button>,
        ]}
      >
        <Content
          extraContent={
            <img
              draggable={false}
              src="https://gw.alipayobjects.com/zos/antfincdn/K%24NnlsB%26hz/pageHeader.svg"
              alt="content"
              width="100%"
            />
          }
        >
          <BodyContent
            checked={gdpr}
            changeGDPR={() => setGdpr((currentGDPR) => !currentGDPR)}
            provider={user?.typeOfLogin ?? provider?.peerMeta?.description ?? '...'}
          />
        </Content>
      </PageHeader>
    </Card>
  )
}
