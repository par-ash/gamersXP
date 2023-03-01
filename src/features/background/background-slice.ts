import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

import { sendFileToBackend } from 'api'
import { RootReducer } from 'app/rootReducer'

const initialState: TbackgroundState = {
  userID: null,
  wallet: null,
  id: null,
  title: null,
  timestamp: null,
  features: [],
  data: {
    events: [],
    infos: [],
  },
}

export const sendDataContent = createAsyncThunk(
  'overwolf/sendDataContent',
  async (_, thunkAPI: any) => {
    const { getState } = thunkAPI as IThunkAPi<RootReducer>
    const { background } = getState()
    if (!background.userID && !background.wallet) return null

    console.log(
      `Sending data to cloud for user ${background.userID} | wallet ${background.wallet}`,
    )
    const timestamp = Date.now()
    const s3Data = {
      ...background,
      timestamp,
      user: {
        id: background.userID,
        wallet: background.wallet,
      },
    }

    const response = await sendFileToBackend(s3Data)

    return response
  },
)

const backgroundWindowSlice = createSlice({
  name: 'backgroundWindow',
  initialState,
  reducers: {
    setEvent(state, action: PayloadAction<IoverwolfEventPayload>) {
      const { event } = action.payload
      const dataEvent = {
        timestamp: Date.now(),
        event,
      }
      //@ts-ignore
      state.data.events.push(dataEvent)
    },
    setInfo(state, action: PayloadAction<IoverwolfInfoPayload>) {
      const { info } = action.payload
      const dataInfo = {
        timestamp: Date.now(),
        info,
      }
      //@ts-ignore
      state.data.infos.push(dataInfo)
    },
    setHeaderData(state, action: PayloadAction<IoverwolfHeaderPayload>) {
      const { id, title, timestamp, features } = action.payload

      state.id = id
      state.title = title
      state.timestamp = timestamp
      state.features = features
    },
    setUserCognitoID(state, action: PayloadAction<string | null>) {
      state.userID = action.payload
    },
    setCurrentWalletID(state, action: PayloadAction<string | null>) {
      state.wallet = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendDataContent.fulfilled, (state) => {
      state.timestamp = null
      state.data.infos = []
      state.data.events = []
    })
  },
})

export const {
  setEvent,
  setInfo,
  setHeaderData,
  setUserCognitoID,
  setCurrentWalletID,
} = backgroundWindowSlice.actions

export default backgroundWindowSlice.reducer
