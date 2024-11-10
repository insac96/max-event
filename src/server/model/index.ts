import type { IGlobalDB } from '~~/types'
import type { Mongoose } from 'mongoose'

import { DBConfig } from './config'
import { DBUser } from './user'
import { DBWheel, DBWheelHistory, DBWheelLucky } from './wheel'
import { DBLogAddCoin, DBLogAddWheel } from './log'

export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    Config: DBConfig(mongoose),
    
    User: DBUser(mongoose),

    Wheel: DBWheel(mongoose),
    WheelHistory: DBWheelHistory(mongoose),
    WheelLucky: DBWheelLucky(mongoose),

    LogAddCoin: DBLogAddCoin(mongoose),
    LogAddWheel: DBLogAddWheel(mongoose),
  }
}