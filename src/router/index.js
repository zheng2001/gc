import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from "@/views/Index.vue";
import Cookies from 'js-cookie'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    redirect:'/home',
    children:[
      //  ====  首页  ====
      {
        path:'home',
        name:'Home',
        component: ()=>import('@/views/home/Home.vue'),
        meta:{
          title:'首页'
        }
      },
      //  ====  交流区  ====
      {
        path:'communicate',
        name:'Communicate',
        component: ()=>import('@/views/communicate/Communicate.vue'),
        meta:{
          title:'交流区'
        }
      },
      //  ====  关于  ====
      {
        path:'about',
        name:'About',
        component: ()=>import('@/views/about/About.vue'),
        meta:{
          title:'关于'
        }
      },
      //  ====  投稿  ====
      {
        path:'contribute',
        name:'Contribute',
        component: ()=>import('@/views/contribute/Contribute.vue'),
        meta:{
          title:'投稿'
        }
      }
    ]
  },
  //  ====== 文章  =====
  {
    path:'/essayDetails',
    name:'EssayDetails',
    component: ()=>import('@/views/essay_details/EssayDetails.vue'),
    meta:{
      title:'文章详情'
    }
  },
  //  ====== 个人中心  =====
  {
    path:'/center',
    name:'center',
    component: ()=>import('@/views/center/Center.vue'),
    meta:{
      title:'个人中心'
    }
  },
  {
    path: "*",
    name: '404',
    component:()=>import('@/views/404'),
    meta: {
      title: '404 找不到页面'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  const user = Cookies.get("user")
  if ( !user && (to.path === '/contribute'|| to.path === '/center')) return next("/") // 强制退回登录页面
  next()
})

router.afterEach((to, from) => {
  document.title = to.meta.title //在全局后置守卫中获取路由元信息设置title
})

export default router
