<template>
  <el-dialog
    title="添加"
    :visible="visable"
    width="30%"
    :modal="false"
    :show-close="false"
  >
    <el-form ref="form" label-suffix=":" :model="form" label-width="100px">
      <el-form-item label="菜单按钮名称">
        <el-input v-model="form.menu.name" />
      </el-form-item>
      <el-form-item label="菜单url">
        <el-input v-model="form.menu.uri" />
      </el-form-item>
      <el-form-item label="按钮Id">
        <el-input v-model="form.menu.btnId" />
      </el-form-item>
      <el-form-item label="菜单按钮值">
        <el-input v-model="form.menu.menuButtonValue" />
      </el-form-item>
      <el-form-item label="菜单图标">
        <el-input v-model="form.menu.icon" />
      </el-form-item>
      <el-form-item label="是否为菜单">
        <el-radio-group v-model="form.menu.type">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="同级序号">
        <el-input v-model="form.menu.orders" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.menu.state">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上级菜单">
        <!-- https://blog.csdn.net/qq_32786139/article/details/108345247 -->
        <tree-select
          v-if="treeFlag"
          :data="form.menuList"
          placeholder="请选择"
          :default-props="defaultProps"
          :clear="clearTreeSelect"
          :node-key="nodeKey"
          :checked-keys="checkedKeys"
          @parent-event="popoverHide"
          @popoverHide="popoverHide"
        />
        <!-- <el-select v-model="form.menu.parentId" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in form.menuList"
            :key="item.menuButtonId"
            :label="item.name"
            :value="item.menuButtonId"
          />
        </el-select> -->
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleHide">取 消</el-button>
      <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import TreeSelect from '@/components/TreeSelect'
import { queryMenuList, addMenu } from '@/api/menu-button'
export default {
  name: 'AddFrom',
  components: { TreeSelect },
  // eslint-disable-next-line vue/require-prop-types
  props: ['visable'],
  data() {
    return {
      loading: false,
      // 清空树形选择框数据
      clearTreeSelect: 0,
      defaultProps: {
        label: 'name'
      },
      // 控制树组件显示 v-if 传值用
      treeFlag: false,
      defaultCheckedKeys: [],
      checkedKeys: [],
      nodeKey: 'menuButtonId',
      form: {
        menu: {
          menuButtonId: '',
          name: '',
          uri: '',
          btnId: '',
          menuButtonValue: '',
          icon: '',
          type: 0,
          orders: '',
          parentId: '',
          state: 1
        },
        menuList: []
      }
    }
  },
  /* computed:{
      ...mapGetters(['visable'])
    },*/
  created() {
    this.getMenuList()
  },
  methods: {
    handleSubmit(form) {
      addMenu(this.form.menu).then((response) => {
        this.handleHide()
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        this.$refs[form].resetFields()
        this.$emit('getMenus')
      }).catch(error => {
        console.log(error)
      })
    },
    handleHide() {
      this.$emit('handleAddHide')
    },
    getMenuList() {
      // const that = this
      queryMenuList().then((response) => {
        const data = response.data
        this.form.menuList = data.data
        this.treeFlag = true
      }).catch(error => {
        console.log(error)
      })
    },
    popoverHide(checkedIds, checkedData) {
      // 会被触发两次的问题
      if (checkedData !== undefined && checkedData != null) {
        this.form.menu.parentId = checkedData.menuButtonId
        // checkedData.forEach(item => {
        //   if (item.childrenList === undefined || item.childrenList == null) {
        //     this.carList.push(item.menuId)
        //   }
        // })
      }
    }
  }
}
</script>

<style scoped>

</style>
