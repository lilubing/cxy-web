import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding

  // const roles = store.getters && store.getters.roles
  const buttons = store.getters && store.getters.permission[value.id]

  if (value) {
    const permissionRoles = value

    const hasPermission = buttons.some(item => {
      return permissionRoles.key === item.btn_id
    })

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
