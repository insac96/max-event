import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event, false) as IAuth

    const user = await DB.User
    .findOne({ _id: auth?._id })
    .select('-token -password')
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    return resp(event, { result: user })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})