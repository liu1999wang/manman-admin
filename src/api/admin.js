import request from '@/utils/request'

export function getuserlist(data) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/admin/add/',
    method: 'post',
    data
  })
}

export function editUser(data) {
  return request({
    url: '/admin/edit/' + data.id,
    method: 'post',
    data
  })
}

export function geteditUser(id) {
  return request({
    url: '/admin/edit/' + id,
    method: 'get'
  })
}

export function alterState(admin_id) {
  return request({
    url: '/admin/state/' + admin_id,
    method: 'put'
  })
}

export function endowrole(data) {
  return request({
    url: '/admin/endowrole/' + data.id,
    method: 'post',
    data
  })
}

