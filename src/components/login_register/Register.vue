<template>
  <div style="height: 400px;">
    <el-form :model="form" ref="registerForm" :rules="rules">
      <el-form-item label="昵称" prop="nickname">
        <el-input placeholder="请输入昵称" v-model="form.nickname" size="medium" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username" size="medium" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input placeholder="请输入密码" v-model="form.pwd" size="medium" show-password clearable></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPwd">
        <el-input placeholder="请再次输入密码" v-model="form.checkPwd" size="medium" show-password clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="registerBtn" size="medium" type="primary" @click="register">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from "@/uitls/request";

export default {
  name: "Register",
  data() {
    const checkUsername = (rule, value, callback) => {
      request.get('/user/checkUsername/'+value, ).then(res =>{
        if (res.code === '200'){
          callback(new Error(res.data));
        }else {
          callback();
        }
      })
    };
    const equalToPassword = (rule, value, callback) => {
      if (this.form.pwd !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      form: {},
      rules: {
        nickname:[
          { required:true,message:'昵称不能为空',trigger:'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
          {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'},
          { required: true, validator: checkUsername, trigger: "blur" }
        ],
        pwd: [
          {required: true, message: "密码不能为空", trigger: "blur"},
          {min: 5, max: 12, message: "长度在 5 到 12个字符", trigger: "blur"}
        ],
        checkPwd:[
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    }
  },
  methods:{
    register(){
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          request.post('/user/register', this.form).then(res => {
            if (res.code === '200') {
              this.form = {};
              this.$emit('changeView','Login')
              this.$message.success({
                message:"注册成功,快去登录把！",
                duration:2000
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      });
    }
  }
}
</script>

<style scoped>
.registerBtn{
  width: 100%;
}
</style>
