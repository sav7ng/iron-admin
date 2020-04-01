import { axios } from '@/utils/request'

export function userFindAll (parameter) {
  return axios({
    url: '/admin/users/findAll',
    method: 'get',
    params: parameter
  })
}

export function banUserById (parameter) {
  return axios({
    url: '/admin/users/banUserById',
    method: 'delete',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getUserInfoById (parameter) {
  return axios({
    url: '/admin/users/getUserInfoById',
    method: 'get',
    params: parameter
  })
}
