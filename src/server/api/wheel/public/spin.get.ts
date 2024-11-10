import type { IAuth, IDBUser, IDBWheel } from "~~/types"

const getRandomGift = (list : Array<IDBWheel>) : IDBWheel => {
  let totalPercent = 0
  let rand = 0
  totalPercent = list.reduce((accumulator, object) => {
    return parseFloat(String(accumulator)) + parseFloat(String(object.percent))
  }, 0)
  totalPercent = totalPercent
  rand = Math.random() * totalPercent

  // Get Chances
  const chances : Array<number> = []
  let acc = 0
  list.forEach(i => {
    acc = parseFloat(String(acc)) + (parseFloat(String(i.percent)))
    chances.push(acc)
  })

  // Get Index
  let index : number = 0
  chances.forEach(i => {
    (i <= rand) && (index = index + 1)
  })

  return list[index]
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const user = await DB.User.findOne({ _id: auth._id }).select('currency') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(user.currency.wheel < 1) throw 'Bạn đã hết lượt quay'

    const list = await DB.Wheel.find({})
    if(list.length == 0) throw 'Vòng quay hiện chưa có phần thưởng để bắt đầu'

    const resultGift = getRandomGift(list)
    if(!resultGift) throw 'Có lỗi xảy ra, vui lòng thử lại sau'

    const historyCreate = {
      user: user._id,
      type: resultGift.type,
      name: resultGift.name,
      amount: resultGift.amount,
      percent: resultGift.percent
    }

    // History
    await DB.WheelHistory.create(historyCreate)

    // Lucky User
    if(resultGift.type != 0 && resultGift.percent <= 1){
      await DB.WheelLucky.create(historyCreate)
    }

    // Update User
    await DB.User.updateOne({ _id: user._id }, { $inc: { 'currency.wheel': -1 }})

    return resp(event, { result: resultGift })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})