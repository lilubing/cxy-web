import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/oauth2-authorization-server/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function queryUserList(params) {
  return request({
    url: '/mybatis-web/users',
    method: 'get',
    params
  })
}

export function getMenuList() {
  return request({
    url: '/mybatis-web/user/menuList',
    method: 'get'
  })
}

export function addUser(user) {
  return request({
    url: '/mybatis-web/users',
    method: 'post',
    data: user
  })
}

export function updateUser(vo) {
  return request({
    url: '/mybatis-web/users',
    method: 'put',
    data: vo
  })
}

export function deleteUser(userId) {
  return request({
    url: `/mybatis-web/users/`,
    method: 'delete',
    params: {
      userId
    }
  })
}

export function getUserRoleInfo(userId) {
  return request({
    url: `/mybatis-web/users/id`,
    method: 'get',
    params: {
      userId
    }
  })
}
