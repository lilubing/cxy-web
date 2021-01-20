import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function login(data) {
  return request({
    url: '/oauth2-authorization-server/login/token',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/mybatis-web/user/extra',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/oauth2-authorization-server/logout/token',
    method: 'post',
    params: {
      'token': getToken()
    }
  })
}

export function getUserButton(parentMenuId, userId) {
  return request({
    url: `/mybatis-web/menuButtons/user_button`,
    method: 'get',
    params: {
      'parentMenuId': parentMenuId,
      'userId': userId
    }
  })
}

export function getMenuPer(userId) {
  return request({
    url: `/mybatis-web/menuButtons/user_menu`,
    method: 'get',
    params: {
      'parentMenuId': 0,
      'userId': userId
    }
  })
}
export function changepassword(oldpwd, pwd) {
  return request({
    url: `/mybatis-web/menuButtons/users/updpwd`,
    method: 'put',
    params: {
      oldpwd,
      pwd
    }
  })
}

export function validateCode(params) {
  return request({
    url: '/mybatis-web/login/validateCode',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function getPrinciple() {
  return request({
    url: '/mybatis-web/getPrinciple',
    method: 'get'
  })
}
