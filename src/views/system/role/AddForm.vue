<template>
  <el-dialog
    title="添加"
    :visible="visable"
    width="30%"
    :modal="false"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input v-model="form.description" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleReset">重 置</el-button>
      <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
/* import { mapGetters } from 'vuex'*/
// import { queryRoleSelectList, addRole } from '@/api/role'
import { addRole } from '@/api/role'
// 重置必须加上Prop才可以生效
export default {
  name: 'AddFrom',
  // eslint-disable-next-line vue/require-prop-types
  props: ['visable'],
  data() {
    return {
      form: {
        name: '',
        description: ''
      }
    }
  },
  /* computed:{
      ...mapGetters(['visable'])
    },*/
  created() {
    this.getRoleList()
  },
  methods: {
    handleSubmit(form) {
      this.form.createUserId = sessionStorage.getItem('userId')
      addRole(this.form).then((response) => {
        this.handleClose()
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        this.$emit('getRoleList')
      }).catch(error => {
        console.log(error)
      })
    },
    handleReset() {
      this.$refs['form'].resetFields()
      // this.$emit('handleAddHide')
    },
    handleClose() {
      this.$emit('handleAddHide')
    },
    getRoleList() {
      // const that = this
      // queryRoleSelectList().then((response) => {
      //   const data = response.data
      //   that.roles = data.data
      // }).catch(error => {
      //   console.log(error)
      // })
    }
  }
}
</script>

<style scoped>

</style>
