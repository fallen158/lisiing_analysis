const { exec } = require('../db/mysql')
const { SuccessModel, ErrorModel } = require('../utils/resModel')

const popularTop100 = async data => {
  const { url, title, area, address, price, comment, tags, roomType } = data
  const sql = `insert into popular_top100(url, title, area, address, price, comment, tags, roomType) values('${url}', '${title}', '${area}', '${address}', '${price}', '${comment}', '${tags}', '${roomType}');`
  const rows = await exec(sql)
  // 统计数据重复
  if (rows.insertId) {
    return new SuccessModel({
      message: 'data created successfully',
      insertId: rows.insertId
    })
  }
  if (rows.code === 0) {
    return rows
  }
  return new ErrorModel({ message: 'data created fail' })
}

module.exports = {
  popularTop100
}
