<template>
  <div class="tinymce">
    <editor id="tinymce" v-model="Html" :init="tinymceInit" @input="echoEditor"></editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default/icons'
import 'tinymce/plugins/emoticons'

export default {
  name: 'Tinymce',
  components: { Editor },
  data() {
    return {
      Html: '',
      tinymceInit: {
        language_url: '/tinymce/langs/zh_CN.js', // 引用中文语言
        language: 'zh_CN',
        skin_url: '/tinymce/skins/ui/oxide', // 引用默认皮肤
        content_css: '/tinymce/skins/content/document/content.css', // 编辑区样式
        height:500,
        resize: false, //禁止用户拖动改变编辑器大小
        statusbar: false, // 隐藏底部状态栏
      }
    }
  },
  mounted() {
    tinymce.init({})
  },
  methods: {
    echoEditor() {
      this.$emit('echoEditor', this.Html)
    }
  }
}
</script>
