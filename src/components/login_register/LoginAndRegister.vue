<template>
  <el-dialog width="35%" :visible.sync="dialogVisible" :lock-scroll=false :close-on-click-modal=false :before-close="reset" append-to-body>
    <div class="header">
      <div class="tab_item login" @click="view='Login'" :style="view=='Login'?'color:#00aeec':'color:#505050'">登录</div>
      <el-divider direction="vertical"></el-divider>
      <div class="tab_item register" @click="view='Register'" :style="view=='Register'?'color:#00aeec':'color:#505050'">注册</div>
    </div>
    <transition name='component-fade' mode="out-in">
      <!-- 使用component设置组件切换 -->
      <component :is="view" ref="forms" @changeView="setView" @changeDialog="closeDialog"></component>
    </transition>
  </el-dialog>
</template>

<script>
import Login from "@/components/login_register/Login";
import Register from "@/components/login_register/Register";

export default {
  name: "LoginAndRegister",
  components:{Login,Register},
  data() {
    return {
      dialogVisible: false,
      view:"Login",// 设置切换组件
    };
  },
  methods:{
    // 关闭窗口之前重置表单
    reset(done){
      if (this.view === 'Login'){
        this.$nextTick(()=> {
          this.$refs.forms.$refs['loginForm'].clearValidate();
          this.$refs.forms.form = {};
        })
      }else if(this.view === 'Register'){
        this.$nextTick(()=> {
          this.$refs.forms.$refs['registerForm'].clearValidate();
          this.$refs.forms.form = {};
        })
      }
      this.view="Login"
      done()
    },
    // 切换到注册
    setView(data){
      this.view = data
    },
    /// 登录成功关闭窗口
    closeDialog(data){
      this.dialogVisible = data
      this.$emit('loginSuccess',true) // 传递显示用户信息
    }
  }
}
</script>

<style>
.el-dialog{
  border-radius: 10px !important;
}
.header{
  display: flex;
  justify-content: center;
}
.tab_item{
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  color: #505050;
  cursor: pointer;
  margin-bottom: 30px;
}
.el-divider--vertical{
  height: 20px!important;
}
.component-fade-enter,
.component-fade-leave-to{
  opacity: 0;
  transform: translateX(20px);
}
.component-fade-enter-active,
.component-fade-leave-active{
  transition: all 0.5s ease;
}
</style>
