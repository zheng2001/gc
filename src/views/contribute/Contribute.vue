<template>
 <div class="contributeContainer">
   <div class="top">投稿</div>
   <div class="main">
     <el-form label-position="top" :model="form" ref="contributeForm" :rules="rules">
       <el-form-item label="标题：" prop="title">
           <el-input placeholder="请输入标题（建议30字以内）" maxlength="40" type="text" v-model="form.title" show-word-limit clearable></el-input>
       </el-form-item>
       <el-form-item label="内容：" prop="content">
         <Tinymce v-model="form.content" @echoEditor="setValue" ref="editor" ></Tinymce>
       </el-form-item>
       <el-form-item label="标签：" prop="tid">
         <el-radio-group v-model="form.tid" size="medium">
           <el-radio-button v-for="(tag,index) in tagList" :key="index" :label="tag.id">
             {{tag.tagName}}
           </el-radio-button>
         </el-radio-group>
       </el-form-item>
       <el-form-item style="text-align: center" size="medium">
         <el-button type="primary" @click="submit">提交文章</el-button>
         <el-button type="warning" @click="reset">清空</el-button>
       </el-form-item>
     </el-form>
   </div>
 </div>
</template>

<script>
import Tinymce from "@/components/tinymceText/TinymceText.vue";
import request from "@/uitls/request";
import Cookies from 'js-cookie'

export default {
  name: "Contribute",
  components:{Tinymce},
  data(){
    return{
      form:{
        uid:'',
        tid:'',
        title:'',
        content:''
      },
      tagList:[],
      rules:{
        title:[
          { required:true,message:'请输入标题',trigger:'blur' },
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
        ],
        content:[
          { required:true,message:'请输入内容',trigger:'blur' }
        ],
        tid:[
          { required:true,message:'请选择一个标签',trigger:'blur' }
        ]
      }
    }
  },
  created() {
    this.form.uid = JSON.parse(Cookies.get('user')).id
    this.tags();
  },
  methods:{
    tags(){
      request.get('/contribute/tags').then(res=>{
        if (res.code === '200') {
          this.tagList = res.data;
        }
      })
    },
    setValue(data){
      this.form.content = data
    },
    submit(){
      this.$refs['contributeForm'].validate((valid) => {
        if (valid) {
          request.post('/contribute/addContribute',this.form).then(res=>{
            if (res.code === '200'){
              // 重置表单
              this.$nextTick(()=>{
                this.$refs.editor.Html = ''
              });
              this.form.tid='';
              this.form.title='';
              this.form.content='';
              this.$message.success('投稿成功,通过个人中心查看投稿情况！');
            }else{
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    reset(){
      this.$refs.contributeForm.clearValidate();
      // 重置表单
      this.$nextTick(()=>{
        this.$refs.editor.Html = ''
      });
      this.form.tid='';
      this.form.title='';
      this.form.content='';
    }
  }
}
</script>

<style scoped>
.contributeContainer{
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 0 4px rgba(0,0,0,0.3);
}
.top{
  font-size: 20px;
  background-color: #DDB90E;
  border-radius: 10px 10px 0px 0px;
  padding: 16px 30px;
  box-sizing: content-box;
}
.main{
  padding: 10px 40px;
}

::v-deep .main .el-radio-button__inner{
  margin:5px 5px 0 0;
  border-radius: 15px;
}
</style>
