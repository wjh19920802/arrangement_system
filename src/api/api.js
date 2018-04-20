import axios from 'axios'

// settings
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = 'http://192.168.0.3:60000'

export function fetchPost (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(res => {
      resolve(res.data)
    }).catch((error) => {
      reject(error)
    })
  })
}
export function fetchGet (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, params).then(res => {
      resolve(res.data)
    }).catch((error) => {
      reject(error)
    })
  })
}
export default {
  // 缩略图展示信息
  getTypeDesc (path) {
    return fetchGet(`/${path}`)
  },
  // 商品详情展示信息
  getTypeDetail (type, id) {
    return fetchPost(`/${type}/detail`, {id})
  }
}
