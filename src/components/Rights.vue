<!--  -->
<template>
<div class='home_rights'>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <!-- 用户列表表格 -->
    <el-table
      stripe
      border
      :data="rightList"
      style="width: 100%">
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level==0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.level==1">二级</el-tag>
          <el-tag type="warning" v-else="scope.row.level==2">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
//import引入的组件需要注入到对象中才能使用
components: {},
data() {
//这里存放数据
return {
  rightList:[]
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
  getRightList: async function(){
    let res = await this.$axios.get("/rights/list")
    if(res.meta.status != 200){
      this.$message.error("获取权限列表失败！")
    }else{
      this.rightList = res.data
    }
  }
},
//生命周期 - 创建完成（可以访问当前this实例）
created() {
  this.getRightList()
},
//生命周期 - 挂载完成（可以访问DOM元素）
mounted() {

},
beforeCreate() {}, //生命周期 - 创建之前
beforeMount() {}, //生命周期 - 挂载之前
beforeUpdate() {}, //生命周期 - 更新之前
updated() {}, //生命周期 - 更新之后
beforeDestroy() {}, //生命周期 - 销毁之前
destroyed() {}, //生命周期 - 销毁完成
activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style  scoped>
  .el-table{
    font-size: 12px;
  }
</style>