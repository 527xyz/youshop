<!--  -->
<template>
<div class='home_users'>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row :gutter="20">
    <!-- 搜索框 -->
      <el-col :span="8">
        <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList" @keyup.enter.native="changeSearchText">
          <el-button slot="append" icon="el-icon-search" @click="getUserList" ></el-button>
        </el-input>
      </el-col>
      <!-- 添加用户按钮 -->
      <el-col :span="2">
        <el-button type="primary" @click="dialogFormVisible=true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表表格 -->
    <el-table
      stripe
      border
      :data="userList"
      style="width: 100%">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column
        label="姓名"
        prop="username">
      </el-table-column>
      <el-table-column
        label="邮箱"
        prop="email">
      </el-table-column>
      <el-table-column
        label="电话"
        prop="mobile">
      </el-table-column>
      <el-table-column
        label="角色"
        prop="role_name">
      </el-table-column>
      <el-table-column
        label="状态"
        >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180px"
        align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(scope.row.id)"></el-button>
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-s-tools" size="mini" @click="setRole(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userTotal">
      </el-pagination>
    </div>
  </el-card>
  <!-- 添加用户弹窗 -->
  <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="50%" @close="addDialogClosed">
    <el-form :model="addForm" :rules="addFormRules" label-width="70px" ref="addFormRef">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" >
        <el-input v-model="addForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="addForm.phone"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="addUser">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
  <!-- 修改用户信息弹窗 -->
  <el-dialog title="修改用户信息" :visible.sync="EditDialog" width="50%" @close="updateDialogClosed">
    <el-form :model="editForm" :rules="editFormRules" label-width="70px" ref="editFormRef">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone" >
        <el-input v-model="editForm.phone"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="updateDialog">确 定</el-button>
      <el-button @click="EditDialog = false">取 消</el-button>
    </div>
  </el-dialog>
  <!-- 分配角色弹窗 -->
  <el-dialog title="分配角色" :visible.sync="setRoleDialog" width="50%" @close="serRoleDialogClosed">
    <div>
      <p>当前用户：{{userInfo.username}}</p>
      <p>当前角色：{{userInfo.rolename}}</p>
      <p>分配新角色：
        <el-select v-model="newRole" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
    </div>
    <div class="dialog-footer">
      <el-button type="primary" @click="setRoleSend">确 定</el-button>
      <el-button @click="setRoleDialog = false">取 消</el-button>
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
  var checkPhone = (rule, value, callback) => {
    var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if(myreg.test(value)){
      return callback();
    }
    callback(new Error("请输入正确格式的手机号"))
  };
  var checkEmail = (rule, value, callback) => {
    var myreg=/^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+.)+[A-Za-z]{2,4}$/;
    if(myreg.test(value)){
      return callback();
    }
    callback(new Error("请输入合法的邮箱"))
  };
return {
  queryInfo:{
    query:"",
    pagenum:1,
    pagesize:3
  },
  userList:[],
  userTotal:0,
  dialogFormVisible:false,
  addForm:{
    username:"",
    password:"",
    email:"",
    phone:"",
  },
  addFormRules:{
    username:[
      { required: true, message: '请输入用户名', trigger: ['change','blur'] },
      { min: 3, max: 12, message: '请输入长度为3-12位的用户名', trigger: 'blur' }
    ],
    password:[
      { required: true, message: '请输入用户名', trigger: ['change','blur'] },
      { min: 6, max: 12, message: '请输入长度为6-12位的密码', trigger: 'blur' }
    ],
    phone:[
      { required: true, message: '请输入手机号', trigger: ['change','blur'] },
      { validator: checkPhone, trigger: 'blur' }
    ],
    email:[
      { required: true, message: '请输入邮箱地址', trigger: ['change','blur'] },
      { validator: checkEmail, trigger: 'blur' }
    ]
  },
  EditDialog:false,
  editForm:{
    username:"",
    email:"",
    phone:"",
  },
  editFormRules:{
    phone:[
      { required: true, message: '请输入手机号', trigger: ['change','blur'] },
      { validator: checkPhone, trigger: 'blur' }
    ],
    email:[
      { required: true, message: '请输入邮箱地址', trigger: ['change','blur'] },
      { validator: checkEmail, trigger: 'blur' }
    ]
  },
  // 分配角色
  setRoleDialog:false,
  userInfo:{
    username:"",
    rolename:""
  },
  roleList:[],
  newRole:""
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {
},
//方法集合
methods: {
  getUserList:async function(){
    let res = await this.$axios.get("/users",{
      params:{
        query:this.queryInfo.query,
        pagenum:this.queryInfo.pagenum,
        pagesize:this.queryInfo.pagesize
      }
    })
    if(res.meta.status != 200){
      return this.$message.error("获取用户列表失败！");
    }
    this.userList = res.data.users;
    this.userTotal = res.data.total
  },
  handleSizeChange:function(newSize){
    this.queryInfo.pagesize = newSize;
    this.getUserList();
  },
  handleCurrentChange:function(newPagenum){
    this.queryInfo.pagenum = newPagenum;
    this.getUserList();
  },
  changeState:async function(data){
    let res = await this.$axios.put(`users/${data.id}/state/${data.mg_state}`)
    if(res.meta.status != 200){
      data.mg_state = !data.mg_state
      return this.$message.error("用户状态更新失败!")
    }
    this.$message.success("用户状态更新成功!")
  },
  addDialogClosed:function(){
    this.$refs.addFormRef.resetFields()
  },
  addUser:function(){
    this.$refs.addFormRef.validate(async(valid)=>{
      if(!valid){
        return this.$message.error("添加用户失败！请重试")
      }
      let res = await this.$axios.post("/users",{
        username:this.addForm.username,
        password:this.addForm.password,
        email:this.addForm.email,
        mobile:this.addForm.phone,
      })
      if(res.meta.status != 201){
        return this.$message.error("添加用户失败！请更换用户名后重试")
      }else if(res.meta.status == 201){
        this.dialogFormVisible = false
        this.getUserList()
        return this.$message.success("添加用户成功！")
      }
    })
  },
  showEditDialog:async function(userId){
    this.EditDialog = true
    let res = await this.$axios.get("/users/" + userId)
    if(res.meta.status != 200){
      return this.$message.error("查询用户信息失败！")
    }else if(res.meta.status == 200){
      this.editForm.userid = res.data.id;
      this.editForm.username = res.data.username;
      this.editForm.email = res.data.email;
      this.editForm.phone = res.data.mobile;
    }
  },
  updateDialog:function(){
    this.$refs.editFormRef.validate(async(valid)=>{
      if(!valid){
        return this.$message.error("用户信息修改失败！")
      }
      let res = await this.$axios.put("/users/" + this.editForm.userid,{
        email:this.editForm.email,
        mobile:this.editForm.phone,
      })
      if(res.meta.status != 200){
        return this.$message.error("用户信息修改失败！请重试")
      }else if(res.meta.status == 200){
        this.EditDialog = false
        this.getUserList()
        return this.$message.success("用户信息修改成功！")
      }
    })
  },
  updateDialogClosed:function(){
    this.$refs.editFormRef.resetFields()
  },
  delUser:async function(userId){
    let res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(err=>err)
    if(res=="cancel"){
      this.$message.info("取消删除");
    }else if(res=="confirm"){
      this.$axios.delete("/users/" + userId)
      .then((result)=>{
        if(result.meta.status==200){
          this.getUserList()
          this.$message.success("已删除该用户");
        }else{
          this.$message.info("删除失败");
        }
      })
    }
  },
  changeSearchText:function(){
    if(!this.queryInfo.query){
      this.getUserList();
    }else{
      this.getUserList();
    }
  },
  // 分配角色
  setRole:async function(role){
    this.userInfo.roleId = role.id;
    this.userInfo.username = role.username;
    this.userInfo.rolename = role.role_name;
    this.setRoleDialog = true
    // 获取所有角色列表
    let res = await this.$axios.get("/roles")
    if(res.meta.status != 200){
      return this.$message.error("获取角色失败！")
    }else if(res.meta.status == 200){
      this.roleList = res.data
    }
  },
  setRoleSend:async function(){
    if(!this.newRole){
      return this.$message.error("请选择需要分配的角色")
    }
    let res = await this.$axios.put(`users/${this.userInfo.roleId}/role`,{
      rid:this.newRole
    })
    if(res.meta.status != 200){
      return this.$message.error("分配角色失败！")
    }else if(res.meta.status == 200){
      this.$message.success("分配角色成功！")
      this.setRoleDialog = false;
      this.getUserList()
    }
  },
  serRoleDialogClosed:function(){
    this.userInfo = {}
    this.newRole = ""
  }
},
//生命周期 - 创建完成（可以访问当前this实例）
created() {
  this.getUserList()
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
<style lang="less" scoped>
  .home_users{
    .el-table{
      margin: 20px 0;
      font-size: 14px;
    }
    .dialog-footer{
      display: flex;
      justify-content: flex-end;
    }
  }
  .el-dialog p{
    margin-bottom: 10px;
  }
</style>