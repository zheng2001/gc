<template>
  <div class="centerContainer">
    <div style="padding: 20px;">
      <el-row style="padding:20px;">
        <el-page-header @back="back" title="返回首页" content="个人中心"
                        style="display: flex;line-height: 20px;">
        </el-page-header>
      </el-row>
      <el-row class="infoCard">
        <el-row class="top">
          <el-avatar :src="imgPath+user.headImg" :size="70"></el-avatar>
          <span style="font-size: 20px;margin-top: 10px;">{{user.nickname}}</span>
        </el-row>
        <div class="divider">
          <el-divider></el-divider>
        </div>
        <el-tabs tab-position="left" @tab-click="handleClick" class="tab">
          <el-tab-pane label="个人信息">
            <el-card shadow="always">
              <el-col :span="12" :offset="4">
                <el-form :model="form" ref="ruleForm" :rules="rules" label-position="right" label-width="80px">
                  <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="form.nickname"></el-input>
                  </el-form-item>
                  <el-form-item label="用户名">
                    <el-input v-model="form.username" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="年龄" prop="age">
                    <el-input v-model.number="form.age"></el-input>
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-radio-group v-model="form.sex">
                      <el-radio label="男"></el-radio>
                      <el-radio label="女"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="头像">
                    <el-upload
                        class="avatar-uploader"
                        action=""
                        list-type="picture"
                        :show-file-list="false"
                        :auto-upload="false"
                        :on-change="changeUpload">
                      <img v-if="this.form.headImg" :src="imgPath+this.form.headImg" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <!--头像裁剪组件-->
                    <CropperImg ref="CropperImgRef" @data="setHeadImg"/>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="save">保存</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="修改密码">
            <el-card shadow="always">
              <el-col :span="12" :offset="4">
                <el-form :model="pwdForm" ref="rulePwdForm" :rules="rulePwd" label-position="right" label-width="80px">
                  <el-form-item label="新密码" prop="pwd">
                    <el-input v-model="pwdForm.pwd" show-password clearable></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="checkPwd">
                    <el-input v-model="pwdForm.checkPwd" show-password clearable></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="modifyPwd">修改</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="我的投稿">
            <!--有稿件-->
            <el-row :gutter="10" v-if="total>0">
              <el-col :span="24" v-for="(item,index) in contributeList" :key="index" style="margin-bottom: 10px;">
                <el-card shadow="hover">
                  <div style="display: flex;flex-direction: column;">
                    <div style="padding: 5px 0;">标题：<span style="font-size: 15px;color:#909399;">{{item.title}}</span></div>
                    <div style="padding: 5px 0;">内容：<el-button type="primary" plain icon="el-icon-zoom-in" @click="preView(item.content)">点击查看</el-button></div>
                    <div style="padding: 5px 0;">标签：<el-tag type="warning" size="mini" effect="dark">{{item.tag.tagName}}</el-tag></div>
                    <div style="padding: 5px 0;">
                      审核状态：<span :style="statusColor(item.essayStatus)">{{checkStatus(item.essayStatus)}}</span>
                    </div>
                    <div style="padding: 5px 0;" v-if="item.essayStatus == 2" >
                      <span>不通过理由：</span>
                      <span style="color: #F56C6C;font-size: 13px;">{{item.reason}}</span>
                    </div>
                    <div style="padding: 5px 0;">
                      <span>创建时间：</span>
                      <span style="font-size: 12px;color: #909399;margin-right: 10px;">{{item.createTime}} </span>
                      <span v-if="item.essayStatus == 1">发布时间：
                        <span style="font-size: 12px;color: #909399;">{{item.releaseTime}}</span>
                      </span>
                    </div>
                    <el-button type="danger" size="mini" v-if="item.essayStatus == 2" @click="deleteById(item.id)">删除</el-button>
                  </div>
                </el-card>
              </el-col>
              <!--预览窗体-->
              <el-dialog title="文章内容" width="70%" class="showDialog" :visible.sync="essayContentVisible" :before-close="handleViewClose">
                <div v-html="html"></div>
              </el-dialog>
            </el-row>
            <!--分页-->
            <div v-if="total>0">
              <el-pagination
                  background
                  :current-page="params.pageNum"
                  :page-size="params.pageSize"
                  layout="total,prev, pager, next,jumper"
                  @current-change ="handleCurrentChange"
                  :total="total">
              </el-pagination>
            </div>
            <!--无稿件-->
            <el-row v-else="total>0">
              <el-empty description="一个稿件都没有，快去投稿把~" :image-size="200"></el-empty>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import CropperImg from "@/components/CropperImg/CropperImg";
import request from "@/uitls/request";

export default {
  name: "Center",
  components:{CropperImg},
  data(){
    const checkAge = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else {
        if (value < 0 || value > 120) {
          callback(new Error('年龄输入有误'));
        } else {
          callback();
        }
      }
    };
    const equalToPassword = (rule, value, callback) => {
      if (this.pwdForm.pwd !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return{
      user:Cookies.get('user')?JSON.parse(Cookies.get('user')):{},
      imgPath : "http://localhost:9090/gc/front/user/avatar/download/",
      form: {
        id:'',
        nickname: '',
        username: '',
        age:'',
        sex:'',
        headImg:''
      },
      rules:{
        nickname:[
          { required:true,message:'昵称不能为空',trigger:'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        age:[
          { required:true,validator: checkAge, trigger: 'blur' }
        ]
      },
      pwdForm:{
        pwd:'',
        checkPwd:''
      },
      rulePwd:{
        pwd: [
          {required: true, message: "密码不能为空", trigger: "blur"},
          {min: 5, max: 12, message: "长度在 5 到 12个字符", trigger: "blur"}
        ],
        checkPwd:[
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true,validator: equalToPassword, trigger: "blur" }
        ]
      },
      contributeList:[],
      params:{
        pageNum: 1,
        pageSize: 2,
        uid:JSON.parse(Cookies.get('user')).id
      },
      total:0,
      essayContentVisible:false,
      html:''
    }
  },
  created() {
    this.load();
  },
  methods:{
    load(){
      request.get('/user/getUserById/'+this.user.id).then(res=>{
        if (res.code === '200'){
          this.form = res.data;
        }
      })
    },
    back(){
      this.$router.push("/home")
    },
    changeUpload(file) {
      let tempImg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const isLt10M = file.size / 1024 / 1024 < 10;
      const isJPG = tempImg === 'jpg'
      const isPNG = tempImg === 'png'

      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
      }
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
        return;
      }
      this.$nextTick(() => { // 赋值给裁剪窗体
        this.$refs.CropperImgRef.option.img = file.url
        this.$refs.CropperImgRef.option.name = file.name
        this.$refs.CropperImgRef.cropperVisible = true
      })
    },
    setHeadImg(data){
      this.form.headImg = data;
    },
    save(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          request.post('/user/update',this.form).then(res=>{
            if (res.code === '200'){
              this.load();
              let temp = {
                id:this.form.id,
                nickname:this.form.nickname,
                username:this.form.username,
                headImg:this.form.headImg,
                token:JSON.parse(Cookies.get('user')).token
              }
              Cookies.set('user',JSON.stringify(temp),{expires:7});// 重置下cookie中的数据
              this.user = JSON.parse(Cookies.get('user'))
              this.$message.success("保存成功")
            }else{
              this.$message.error(res.msg)
            }
          })
        }
      });
    },
    modifyPwd(){
      this.$refs['rulePwdForm'].validate((valid) => {
        if (valid) {
          request.get('/user/modifyPwdById/'+this.user.id+'/'+this.pwdForm.pwd).then(res=>{
            if (res.code === '200'){
              this.pwdForm = {
                pwd:'',
                checkPwd:''
              }
              this.$message.success("修改成功")
            }else{
              this.$message.error(res.msg)
            }
          })
        }
      });
    },
    loadContribution(){
      request.get('/user/ContributeList',{
        params:this.params
      }).then(res =>{
        if (res.code === '200'){
          this.contributeList = res.data.list;
          this.total = res.data.total;
        }
      })
    },
    /*判断稿件状态返回显示的颜色*/
    statusColor(status){
      if(status == 0){
        return 'color:orange'
      }else if(status == 1){
        return 'color:green'
      }else{
        return 'color:red'
      }
    },
    /*判断稿件状态返回显示名称*/
    checkStatus(status){
      if(status == 0){
        return "审核中"
      }else if(status == 1){
        return "通过"
      }else{
        return "不通过"
      }
    },
    //文章内容预览
    preView(data){
      this.essayContentVisible = true;
      this.html = data;
    },
    //关闭预览
    handleViewClose(done){
      this.html = ''
      done();
    },
    //删除不通过的稿件
    deleteById(id){
      this.$confirm('是否删除该稿件?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.get('/user/deleteById/'+id).then(res =>{
          if (res.code === '200'){
            this.$message.success("删除成功")
            if(this.params.pageNum !== 1 && this.contributeList.length==1){
              this.params.pageNum = this.params.pageNum-1;
            };
            this.loadContribution()
          }else{
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        });
      });
    },
    // 点击分页按钮触发分页
    handleCurrentChange(pageNum){
      this.params.pageNum = pageNum
      this.loadContribution()
    },
    handleClick(tab, event){
      if (tab.index == 0) {
        this.$refs['ruleForm'].clearValidate();
        this.form =  {
          id:'',
          nickname: '',
          username: '',
          age:'',
          sex:'',
          headImg:''
        };
        this.load();
      }else if(tab.index == 1){
        this.$refs['rulePwdForm'].clearValidate();
        this.pwdForm = {
          pwd:'',
          checkPwd:''
        }
      }else{
        this.loadContribution();
      }
    }
  }
}
</script>

<style scoped>
.centerContainer{
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 120px);
  padding: 10px 50px;
}
.infoCard{
  margin: 10px 40px;
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
  border-radius: 10px;
}
.top{
  display:flex;
  flex-direction:column;
  align-items:center;
  height: 110px;
  margin-top: 10px;
}
.divider {
  padding: 0 40px;
}
.tab{
  min-height: 400px;
  padding: 20px;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.showDialog{
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
::v-deep .showDialog .el-dialog {
  margin: 0 auto !important;
  height: 80%;
  border-radius: 10px;
  overflow: hidden;
}
::v-deep .showDialog .el-dialog__body {
  position: absolute;
  left: 0;
  top: 54px;
  bottom: 0;
  right: 0;
  padding: 0;
  z-index: 1;
  overflow: hidden;
  overflow-y: auto;
  padding: 0 20px;
}
</style>
