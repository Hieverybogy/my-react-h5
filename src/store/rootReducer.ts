// src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit'
import counterReducer from './modules/counter'
import chatReducer from './modules/chat'
import chatUserReducer from './modules/chatUser'

export const rootReducer = combineReducers({
  counter: counterReducer,
  chat: chatReducer,
  chatUser: chatUserReducer,
})

export type RootState = ReturnType<typeof rootReducer>
