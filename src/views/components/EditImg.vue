<template>
  <el-dialog v-model="visible" title="编辑图片" top="2vh" width="90%" style="height: 90vh">
    <el-button style="position: absolute; z-index: 99; right: 43vw; top: 135px" type="primary" @click="onOk">立即更改</el-button>
    <div id="tui-image-editor"></div>
  </el-dialog>
</template>

<script lang="ts" setup>
import 'tui-image-editor/dist/tui-image-editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'
import ImageEditor from 'tui-image-editor'
import locale_zh from '@/utils/tui_zh'
import { ref, watch, defineProps, computed, defineEmits } from 'vue'

const instance = ref(null)
const props = defineProps(['visible'])
const emit = defineEmits(['done', 'update:visible'])
const visible = computed(() => props.visible)

const init = () => {
  const timer = setInterval(() => {
    const dom = document.querySelector('#tui-image-editor')
    if (dom) {
      clearInterval(timer)
      instance.value = new ImageEditor(dom, {
        includeUI: {
          loadImage: {
            path: 'https://cdn.erp.jinweitec.com/erpsys/Fu4UAygYcP1b1yeSREnFi64DWi0f?imageMogr2/format/webp/interlace/0/quality/50',
            name: 'image',
          },
          initMenu: 'draw', // 默认打开的菜单项
          menuBarPosition: 'bottom', // 菜单所在的位置
          locale: locale_zh, // 本地化语言为中文
        },
        cssMaxWidth: 1000, // canvas 最大宽度
        cssMaxHeight: 600, // canvas 最大高度
      })
    }
  }, 50)
}

const onOk = () => {
  const t = instance.value.toDataURL()
  emit('done', t)
}

watch(visible, (val) => {
  if (val) {
    init()
  }
})
</script>

<style>
.tui-image-editor-container {
  min-height: 90vh;
}
.tui-image-editor-header-logo,
.tui-image-editor-header-buttons {
  display: none;
}
.tui-image-editor-help-menu {
  top: 30px;
}
</style>
