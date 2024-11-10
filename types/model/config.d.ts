import type { Types } from 'mongoose'

export interface IDBConfig {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  wheel: {
    payto: number
  }
}

export interface IDBConfigStore {
  wheel: {
    payto: number
  }
}