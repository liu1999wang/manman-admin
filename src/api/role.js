import request from '@/utils/request'

export function getrolelist(data) {
  return request({
    url: 'role/list',
    method: 'get',
    params: data
  })
}

export function addRole(data) {
  return request({
    url: 'role/add',
    method: 'post',
    data
  })
}

export function editRole(data) {
  return request({
    url: `role/edit/${data.id}`,
    method: 'post',
    data
  })
}

export function geteditRole(role_id) {
  return request({
    url: `role/edit/${role_id}`,
    method: 'get'
  })
}

export function alterState(role_id) {
  return request({
    url: `role/state/${role_id}`,
    method: 'put'
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}

export function endowpermission(data) {
  return request({
    url: `role/authorization/${data.id}`,
    method: 'post',
    data: { 'per_ids': data.per_ids }
  })
}

