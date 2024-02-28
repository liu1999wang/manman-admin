import request from '@/utils/request'

export function list(data) {
  return request({
    url: 'permission/list',
    method: 'get',
    params: data
  })
}

export function geteditPermission(permission_id) {
  return request({
    url: `permission/edit/${permission_id}`,
    method: 'get'
  })
}

export function addpermission(data) {
  return request({
    url: `permission/add/`,
    method: 'post',
    data
  })
}

export function getpermissionlist() {
  return request({
    url: 'permission/permissionlist',
    method: 'get'
  })
}
export function editpermission(data) {
  return request({
    url: `permission/edit/${data.id}`,
    method: 'post',
    data
  })
}

export function delpermission(data) {
  return request({
    url: `permission/del`,
    method: 'delete',
    params: data
  })
}
