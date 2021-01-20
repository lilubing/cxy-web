<template>
  <el-dialog
    title="权限控制"
    :visible="visable"
    width="30%"
    :modal="false"
    :before-close="handleClose"
  >
    <el-tree
      ref="tree"
      default-expand-all
      :data="data"
      show-checkbox
      node-key="menuButtonId"
      :default-checked-keys="checkedKeys"
      :props="defaultProps"
      highlight-current
      :check-strictly="true"
      :render-content="renderContent"
      @check-change="handleCheckChange"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleReset">重 置</el-button>
      <el-button type="primary" @click="handleClose">关 闭</el-button>
      <!-- <el-button type="primary" @click="handleSubmit('form')">确 定</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
import { getMenuButtonsTreeByRoleId, setRoleAuthorities } from '@/api/role'

export default {
  name: 'AuthForm',
  // eslint-disable-next-line vue/require-prop-types
  props: ['visable', 'roleId'],
  data() {
    return {
      checkedKeys: [],
      data: [/* {
              id: 1,
              name: '系统管理',
              isMenu:true,
              children: [{
                id: 4,
                name: '用户管理',
                isMenu:true,
                children: [{
                  id: 9,
                  name: '用户删除',
                  isMenu:false
                }, {
                  id: 10,
                  name: '用户修改',
                  isMenu:false
                }]
              }]
            }*/],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getAuthorities()
  },
  methods: {
    handleSubmit() {
      // false 是否只包含叶子节点    //true 是否包含半选状态节点
      const halfTreeKeys = this.$refs.tree.getHalfCheckedKeys()
      console.log(halfTreeKeys)
      const treeKeys = this.$refs.tree.getCheckedKeys()
      setRoleAuthorities(this.roleId, halfTreeKeys.concat(treeKeys)).then(response => {
        this.handleClose()
        this.$message({
          showClose: true,
          message: '权限设置成功',
          type: 'success'
        })
      }).catch(error => {
        console.log(error)
      })
    },
    getAuthorities() {
      // const that = this
      getMenuButtonsTreeByRoleId(this.roleId).then(response => {
        this.data = response.data
        this.getAllCheckedKeys(response.data)
      }).catch(error => {
        console.log(error)
      })
    },
    getAllCheckedKeys(resultData) {
      resultData.forEach(item => {
        if (undefined !== item.checked) {
          this.checkedKeys.push(item.menuButtonId)
        }
        if (undefined !== item.children) {
          this.getAllCheckedKeys(item.children)
        }
      })
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          {this.iconClass(data.type)}
          <span style='margin-left:5px;'>{node.label}</span>
        </span>
      )
    },
    iconClass(type) {
      if (type) {
        return <i class='el-icon-document'></i>
      } else {
        return <i class='el-icon-menu'></i>
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      setRoleAuthorities(data.menuButtonId, checked, this.roleId).then(response => {
        this.$message({
          showClose: true,
          message: '权限设置成功',
          type: 'success'
        })
      }).catch(error => {
        console.log(error)
      })
    },
    handleClose() {
      this.$emit('handleAuthHide')
    },
    handleReset() {
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
