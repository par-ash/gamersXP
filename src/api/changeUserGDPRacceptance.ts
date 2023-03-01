import axios from 'axios'

export async function changeUserGDPRaccpetance(
  username: string,
  acceptance: boolean,
) {
  try {
    const response = await axios.put(
      'https://cx1sc486cg.execute-api.eu-central-1.amazonaws.com/Prod/change-custom-attributes',
      {
        username,
        allow: acceptance ? '1' : '0',
      },
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
