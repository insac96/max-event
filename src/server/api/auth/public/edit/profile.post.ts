import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { email, } = await readBody(event)

    const user = await DB.User
    .findOne({ _id: auth._id })
    .select('email') as IDBUser
    if(!user) throw 'Tài khoản không tồn tại'

    if(!user.email && !!email){
      user.email = email
    }

    await user.save()
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})