import { FC, useEffect, useState } from 'react'
import { Button, Spin, Result, Checkbox, Popover, Typography } from 'antd'
import { useAWSCognitoUser } from 'hooks/useAWSCognitoUser'
import gtIcon from 'assets/images/TokenLogo.png'
import { useHistory } from 'react-router-dom'
import { WALLET_ADAPTERS } from "@web3auth/base";
import { web3auth, userInfo } from "../../pages/DesktopWindow"
import { changeUserGDPRaccpetance } from 'api'

export const useWeb3AWSCognito = async () => {
    console.log("starting connect")
    if (web3auth.status === "not_ready") {
        console.log("web3auth not ready, so init again")
        await web3auth.init();
        //await new Promise(f => setTimeout(f, 2000));
    }
    //await web3auth.logout()
    await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "jwt",
        extraLoginOptions: {
            domain: "https://overwolf-integration.auth.us-east-1.amazoncognito.com",
            verifierIdField: "email",
            response_type: "token",
            scope: "email profile openid",
        },
    });
    if (web3auth.status === "connected") {
        window.location.reload()
    }
}

const AuthWrapper: FC<{ setDisplaySideBar: (display: boolean) => void }> = ({
  children,
  setDisplaySideBar,
}) => {
    const user = userInfo;
  const { loading } = useAWSCognitoUser()
  const [disabled, setDisable] = useState({
    tos: false,
    gdpr: false,
  })

  const history = useHistory()

  useEffect(() => {
    if (user !== null && user && history) {
      setDisplaySideBar(true)
      history.push('wallet')
      ;(async () => {
        await changeUserGDPRaccpetance(user.name, disabled.gdpr)
      })()
    }
  }, [user, history, setDisplaySideBar, disabled])

  if (loading)
    return (
      <div
        style={{
          margin: '20px 0',
          marginBottom: 20,
          padding: '250px 50px',
          textAlign: 'center',
        }}
      >
        <Spin tip="Loading..." />
      </div>
    )

  if (user) return <>{children}</>

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
      }}
    >
      <Result
        status={!disabled.tos ? 'info' : 'success'}
        icon={
          <img
            draggable={false}
            src={gtIcon}
            alt="GT Icon"
            style={{
              filter: `grayscale(${disabled.tos ? 0 : 100}%)`,
              width: '9rem',
            }}
          />
        }
        title={
          <Typography.Title level={4}>
            "Join GamersXP and start earning GMXP Tokens, by playing the games you
            love"
          </Typography.Title>
        }
        subTitle={
          <>
            <br />
            <Checkbox
              style={{ marginRight: 7 }}
              onChange={(e) =>
                setDisable((oldState) => ({
                  ...oldState,
                  tos: e.target.checked,
                }))
              }
            />

            <a
              href="#/"
              onClick={() =>
                overwolf.utils.openUrlInDefaultBrowser(
                  'https://gamersxp.io/terms-and-conditions/',
                )
              }
            >
              Terms and Conditions
            </a>

            <br />
            <Checkbox
              onChange={(e) =>
                setDisable((oldState) => ({
                  ...oldState,
                  gdpr: e.target.checked,
                }))
              }
            >
              I want to receive more targeted messages{' '}
              <Popover
                overlayStyle={{
                  width: '30vw',
                }}
                content={
                  <div>
                    <p>
                      By checking this box, you agree to receive targeted
                      messages about GamersXP events and partner projects, and also
                      about games that do not use a GamersXP account.
                    </p>
                    <p>
                      You can unsubscribe from targeted messages, at any time, in
                      the Account Management section.
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
        }
        extra={
          <>
            <Button
              disabled={!disabled.tos}
              type="primary"
              key="console"
              onClick={useWeb3AWSCognito}
              color="ccff00"
            >
              Sign In
            </Button>
          </>
        }
      />
    </div>
  )
}

export default AuthWrapper