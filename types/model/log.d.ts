import type { Types } from 'mongoose'

export interface IDBLogAddWheel {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  from: Types.ObjectId
  to: Types.ObjectId

  start: number
  end: number
  add: number
  reason: string
}

export interface IDBLogAddCoin {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  from: Types.ObjectId
  to: Types.ObjectId

  start: number
  end: number
  add: number
  reason: string
}