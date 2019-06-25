const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db')
const con = mysql.createConnection(MYSQL_CONF)
const { ErrorModel } = require('../utils/resModel')
con.connect()

const exec = sql => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, data) => {
      if (err) {
        // 数据重复
        if (err.code === 'ER_DUP_ENTRY') {
          resolve(new ErrorModel('数据重复'))
        }
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = {
  exec
}
