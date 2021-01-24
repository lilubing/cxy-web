<template>
  <el-card shadow="never">
    <div class="app-container">
      <!--筛选条件-->
      <div class="filter-container">
        <span>登录账号：</span>
        <el-input v-model="queryParams.conditions.userName" clearable style="width: 160px; margin-right: 15px;" size="small" />
        <span>真实姓名：</span>
        <el-input v-model="queryParams.conditions.realName" clearable style="width: 160px; margin-right: 15px;" size="small" />
        <span>手机号码：</span>
        <el-input v-model="queryParams.conditions.mobilePhone" clearable style="width: 160px; margin-right: 15px;" size="small" />

      </div>
      <!--按钮-->
      <div style="margin-top: 10px;">
        <el-button v-permission="{id: '2', key: 'sysUserSelect'}" plain type="primary" size="small" icon="el-icon-search" @click="query(true)">查询</el-button>
        <el-button plain type="primary" size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
        <el-button v-permission="{id: '2', key: 'sysUserAdd'}" icon="el-icon-plus" type="primary" size="small" @click="add()">添加</el-button>
        <el-button v-permission="{id: '2', key: 'sysUserEdit'}" icon="el-icon-edit" type="primary" size="small" @click="edit()">修改</el-button>
        <el-button v-permission="{id: '2', key: 'sysUserDelete'}" icon="el-icon-delete" type="primary" size="small" @click="deletes()">删除</el-button>
      </div>
      <!--列表-->
      <el-table
        ref="multipleTable"
        v-loading="loading"
        class="table"
        size="medium"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
        />
        <el-table-column type="index" align="center" header-align="center" label="序号" />
        <el-table-column prop="userName" align="center" header-align="center" label="账号" />
        <el-table-column prop="realName" align="center" header-align="center" label="昵称" />
        <el-table-column prop="mobilePhone" align="center" header-align="center" label="手机号" />
        <el-table-column prop="sex" align="center" header-align="center" label="性别">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.sex=== 0" type="success"> 男</el-tag>
            <el-tag v-if="scope.row.sex=== 1" type="danger"> 女</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" align="center" header-align="center" label="创建时间" :formatter="tableFormatDateTime" />
        <!-- <el-table-column prop="createTime" align="center" header-align="center" label="创建时间" :formatter="formatTime" /> -->
        <el-table-column prop="status" align="center" header-align="center" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status=== 0" type="success"> 启用</el-tag>
            <el-tag v-if="scope.row.status=== 1" type="danger"> 锁定</el-tag>
            <el-tag v-if="scope.row.status=== 2" type="danger"> 逾期</el-tag>
          </template>
        </el-table-column>

        <!-- <el-table-column v-for="{prop,label,sortable} in cloConfig"  :key="prop" :label="label" :prop="prop" :sortable="sortable">
        </el-table-column>-->
      </el-table>

      <el-pagination :current-page="queryParams.page" :page-sizes="[10,20,30, 50]" :page-size="queryParams.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

      <add-form :visable="addVisable" @handleAddHide="handleAddHide" @getUserList="getUserList" />
      <edit-form v-if="editViasble" :user-id="userId" :visable="editViasble" @handleEditHide="handleEditHide" @getUserList="getUserList" />
    </div>
  </el-card>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令

// import SearchFrom from '@/components/SearchForm/Form.vue'
import { tableFormatDateTime } from '@/utils/myDate'
// eslint-disable-next-line no-unused-vars
import { queryUserList, getMenuList, deleteUser } from '@/api/user'
import AddForm from './AddForm'
import EditForm from './EditForm'
import { preValid } from '@/utils/validate'
import moment from 'moment'
export default {
  name: 'Index',
  directives: { permission },
  components: {
    AddForm, EditForm
  },
  data() {
    return {
      queryParams: {
        page: 1,
        limit: 20,
        conditions: {
          userName: '',
          realName: '',
          mobilePhone: ''
        }
      },
      addVisable: false,
      editViasble: false,
      total: 0,
      userId: '',
      loading: false,
      batchSelect: [],
      // 表格列配置
      cloConfig: [
        {
          prop: 'userName',
          label: '账号'
        }, {
          prop: 'nickName',
          label: '用户名'
        }, {
          prop: 'phone',
          label: '手机号'
        }, {
          prop: 'sex',
          label: '性别'
          // formatter:formatSex
        }, {
          prop: 'createTime',
          label: '创建时间'
        }, {
          prop: 'isLock',
          label: '状态'
        }],
      newDialogVisible: false,
      tableData: []
    }
  },
  created() {
    this.getUserList()// this.currentPage,this.pageSize,""
  },
  methods: {
    // 日期格式化
    tableFormatDateTime,
    // 日期格式化
    formatTime(row, column) {
      const date = row[column.property]
      if (date === undefined) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    getUserList() {
      this.loading = true
      queryUserList(this.queryParams).then((response) => {
        this.loading = false
        const data = response.data.data
        this.tableData = data.rows
        this.total = data.total
      }).catch(error => {
        console.log(error)
      })
    },
    // 过滤查询
    query() {
      // const that = this
      // this.menuGroup.items.forEach(function(item) {
      //   that.queryParams[item.name] = item.value
      // })
      this.queryParams.page = 1
      this.getUserList()
    },
    add() {
      this.addVisable = true
    },
    handleAddHide() {
      this.addVisable = false
    },
    edit() {
      const userList = this.batchSelect
      if (preValid(userList)) {
        const user = userList[0]
        this.editViasble = true
        this.userId = user.id
      }
    },
    handleEditHide() {
      this.editViasble = false
    },
    deletes() {
      const userList = this.batchSelect
      const userIds = []
      userList.forEach((user) => {
        const userId = user.id
        userIds.push(userId)
      })
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(userIds.join(',')).then((response) => {
          const data = response.data
          if (data.code === 200) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.getUserList()
          }
        }).catch(error => {
          console.log(error)
        })
      })
    },
    reset() {
      this.queryParams.conditions.userName = ''
      this.queryParams.conditions.realName = ''
      this.queryParams.conditions.mobilePhone = ''
    },
    // 批量选择
    handleSelectionChange(val) {
      this.batchSelect = val
    },
    handleCurrentChange(page) {
      this.queryParams.page = page
      this.getUserList()
      this.currentPage = page
    },
    handleSizeChange(size) {
      this.queryParams.limit = size
      this.getUserList()
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
