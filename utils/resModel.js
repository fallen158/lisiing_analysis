class Model {
  constructor (data, msg) {
    if (typeof data === 'string') {
      this.msg = data
      data = null
      msg = null
    }
    if (data) {
      this.dtat = data
    }
    if (msg) {
      this.msg = msg
    }
  }
}

class SuccessModel extends Model {
  constructor (data, msg) {
    super(data, msg)
    this.code = 1
  }
}

class ErrorModel extends Model {
  constructor (data, msg) {
    super(data, msg)
    this.code = 0
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
}
