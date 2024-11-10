import type { Model } from 'mongoose'
export { IDBConfig, IDBConfigStore } from './config'
export { IDBUser, IDBUserStore } from './user'
export { IDBWheel, IDBWheelHistory, IDBWheelLucky } from './wheel'
export { IDBLogAddWheel, IDBLogAddCoin } from './log'

export interface IGlobalDB {
  Config: Model<IDBConfig>

  User: Model<IDBUser>

  Wheel: Model<IDBWheel>
  WheelHistory: Model<IDBWheelHistory>
  WheelLucky: Model<IDBWheelLucky>

  LogAddWheel: Model<IDBLogAddWheel>
  LogAddCoin: Model<IDBLogAddCoin>
}