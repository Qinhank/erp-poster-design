<template>
  <select-template v-if="isShow" @close="closeModal" />
</template>

<script setup lang="ts">
import { onMounted, defineProps, watch, computed, defineEmits } from 'vue'
// import store from '@/store'
import { useStore } from 'vuex'
import { ElMessageBox } from 'element-plus'
import SelectTemplate from './components/SelectTemplate.vue'

const imgBaseUrl = 'https://cdn.erp.jinweitec.com/'
const imgMaterialUrl = 'https://cdn.material.jinweitec.com/' // 素材图片

function fillUrl(_url: any, w?: any, h?: any, quality?: any) {
  let url = _url
  if (!url) {
    return ''
  }
  if (url?.indexOf('/') === 0) {
    url = url.substr(1, url.length)
  }

  if (!url?.includes('http')) {
    url = `${imgBaseUrl}${url}`
  } else if (url?.includes('//erpcdn.3927qp.com/')) {
    // console.log('fillUrl url', url)
    // erpcdn.3927qp.com/ => https://cdn.jinweitec.com/erpsys/

    return url.replace(/http(s)?:\/\/erpcdn.3927qp.com\//g, 'https://cdn.jinweitec.com/erpsys/')
  }
  if (url?.includes(imgBaseUrl) || url?.includes(imgMaterialUrl)) {
    if (w && h && quality) {
      return `${url}?imageMogr2/thumbnail/${w}x${h}!|imageMogr2/gravity/center/crop/${w}x${h}/format/webp/interlace/0/quality/${quality}`
    }
    if (w && h) {
      return `${url}?imageMogr2/crop/${w}x${h}`
    }
    if (w) {
      return `${url}?imageMogr2/thumbnail/${w}x|imageMogr2/gravity/northwest/crop/${w}x${w}/rotate/0/strip/interlace/0`
    }
    if (quality) {
      return `${url}?imageMogr2/format/webp/interlace/0/quality/${quality}`
    } else {
      return url
    }
  } else {
    return url
  }
}

const store = useStore()
const props = defineProps(['companyId', 'data', 'config', 'modelValue'])
const emits = defineEmits('close', 'update:modelValue', 'save')

const data = computed(() => props.data)
const isShow = computed(() => props.modelValue)
const templateVisible = computed(() => store.state.epd.templateVisible)

watch(
  () => data.value,
  (n) => {
    if (n?.slider_image) {
      const imgs = n?.slider_image?.split(',')
      store.commit(
        'setImg',
        imgs.map((_) => fillUrl(_)),
      )
      store.commit('setState', { key: 'templateData', value: n })
      // ElMessageBox.alert('当前产品未发现slider_image，请重新选择', '不可选', {
      //   // if you want to disable its autofocus
      //   // autofocus: false,
      //   confirmButtonText: '我知道了',
      // })
    }
    // store.commit('setImg', n)
  },
)

watch(
  () => isShow.value,
  (n) => {
    if (n) {
      store.commit('setState', { key: 'templateVisible', value: true })
      store.commit('setState', { key: 'templateMode', value: 1 })
      store.commit('setState', { key: 'templateDate', value: Date.now() })
    }
  },
)

// watch(
//   () => templateVisible.value,
//   (n) => {
//     console.log('n', n)
//   },
// )

const closeModal = () => {
  store.dispatch('selectWidget', { uuid: '-1' })
  emits('update:modelValue', false)
  store.commit('setState', { key: 'templateVisible', value: false })
}

const save = (data: any) => {
  console.log(66666)
  // emits('save', data)
}

onMounted(() => {
  if (props.companyId) {
    localStorage.setItem('CompanyId', props.companyId)
  }
  if (props.config) {
    for (const key in props.config) {
      if (Object.prototype.hasOwnProperty.call(props.config, key)) {
        const val = props.config[key]
        localStorage.setItem(key, val)
      }
    }
  }
})
</script>

<style>
.el-dialog__body {
  padding: 0;
}
</style>
