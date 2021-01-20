<template>
  <el-card shadow="never">
    <search-from :menu-group="menuGroup" />
    <div class="app-container">
      <el-table
        :data="data"
        style="width: 100%;margin-bottom: 20px;"
        row-key="menuButtonId"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="name" label="菜单按钮" sortable width="250" />
        <el-table-column align="center" header-align="center" prop="uri" width="250" label="菜单url" />
        <el-table-column align="center" header-align="center" prop="btnId" label="按钮Id" />
        <el-table-column align="center" header-align="center" prop="menuButtonValue" label="菜单按钮值" />
        <el-table-column align="center" header-align="center" prop="orders" width="50" label="排序" />
        <el-table-column align="center" header-align="center" width="70" label="类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 1" type="success"> 按钮</el-tag>
            <el-tag v-else type="primary"> 菜单</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" width="70" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === 0" type="success"> 禁用</el-tag>
            <el-tag v-else type="primary"> 正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <tree-table v-loading="loading" class="table" size="medium" :data="data" :eval-func="func" :eval-args="args" :expand-all="expandAll" border>
        <el-table-column align="center" header-align="center" prop="uri" label="菜单按钮url" />
        <el-table-column align="center" header-align="center" prop="menuButtonId" label="菜单按钮Id" />
        <el-table-column align="center" header-align="center" prop="menuButtonValue" label="菜单按钮value" />
        <el-table-column align="center" header-align="center" prop="orders" label="排序号" />
        <el-table-column align="center" header-align="center" label="类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type" type="primary"> 菜单</el-tag>
            <el-tag v-else type="success"> 按钮</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" header-align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </tree-table> -->
    </div>
    <add-form v-if="addVisable" :visable="addVisable" @handleAddHide="handleAddHide" @getMenus="getMenus" />
    <edit-form v-if="editViasble" :menu-button-id="menuButtonId" :visable="editViasble" @handleEditHide="handleEditHide" @getMenus="getMenus" />
  </el-card>
</template>

<script>

// import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'
import SearchFrom from '@/components/SearchForm/Form.vue'
import EditForm from './EditForm'
import AddForm from './AddForm'
import { queryMenuList, deleteMenu } from '@/api/menu-button'
export default {
  name: 'Index',
  // components: { treeTable, SearchFrom, EditForm, AddForm },
  components: { SearchFrom, EditForm, AddForm },
  data() {
    return {
      loading: false,
      editViasble: false,
      addVisable: false,
      menuButtonId: '',
      menuGroup: {
        inline: true,
        items: [{
          type: 'button',
          label: '添加',
          method: this.add,
          icon: 'el-icon-plus'
        }]
      },
      func: treeToArray,
      expandAll: false,
      data: [],
      args: []
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    handleAddHide() {
      this.addVisable = false
    },
    edit(row) {
      this.menuButtonId = row.menuButtonId
      this.editViasble = true
    },
    add() {
      this.addVisable = true
    },
    remove(row) {
      this.$confirm('此操作将永久该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(row.menuButtonId).then((response) => {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getMenus()
        }).catch(error => {
          console.log(error)
        })
      })
    },
    getMenus() {
      this.loading = true
      queryMenuList().then((response) => {
        this.loading = false
        const data = response.data
        if (data.code === 200) {
          this.data = data.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleEditHide() {
      this.editViasble = false
    }

  }
}
</script>

<style lang="scss" scoped>
  .role{
    .role-table{
      margin: 20px 0px;
    }
  }
  .el-card{
    border-radius: 0px;
  }
</style>
