import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên cấp cao'
    
    const { size, current, sort, search} = await readBody(event)
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { }
    if(!!search.from){
      const users = await DB.User.find({
        username : { $regex : search.from.toLowerCase(), $options : 'i' }
      }).select('_id')

      match['from'] = { $in: users.map(i => i._id)}
    }

    if(!!search.to){
      const users = await DB.User.find({
        username : { $regex : search.to.toLowerCase(), $options : 'i' }
      }).select('_id')

      match['to'] = { $in: users.map(i => i._id)}
    }

    const list = await DB.LogAddWheel
    .find(match)
    .populate({ path: 'from', select: 'username' })
    .populate({ path: 'to', select: 'username' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.LogAddWheel.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})