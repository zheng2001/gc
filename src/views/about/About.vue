<template>
  <div class="aboutContainer">
    <div class="left">
      <div class="square"></div>
      <div class="title">关于</div>
    </div>
    <div class="right">
      <div class="goal">
        <h1>About</h1>
        <p>&emsp;&emsp;作者声明</p>
        <p>&emsp;&emsp;目标是建立一个游戏交流平台网站，让大家了解更多不同游戏。网站前期可能比较简陋，后续会陆续完善。希望有更多的人加入并使用。 </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "About"
}
</script>

<style scoped>
.aboutContainer{
  height: 650px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  /*background: linear-gradient(to bottom right,#41464C,#969694);*/
  background-image: url(../../assets/img/about.jpg);
  background-repeat: no-repeat;
  background-size: 100%;
  opacity: 0.9;
  border-radius: 50px;
  animation: load 1s linear;
  transition: 1s ease 0.2s;
}
.left{
  width: 400px;
  height: 100%;
}
.left .square{
  width: 250px;
  height: 250px;
  border: 5px solid rgb(183, 207, 226);
  margin: 200px auto auto;
  border-radius: 30%;
  animation: a1 3s infinite linear;
}
.left .square::before{
  content: "";
  width: 250px;
  height: 250px;
  transform: rotate(30deg);
  border: 5px solid rgb(183, 207, 226);
  border-radius: 40%;
  position: absolute;
  animation: a2 25s infinite linear;
}
.left .square::after{
  content: "";
  width: 250px;
  height: 250px;
  transform: rotate(60deg);
  border: 5px solid rgb(183, 207, 226);
  border-radius: 30%;
  position: absolute;
  animation: a2 60s infinite linear;
}
.left .title{
  position: absolute;
  font-size: 2em;
  margin-left: 170px;
  margin-top: -150px;
  color: rgb(183, 207, 226);
  z-index: -10;
}
.left .square:hover{
  animation: a1 15s infinite linear;
}
.left .square:hover::before{
  animation: a2 80s infinite linear;
}
.left .square:hover::after{
  animation: a1 50s infinite linear;
}
.right{
  flex: 1;
  height: 100%;
}
.goal{
  color: rgb(206, 228, 238);
  width: 500px;
  margin: auto;
  display: flex;
  flex-direction: column;
}
.goal h1{
  font-size: 4em;
  font-weight: bolder;
  line-height: 200px;
}

.goal p{
  word-wrap: break-word;
}
@keyframes a1{
  to{
    transform: rotate(360deg);
  }
}
@keyframes a2{
  to{
    transform: rotate(-10800deg);
  }
}
@keyframes load{
  0%{
    opacity: 0;
    margin-top: 20px;
  }
  100%{
    opacity: 1;
    margin-top: 0px;
  }
}
</style>
