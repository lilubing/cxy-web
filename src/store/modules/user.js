import { login, logout, getInfo, getUserButton, getMenuPer, getPrinciple } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter, constantRoutes, asyncRoutes } from '@/router'
/* Layout */
// import Layout from '@/layout'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  permission: {},
  addRouters: [],
  userInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_BTN_PER: (state, obj) => {
    state.permission[obj.key] = obj.data
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // 递归获取按钮权限
  GetBtnPermission({ commit, state }, ids) {
    return new Promise((resolve, reject) => {
      if (!ids) {
        resolve()
        return
      }
      const iterator = function(i) {
        if (i === ids.length) {
          resolve()
          return
        }
        // 异步请求，
        getUserButton(ids[i], sessionStorage.getItem('userId')).then(response => {
          commit('SET_BTN_PER', { key: ids[i], data: response.data })
          i++
          iterator(i)
        }).catch(err => {
          console.log(err)
          resolve()
        })
      }
      iterator(0)
    })
  },
  GenerateRoutes({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMenuPer(sessionStorage.getItem('userId')).then(response => {
        console.log(response.data)
        console.log(asyncRoutes)
        console.log(constantRoutes)

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
          asyncRoutes.forEach(b => {
            b.children.forEach(c => {
              console.log(c.meta.title)
              if (c.meta.menuId === a.menu_button_id) {
                temp.forEach(d => {
                  if (d.meta.parentId === b.meta.parentId) {
                    d.children.push(c)
                  }
                })
              }
            })
          })
        })
        // 删除children 长度为0 的对象
        temp.forEach(n => {
          if (n.children.length > 0) {
            result.push(n)
          }
        })
        // result = constantRoutes.concat(result)
        state.addRouters = result
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user login
  Login({ commit, dispatch }, userInfo) {
    const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: userName.trim(), password: password }).then(response => {
        const data = response.data.data
        setToken(data.access_token)

        sessionStorage.setItem('userId', data.userId)
        /**
         * Display default card after login
         */
        sessionStorage.setItem('tableType', '2')
        sessionStorage.setItem('shoAllTickets', '2')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  GetInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const userInfo = response.data
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo))

        // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
        //   commit('SET_ROLES', data.roles)
        // } else {
        //   reject('getInfo: roles must be a non-null array !')
        // }

        if (!response.data) {
          reject('Verification failed, please Login again.')
        }

        // const { name, avatar, introduction } = userInfo

        const roles = []
        const authorities = userInfo.rolesList
        for (let index = 0; index < authorities.length; index++) {
          roles[index] = authorities[index]
        }

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_USERINFO', userInfo)
        commit('SET_NAME', userInfo.userName)
        // commit('SET_NAME', userInfo.realName)
        // commit('SET_ROLES', roles)
        if (authorities && authorities.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', roles)
        } else {
          reject('getInfo: roles must be a non-null array !')
        }
        // commit('SET_NAME', realName)
        // commit('SET_AVATAR', avatar)
        // commit('SET_INTRODUCTION', introduction)
        resolve(roles)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  GetPrinciple({ commit, state }) {
    return new Promise((resolve, reject) => {
      getPrinciple(state.token).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  Logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        sessionStorage.removeItem('userInfo')
        /** Display default card after login */
        sessionStorage.removeItem('tableType')
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  ResetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('user/GetInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
