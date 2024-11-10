import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 100) throw 'Bạn không phải quản trị viên cấp cao'

    const data = await readBody(event)
    const { wheel } = data
    if(!wheel) throw 'Dữ liệu đầu vào không hợp lệ'
    
    delete data['_id']
    await DB.Config.updateMany({}, data)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})