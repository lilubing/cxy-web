import request from '@/utils/request'

export function queryMenuList() {
  return request({
    url: '/mybatis-web/menuButtons',
    method: 'get'
  })
}

export function queryMenuInfo(menuButtonId) {
  return request({
    url: `/mybatis-web/menuButtons/id`,
    method: 'get',
    params: {
      menuButtonId
    }
  })
}

export function deleteMenu(menuButtonId) {
  return request({
    url: `/mybatis-web/menuButtons`,
    method: 'delete',
    params: {
      menuButtonId
    }
  })
}

export function addMenu(menuButton) {
  return request({
    url: '/mybatis-web/menuButtons',
    method: 'post',
    data: menuButton
  })
}

export function updateMenu(menuButton) {
  return request({
    url: '/mybatis-web/menuButtons',
    method: 'post',
    data: menuButton
  })
}
