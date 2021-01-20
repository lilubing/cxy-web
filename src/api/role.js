import request from '@/utils/request'

export function queryRoleSelectList(requestParam) {
  return request({
    url: '/mybatis-web/roles',
    method: 'get',
    params: {
      page: 1,
      limit: 999,
      conditions: {
        sort: 'asc'
      }
    }
  })
}

export function queryRoleList(params) {
  return request({
    url: '/mybatis-web/roles',
    method: 'get',
    params
  })
}

export function getRoleInfo(roleId) {
  return request({
    url: `/mybatis-web/roles/id`,
    method: 'get',
    params: {
      roleId
    }
  })
}

export function deleteRole(roleId) {
  return request({
    url: `/mybatis-web/roles/`,
    method: 'delete',
    params: {
      roleId
    }
  })
}

export function addRole(role) {
  return request({
    url: '/mybatis-web/roles',
    method: 'post',
    data: role
  })
}

export function updateRole(role) {
  return request({
    url: '/mybatis-web/roles',
    method: 'put',
    data: role
  })
}

export function setRoleAuthorities(menuButtonId, checked, roleId) {
  const params = {
    menuButtonId, checked, roleId
  }
  return request({
    url: '/mybatis-web/menuButtons/saveMenuButtonAndRoleAss',
    method: 'post',
    params
  })
}

export function getMenuButtonsTreeByRoleId(roleId) {
  return request({
    url: `/mybatis-web/menuButtons/menuButtonsTreeByRoleId`,
    method: 'get',
    params: {
      roleId
    }
  })
}

export function queryMenuList(roleId) {
  return request({
    url: '/mybatis-web/roles/menu/list',
    method: 'get',
    params: { roleId }
  })
}
