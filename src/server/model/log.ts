import type { Mongoose } from 'mongoose'
import type { IDBLogAddCoin, IDBLogAddWheel } from '~~/types'

export const DBLogAddCoin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLogAddCoin>({ 
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    start: { type: Number, index: true },
    end: { type: Number, index: true },
    add: { type: Number, index: true },
    reason: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LogAddCoin', schema, 'LogAddCoin')
  return model 
}

export const DBLogAddWheel = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLogAddWheel>({ 
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    start: { type: Number, index: true },
    end: { type: Number, index: true },
    add: { type: Number, index: true },
    reason: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LogAddWheel', schema, 'LogAddWheel')
  return model 
}