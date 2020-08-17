import md5 from './md5.min'

function randomString(length) {
    let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i)
        result += str[Math.floor(Math.random() * str.length)];
    return result;
}

function signature(config) {
  const SECRET = 'wrXxDI3FlGO8vqp5Gb3FlWu25idm';
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
  const timestamp = new Date()/1000;
  const nonce = randomString(28);
  config.headers.timestamp = timestamp;
  config.headers.nonce = nonce;

  let parameters = {
    nonce: nonce
  };

  if(config.hasOwnProperty('params')){
    for (let key in config.params) {
      let item = config.params[key];
      if(!parameters.hasOwnProperty(key)){
        parameters[key] = item
      }
    }
  }

  if(config.hasOwnProperty('data')){
    for (let key in config.data) {
      let item = config.data[key];
    　if(!parameters.hasOwnProperty(key)){
        parameters[key] = item
      }
    }
  }
  let parameters_list = [];
  for (let key in parameters) {
    let item = key+parameters[key];
    if(parameters_list.indexOf(item)===-1){
      parameters_list.push(item)
    }
  }
  let sort_parameters = parameters_list.sort();
  console.log(JSON.stringify(parameters_list));
  console.log(JSON.stringify(sort_parameters));

  let sort_parameters_secret = (sort_parameters.join("")+SECRET).toLowerCase();

  console.log(sort_parameters_secret)
  console.log(md5(sort_parameters_secret))
  config.headers.sign = md5(sort_parameters_secret);
  return config;
}


export default {
  sign(config){
    return signature(config)
  }
}
