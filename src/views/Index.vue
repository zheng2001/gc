<template>
  <div>
    <!--头部-->
    <div class="header">
      <div class="header_left">
        <span><a href="/home">游戏交流平台</a></span>
      </div>
      <div class="header_middle">
        <el-menu
            :default-active="$route.path.substring(1)"
            router
            class="el-menu-demo"
            mode="horizontal"
            background-color="#651ED9"
            text-color="#FFF"
            active-text-color="#E6A23C">
          <el-menu-item index="home">首页</el-menu-item>
          <el-menu-item index="communicate">交流区</el-menu-item>
          <el-menu-item index="about">关于</el-menu-item>
        </el-menu>
      </div>
      <div class="header_right">
        <div v-if="isLogin" class="logged_in">
          <el-dropdown trigger="hover">
            <!-- 头像、用户名-->
            <el-row style="height: 40px;">
              <el-avatar :src="imgPath+user.headImg" class="avatar"></el-avatar>
              <span class="nickname">{{user.nickname}}</span>
              <span class="right_icon"><i class="el-icon-arrow-down el-icon--right"/></span>
            </el-row>
            <!-- 用户功能 -->
            <el-dropdown-menu slot="dropdown" style="text-align: center;">
              <el-dropdown-item>
                <span @click="toCenter">个人中心</span>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <span @click="logout">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <router-link to="contribute">
            <el-button type="danger" size="medium" class="contribute">投稿<i class="el-icon-upload el-icon--right"></i></el-button>
          </router-link>
        </div>
        <div class="login_Register" @click="toLoginAndRegister" v-else="isLogin">
          登录/注册
        </div>
      </div>
    </div>
    <!--主体-->
    <div class="main">
      <!--回到顶部-->
      <el-backtop :visibility-height=400></el-backtop>
      <router-view/>
    </div>
    <!--登录注册窗口-->
    <login-and-register ref="LoginAndRegister" @loginSuccess="loginSuccess"></login-and-register>
  </div>
</template>

<script>
import LoginAndRegister from "@/components/login_register/LoginAndRegister";
import Cookies from 'js-cookie'

export default {
  name: "Index",
  components:{LoginAndRegister},
  data() {
    return {
      isLogin:Cookies.get('user')?true:false,
      user:Cookies.get('user')?JSON.parse(Cookies.get('user')):{},
      imgPath : "http://localhost:9090/gc/front/user/avatar/download/",
    };
  },
  methods: {
    toLoginAndRegister(){
      this.$nextTick(()=>{
        this.$refs.LoginAndRegister.dialogVisible = true
      })
    },
    loginSuccess(data){
      this.isLogin = data
      this.user = JSON.parse(Cookies.get('user'))
    },
    toCenter(){
      this.$router.push("/center")
    },
    logout(){
      //清除浏览器用户的数据
      Cookies.remove('user')
      this.isLogin = false
      // 判断是否在投稿页面退出登录，是就跳到首页
      if(this.$route.path === '/contribute'){
        this.$router.push("/")
      }
      this.$message.success({
        message:"退出登录成功！",
        duration:2000
      })
    }
  }
}
</script>

<style scoped>
.header{
  min-height: 60px;
  padding: 20px 50px;
  border-radius: 20px 20px 20px 20px;
  background-color: #651ED9;
  color: #FFFFFF;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-sizing: content-box;
}
.header_left{
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header_left span{
  text-align: center;
  font-size: 25px;
}
.header_left span a{
  color: white;
  text-decoration: none;
}
.header_middle{
  width: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header_middle .el-menu--horizontal{
  /* 去导航栏下划线*/
  border-bottom: none!important;
}
.header_right{
  width: 250px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login_Register{
  width: 120px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  color:#FFF;
  font-size: 13px;
  background: #00aeec;
  border-radius: 8px;
}
.login_Register:hover{
  opacity: 0.85;
}

/* 登录状态显示的div */
.logged_in{
  height: 60px;
  padding-top: 10px;
}
.avatar{
  cursor: pointer;
}
.nickname{
  padding-left: 5px;
  text-align: center;
  cursor: pointer;
  width: 60px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: sandybrown;
  /* 昵称过长省略 */
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 昵称右侧图标Span */
.right_icon{
  cursor: pointer;
  height: 40px;
  line-height: 40px;
  vertical-align: top;
}
/* 昵称右侧图标 */
.el-icon-arrow-down {
  color: darkgray;
  font-size: 12px;
  font-weight: bold;
}
/* 投稿按钮 */
.contribute{
  vertical-align: top;
  margin-top: 5px;
  margin-left: 20px;
}
.main{
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 120px);
  padding: 10px 50px;
}
</style>
