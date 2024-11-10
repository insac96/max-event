import type { Types } from 'mongoose'

export interface IDBUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  username: string
  password: string
  email: string
  phone: string
  payment: number
  currency: {
    wheel: number
    coin: number
  }
  type: number
  token: string
  
  // Function
  save: {
    () : void
  }
}

export interface IDBUserStore {
  _id: IDBUser['_id'],
  username: IDBUser['username'],
  type: IDBUser['type'],
  currency: IDBUser['currency'],
}