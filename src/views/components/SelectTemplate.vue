<template>
  <el-dialog :destroy-on-close="true" :model-value="templateVisible" top="5vh" width="90%" style="height: 90vh" @close="handleClose">
    <template #header>
      <div class="text-left">
        编辑{{ noMenu ? '图片' : '模板' }} - 【<a class="text-blue-500 cursor-pointer" @click="toggleMode(noMenu ? 2 : 1)">{{ noMenu ? '进入' : '退出' }}模板编辑</a>】
      </div>
    </template>
    <div id="page-design-index" ref="pageDesignIndex" class="page-design-bg-color">
      <header-options ref="options" v-model="isContinue" :noMenu="noMenu" @change="optionsChange" @save="saveAs" />
      <div v-show="false" :style="style" class="top-nav">
        <div class="top-nav-wrap">
          <div class="top-left">
            <div class="name" @click="jump2home">{{ APP_NAME }}</div>
            <div class="operation">
              <div :class="['operation-item', { disable: !undoable }]" @click="undoable ? handleHistory('undo') : ''"><i class="iconfont icon-undo" /></div>
              <div :class="['operation-item', { disable: !redoable }]" @click="redoable ? handleHistory('redo') : ''"><i class="iconfont icon-redo" /></div>
            </div>
            <!-- <el-tooltip effect="dark" content="标尺" placement="bottom">
              <i style="font-size: 20px" class="icon sd-biaochi extra-operation" @click="changeLineGuides" />
            </el-tooltip> -->
          </div>
        </div>
      </div>
      <div class="page-design-index-wrap">
        <widget-panel :noMenu="noMenu"></widget-panel>
        <design-board class="page-design-wrap" pageDesignCanvasId="page-design-canvas">
          <!-- 用于挡住画布溢出部分，因为使用overflow有bug -->
          <div class="shelter" :style="{ width: Math.floor((dPage.width * dZoom) / 100) + 'px', height: Math.floor((dPage.height * dZoom) / 100) + 'px' }"></div>
          <!-- 提供一个背景图层 -->
          <div class="shelter-bg transparent-bg" :style="{ width: Math.floor((dPage.width * dZoom) / 100) + 'px', height: Math.floor((dPage.height * dZoom) / 100) + 'px' }"></div>
        </design-board>
        <style-panel :noMenu="noMenu"></style-panel>
      </div>

      <edit-img :visible="editImgVisible" @done="editImgDone" />
      <!-- 抠图 -->
      <image-cutout></image-cutout>
      <!-- 标尺 -->
      <line-guides :show="showLineGuides" />
      <!-- 缩放控制 -->
      <zoom-control ref="zoomControl" />
      <!-- 右键菜单 -->
      <right-click-menu />
      <!-- 旋转缩放组件 -->
      <Moveable />
      <!-- 遮罩百分比进度条 -->
      <ProgressLoading :percent="downloadPercent" :text="downloadText" cancelText="取消" @cancel="downloadCancel" @done="downloadPercent = 0" />
    </div>
  </el-dialog>
</template>

<script lang="ts">
import _config from '@/config'
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import RightClickMenu from '@/components/business/right-click-menu/RcMenu.vue'
import Moveable from '@/components/business/moveable/Moveable.vue'
import designBoard from '@/components/modules/layout/designBoard.vue'
import zoomControl from '@/components/modules/layout/zoomControl.vue'
import lineGuides from '@/components/modules/layout/lineGuides.vue'
import imageCutout from '@/components/business/image-cutout'

import shortcuts from '@/mixins/shortcuts'
import wGroup from '@/components/modules/widgets/wGroup/wGroup.vue'
import headerOptions from './HeaderOptions.vue'
import ProgressLoading from '@/components/common/ProgressLoading/index.vue'
import widgetPanel from '@/components/modules/panel/widgetPanel.vue'
import stylePanel from '@/components/modules/panel/stylePanel.vue'
import { ElDialog } from 'element-plus'
import EditImg from './EditImg.vue'

const beforeUnload = function (e: any) {
  const confirmationMessage = '系统不会自动保存您未修改的内容'
  ;(e || window.event).returnValue = confirmationMessage // Gecko and Trident
  return confirmationMessage // Gecko and WebKit
}

export default defineComponent({
  components: {
    RightClickMenu,
    Moveable,
    headerOptions,
    ProgressLoading,
    designBoard,
    zoomControl,
    lineGuides,
    imageCutout,
    widgetPanel,
    stylePanel,
    ElDialog,
    EditImg,
  },
  mixins: [shortcuts],
  emits: ['update:modelValue', 'close', 'save'],
  setup(props) {
    !_config.isDev && window.addEventListener('beforeunload', beforeUnload)

    const state = reactive({
      style: {
        left: '0px',
      },
      // openDraw: false,
      downloadPercent: 0, // 下载进度
      downloadText: '',
      isContinue: true,
      APP_NAME: _config.APP_NAME,
      showLineGuides: false,
      visible: false,
    })

    onMounted(() => {
      setTimeout(() => {
        state.visible = true
      }, 3000)
    })

    // const draw = () => {
    //   state.openDraw = true
    // }
    // watch(() => props.visible, n => {
    //   this.initGroupJson(JSON.stringify(wGroup.setting))
    //   window.addEventListener('scroll', this.fixTopBarScroll)
    //   // window.addEventListener('click', this.clickListener)
    //   document.addEventListener('keydown', this.handleKeydowm, false)
    //   document.addEventListener('keyup', this.handleKeyup, false)
    //   this.loadData()
    // })
    function jump2home() {
      // const fullPath = window.location.href.split('/')
      // window.open(fullPath[0] + '//' + fullPath[2])
      window.open('https://xp.palxp.cn/')
    }
    return {
      ...toRefs(state),
      jump2home,
    }
  },
  computed: {
    ...mapGetters(['dActiveElement', 'dHistoryParams', 'dCopyElement', 'dPage', 'dZoom']),
    undoable() {
      return !(this.dHistoryParams.index === -1 || (this.dHistoryParams === 0 && this.dHistoryParams.length === this.dHistoryParams.maxLength))
    },
    redoable() {
      return !(this.dHistoryParams.index === this.dHistoryParams.length - 1)
    },
    templateVisible() {
      return this.$store.state.epd.templateVisible
    },
    templateId() {
      return this.$store.state.epd.templateId
    },
    noMenu() {
      return this.$store.state.epd.templateMode === 1
    },
    editImgVisible() {
      return this.$store.state.epd.editImgVisible
    },
    imgs() {
      return this.$store.state.epd.imgs
    },
    imgIndex() {
      return this.$store.state.epd.imgIndex
    },
  },
  watch: {
    templateVisible(n) {
      if (n) {
        this.initGroupJson(JSON.stringify(wGroup.setting))
        window.addEventListener('scroll', this.fixTopBarScroll)
        // window.addEventListener('click', this.clickListener)
        document.addEventListener('keydown', this.handleKeydowm, false)
        document.addEventListener('keyup', this.handleKeyup, false)
        this.loadData()
      } else {
        window.removeEventListener('scroll', this.fixTopBarScroll)
        // window.removeEventListener('click', this.clickListener)
        document.removeEventListener('keydown', this.handleKeydowm, false)
        document.removeEventListener('keyup', this.handleKeyup, false)
        document.oncontextmenu = null
      }
    },
    templateId(n) {
      // ;(this.$refs as any)?.zoomControl.screenChange()
      // this?.$nextTick?.()
      // this.selectWidget({
      //   uuid: '-1',
      // })
    },
    // $route() {
    //   if (this.$props.visible) {
    //     this.initGroupJson(JSON.stringify(wGroup.setting))
    //     window.addEventListener('scroll', this.fixTopBarScroll)
    //     // window.addEventListener('click', this.clickListener)
    //     document.addEventListener('keydown', this.handleKeydowm, false)
    //     document.addEventListener('keyup', this.handleKeyup, false)
    //     this.loadData()
    //   }
    // },
  },
  mounted() {
    // this.initGroupJson(JSON.stringify(wGroup.setting))
    // window.addEventListener('scroll', this.fixTopBarScroll)
    // // window.addEventListener('click', this.clickListener)
    // document.addEventListener('keydown', this.handleKeydowm, false)
    // document.addEventListener('keyup', this.handleKeyup, false)
    // this.loadData()
  },
  // beforeUnmount() {
  //   window.removeEventListener('scroll', this.fixTopBarScroll)
  //   // window.removeEventListener('click', this.clickListener)
  //   document.removeEventListener('keydown', this.handleKeydowm, false)
  //   document.removeEventListener('keyup', this.handleKeyup, false)
  //   document.oncontextmenu = null
  // },
  methods: {
    ...mapActions(['selectWidget', 'initGroupJson', 'handleHistory']),
    saveAs(data: any) {
      this.$emit('save', data)
    },
    editImgDone: (base64) => {
      const _imgs = [...this.imgs.value]
      const _index = this.imgIndex.value
      _imgs.value[_index] = base64
      this.$store.commit('setState', { key: 'editImgVisible', value: false })
      this.$store.commit('setState', { key: 'imgs', value: _imgs })
    },
    handleClose() {
      this.$emit('close')
      // this.$store.commit('setState', { key: 'templateVisible', value: false })
    },
    toggleMode(mode: number) {
      this.$store.commit('setState', { key: 'templateMode', value: mode })
    },
    changeLineGuides() {
      this.showLineGuides = !this.showLineGuides
    },
    downloadCancel() {
      this.downloadPercent = 0
      this.isContinue = false
    },
    async loadData() {
      // 初始化加载页面
      // const { id, tempid, tempType } = this.$route.query
      setTimeout(() => {
        this?.$refs?.options?.load?.(null, null, null, async () => {
          ;(this.$refs as any).zoomControl.screenChange()
          await this.$nextTick()
          // 初始化激活的控件为page
          this.selectWidget({
            uuid: '-1',
          })
        })
        // ;(this.$refs as any)?.options?.load?.(id, tempid, tempType, async () => {
        //   ;(this.$refs as any).zoomControl.screenChange()
        //   await this.$nextTick()
        //   // 初始化激活的控件为page
        //   this.selectWidget({
        //     uuid: '-1',
        //   })
        // })
      }, 50)
    },
    zoomSub() {
      ;(this.$refs as any).zoomControl.sub()
    },
    zoomAdd() {
      ;(this.$refs as any).zoomControl.add()
    },
    save() {
      ;(this.$refs as any).options.save()
    },
    fixTopBarScroll() {
      const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
      this.style.left = `-${scrollLeft}px`
    },
    clickListener(e) {
      console.log('click listener', e)
    },
    optionsChange({ downloadPercent, downloadText }: any) {
      this.downloadPercent = downloadPercent
      this.downloadText = downloadText
    },
  },
})
</script>

<style lang="less" scoped>
@import url('@/assets/styles/design.less');
</style>
