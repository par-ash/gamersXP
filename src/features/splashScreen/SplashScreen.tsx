import { Layout, Typography } from 'antd'
import logo from 'assets/images/GT-Icon.svg'
import { FC } from 'react'
import './SplashScreen.less'

const { Content } = Layout
const { Text } = Typography
export const SplashScreen: FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content className="splash-container">
        <div className="splash-screen">
          <img
            draggable={false}
            className="splash-logo"
            src={logo}
            alt="gamersxp"
          />
          <Text strong>Wait a moment while we load GamersXP</Text>
          <div className="loading-dot">.</div>
        </div>
      </Content>
    </Layout>
  )
}
