<!--  -->
<template>
<div class='login'>
  <div class="login_box" @keyup.enter="login">
    <div class="login_tx">
      <img src="../assets/images/login_tx.png" alt="">
    </div>
    <el-form class="login_form" :model="loginFrom" :rules="rulesFrom" ref="loginFormRef">
      <el-form-item prop="username">
        <el-input v-model="loginFrom.username" prefix-icon="el-icon-user-solid" placeholder="请输入账户"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginFrom.password" type="password" prefix-icon="el-icon-lock" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetLoginFrom">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
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
  loginFrom:{
    username:"",
    password:"",
  },
  rulesFrom:{
    username:[{ required: true, message: '请输入用户名', trigger: 'change' },{ min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }],
    password:[{ required: true, message: '请输入密码', trigger: 'change' },{ min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }]
  }
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
  login:function(){
    this.$refs.loginFormRef.validate(async(valid)=>{
      if(!valid)return;
      await this.$axios.post("/login",{
        username:this.loginFrom.username,
        password:this.loginFrom.password
      }).then((res)=>{
        if(res.meta.status==200){
          this.$message({
            message:"登录成功",
            type:"success"
          })
          window.sessionStorage.setItem("token",res.data.token)
          setTimeout(()=>{
            this.$router.push({name:"Home"})
          },1500)
        }else{
          this.$message({
            message:"登录失败，请重试",
            type:"warning"
          })
        }
      }).catch((err)=>{
        console.log(err)
      })
    })
  },
  resetLoginFrom:function(){
    this.$refs.loginFormRef.resetFields()
  }
},
//生命周期 - 创建完成（可以访问当前this实例）
created() {

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
.login {
  height: 100%;
  background: rgba(43,75,107,.8);
  position: relative;
  .login_box {
    width: 500px;
    height: 300px;
    background: #fff;
    border-radius: 20px;
    position: absolute;
    top: 0;bottom:0;
    left: 0;right:0;
    margin: auto;
    .login_tx {
      width: 100px;
      height: 100px;
      transform: translateY(-50px);
      margin: 0 auto;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .login_form{
      // position: absolute;
      // bottom: 0;
      padding: 0 20px;
      .btns{
        display: flex;
        justify-content: center;
        button{
          width: 100px;
          margin: 0 10px;
        }
      }
    }
  }
}
</style>