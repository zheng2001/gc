<template>
  <div>
    <!--搜索和标签-->
    <div class="searchAndTagContainer">
      <div class="search">
        <el-input :placeholder="this.placeholder"
                  onfocus="this.placeholder=''"
                  onblur="this.placeholder='请输入想要搜索的内容'"
                  size="default"
                  class="searchInput"
                  v-model="params.title"
                  @keyup.enter.native="search"
                  clearable>
          <el-button slot="append" icon="el-icon-search" @click="search" class="searchBtn"></el-button>
        </el-input>
      </div>
      <div class="defaultTag">
        <div>
          <el-radio-group v-model="activeRadio" size="default">
            <el-radio-button label="0">全部</el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="activeRadio" size="small">
            <el-radio-button v-for="(tag,index) in defaultTagList" :key="index" :label="tag.id">
              {{ tag.tagName }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <el-button plain @click="moreTags">更多<i :class="this.showMore == false?'el-icon-arrow-down':'el-icon-arrow-up'"></i></el-button>
      </div>
      <div class="tags" v-if="showMore==true">
        <el-radio-group v-model="activeRadio" size="small">
          <el-radio-button v-for="(tag,index) in tagList" :key="index" :label="tag.id">
            {{ tag.tagName }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <!--文章内容-->
    <div class="essayContainer">
      <el-row :gutter="10">
        <el-col :span="16" v-loading="loading">
          <el-row>
            <el-card shadow="hover" class="card" :body-style="{ padding: '0px' }"
                     v-for="(item,index) in essayList"
                     :key="index"
                     v-if="essayList.length>0">
              <el-col :span="6">
                <img :src="require('@/assets/img/essayImg.jpg')" class="image">
              </el-col>
              <router-link :to="{path:'/essayDetails',query:{id:item.id}}">
                <el-col :span="18" style="cursor: pointer;">
                  <el-row class="cardContent">
                    <p class="content">
                      {{item.title}}
                    </p>
                  </el-row>
                  <el-row class="cardBottom">
                    <el-tag type="warning" size="mini" effect="dark" style="margin-right: 10px">{{item.tag.tagName}}</el-tag>
                    <span>发布时间：{{ item.releaseTime}}</span>
                  </el-row>
                </el-col>
              </router-link>
            </el-card>
            <el-empty :image-size="200" v-if="!essayList.length>0"></el-empty>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-card shadow="always" :body-style="{ padding: '0px' }">
            <div class="date">
              <el-calendar v-model="calendar"></el-calendar>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <button class="rollBtn" v-if="essayList.length>0 && tempList.length>10" @click="change_a_batch">
          <i class="el-icon-refresh el-icon--left"></i>换一批
      </button>
    </div>
  </div>
</template>

<script>
import request from "@/uitls/request";

export default {
  name: "Communicate",
  data(){
    return{
      placeholder:'请输入想要搜索的内容',
      params:{
        title:'',
        tid:'',
      },
      defaultTagList:[], // 默认前五个标签
      activeRadio:'0',
      showMore:false,
      tagList:[], // 排除前五个标签剩余所有标签
      loading:false,
      tempList:[], // 临时列表，所有内容
      essayList: [], //处理后的list
      start:0, //截取第几页的开始参数
      end:1,// 截取第几页的结束参数
      pages:0,// 总页数,默认一页(从0开始)
      pageSize:10,// 一页展示数量
      pageNum:0, //页码,默认第一页(从0开始)
      calendar: new Date()
    }
  },
  created() {
    this.defaultTags();
    this.tags();
    this.load();
  },
  methods: {
    defaultTags(){
      request.get('/communicate/defaultTags').then(res=>{
        if (res.code === '200') {
          this.defaultTagList = res.data;
        }
      })
    },
    tags(){
      request.get('/communicate/tags').then(res=>{
        if (res.code === '200') {
          this.tagList = res.data;
        }
      })
    },
    moreTags() {
      // 判断是否查看更多标签
      if (this.showMore == false) { // 否，更换按钮标签，展开显示标签
        this.showMore = true
      } else { // 是，收起展开显示标签
        this.showMore = false
      }
    },
    change_a_batch(){
      // 判断总数量是否大于显示数量
      if (this.tempList.length>this.pageSize){
        // 判断共分为几页
        this.getPages();
        // 每点击一次页码加一，截取的参数加一
        this.autoIncre();
        // 判断是否是最后一页
        this.clear();
        // 截取当前页数据
        this.render();
      }
    },
    // 计算数据的长度，共分为几页，如果不能整除则加1
    getPages() {
      let total = this.tempList.length; // 总数量
      this.pages = total / this.pageSize;
      if (total % this.pageSize != 0) {
        this.pages = parseInt(this.pages) + 1; // 总页数
      }
    },
    // 每点击一次，页数加一，截取的参数加一
    autoIncre() {
      this.pageNum++;
      this.start++;
      this.end++;
    },
    // 如果点击判断此时当前页大于总页数，则将页数和开始截取的参数重置(既回到首页)。
    clear() {
      if (this.pageNum > this.pages - 1) {
        this.start = 0;
        this.end = 1;
        this.pageNum = 0;
      }
    },
    // 截取每页的数据
    render() {
      this.loading = true;
      setTimeout(()=>{
        this.essayList = this.tempList.slice(this.pageSize * this.start, this.pageSize * this.end);
        this.loading = false;
      },500)
    },
    load(){
      this.params.tid = this.activeRadio==='0'?'':this.activeRadio;// 标签选择全部特殊处理
      request.get('/communicate/list',{
        params:this.params
      }).then(res=>{
        if (res.code === '200') {
            this.tempList = res.data;
            this.render();
        }
      })
    },
    search(){
      this.start = 0;
      this.end = 1;
      this.pageNum = 0;
      this.load();
    }

  }
}
</script>

<style scoped>
.searchAndTagContainer{
  padding: 10px 20px;
}
.search{
  display:flex;
  justify-content: center;
  align-items:center;
  padding: 10px;
}
.searchInput{
  width: 600px;
  border:1px solid #651ED9;
  border-radius: 4px;
}
.searchBtn:hover{
  color: #00aeec;
}
.defaultTag{
  padding: 10px 50px;
  display:flex;
  flex-direction: row;
  justify-content: space-between;
}
::v-deep .defaultTag .el-radio-button:first-child:last-child .el-radio-button__inner {
  border-radius: 20px;
}
::v-deep .defaultTag .el-radio-button__inner{
  margin-right:10px;
  border-radius: 15px;
}
.tags{
  padding:10px 80px;
  background-color: #FFFFFF;
  border-radius:10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
::v-deep .tags .el-radio-button__inner{
  margin:5px 5px 0 0;
  border-radius: 15px;
}
.essayContainer{
  padding:0px 20px 10px;
}
.card{
  height: 150px;
  margin-bottom: 15px;
  border-radius: 10px;
}
.image {
  width: 100%;
  height: 150px;
  display: block;
}
.cardContent{
  height: 120px;
  padding:0 20px;
}
.content{
  padding-top: 30px;
  font-size:20px;
  color:#606266;

  /* 主要代码 */
  overflow: hidden;
  text-overflow: ellipsis;
  text-indent: 2em;
  display: -webkit-box;

  /* 几行后显示省略号 */
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.cardBottom{
  height: 30px;
  line-height:30px;
  padding:0 20px;
  text-align: right;
  font-size: 12px;
  color: #909399;
}
::v-deep .date .el-calendar-table .el-calendar-day{
  width: 50px;
  height: 50px;
}
.rollBtn{
  width: 80px;
  height: 40px;
  position: fixed;
  right: 100px;
  bottom: 40px;
  cursor: pointer;
  border-radius: 4px;
  background-color: #DDB90E;
  color: #FFF;
  border: 0;
}
.rollBtn:hover i{
  color: #18191C;
  transform: rotate(360deg);
  transition: transform .5s ease;
}
</style>

