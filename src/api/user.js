import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/store',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/info/' + token,
    method: 'get'
  })
}

export function generateRoutes(token) {
  return request({
    url: '/admin/permission/' + token,
    method: 'get'
  })
}

export function logout(token) {
  return request({
    url: '/admin/logout/' + token,
    method: 'get'
  })
}

export function getuserlist(data) {
  return request({
    url: '/user/list',
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function geteditUser(id) {
  return request({
    url: '/user/edit/' + id,
    method: 'get'
  })
}

export function editUser(data) {
  return request({
    url: '/user/edit/' + data.id,
    method: 'post',
    data
  })
}

export function editMoney(data) {
  return request({
    url: '/usermoneys/editmoney/',
    method: 'post',
    data
  })
}

export function editIntegral(data) {
  return request({
    url: '/usermoneys/editintegral/',
    method: 'post',
    data
  })
}

export function alterState(id) {
  return request({
    url: '/user/state/' + id,
    method: 'put'
  })
}

