import md5 from 'js-md5' // yarn add js-md5
import { Base64 } from 'js-base64' // yarn add js-base64

function randomString (length) {
    const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = length; i > 0; --i) { result += str[Math.floor(Math.random() * str.length)] }
    return result
}

function parseJson (jsonObj) {
    for (const key in jsonObj) {
        const element = jsonObj[key]
        if (element.length > 0 && typeof (element) === 'object' || typeof (element) === 'object') {
            parseJson(element)
        } else {
            jsonObj[key] = element.toString().toLowerCase()
        }
    }
    return jsonObj
}

function signature (config) {
  const SECRET = 'e6QGz7AhFzFAFsR9jYoCUnZGsqDrQI'
  // config 数据示例
  // {
  //     "url": "/user/login",
  //     "method": "post",
  //     "data": {
  //         "username": "username",
  //         "password": "password"
  //     },
  //     "headers": {
  //     }
  // }
  const timestamp = new Date() / 1000
  const nonce = randomString(28)
  config.headers.timestamp = timestamp
  config.headers.nonce = nonce

  const parameters = {
    nonce: nonce
  };
  ['params', 'data'].forEach(function (d) {
    if (config.hasOwnProperty(d)) {
      for (const key in config[d]) {
        const item = config[d][key]
        if (item !== undefined && item !== '[]' && JSON.stringify(item) !== '[]' && item !== '' && item !== null || !!+item) {
          if (typeof item === 'object') {
            parameters[key] = JSON.stringify(parseJson(item))
          } else {
            parameters[key] = item.toString().toLowerCase()
          }
        }
      }
    }
  })
  const parametersList = []
  for (const key in parameters) {
    const item = parameters[key].toLowerCase().replace(/[^a-z\d]/ig, '')
    if (item !== undefined && item !== '[]' && JSON.stringify(item) !== '[]' && item !== '' && item !== null || !!+item) {
      const result = key + Base64.encode(item)
      if (parametersList.indexOf(result) === -1) {
        parametersList.push(result)
      }
    }
  }
  const sortParameters = parametersList.sort()
  const sortParametersSecret = (sortParameters.join('') + SECRET).toLowerCase()
  config.headers.sign = md5(sortParametersSecret)
  return config
}
export default {
  sign (config) {
    return signature(config)
  }
}
