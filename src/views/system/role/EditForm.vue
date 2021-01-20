<template>
  <el-dialog
    title="编辑"
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
import { updateRole, getRoleInfo } from '@/api/role'
export default {
  name: 'AddFrom',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    'roleId': String,
    'visable': Boolean
  },
  data() {
    return {
      form: {
        name: '',
        description: ''
      }
    }
  },
  created() {
    this.getRoleInfo()
  },
  methods: {
    handleSubmit(form) {
      this.form.lastModifyUserId = sessionStorage.getItem('userId')
      updateRole(this.form).then((response) => {
        this.handleClose()
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
        this.$emit('getRoleList')
      }).catch(error => {
        console.log(error)
      })
    },
    handleClose() {
      this.$emit('handleEditHide')
    },
    handleReset() {
      this.$refs['form'].resetFields()
    },
    getRoleInfo() {
      const that = this
      getRoleInfo(this.roleId).then((response) => {
        that.form = response.data.data
      }).catch(error => {
        console.log(error)
      })
    }
  }
  /* computed:{
      ...mapGetters(['visable'])
    }*/
}
</script>

<style scoped>

</style>
