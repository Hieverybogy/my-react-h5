import { createAsyncThunk, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import axios from 'axios'
import type { RootState } from '../store'

export interface ChatMember {
  userId: number
  username: string
  avatar?: string
}

export interface ChatRecord {
  id: number
  members: ChatMember[]
  chatUser?: ChatMember
  unreadCount?: number
  createdAt?: string
}

export interface ChatState {
  currentTargetUserId?: number
  chatRecordLists: ChatRecord[]
}

const initialState: ChatState = {
  currentTargetUserId: undefined,
  chatRecordLists: [],
}

// 异步请求
export const getChatRecordList = createAsyncThunk<
  ChatRecord[],
  { chatToken: string; chatUserId?: number },
  { rejectValue: string }
>('chat/getChatRecordList', async ({ chatToken, chatUserId }, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/chat/conversation', {
      headers: {
        Authorization: 'Bearer ' + chatToken,
      },
    })

    if (res.data.code === 0) {
      const data: ChatRecord[] = (res.data.result || []).map((k: any) => ({
        ...k,
        chatUser: (k.members || []).find((m: any) => m.userId !== chatUserId),
      }))
      return data
    } else {
      return rejectWithValue(res?.data?.errorDesc || '请求失败')
    }
  } catch (error: any) {
    console.error(error)
    return rejectWithValue(error?.message || '请求异常')
  }
})

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentTargetUserId(state, action: PayloadAction<number>) {
      state.currentTargetUserId = action.payload
    },
    setChatRecordLists(state, action: PayloadAction<ChatRecord[]>) {
      state.chatRecordLists = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getChatRecordList.fulfilled, (state, action) => {
        state.chatRecordLists = action.payload
      })
      .addCase(getChatRecordList.rejected, state => {
        state.chatRecordLists = []
      })
  },
})

export const currentConversationId = createSelector(
  [
    (state: RootState) => state.chat.currentTargetUserId,
    (state: RootState) => state.chat.chatRecordLists,
  ],
  (currentTargetUserId, chatRecordLists) => {
    return chatRecordLists.find(item => item.chatUser?.userId === currentTargetUserId)?.id
  }
)

export const { setCurrentTargetUserId, setChatRecordLists } = chatSlice.actions
export default chatSlice.reducer
