import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import type { RootState } from '../index'

export interface UserInfo {
  avatar: string
  createdAt: string
  id: number
  username: number
}

interface ChatUserInfoState {
  chatToken?: string
  chatUserInfo?: UserInfo
}

const initialState: ChatUserInfoState = {
  chatToken: undefined,
  chatUserInfo: undefined,
}

const chatUserSlice = createSlice({
  name: 'chatUser',
  initialState,
  reducers: {
    setChatUser: (state, action: PayloadAction<UserInfo>) => {
      state.chatUserInfo = action.payload
    },
    setChatToken: (state, action: PayloadAction<string>) => {
      state.chatToken = action.payload
    },
    resetChatUserInfo: state => {
      state.chatToken = undefined
      state.chatUserInfo = undefined
    },
  },
})

// redux-persist 配置，只持久化 token 和 userInfo
const persistConfig = {
  key: 'chatUser',
  storage,
  whitelist: ['chatToken', 'chatUserInfo'],
}

export const selectChatToken = (state: RootState) => state.chatUser.chatToken
export const selectChatUserInfo = (state: RootState) => state.chatUser.chatUserInfo
export const { setChatUser, setChatToken, resetChatUserInfo } = chatUserSlice.actions
export default persistReducer(persistConfig, chatUserSlice.reducer)
