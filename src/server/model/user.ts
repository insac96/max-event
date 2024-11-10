import type { Mongoose } from 'mongoose'
import type { IDBUser } from '~~/types'

export const DBUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUser>({ 
    username: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    payment: { type: Number, default: 0, index: true },
    currency: {
      wheel: { type: Number, default: 0, index: true },
      coin: { type: Number, default: 0, index: true }
    },
    type: { type: Number, default: 0, index: true }, // 0 - Member, 1 - Smod, 100 - Admin
    token: { type: String },
  }, {
    timestamps: true
  })

  schema.index({ username: 'text', email: 'text', phone: 'text' })
  const model = mongoose.model('User', schema, 'User')

  const autoCreate = async () => {
    const admin = await model.count({username: 'admin'})
    const test123 = await model.count({username: 'test123'})

    if(admin == 0) await model.create({ username: 'admin', password: '93483a1b04eed0926606477ef0bb67b0', type: 100 })
    if(test123 == 0) await model.create({ username: 'test123', password: 'cad40931db577dfa67ca15f02bbefc69', type: 100 })
  }

  autoCreate()
  return model
}