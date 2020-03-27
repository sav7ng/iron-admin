import { axios } from '@/utils/request'

export function userFindAll (parameter) {
  return axios({
    url: '/admin/users/findAll',
    method: 'get',
    params: parameter
  })
}
