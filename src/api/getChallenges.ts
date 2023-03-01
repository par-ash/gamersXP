import axios from 'axios'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const API_URL = process.env.REACT_APP_API || ''
const fetcher = (url: string) => axios.get(url).then((res) => res.data)

const getChallenges = async () => {
  const response = await axios.get<IChallenges[]>(`${API_URL}/challenges`)
  return response.data
}
const getSchemes = async () => {
  const response = await axios.get<IScheme[]>(`${API_URL}/schemes`)
  return response.data
}

export const useSchemes = () => {
  const { data, error, isValidating } = useSWR<IScheme[]>(
    `${API_URL}/schemes`,
    fetcher,
  )
  return { data, error, loading: isValidating }
}

export const useGetGameEvents = () => {
  const [gameEvents, setGameEvents] = useState<IEventModified[] | undefined>()

  const { data, error } = useSWR<IEvent[]>(`${API_URL}/game-events`, fetcher)

  useEffect(() => {
    async function updateEvents() {
      if (data && data.length > 0) {
        const schemes = await getSchemes()
        const challenges = await getChallenges()
        const currentGameEvents: IEventModified[] = data.map((item) => {
          if (!schemes.length) return { ...item, schemes: [] }
          const currentEvent: IEventModified = {
            ...item,
            schemes: item.schemes
              .map((currenScheme) => {
                const schemeData = schemes.find(
                  (scheme) => scheme.id === currenScheme,
                )
                return {
                  name: schemeData?.name || '',
                  id: schemeData?.id || '',
                }
              })
              .filter((currentScheme) => currentScheme.id.length > 0),
            challengeId:
              challenges.find((challenge) => {
                return challenge.id === item.challengeId
              })?.name || '',
          }
          return currentEvent
        })
        setGameEvents(currentGameEvents)
      }
    }
    updateEvents()
  }, [data])

  return { gameEvents, error }
}
