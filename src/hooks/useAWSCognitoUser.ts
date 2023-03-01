import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import {
  LOCALSTORAGE_KEYS,
  REACT_APP_AWS_COGNITO_REDIRECT_URI,
  REACT_APP_AWS_COGNITO_URL_AUTH,
  REACT_APP_AWS_POOLS_WEB_CLIENT_ID,
} from './constants'
import { useDispatch } from 'react-redux'
import { setUserCognitoID } from 'features/background'
import { web3auth } from "../pages/DesktopWindow"

interface IAWSCognitoTokenResponse {
  id_token: string
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

interface IAWSCognitoUserInformationResponse {
  email_verified: boolean
  email: number
  username: string
  name: string
  sub: string
  'custom:GDPR-acceptance': '1' | '0'
  roles?: Array<string | number>
  isJoined?: boolean
}

export async function getRolesFromCode(
  userId: string
): Promise<{ roles: Array<string | number>, isJoined: boolean }> {
  try {
    const res = await fetch(
      `https://slmkhd9xsg.execute-api.eu-central-1.amazonaws.com/corsproxy/?uri=https://discord.com/api/v8/guilds/${process.env.REACT_APP_GUILD_ID}/members/${userId}`,
    ).then((r) => r.json());

    const roles = res.roles as Array<string | number>;
    return { roles, isJoined: true };
  } catch (error) {
    console.log('error', error)

    return { roles: [], isJoined: false }
  }
}

const getAWSCognitoToken = async (
  code: string,
): Promise<IAWSCognitoTokenResponse> => {
  const url = `${REACT_APP_AWS_COGNITO_URL_AUTH}/oauth2/token`
  const { data } = await axios.post<IAWSCognitoTokenResponse>(
    url,
    new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: REACT_APP_AWS_POOLS_WEB_CLIENT_ID,
      code,
      redirect_uri: REACT_APP_AWS_COGNITO_REDIRECT_URI,
    }),
  )
  if (Object.keys(data).length) {
    localStorage.setItem(LOCALSTORAGE_KEYS.TOKEN, JSON.stringify(data))
    localStorage.removeItem(LOCALSTORAGE_KEYS.CODE)
  }
  return data
}

const updateAWSCognitoRefreshToken = async (refreshToken: string) => {
  const url = `${REACT_APP_AWS_COGNITO_URL_AUTH}/oauth2/token`
  const { data } = await axios.post<IAWSCognitoTokenResponse>(
    url,
    new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: REACT_APP_AWS_POOLS_WEB_CLIENT_ID,
      refresh_token: refreshToken,
    }),
  )

  return data.access_token
}

const hasExpiration = (expirationTime: number) =>
  Date.now() >= expirationTime * 1000

const getAWSCognitoUserInformation = async ({
  expires_in,
  refresh_token,
  access_token,
}: IAWSCognitoTokenResponse): Promise<IAWSCognitoUserInformationResponse> => {
  const url = `${REACT_APP_AWS_COGNITO_URL_AUTH}/oauth2/userInfo`
  let token = access_token
  console.log("getAWSCognitoUserInformation")
  if (hasExpiration(expires_in)) {
    const updatedToken = await updateAWSCognitoRefreshToken(refresh_token)
    token = updatedToken
  }
  let { data } = await axios.get<IAWSCognitoUserInformationResponse>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!!data && data.username.split('_')[0] === 'discord') {
    const { roles, isJoined } = await getRolesFromCode(data.username.split('_')[1])
    data.roles = roles
    data.isJoined = isJoined
  }

  return data
}

export const logout = async (): Promise<void> => {
  await web3auth.logout()

  localStorage.clear()
  if (typeof window.injectedProvider?.provider?.disconnect === 'function') {
    await window.injectedProvider.provider.disconnect()
    //await window.ethereum.provider.disconnect()
    console.log("logged out")
  }
  window.dispatchEvent(new Event('storage'))
  const url = `${REACT_APP_AWS_COGNITO_URL_AUTH}/logout?response_type=code&client_id=${REACT_APP_AWS_POOLS_WEB_CLIENT_ID}&redirect_uri=${REACT_APP_AWS_COGNITO_REDIRECT_URI}&state=STATE&scope=openid+profile+aws.cognito.signin.user.admin`
  window.open(url, 'Sign In', 'height=768,width=800,resizable=yes,status=yes')
  setTimeout(() => {
    window.location.reload()
  }, 2)
}

export function useAWSCognitoUser() {
  const [user, updteUser] = useState<IAWSCognitoUserInformationResponse | null>(
    null,
  )
  const dispatch = useDispatch()
  const [loading, updateLoader] = useState(true)

  const fetchUserData = useCallback(
    async (code: string, awsToken: IAWSCognitoTokenResponse | null) => {
      try {

        if (!awsToken) awsToken = await getAWSCognitoToken(code)
        const awsUser = await getAWSCognitoUserInformation(awsToken)
        dispatch(setUserCognitoID(awsUser.sub))
        updteUser(awsUser)
      } catch (error) {
        console.log(error)
        dispatch(setUserCognitoID(null))
        updteUser(null)
      }
    },
    [dispatch],
  )

  const isValidContent = (content: string | null) =>
    typeof content === 'string' && content.length

  useEffect(() => {
    async function checkUserData() {
      const params = new URLSearchParams(window.location.search);
      const newCode = params.get('code');
      console.log(newCode, params)
      if (newCode) {
        localStorage.setItem(LOCALSTORAGE_KEYS.CODE, newCode);
      }
      updateLoader(true)
      const code = localStorage.getItem(LOCALSTORAGE_KEYS.CODE) as string
      const awsToken = localStorage.getItem(LOCALSTORAGE_KEYS.TOKEN) as string

      if (isValidContent(code) && !isValidContent(awsToken))
        await fetchUserData(code, null)
      else if (isValidContent(awsToken))
        await fetchUserData(
          code,
          JSON.parse(awsToken) as IAWSCognitoTokenResponse,
        )
      else updteUser(null)

      setTimeout(() => {
        updateLoader(false)
      }, 4000)
    }

  
    checkUserData()

    window.addEventListener('storage', checkUserData)

    return () => {
      window.removeEventListener('storage', checkUserData)
    }
  }, [fetchUserData])

  return { user, loading }
}
