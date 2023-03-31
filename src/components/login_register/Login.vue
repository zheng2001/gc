<template>
  <div style="height: 200px;">
    <el-form :model="form" ref="loginForm" :rules="rules">
      <el-form-item prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username" name="username" autocomplete="on" prefix-icon="el-icon-user" size="medium" clearable></el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input placeholder="请输入密码" v-model="form.pwd" name="pwd" autocomplete="on" prefix-icon="el-icon-lock" size="medium" @keyup.enter.native="login" show-password clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="loginBtn" size="medium" type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
    <div class="form_bottom">
      <div>首次使用？<span class="toRegister" @click="toRegister">点我注册!</span></div>
    </div>
  </div>
</template>

<script>
import request from "@/uitls/request";
import Cookies from 'js-cookie'

export default {
  name: "Login",
  data(){
    return{
      form:{},
      rules: {
        username:[
          { required:true,message:'用户名不能为空',trigger:'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        pwd:[
          { required:true,message: "密码不能为空", trigger: "blur" },
          { min: 5, max: 12, message: "长度在 5 到 12个字符", trigger: "blur" }
        ]
      }
    }
  },
  methods:{
    login(){
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          request.post('/user/login',this.form).then(res=>{
            if (res.code === '200'){
              Cookies.set('user',JSON.stringify(res.data),{expires:7});// 把数据存放到cookie中
              this.form = {}; // 重置表单
              this.$emit('changeDialog',false); // 登录成功，传递关闭窗口信息
              this.$message.success({
                message:'登录成功',duration:2000
              });
            }else{
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    toRegister(){
      this.$emit('changeView','Register')
    }
  }
}
</script>

<style scoped>
.loginBtn{
  width: 100%;
}
.form_bottom{
  height: 20px;
  display: flex;
  justify-content: flex-end;
}
.forgetPwd{
  cursor: pointer;
}
.forgetPwd:hover{
  opacity: 0.75;
}
.toRegister{
  cursor: pointer;
  color: #00aeec;
}
.toRegister:hover{
  opacity: 0.75;
}
</style>
