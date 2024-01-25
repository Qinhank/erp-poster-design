<!--
 * @Author: ShawnPhang
 * @Date: 2022-01-12 11:26:53
 * @Description: 顶部操作按钮组
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-12-11 12:40:59
-->
<template>
  <div class="w-full flex items-center" style="border-bottom: 1px solid #ccc; border-top: 1px solid #ccc">
    <div class="top-title text-left p-0 font-bold text-[18px]">
      <el-input v-if="tempid && !noMenu" v-model="title" class="input-wrap" placeholder="未命名的设计" />
    </div>
    <div class="top-icon-wrap">
      <template v-if="!noMenu">
        <!-- <span style="color: #999; font-size: 14px; margin-right: 0.5rem">{{ stateBollean ? '启用' : '停用' }}</span> <el-switch v-model="stateBollean" @change="stateChange" /> -->
        <!-- <div class="divide__line">|</div> -->
        <el-button plain type="primary" @click="openPsd">上传PSD模板</el-button>
        <el-button plain type="primary" :loading="posting" @click="addTemplate">新增模板</el-button>
        <template v-if="tempid">
          <el-button plain type="primary" :loading="posting" @click="saveTemp">保存模板</el-button>
          <el-button :loading="posting" @click="deleteTemplate">删除</el-button>
        </template>
        <!-- <div class="divide__line">|</div> -->
      </template>
      <template v-else>
        <el-button :loading="loading" size="large" class="primary-btn" :disabled="tempEditing" plain type="primary" @click="download">另存为</el-button>
      </template>
      <!-- <el-button @click="draw">绘制(测试)</el-button> -->
      <!-- <el-button size="large" class="primary-btn" :disabled="tempEditing" @click="save(false)">保存</el-button> -->
      <!-- <copyRight> -->
      <!-- </copyRight> -->
    </div>
    <!-- 生成图片组件 -->
    <SaveImage ref="canvasImage" />
    <Psd v-model="psdVisible" />
  </div>
</template>

<script lang="ts">
import api from '@/api'
import { defineComponent, reactive, toRefs, getCurrentInstance, ComponentInternalInstance, computed, watch, onMounted } from 'vue'
import { mapGetters, mapActions, useStore } from 'vuex'
// import { useRoute, useRouter } from 'vue-router'
// import _dl from '@/common/methods/download'
import { ElMessageBox } from 'element-plus'
import useNotification from '@/common/methods/notification'
import SaveImage from '@/components/business/save-download/CreateCover.vue'
import { useFontStore } from '@/common/methods/fonts'
import Canvas2Image from '@/common/methods/canvas2image'
// import dayjs from 'dayjs'
// import copyRight from './CopyRight.vue'
import _config from '@/config'
// import useConfirm from '@/common/methods/confirm'
import html2canvas from 'html2canvas'
import Psd from './Psd.vue'
// import wGroup from '@/components/modules/widgets/wGroup/wGroup.vue'

export default defineComponent({
  components: { SaveImage, Psd },
  props: ['modelValue', 'noMenu'],
  emits: ['change', 'update:modelValue', 'save'],
  setup(props, { emit }) {
    const { proxy }: any = getCurrentInstance() as ComponentInternalInstance
    // const route = useRoute()
    // const router = useRouter()
    const store = useStore()
    const state = reactive({
      stateBollean: false,
      title: '',
      loading: false,
      psdVisible: false,
      posting: false,
    })

    const tempid = computed(() => store.state.epd.templateId)
    const templateTitle = computed(() => store.state.epd.templateTitle)

    onMounted(() => {
      console.log(store)
    })

    watch(
      () => templateTitle.value,
      async (n) => {
        // const { title } = await api.home['getTempDetail']({ id: n })
        state.title = n
      },
    )

    // 保存作品
    // async function save(hasCover: boolean = false) {
    //   // Bugs: 历史操作有问题，且page操作未及时入栈 proxy?.dPageHistory
    //   if (proxy?.dHistory.length <= 0) {
    //     return
    //   }
    //   store.commit('setShowMoveable', false) // 清理掉上一次的选择框
    //   // console.log(proxy?.dPage, proxy?.dWidgets)
    //   // const { id, tempid } = route.query
    //   const cover = hasCover ? await proxy?.draw() : undefined
    //   const widgets = proxy.dWidgets // reviseData()
    //   const { id: newId, stat, msg } = await api.home.saveWorks({ cover, id: null, title: proxy.title || '未命名设计', data: JSON.stringify({ page: proxy.dPage, widgets }), temp_id: tempid, width: proxy.dPage.width, height: proxy.dPage.height })
    //   stat !== 0 ? useNotification('保存成功', '可在"我的作品"中查看') : useNotification('保存失败', msg, { type: 'error' })
    //   // !id && router.push({ path: '/home', query: { id: newId }, replace: true })
    //   store.commit('setState', { key: 'templateId', value: newId })
    //   store.commit('setShowMoveable', true)
    // }
    async function createImg() {
      const shareContent: any = document.getElementById('page-design-canvas') // 需要截图的包裹的（原生的）DOM 对象
      const width = shareContent?.offsetWidth // 获取dom 宽度
      const height = shareContent?.offsetHeight // 获取dom 高度
      const _canvas: any = document.createElement('canvas') // 创建一个canvas节点
      const scale = 2 // 定义任意放大倍数 支持小数
      _canvas.width = width * scale // 定义canvas 宽度 * 缩放
      _canvas.height = height * scale // 定义canvas高度 *缩放
      _canvas?.getContext('2d').scale(scale, scale) // 获取context,设置scale
      const opts = {
        scale: scale, // 添加的scale 参数
        canvas: _canvas, // 自定义 canvas
        // logging: true, //日志开关，便于查看html2canvas的内部执行流程
        width: width, // dom 原始宽度
        height: height,
        useCORS: true, // 【重要】开启跨域配置
      }

      const canvas = await html2canvas(shareContent, opts)
      const context: any = canvas.getContext('2d')
      // 【重要】关闭抗锯齿
      context.mozImageSmoothingEnabled = false
      context.webkitImageSmoothingEnabled = false
      context.msImageSmoothingEnabled = false
      context.imageSmoothingEnabled = false
      // 【重要】默认转化的格式为png,也可设置为其他格式
      const img = Canvas2Image.convertToImage(canvas, canvas.width, canvas.height)
      // document.body.appendChild(img)
      // $(img)
      //   .css({
      //     width: canvas.width / 2 + 'px',
      //     height: canvas.height / 2 + 'px',
      //   })
      //   .addClass('f-full')

      // const dom = document.getElementById('page-design-canvas')
      // const canvas = await html2canvas(dom, { useCORS: true, allowTaint: true, backgroundColor: null })
      // 创建图片
      // const image = canvas.toDataURL('image/jpg')
      return img
    }
    // 保存模板
    async function saveTemp() {
      // const { tempid, tempType: type } = route.query
      let res = null
      state.posting = true
      const image = await createImg()
      // const type = 2
      if (false) {
        // 保存组件，组合元素要保证在最后一位，才能默认选中
        if (proxy.dWidgets[0].type === 'w-group') {
          const group = proxy.dWidgets.shift()
          group.record.width = 0
          group.record.height = 0
          proxy.dWidgets.push(group)
        }
        // TODO：如果保存组件不存在组合，则添加组合。该功能待优化
        if (!proxy.dWidgets.some((x: any) => x.type === 'w-group')) {
          alert('提交组件必须为组合！')
          return
          // proxy.dWidgets.push(wGroup.setting)
        }
        res = await api.home.saveTemp({ id: tempid.value, cover_base64: image, type, title: proxy.title || '未命名组件', content: JSON.stringify(proxy.dWidgets), width: proxy.dPage.width, height: proxy.dPage.height })
      } else {
        res = await api.home.saveTemp({ id: tempid.value, cover_base64: image, title: proxy.title || '未命名模板', content: JSON.stringify({ page: proxy.dPage, widgets: proxy.dWidgets }), width: proxy.dPage.width, height: proxy.dPage.height })
      }
      res.stat != 0 && useNotification(res.msg || '成功')
      store.commit('setState', { key: 'templateDate', value: Date.now() })
      state.posting = false
      return res
    }
    // 停用启用
    // async function stateChange(e: any) {
    //   const { tempid, tempType: type } = route.query
    //   const { stat } = await api.home.saveTemp({ id: tempid, type, state: e ? 1 : 0 })
    //   stat != 0 && useNotification('保存成功', '模板内容已变更')
    // }
    // async function download_bak() {
    //   if (state.loading === true) {
    //     return
    //   }
    //   // 临时提示
    //   if (proxy.title === '自设计模板') {
    //     const isPass = await useConfirm('提示', 'PSD自设计作品暂时保存在Github，下载可能失败', 'warning')
    //     if (!isPass) {
    //       return
    //     }
    //   }
    //   state.loading = true
    //   context.emit('update:modelValue', true)
    //   context.emit('change', { downloadPercent: 1, downloadText: '正在处理封面' })
    //   await save(true)
    //   setTimeout(async () => {
    //     const { id } = route.query
    //     if (id) {
    //       const { width, height } = proxy.dPage
    //       context.emit('update:modelValue', true)
    //       context.emit('change', { downloadPercent: 1, downloadText: '准备合成图片' })
    //       state.loading = false
    //       let timerCount = 0
    //       const animation = setInterval(() => {
    //         if (props.modelValue && timerCount < 75) {
    //           timerCount += RandomNumber(1, 10)
    //           context.emit('change', { downloadPercent: 1 + timerCount, downloadText: '正在合成图片' })
    //         } else {
    //           clearInterval(animation)
    //         }
    //       }, 800)
    //       await _dl.downloadImg(api.home.download({ id, width, height }) + '&r=' + Math.random(), (progress: number, xhr: any) => {
    //         if (props.modelValue) {
    //           clearInterval(animation)
    //           progress >= timerCount && context.emit('change', { downloadPercent: Number(progress.toFixed(0)), downloadText: '图片生成中' })
    //         } else {
    //           xhr.abort()
    //         }
    //       })
    //       context.emit('change', { downloadPercent: 100, downloadText: '图片下载中' })
    //     }
    //   }, 100)
    // }
    async function download() {
      // 创建图片
      state.loading = true
      const image = await createImg()
      emit('save', image)
      state.loading = false
      // 你可以下载图片或者以其他方式使用它
      // const link = document.createElement('a')
      // link.href = image
      // link.download = `${Date.now()}.jpg`
      // document.body.appendChild(link)
      // link.click()
      // document.body.removeChild(link)
    }
    // function RandomNumber(min: number, max: number) {
    //   return Math.ceil(Math.random() * (max - min)) + min
    // }

    const deleteTemplate = async () => {
      ElMessageBox.confirm('确认要删除当前模板吗？', '删除确认', {
        confirmButtonText: '确认删除',
        cancelButtonText: '我再想想',
        type: 'warning',
      }).then(async () => {
        try {
          await api.home.removeComp({ id: tempid.value })
          store.commit('setState', { key: 'templateDate', value: Date.now() })
          store.commit('setState', { key: 'templateId', value: null })
          useNotification('删除成功')
        } catch (error) {}
      })
    }

    const addTemplate = async () => {
      const res = await saveTemp()
      if (res.id) {
        store.commit('setState', { key: 'templateId', value: res.id })
      }
    }

    const openPsd = () => {
      store.dispatch('resetWidget')
      state.psdVisible = true
    }

    return {
      ...toRefs(state),
      tempid,
      download,
      // save,
      saveTemp,
      // stateChange,
      deleteTemplate,
      addTemplate,
      openPsd,
    }
  },
  computed: {
    ...mapGetters(['dPage', 'dWidgets', 'tempEditing', 'dHistory', 'dPageHistory']),
  },
  methods: {
    ...mapActions(['pushHistory', 'addGroup']),
    async load(id: any, tempId: any, type: any, cb: Function) {
      // if (this.$route.name !== 'Draw') {
      await useFontStore.init() // 初始化加载字体
      // }
      // console.log(9999999, tempId)
      // const apiName = tempId && !id ? 'getTempDetail' : 'getWorks'
      // if (!id && !tempId) {
      //   cb()
      //   return
      // }
      // const { data: content, title, state, width, height } = await api.home[apiName]({ id: id || tempId, type })
      // if (content) {
      //   const data = JSON.parse(content)
      //   this.stateBollean = !!state
      //   this.title = title
      //   this.$store.commit('setShowMoveable', false) // 清理掉上一次的选择框
      //   // this.$store.commit('setDWidgets', [])
      //   if (type == 1) {
      //     // 加载文字组合组件
      //     this.dPage.width = width
      //     this.dPage.height = height
      //     this.addGroup(data)
      //   } else {
      //     const AcImg = this.$store.state?.imgs
      //     if (AcImg && AcImg.length) {
      //       data.page.backgroundImage = AcImg[0]
      //     }
      //     this.$store.commit('setDPage', data.page)
      //     id ? this.$store.commit('setDWidgets', data.widgets) : this.$store.dispatch('setTemplate', data.widgets)
      //   }
      //   cb()
      //   this.pushHistory('请求加载load')
      // }
    },
    draw() {
      return new Promise((resolve) => {
        this.$refs.canvasImage.createCover(({ key }) => {
          resolve(_config.IMG_URL + key)
        })
      })
    },
  },
})
</script>

<style lang="less">
.input-wrap {
  .el-input__wrapper {
    flex-grow: inherit !important;
  }
}
</style>
<style lang="less" scoped>
.top-icon-wrap {
  display: flex;
  align-items: center;
  padding-right: 20px;
  height: 54px;
  // position: absolute;
  // right: 0;
  // z-index: 99;
  // bottom: 0;
  .top-icon {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    color: #ffffff;
    cursor: pointer;
    font-weight: bold;
    margin: 8px;
    padding: 5px 8px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}
.top-title {
  color: @color-black;
  flex: 1;
  padding-left: 20px;
  // font-weight: bold;
  .input-wrap {
    width: 15rem;
    :deep(input) {
      border-color: #ffffff;
      // border-color: #e8eaec;
    }
  }
  .input-wrap:hover {
    :deep(input) {
      border-color: #e8eaec;
    }
  }
}
.primary-btn {
  font-weight: 600;
  transform: scale(0.95);
  margin-left: 10px;
}

.divide__line {
  margin: 0 1rem;
  color: #e8eaec;
  height: 20px;
}
</style>
