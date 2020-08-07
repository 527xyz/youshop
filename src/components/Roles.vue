<!--  -->
<template>
<div class='home_rights'>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <!-- 添加角色按钮 -->
    <el-row :gutter="20">
      <el-col>
        <el-button type="primary" @click="addRight">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 角色列表表格 -->
    <el-table
      align="center"
      stripe
      border
      :data="roleList"
      style="width: 100%">
      <!-- 权限视图 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item1,i1) in scope.row.children" :class="['borBottom', 'aligncenter', i1==0? 'borTop': '']">
            <el-col :span="5" :key="item1.id">
              <el-tag closable @close="delRole(scope.row,item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row v-for="(item2,i2) in item1.children" :class="['aligncenter', i2==0? '': 'borTop']">
                <el-col :span="6" :key="item2.id">
                  <el-tag closable type="success" @close="delRole(scope.row,item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag closable type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" @close="delRole(scope.row,item3.id)">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- <pre>
            {{scope.row}}
          </pre> -->
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRight(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRight(scope.row)">删除</el-button>
          <el-button type="info" icon="el-icon-setting" size="mini" @click="setRight(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 添加角色弹窗 -->
  <el-dialog title="添加角色" :visible.sync="dialogRightVisible" width="50%" @close="addDialogClosed">
    <el-form :model="addRightInfo" :rules="addRightRules" label-width="90px" ref="addRightRef">
      <el-form-item label="角色名称" prop="rightname">
        <el-input v-model="addRightInfo.rightname"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="rightinfo" >
        <el-input v-model="addRightInfo.rightinfo"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="addRightSend">添 加</el-button>
      <el-button @click="dialogRightVisible = false">取 消</el-button>
    </div>
  </el-dialog>
  <!-- 修改角色信息弹窗 -->
  <el-dialog title="修改角色" :visible.sync="dialogeditVisible" width="50%" @close="editDialogClosed">
    <el-form :model="editRightInfo" :rules="addRightRules" label-width="90px" ref="editRightRef">
      <el-form-item label="角色名称" prop="rightname">
        <el-input v-model="editRightInfo.rightname"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="rightinfo" >
        <el-input v-model="editRightInfo.rightinfo"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="editRightSend">确 定</el-button>
      <el-button @click="dialogeditVisible = false">取 消</el-button>
    </div>
  </el-dialog>
  <!-- 分配角色权限弹窗 -->
  <el-dialog title="分配权限" :visible.sync="dialogSetRightVisible" width="50%" @close="setRightDialogClosed">
    <el-tree :data="setRightInfo" :props="defaultProps" show-checkbox node-key="id" :default-checked-keys="defKeys" default-expand-all ref="setRightRef">
      
    </el-tree>
    <div class="dialog-footer">
      <el-button type="primary" @click="setRightSend">确 定</el-button>
      <el-button @click="dialogSetRightVisible = false">取 消</el-button>
    </div>
  </el-dialog>
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
  roleId:"",
  roleList:[],
  // 添加角色
  dialogRightVisible:false,
  addRightInfo:{
    rightname:"",
    rightinfo:""
  },
  addRightRules:{
    rightname:[
      { required: true, message: '请输入角色名称', trigger: ['change','blur'] },
    ],
    rightinfo:[
      { required: true, message: '请输入角色描述', trigger: ['change','blur'] },
    ]
  },
  // 修改角色
  dialogeditVisible:false,
  editRightInfo:{
    rightId:"",
    rightname:"",
    rightinfo:""
  },
  // 分配角色权限
  dialogSetRightVisible:false,
  setRightInfo:[],
  defaultProps: {
    children: 'children',
    label: 'authName'
  },
  // 默认勾选数组
  defKeys:[]
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
  getRoleList: async function(){
    let res = await this.$axios.get("/roles")
    if(res.meta.status != 200){
      this.$message.error("获取角色列表失败！")
    }else{
      this.roleList = res.data
    }
  },
  // 删除权限
  delRole:async function(role,rightId){
    let res = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(err=>err)
    if(res=="cancel"){
      this.$message.info("取消删除");
    }else if(res=="confirm"){
      let result = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
      if(result.meta.status != 200){
        this.$message.error("权限删除失败！")
      }else{
        this.$message.success("权限删除成功！")
        role.children = result.data
      }
    }
  },
  // 添加角色
  addRight:function(){
    this.dialogRightVisible = true
  },
  addRightSend:function(){
    this.$refs.addRightRef.validate(async(valid)=>{
      if(!valid){
        return this.$message.error("添加角色失败！请重试")
      }
      let res = await this.$axios.post("/roles",{
        roleName:this.addRightInfo.rightname,
        roleDesc:this.addRightInfo.rightinfo
      })
      if(res.meta.status != 201){
        return this.$message.error("添加角色失败！请重试")
      }else if(res.meta.status == 201){
        this.dialogRightVisible = false
        this.getRoleList()
        return this.$message.success("添加角色成功！")
      }
    })
  },
  addDialogClosed:function(){
    this.$refs.addRightRef.resetFields()
  },
  // 修改角色
  editRight:function(role){
    this.editRightInfo.rightId = role.id
    this.editRightInfo.rightname = role.roleName
    this.editRightInfo.rightinfo = role.roleDesc
    this.dialogeditVisible = true
  },
  editRightSend:function(){
    this.$refs.editRightRef.validate(async(valid)=>{
      if(!valid){
        return this.$message.error("编辑角色失败！请重试")
      }
      let res = await this.$axios.put("/roles/" + this.editRightInfo.rightId,{
        roleName:this.editRightInfo.rightname,
        roleDesc:this.editRightInfo.rightinfo
      })
      if(res.meta.status != 200){
        return this.$message.error("编辑角色失败！请重试")
      }else if(res.meta.status == 200){
        this.dialogeditVisible = false
        this.getRoleList()
        return this.$message.success("编辑角色成功！")
      }
    })
  },
  editDialogClosed:function(){
    this.$refs.editRightRef.resetFields()
  },
  // 删除角色
  delRight:async function(right){
    let result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(err=>err)
    if(result=="cancel"){
      this.$message.info("取消删除");
    }else if(result=="confirm"){
      let res = await this.$axios.delete("/roles/" + right.id)
      if(res.meta.status != 200){
        return this.$message.error("删除角色失败！请重试")
      }else if(res.meta.status == 200){
        this.dialogeditVisible = false
        this.getRoleList()
        return this.$message.success("编辑角色成功！")
      }
    }
  },
  // 分配角色权限
  setRight:async function(role){
    this.roleId = role.id
    this.dialogSetRightVisible = true
    this.getLeafKeys(role)
    let res = await this.$axios.get("/rights/tree")
    if(res.meta.status != 200){
      this.$message.error("权限获取失败！")
    }else{
      this.setRightInfo = res.data
    }
  },
  getLeafKeys:function(node){
    if(!node.children){
      return this.defKeys.push(node.id);
    }
    node.children.forEach(item => {
      this.getLeafKeys(item)
    });
  },
  setRightSend:async function(){
    const keys = await [
      ...this.$refs.setRightRef.getCheckedKeys(),
      ...this.$refs.setRightRef.getHalfCheckedKeys()
    ]
    let keysStr = keys.join(",");
    let res = await this.$axios.post(`roles/${this.roleId}/rights`,{
      rids:keysStr
    })
    if(res.meta.status != 200){
      return this.$message.error("角色分配权限失败！")
    }else if(res.meta.status == 200){
      this.$message.success("角色分配权限成功！")
      this.dialogSetRightVisible = false
      this.getRoleList();
    }
  },
  setRightDialogClosed:function(){
    this.defKeys = [];
  }
},
//生命周期 - 创建完成（可以访问当前this实例）
created() {
  this.getRoleList()
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
    margin-top: 20px;
    font-size: 12px;
  }
  .el-tag{
    margin: 10px 8px 10px 0;
    cursor: pointer;
  }
  .borTop{
    border-top: 1px solid #dfdede;
  }
  .borBottom{
    border-bottom: 1px solid #dfdede;
  }
  .aligncenter{
    display: flex;
    align-items: center;
  }
  .dialog-footer{
    display: flex;
    justify-content: flex-end;
  }
</style>