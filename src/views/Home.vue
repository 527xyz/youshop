<!--  -->
<template>
  <div class="home">
    <el-container class="home_container">
      <el-header class="header">
        <img src="../assets/images/logo.png" alt class="head_logo" />
        <span class="head_title">优品购商城</span>
        <el-button type="info" @click="logOut">
          退出
          <i class="el-icon-switch-button"></i>
        </el-button>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '64px': '200px'" class="aside">
          <div class="toggle_button"><span @click="toggleCol"><i class="el-icon-s-operation"></i></span></div>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="rgb(64,158,255)"
            unique-opened
            collapse-transition
            :collapse="isCollapse"
            router
            :default-active="curSources"
          >
            <el-submenu v-for="item in menuList" :key="item.id" :index="item.id + ''">
              <template slot="title">
                <i :class="menuIcons[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="'/' + item.path" v-for="item in item.children" :key="item.id" @click="saveNavStatus('/' + item.path)">
                <i :class="menuIcons[item.id]"></i>{{item.authName}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <div class="home_main" :style="{paddingLeft: isCollapse? '64px': '200px'}">
          <section class="main_section">
            <el-main class="main">
              <router-view></router-view>
            </el-main>
          </section>
        </div>
      </el-container>
    </el-container>
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
      menuList:"",
      menuIcons:{
        125:"el-icon-s-custom",
        110:"el-icon-user",
        103:"el-icon-postcard",
        111:"el-icon-s-custom",
        112:"el-icon-s-release",
        101:"el-icon-s-cooperation",
        104:"el-icon-date",
        115:"el-icon-edit-outline",
        121:"el-icon-files",
        102:"el-icon-s-order",
        107:"el-icon-shopping-cart-full",
        145:"el-icon-s-data",
        146:"el-icon-s-marketing"
      },
      isCollapse:false,
      curSources:""
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    logOut: function () {
      window.sessionStorage.clear();
      this.$router.push({ name: "Login" });
    },
    getMenuList:async function(){
      await this.$axios.get("/menus")
      .then((res)=>{
        if(res.meta.status!=200){
          return
        }
        this.menuList = res.data
      })
      .catch((err)=>{
        console.log(err)
      })
    },
    toggleCol:function(){
      if(!this.isCollapse){
        this.isCollapse = true;
      }else{
        this.isCollapse = false;
      }
    },
    saveNavStatus:function(sources){
      window.sessionStorage.setItem("NavStatus",sources)
      this.curSources = sources
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getMenuList()
    this.curSources = window.sessionStorage.getItem("NavStatus")
    // this.curSources = window.location.hash.split("#")[1]
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  .home_container {
    height: 100%;
  }
  .el-header {
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    background: #262a2c;
    .head_logo {
      width: 60px;
      height: 60px;
    }
    .head_title {
      font-size: 20px;
      color: #ccc;
      margin-left: 10px;
    }
    .el-button {
      margin-left: auto;
      i {
        margin-left: 5px;
      }
    }
  }
  .el-aside {
    z-index: 100;
    position: fixed;
    left: 0;
    top: 60px;
    height: 100%;
    background: #333744;
    .el-menu{
      border-right: none;
    }
    .toggle_button{
      width:100%;
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      color: #fff;
      box-sizing: border-box;
      text-align: center;
      span{
        cursor: pointer;
        background: #333744;
        width: 64px;
        height: 30px;
        text-align: center;
        float: right;
        display: block;
        border-radius: 5px;
      }
      span:hover{
        background: #262a2c;
      }
    }
  }
  .home_main{
    width: 100%;
    height: 100%;
    padding-top: 60px;
    box-sizing: border-box;
    .main_section{
      width: 100%;
      height: 100%;
      overflow-y: auto;
      background: #eaedf1;
    }
  }
  // .el-main {
  // }
}
</style>
