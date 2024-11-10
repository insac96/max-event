import type { IAuth, IDBUser } from "~~/types"
import md5 from 'md5'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Chức năng tạm đóng, vui lòng liên hệ quản trị viên để đổi mật khẩu'

    const { old, new : password } = await readBody(event)
    if(!old || !password) throw 'Vui lòng nhập đủ thông tin'
    if (password.length < 6 || password.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'
    if (!!password.match(/\s/g)) throw 'Mật khẩu không có khoảng cách'

    const user = await DB.User
    .findOne({ _id: auth._id })
    .select('password block') as IDBUser

    if(!user) throw 'Tài khoản không tồn tại'
    if(user.password != md5(old)) throw 'Mật khẩu cũ không chính xác'
    if(old == password) throw 'Hai mật khẩu không được trùng nhau'

    user.password = md5(password)
    await user.save()

    return resp(event, { message: 'Đặt lại mật khẩu thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})