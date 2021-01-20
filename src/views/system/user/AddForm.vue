<template>
  <el-dialog
    title="添加"
    :visible="visable"
    width="40%"
    :modal="false"
    :show-close="false"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="form.userName" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.realName" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.passWord" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobilePhone">
        <el-input v-model="form.mobilePhone" />
      </el-form-item>
      <el-form-item label="邮件" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.sex">
          <el-radio border label="0">男</el-radio>
          <el-radio border label="1">女</el-radio>
        </el-radio-group>
        <!--label="男"-->
      </el-form-item>

      <el-form-item label="角色" prop="rolesList">
        <el-select v-model="form.rolesList" filterable multiple placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleHide">取 消</el-button>
      <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
/* import { mapGetters } from 'vuex'*/
import { addUser } from '@/api/user'
import { queryRoleSelectList } from '@/api/role'
export default {
  name: 'AddFrom',
  // eslint-disable-next-line vue/require-prop-types
  props: ['visable'],
  data() {
    return {
      roles: [],
      form: {
        userName: '',
        realName: '',
        mobilePhone: '',
        email: '',
        sex: '0',
        rolesList: []
      },
      initForm: {
        userName: '',
        realName: '',
        mobilePhone: '',
        email: '',
        sex: '0',
        rolesList: []
      },
      rules: {
        userName: [
          { required: true, message: '用户名并能为空', trigger: blur },
          { min: 1, max: 8, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        rolesList: [
          { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'blur' }
        ],
        email: [
          { type: 'email', // 要检验的类型（number，email，date等）
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'], // hange为检验的字符变化的时候
            required: true
          }
        ],
        mobilePhone: [
          {
            required: true,
            pattern: /^1[34578]\d{9}$/, // 可以写正则表达式
            message: '目前只支持中国大陆的手机号码',
            trigger: 'blur'
          }
        ]
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
      this.$refs[form].validate((valid) => {
        if (valid) {
          addUser(this.form).then((response) => {
            this.handleHide()
            const data = response.data
            if (data.code === 200) {
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
              this.$emit('getUserList')
              this.form = this.initForm
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          return false
        }
      })
    },
    handleHide() {
      this.$emit('handleAddHide')
    },
    getRoleList() {
      const that = this
      queryRoleSelectList().then((response) => {
        const data = response.data
        that.roles = data.data.rows
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
</style>
