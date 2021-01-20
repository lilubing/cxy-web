<template>
  <el-card shadow="never" :body-style="bodyStyle">
    <div class="searchForm">
      <el-form :inline="menuGroup.inline" :model="menuGroup" size="mini" label-suffix=":">
        <template v-for="(item,index) in menuGroup.items">
          <el-form-item v-if="item.type=='input'" :label="item.label">
            <el-input v-model="item.value" size="small" :placeholder="item.label" />
          </el-form-item>
          <el-form-item v-if="item.type=='button'">
            <el-button-group>
              <el-button size="small" type="primary" :icon="item.icon" @click="item.method">{{ item.label }}</el-button>
            </el-button-group>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'From',
  // eslint-disable-next-line vue/require-prop-types
  props: ['menuGroup'],
  data() {
    return {
      bodyStyle: {
        backgroundColor: '#f4f8fa'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .searchForm{
    .el-form-item__content{
      width: 50%;
    }
    .el-form-item{
      margin-bottom: 0px;
    }
  }

</style>
