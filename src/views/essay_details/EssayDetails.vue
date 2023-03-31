<template>
  <div class="essayContainer">
    <div v-loading="loading">
      <!--头部返回-->
      <el-row style="padding:20px;">
        <el-page-header @back="back" title="返回交流区" content="文章详情"
                        style="display: flex;line-height: 20px;">
        </el-page-header>
      </el-row>
      <!--文章详情、登录、推荐文章-->
      <el-row :gutter="20" style="padding: 0 20px;">
        <!--文章详情-->
        <el-col :span="18">
          <div class="essayView">
            <div class="essayHeader">
              <div class="title">{{detailsList.title}}</div>
              <div class="info">
                <div>
                  <el-tag type="warning" size="mini" effect="dark" style="margin-right: 10px">{{detailsList.tagName}}</el-tag>
                  <span class="releaseTime">{{detailsList.releaseTime}}</span>
                </div>
                <div class="authorInfo">
                  <span class="author">作者：</span>
                  <el-avatar :src="detailsList.headImg"></el-avatar>
                  <span class="nickname">{{detailsList.nickname}}</span>
                </div>
              </div>
            </div>
            <div class="divider">
              <el-divider></el-divider>
            </div>
            <div class="essayContent" v-html="detailsList.content"></div>
          </div>
        </el-col>
        <el-col :span="6">
          <!--登录-->
          <div class="loginBox">
            <div v-if="isLogin" class="logged_in">
              <el-dropdown trigger="hover">
                <el-row style="display:flex;flex-direction:column;align-items: center;cursor: pointer;">
                  <el-avatar :size="60" :src="imgPath+user.headImg"></el-avatar>
                  <span style="font-size: 15px;color: rgb(118, 175, 185);margin-top: 10px;">{{user.nickname}}</span>
                </el-row>
                <!-- 用户功能 -->
                <el-dropdown-menu slot="dropdown" style="text-align: center;">
                  <el-dropdown-item>
                    <span @click="toCenter">个人中心</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided >
                    <span @click="logout">退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="login_Register" @click="toLoginAndRegister" v-else="isLogin">
              <span style="color: rgb(32, 76, 97);">登录/注册</span>
            </div>
          </div>
          <!--推荐文章-->
          <div class="similarEssay" v-if="topThreeEssayList.length>0">
           <div class="similarEssay_title">推荐文章</div>
           <el-row v-for="(item,index) in topThreeEssayList" :key="index" style="padding: 15px 0;">
             <el-col :span="12" class="topThreeItem">
                 <span class="itemTitle" @click="openSimilarEssay(item.id)">{{item.title}}</span>
             </el-col>
             <el-col :span="12" class="topThreeItem">
               <span class="itemTime">{{item.releaseTime}}</span>
             </el-col>
           </el-row>
         </div>
        </el-col>
      </el-row>
      <!--评论-->
      <el-row>
        <div class="comment">
          <!--发表评论-->
          <el-row>
            <p style="font-size: 18px;
                      padding-left:20px;
                      margin-bottom: 10px;">
              评论区
            </p>
            <el-row :gutter="10">
              <el-col :span="16" :offset="2">
                <el-input type="textarea" placeholder="发一条友善的评论" v-model.trim="comment.content" resize="none" :rows="3" clearable></el-input>
              </el-col>
              <el-col :span="4" style="line-height:70px;height: 70px;">
                <el-button type="primary" @click="submit" size="default" >发表</el-button>
              </el-col>
            </el-row>
          </el-row>
          <!--评论列表-->
          <el-row style="padding-bottom: 10px;" v-if="commentList.length>0">
            <el-col style="padding-top: 20px;" :offset="2" :span="18" v-for="(item,index) in commentList" :key="index">
              <!--评论-->
              <el-row style="display: flex;">
                <!--评论头像-->
                <div style="width: 60px;
                            text-align: center;">
                 <el-avatar :size="45" :src="imgPath+item.user.headImg"></el-avatar>
                </div>
                <!--评论右侧信息-->
                <div style="flex: 1">
                  <!--评论用户昵称-->
                  <div style="font-size: 14px;
                              color: #61666d;
                              margin-bottom: 4px;">
                    {{item.user.nickname}}
                  </div>
                  <div>
                    <!--评论内容-->
                    <span style="font-size: 14px;">{{item.content}}</span>
                    <!-- 回复日期和回复按钮-->
                    <div style="display: flex;align-items: center;">
                      <span style="margin-right: 15px;
                                   font-size: 13px;
                                   color: #9499A0;">
                        {{item.createTime}}
                      </span>
                      <el-button type="text" style="font-size: 13px;" @click="reply(item.id,item.id)">回复</el-button>
                    </div>
                  </div>
                </div>
              </el-row>
              <!--回复的评论-->
              <el-row style="padding-left: 60px;">
                <!--查看回复评论（评论至少一个），点击展开-->
                <div style="display: block;color: #9499A0;font-size: 13px;" v-if="item.children.length>0">
                  共{{item.children.length}}条回复，<span @click="clickItem(index)" :ref="index" class="showReply">点击查看</span>
                </div>
                <!--所有回复评论内容，默认隐藏-->
                <div style="display: none;">
                  <div v-for="sub in item.children" :key="sub.id" style="display:flex;padding: 8px;">
                    <!--回复用户头像-->
                    <div style="width: 40px;
                              text-align: center;">
                      <el-avatar :size="30" :src="imgPath+sub.user.headImg"></el-avatar>
                    </div>
                    <!--回复用户右侧信息-->
                    <div style="flex: 1;">
                      <!--回复用户昵称-->
                      <div style="display:inline-flex;
                                align-items:center;
                                margin-right: 9px;
                                font-size: 14px;
                                color: #61666d;">
                        <span>{{sub.user.nickname}}</span>
                      </div>
                      <!--回复信息-->
                      <span style="font-size: 14px">回复
                        <!--回复对象的用户昵称-->
                        <span style="color: #008AC5">@{{item.user.nickname}} </span>
                        <!--回复内容-->
                        <span>{{sub.content}}</span>
                      </span>
                      <!--回复日期-->
                      <div style="display: flex;
                                align-items: center;
                                margin-top: 4px;">
                        <span style="margin-right: 20px;
                                      font-size: 13px;
                                      color: #9499A0;">
                          {{sub.createTime}}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-else="commentList.length>0">
            <el-empty description="还没有一条评论！" :image-size="100"></el-empty>
          </el-row>
        </div>
      </el-row>
    </div>
    <!--登录注册窗口-->
    <login-and-register ref="LoginAndRegister" @loginSuccess="loginSuccess"></login-and-register>
    <!--回复评论窗口-->
    <el-dialog title="回复" :visible.sync="dialogVisible" :before-close="reset">
      <el-form :model="replyComment" ref="replyComment" :rules="rules" @submit.native.prevent label-position="right" label-width="80px">
        <el-form-item label="回复内容" prop="content">
          <el-input v-model="replyComment.content" @keyup.enter.native="saveReply"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveReply">确 定</el-button>
      </div>
    </el-dialog>
    <!--回到顶部-->
    <el-backtop :visibility-height=400></el-backtop>
  </div>
</template>

<script>
import LoginAndRegister from "@/components/login_register/LoginAndRegister";
import request from "@/uitls/request";
import Cookies from 'js-cookie'

export default {
  name: "EssayDetails",
  components:{LoginAndRegister},
  data(){
    return{
      loading:false,
      detailsList:{
        id:'',
        nickname:'',
        headImg:'',
        tagName:'',
        title:'',
        content:'',
        releaseTime:''
      },
      isLogin:Cookies.get('user')?true:false,
      user:Cookies.get('user')?JSON.parse(Cookies.get('user')):{},
      imgPath : "http://localhost:9090/gc/front/user/avatar/download/",
      topThreeEssayList:[],
      comment:{
        uid:Cookies.get('user')?JSON.parse(Cookies.get('user')).id:'',
        content:'',
        eid:''
      },
      commentList:[],
      dialogVisible:false,
      replyComment:{
        uid:Cookies.get('user')?JSON.parse(Cookies.get('user')).id:'',
        content:'',
        eid:'',
        pid:'',
        target:''
      },
      rules:{
        content:[
            {required:true,message:'回复内容不能为空',trigger:'blur' }
        ]
      }
    }
  },
  created() {
    const id = this.$route.query.id;
    if(id == null || id == ''){
      this.$router.push("/")
    }else{
      this.loading = true;
      setTimeout(()=>{
        this.comment.eid = id;
        this.replyComment.eid = id;
        this.loadEssay(id);
        this.loadTopThreeEssay(id);
        this. loadComment(id);
        this.loading = false;
      },500)
    }
  },
  methods:{
    back(){
      this.$router.push("/communicate")
    },
    loadEssay(id){
      request.get('/essayDetails/getEssayDetailsById/'+id).then(res=>{
        if (res.code === '200'){
          this.detailsList.id = res.data.id;
          this.detailsList.nickname = res.data.user.nickname;
          this.detailsList.headImg = this.imgPath + res.data.user.headImg;
          this.detailsList.tagName = res.data.tag.tagName;
          this.detailsList.title = res.data.title;
          this.detailsList.content = res.data.content
          this.detailsList.releaseTime = res.data.releaseTime
        }else{
          this.$router.push("/404")
        }
      })
    },
    loadTopThreeEssay(id){
      request.get('/essayDetails/topThreeEssay/'+id).then(res=>{
        if (res.code === '200'){
          this.topThreeEssayList = res.data;
        }
      })
    },
    loadComment(id){
      request.get('/essayDetails/getCommentsById/'+id).then(res=>{
        if (res.code === '200'){
          this.commentList = res.data;
        }
      })
    },
    // 评论列表，回复评论默认隐藏，点击展开
    clickItem(index){
      if (this.$refs[index][0].parentNode.parentNode.childNodes[1].style.display==="none") {
        this.$refs[index][0].parentNode.parentNode.childNodes[1].style.display="block"
        this.$refs[index][0].parentNode.style.display="none"
      }
    },
    toLoginAndRegister(){
      this.$nextTick(()=>{
        this.$refs.LoginAndRegister.dialogVisible = true
      })
    },
    loginSuccess(data){
      this.isLogin = data
      this.user = JSON.parse(Cookies.get('user'))
      this.comment.uid = this.user.id;
      this.replyComment.uid = this.user.id;
    },
    toCenter(){
      this.$router.push("/center")
    },
    logout(){
      //清除浏览器用户的数据
      Cookies.remove('user')
      this.isLogin = false
      this.$message.success({
        message:"退出登录成功！",
        duration:2000
      })
    },
    openSimilarEssay(id){
      this.$router.push("/essayDetails?id="+id)
      location.reload();
    },
    submit(){
      if (Cookies.get('user')){
        if (this.comment.content == ''){
          this.$notify.warning("评论内容不能为空");
        }else{
          request.post('/essayDetails/addComment',this.comment).then(res=>{
            if (res.code == '200'){
              this.$notify.success("提交评论成功");
              this.loadComment(this.comment.eid);
              this.comment.content = '';
            }else{
              this.$notify.success(res.msg)
            }
          })
        }
      }else {
        this.$message.warning("请先登录,才能发表评论!")
      }
    },
    reply(pid,target){
      if (Cookies.get('user')) {
        this.replyComment.pid = pid;
        this.replyComment.target = target;
        this.dialogVisible = true;
      }else {
        this.$message.warning("请先登录,才能回复评论!")
      }
    },
    saveReply(){
      this.$refs['replyComment'].validate((valid) => {
        if (valid) {
          request.post('/essayDetails/addComment',this.replyComment).then(res=>{
            if (res.code == '200'){
              this.loadComment(this.replyComment.eid);
              this.$notify.success("回复评论成功");
              this.replyComment.content = '';
              this.replyComment.pid = '';
              this.replyComment.target = '';
              this.dialogVisible = false;
            }else{
              this.$notify.success(res.msg);
            }
          })
        }
      })
    },
    cancel(){
      this.dialogVisible = false;
      this.$refs['replyComment'].clearValidate();
      this.replyComment.content = '';
      this.replyComment.pid = '';
      this.replyComment.target = '';
    },
    reset(done){
      this.$refs['replyComment'].clearValidate();
      this.replyComment.content = '';
      this.replyComment.pid = '';
      this.replyComment.target = '';
      done();
    }
  }
}
</script>

<style scoped>
.essayContainer{
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 120px);
  margin: 20px 80px;
  background-color: #FFFFFF;
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
  border-radius: 10px;
}
/*文章*/
.essayView{
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
  border-radius: 10px;
  min-height: 400px;
}
.essayHeader{
  padding:20px 30px 10px;
  background-color: #DDB90E;
  border-radius: 10px;
}
.title{
  font-size: 20px;
  font-weight:bold;
}
.info{
  display:flex;
  justify-content: space-between;
  align-items: flex-end;
}
.releaseTime{
  font-size: 12px;
  color: #FFF;
  font-weight: 400;
}
.authorInfo{
  height: 40px;
  display: flex;
  align-items: center;
}
.author{
  font-size: 14px;
  width: 45px;
  height: 40px;
  line-height: 50px;
}
.nickname{
  padding-left: 5px;
  width: 60px;
  height: 40px;
  line-height: 50px;
  font-size: 12px;
  color: dimgray;
  /* 昵称过长省略 */
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.divider{
  padding: 0 10px;
}
.essayContent{
  padding: 0 30px 10px;
  overflow: auto;
}
/*登录*/
.loginBox{
  min-height: 100px;
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: rgb(229, 239, 243);;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login_Register{
  width: 100%;
  height: 100px;
  line-height: 100px;
  text-align: center;
  cursor: pointer;
  color:#FFF;
  font-size: 20px;
}
.logged_in{
  display:flex;
  flex-direction:column;
  align-items: center;
  padding: 10px 0;
  width: 100%;
  border-radius: 10px;
}
/*类似文章*/
.similarEssay{
  min-height: 100px;
  margin-top: 20px;
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
  border-radius: 10px
}
.similarEssay_title{
  text-align: center;
  font-size: 15px;
  color: rgb(56, 117, 158);
  padding: 10px;
  font-weight: bolder;
}
.topThreeItem{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.itemTitle{
  font-size: 12px;
  color: #909399;
  padding-left: 10px;
}
.itemTitle:hover{
  color: #00aeec;
  cursor: pointer;
}
.itemTime{
  font-size: 5px;
  color: #9499A0;
}
/*评论*/
.comment{
  min-height: 400px;
  padding:20px;
}
/*查看回复评论*/
.showReply:hover{
  color: #00aeec;
  cursor: pointer;
}
</style>
