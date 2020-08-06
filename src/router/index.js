import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users.vue'
import Roles from '../components/Roles.vue'
import Rights from '../components/Rights.vue'
import Reports from '../components/Reports.vue'
import Params from '../components/Params.vue'
import Orders from '../components/Orders.vue'
import Goods from '../components/Goods.vue'
import Categories from '../components/Categories.vue'
import GoodsAdd from '../components/GoodsAdd.vue'

const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users},
      {path:'/roles',component:Roles},
      {path:'/rights',component:Rights},
      {path:'/reports',component:Reports},
      {path:'/params',component:Params},
      {path:'/orders',component:Orders},
      {path:'/goods',component:Goods},
      {path:'/categories',component:Categories},
      {path:'/goods/add',component:GoodsAdd},
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const tokenStr = window.sessionStorage.getItem("token");
  if(to.path==="/login"||tokenStr){ // 验证通过
    window.sessionStorage.setItem("NavStatus",window.location.hash.split("#")[1])
    if(to.path==="/welcome"){
      window.sessionStorage.setItem("NavStatus","/welcome")
    }
    next();
  }else{
      next({path:"/login"});// 跳转登录页面
  }
})

export default router
