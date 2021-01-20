import { asyncRoutes, constantRoutes } from '@/router'
import { getMenuPer } from '@/api/login'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

function loopRoutes(a, temp) {
  asyncRoutes.forEach(b => {
    b.children.forEach(c => {
      if (c.meta.menuId === a.menu_button_id) {
        temp.forEach(d => {
          if (d.meta.parentId === b.meta.parentId) {
            d.children.push(c)
          }
        })
      }
    })
  })
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      getMenuPer(sessionStorage.getItem('userId')).then(response => {
        const permissionPage = response.data
        var result = []

        var temp = asyncRoutes.map(n => {
          const obj = {}
          for (const key in n) {
            if (key !== 'children') {
              obj[key] = n[key]
            } else {
              // 将没有menuId的菜单直接展示出来
              const arrTemp = []
              n.children.forEach(child => {
                if (!child.meta.menuId) {
                  arrTemp.push(child)
                }
              })
              obj.children = arrTemp
            }
          }
          return obj
        })
        permissionPage.forEach(a => {
          // 判断是否有子节点
          if (undefined !== a.children) {
            a.children.forEach(e => {
              // 注意：这里没有写二级菜单的子菜单
              loopRoutes(e, temp)
            })
          }
          loopRoutes(a, temp)
        })
        // 删除children 长度为0 的对象
        temp.forEach(n => {
          if (n.children.length > 0) {
            result.push(n)
          }
        })
        // result = constantRoutes.concat(result)
        // console.log('result=' + result)
        // state.addRouters = result
        const accessedRoutes = filterAsyncRoutes(result, roles)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
