import type { IAuth, IDBConfig, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id, money } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(money)) || parseInt(money) < 0) throw 'Dữ liệu tiền tệ không hợp lệ'

    const user = await DB.User.findOne({_id: _id}).select('currency payment') as IDBUser
    if(!user) throw 'Người dùng không tồn tại'

    const config = await DB.Config.findOne({}).select('wheel') as IDBConfig
    const wheelPayTo = config.wheel.payto

    const wheel = Math.floor(money / wheelPayTo)
    const update = await DB.User.findOneAndUpdate({ _id: user._id }, {
      '$inc' : { 
        'payment': money,
        'currency.wheel': wheel,
        'currency.coin': money,
      }
    }, { new: true }).select('currency') as IDBUser

    await DB.LogAddCoin.create({
      from: auth._id,
      to: user._id,
      add: money,
      start: user.currency.coin,
      end: update.currency.coin,
      reason: `Nạp ${money.toLocaleString('vi-VN')} VNĐ`
    })

    if(wheel > 0){
      await DB.LogAddWheel.create({
        from: auth._id,
        to: user._id,
        add: wheel,
        start: user.currency.wheel,
        end: update.currency.wheel,
        reason: `Nạp ${money.toLocaleString('vi-VN')} VNĐ - Tỷ lệ ${wheelPayTo.toLocaleString('vi-VN')} VNĐ / lượt`
      })
    }

    return resp(event, { message: 'Sửa tiền tệ thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})