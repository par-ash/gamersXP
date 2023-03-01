import { FC, useEffect, useState } from "react";
import { DesktopHeader } from "features/desktop";
import { Layout, Result } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import { MenuWrapper } from "features/menu";
import { Auth } from "features/auth";
import { logout } from "hooks/useAWSCognitoUser";
import { SplashScreen } from "features/splashScreen";
import { useInternetConnection } from "hooks";
import { paths } from "features/menu/paths";

import "./Desktop.less";
import { HashRouter, Switch, Route } from "react-router-dom";
import { useWallet } from "hooks/useWallet";
import { Web3AuthCore } from "@web3auth/core";
import {ADAPTER_EVENTS, CHAIN_NAMESPACES, UserInfo} from "@web3auth/base";
import { REACT_APP_INFURA_ID } from "../../app/constants";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";

const { Sider, Content } = Layout;
export let userInfo: UserInfo | null = null;
export let web3authProvider = null;
export const web3auth = new Web3AuthCore({
  clientId: "BApuCibA7g9bIv0HoCRLhbUvo01ehy8Zn9INTc_CpkjtQTsHB3EMAPQBe9XW8vKaprjHOaW4Y4GvdFqBKOu1x9Q",
  web3AuthNetwork: "mainnet",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    rpcTarget: `https://polygon-mainnet.infura.io/v3/${REACT_APP_INFURA_ID}`,
    chainId: "0x89",
  },
});

const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    uxMode: "popup",
    loginConfig: {
      jwt: {
        name: "GamersXP dApp",
        verifier: "aws-cognito-verifier-gamersxpdappv1",
        typeOfLogin: "jwt",
        clientId: "7jl0btnoa8nntps3qbco5lie7o",
      },
    },
  },
});
web3auth.configureAdapter(openloginAdapter);

const torusPlugin = new TorusWalletConnectorPlugin({
  torusWalletOpts: {
    buttonPosition: "bottom-right"
  },
  walletInitOptions: {
    whiteLabel: {
      theme: { isDark: false, colors: { primary: "#C94B32" } },
      logoDark: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      logoLight: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    },
    useWalletConnect: false,
    enableLogging: false,
  },
});
web3auth.addPlugin(torusPlugin);

const subscribeAuthEvents = (web3auth:any) => {
  web3auth.on(ADAPTER_EVENTS.CONNECTED, (data:any) => {
    console.log("Yeah!, you are successfully logged in", data);
    web3authProvider = web3auth.provider;
    web3auth.getUserInfo().then((x:any) => {
      userInfo = x;
      console.log(userInfo)
    });
  });

  web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
    console.log("connecting");
  });

  web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
    console.log("disconnected");
    userInfo = null;
    web3authProvider = null;
  });

  web3auth.on(ADAPTER_EVENTS.ERRORED, (error:any) => {
    console.log("some error or user have cancelled login request", error);
  });
};

async function initWeb3auth() {
  if (!(web3auth && web3authProvider)) {
    console.log("initialising web3auth");
    subscribeAuthEvents(web3auth);
    await web3auth.init();
  }
}

const DesktopWindow: FC = () => {
  const [displaySideBar, setDisplaySideBar] = useState(false);
  const [displaySplash, toggleSplash] = useState(true);
  const isConnected = useInternetConnection();
  const { logoutOfWeb3Modal } = useWallet()

  useEffect(() => {
    initWeb3auth()
  })

  useEffect(() => {
    const load = process.env.NODE_ENV === "development" ? 0 : 1000 * 3.3;
    const timer = setTimeout(() => {
      toggleSplash(false);
    }, load);
    return () => clearTimeout(timer);
  }, []);

  if (displaySplash) return <SplashScreen />;

  return (
    <HashRouter>
      <DesktopHeader />
      <Layout>
        <Sider
          hidden={
            process.env.NODE_ENV === "production" &&
            (!displaySideBar || !isConnected)
          }
          style={{ height: "95vh" }}
          collapsible
          collapsed
          onCollapse={async () => {
            logoutOfWeb3Modal()
            await logout();
            window.location.href='wallet'
            setDisplaySideBar(false);
          }}
          trigger={<PoweroffOutlined />}
        >
          <MenuWrapper />
        </Sider>
        <Layout>
          <Content style={{ margin: 2, padding: 8 }}>
            {isConnected ? (
              <Auth
                setDisplaySideBar={(display: boolean) =>
                  setDisplaySideBar(display)
                }
              >
                <Switch>
                  {paths.map(({ path, Component }) => (
                    <Route key={path} path={path}>
                      <Component />
                    </Route>
                  ))}
                </Switch>
              </Auth>
            ) : (
              <Result
                status="500"
                title="No internet connection"
                subTitle="Sorry, something went wrong, please check your internet connection"
              />
            )}
          </Content>
        </Layout>
      </Layout>
    </HashRouter>
  );
};

export { DesktopWindow };
//add comment here for changes in the file