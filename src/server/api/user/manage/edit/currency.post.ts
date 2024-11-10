import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id, coin, wheel, reason } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!reason) throw 'Vui lòng nhập lý do'
    if(!!isNaN(parseInt(coin)) || parseInt(coin) < 0) throw 'Dữ liệu tiền tệ không hợp lệ'
    if(!!isNaN(parseInt(wheel)) || parseInt(wheel) < 0) throw 'Dữ liệu lượt quay không hợp lệ'

    const user = await DB.User.findOne({_id: _id}).select('currency') as IDBUser
    if(!user) throw 'Người dùng không tồn tại'

    const update = await DB.User.findOneAndUpdate({ _id: user._id }, {
      '$inc' : { 
        'currency.coin': parseInt(coin),
        'currency.wheel': parseInt(wheel),
      }
    }, { new: true }).select('currency') as IDBUser

    if(coin > 0){
      await DB.LogAddCoin.create({
        from: auth._id,
        to: user._id,
        add: coin,
        start: user.currency.coin,
        end: update.currency.coin,
        reason: reason
      })
    }

    if(wheel > 0){
      await DB.LogAddWheel.create({
        from: auth._id,
        to: user._id,
        add: wheel,
        start: user.currency.wheel,
        end: update.currency.wheel,
        reason: reason
      })
    }

    return resp(event, { message: 'Sửa tiền tệ thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})