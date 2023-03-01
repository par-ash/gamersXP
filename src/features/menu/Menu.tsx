import { Menu, Typography } from 'antd'
import { RootReducer } from 'app/rootReducer'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, notification } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { paths, defaultSelectedKeys } from './paths'
import { useCallback, useEffect, useState } from 'react'

const handleHowToStart = () => {
  overwolf.utils.openUrlInDefaultBrowser(
    'https://gamersxp.io/docs-category/getstarted/',
  )
}

const openNotification = (placement: any, tab?: string) => {
  notification.info({
    message: `Configuration`,
    description: (
      <Typography.Paragraph>
        Follow the steps to proceed to the{' '}
        <Typography.Text strong>{tab}</Typography.Text>
        <Button
          style={{ marginTop: 10 }}
          icon={<InfoCircleOutlined />}
          type="primary"
          onClick={handleHowToStart}
        >
          How to Start
        </Button>
      </Typography.Paragraph>
    ),
    bottom: 1,
    placement,
  })
}

export const MenuWrapper = () => {
  const history = useHistory()
  const walletId = useSelector((state: RootReducer) => state.background.wallet)
  const isWalletIdValid =
    walletId !== null && typeof walletId === 'string' && walletId.length > 0
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    defaultSelectedKeys,
  )

  const handleSettings = useCallback(() => {
    if (!history) return
    history.listen((location: any) => {
      if (location.pathname === '/settings') {
        setSelectedKeys([location.pathname])
      }
    })
  }, [history])

  useEffect(() => {
    if (!history) return
    history.listen((location: any) => {
      setSelectedKeys([location.pathname])
    })
  }, [history])

  useEffect(handleSettings, [handleSettings])

  const onClick = (path: string, name?: string) => {
    if (
      isWalletIdValid ||
      process.env.NODE_ENV === 'development' ||
      path === '/wallet'
    ) {
      history.push(path)
      setSelectedKeys([path])
    } else if (path !== '/wallet') openNotification('topLeft', name)
  }

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys}
      selectedKeys={selectedKeys}
    >
      {paths
        .filter((path) => path.Icon)
        .map(({ Icon, name, path, disabled }) => (
          <Menu.Item
            disabled={disabled}
            key={path}
            onClick={() => onClick(path, name)}
            icon={
              Icon && (
                <Icon
                  style={{
                    display: 'block',
                    margin: '2px -11px',
                    width: '2em',
                    height: '2em',
                  }}
                />
              )
            }
          >
            {name}
          </Menu.Item>
        ))}
    </Menu>
  )
}
