<template>
  <div class="homeContainer">
    <div class="homeTop">
      <el-carousel :interval="4000" type="card" height="360px"
                   style="padding: 120px 0 50px 0;">
        <el-carousel-item v-for="(item,index) in bannerList" :key="index">
            <img :src="imgPath+ item.bannerImg" style="width: 100%;height: 100%;"/>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="homeMiddle">
      <div class="bg">Welcome!</div>
      <div class="homeTop_img_1"></div>
      <div class="bg">Have a good time！</div>
      <div class="homeTop_img_2"></div>
    </div>
    <div class="bottomDivider">
      <el-divider ></el-divider>
    </div>
    <div class="homeBottom">
      <h5>@2022-2023 | By zwh</h5>
    </div>
  </div>
</template>

<script>
import request from "@/uitls/request";

export default {
  name: "Home",
  data() {
    return {
      imgPath : "http://localhost:9090/gc/front/home/download/",
      bannerList:[]
    };
  },
  created(){
    this.load();
  },
  methods:{
    load(){
      request.get('/home/banners').then(res=>{
        if (res.code === '200') {
          this.bannerList = res.data
        }
      })
    }
  }
}
</script>

<style scoped>
.homeContainer{
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
}
.homeTop{
  border-radius: 10px 10px 0 0;
}
.homeTop_img_1{
  background-image: url(../../assets/img/1.jpg);
  background-position: 0 0;
  background-attachment: fixed;
  background-size: cover;
  height:680px;
  width:100%;
}
.homeTop_img_2{
  background-image: url(../../assets/img/2.jpg);
  background-position: 0 0;
  background-attachment: fixed;
  background-size: cover;
  height:680px;
  width:100%;
}
.bg{
  text-align: center;
  font-size:46px;
  font-weight: bolder;
  height:220px;
  line-height: 220px;
  background-color: rgb(131, 134, 204);
  color:white;
}
.bottomDivider{
  padding: 0px 15px;
}
.homeBottom{
  text-align: center;
  background-color: #DDB90E;
  border-radius: 30px 30px 10px 10px;
  padding: 20px 50px;
  box-sizing: content-box;
}
</style>
