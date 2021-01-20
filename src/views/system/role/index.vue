<template>
  <el-card shadow="never">
    <div class="app-container">
      <search-from :menu-group="menuGroup" />

      <el-table
        v-loading="loading"
        class="table"
        size="medium"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
      >
        <el-table-column type="index" align="center" header-align="center" label="序号" />
        <el-table-column prop="name" align="center" header-align="center" label="角色名称" />
        <el-table-column prop="description" align="center" header-align="center" label="角色描述" />
        <!-- <el-table-column prop="userList" :formatter="formatUserList" align="center" :show-overflow-tooltip="true" header-align="center" label="人员列表" /> -->

        <el-table-column align="center" header-align="center" label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)">修改</el-button>
            <el-button size="mini" type="success" icon="el-icon-edit" @click="auth(scope.row)">权限分配</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination :current-page="queryParams.page" :page-sizes="[10,20,30, 50]" :page-size="queryParams.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

      <add-form :visable="addVisable" @handleAddHide="handleAddHide" @getRoleList="getRoleList" />
      <edit-form v-if="editViasble" :role-id="roleId" :visable="editViasble" @handleEditHide="handleEditHide" @getRoleList="getRoleList" />
      <auth-form v-if="authViasble" :role-id="roleId" :visable="authViasble" @handleAuthHide="handleAuthHide" />
    </div>
  </el-card>
</template>

<script>
import SearchFrom from '@/components/SearchForm/Form.vue'
// import Pagination from '@/components/Pagination'
import { queryRoleList, deleteRole } from '@/api/role'
import AddForm from './AddForm'
import EditForm from './EditForm'
import AuthForm from './AuthForm'
// eslint-disable-next-line no-unused-vars
import { preValid } from '@/utils/validate'
export default {
  name: 'Index',
  components: {
    AuthForm,
    SearchFrom, AddForm, EditForm
  },
  data() {
    return {
      queryParams: {
        page: 1,
        limit: 20
        // userName:''
      },
      addVisable: false,
      editViasble: false,
      authViasble: false,
      total: 0,
      roleId: '',
      loading: false,
      // 菜单栏
      menuGroup: {
        inline: true,
        items: [{
          type: 'input',
          label: '角色名称',
          name: 'roleName',
          value: ''
        }, {
          type: 'button',
          label: '查询',
          method: this.getRoleList,
          icon: 'el-icon-search'
        }, {
          type: 'button',
          label: '添加',
          method: this.add,
          icon: 'el-icon-plus'
        }]
      },
      tableData: []
    }
  },
  created() {
    this.getRoleList()// this.currentPage,this.pageSize,""
  },
  methods: {
    formatUserList(row, column) {
      const userList = row[column.property]
      const userNames = userList.reduce((prev, cur, index, arr) => {
        if (arr.length === 1) {
          return cur.nikeName
        }
        return prev + cur.nikeName + ','
      }, '')
      return userNames.slice(0, -1)
    },
    getRoleList() {
      this.loading = true
      queryRoleList(this.queryParams).then((response) => {
        this.loading = false
        const data = response.data.data
        this.tableData = data.rows
        this.total = data.total
      }).catch(error => {
        console.log(error)
      })
    },
    add() {
      this.addVisable = true
    },
    handleAddHide() {
      this.addVisable = false
    },
    edit(row) {
      this.editViasble = true
      this.roleId = row.id
    },
    auth(row) {
      this.roleId = row.id
      this.authViasble = true
    },
    handleEditHide() {
      this.editViasble = false
    },
    handleAuthHide() {
      this.authViasble = false
    },
    remove(row) {
      this.$confirm('此操作将永久该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(row.id).then((response) => {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getRoleList()
        }).catch(error => {
          console.log(error)
        })
      })
    },
    handleCurrentChange(page) {
      this.queryParams.page = page
      this.getRoleList()
      this.currentPage = page
    },
    handleSizeChange(size) {
      this.queryParams.limit = size
      this.getRoleList()
      this.pageSize = size
    }

  }
}
</script>

<style lang="scss" scoped>
  .el-card{
    border-radius: 0px;
  }
</style>
