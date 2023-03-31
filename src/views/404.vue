<template>
  <div class="container">
      <el-empty :image-size="300" description="404 找不到页面!"  :image="require('@/assets/img/404.png')">
        <el-button type="primary" @click="goHome">返回首页</el-button>
      </el-empty>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  data() {
    return {

    }
  },
  methods: {
    goHome() {
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
.container{
  text-align: center;
  height: 100vh;
}
</style>
