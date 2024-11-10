import md5 from 'md5'
import type { IAuth, IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id, email, phone, password, type } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
    if(type < 0 || type > 100) throw 'Dữ liệu quyền hạn không hợp lệ'

    const user = await DB.User.findOne({_id: _id})
    .select('username email phone type') as IDBUser
    if(!user) throw 'Người dùng không tồn tại'

    const update : any = { type: type }

    if(!!email && user.email != email){
      const check = await DB.User.findOne({ email: email }).select('_id')
      if(!!check) throw 'Email đã tồn tại'
      update['email'] = email
    }
    if(!!phone && user.phone != phone){
      const check = await DB.User.findOne({ phone: phone }).select('_id')
      if(!!check) throw 'Số điện thoại đã tồn tại'
      update['phone'] = phone
    }
    if(!!password){
      update['password'] = md5(password)
    }
    if(user.type != type){
      update['type'] = type
    }

    await DB.User.updateOne({ _id: user._id }, update)
    
    return resp(event, { message: 'Sửa thông tin thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})