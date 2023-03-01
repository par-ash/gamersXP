import axios from 'axios'

export async function sendFileToBackend(file: any) {
  try {
    const response = await axios.post(
      'https://s5gzw0sr52.execute-api.eu-central-1.amazonaws.com/Prod/game-raw-data',
      file,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data
  } catch (error) {
    return error
  }
}
