<template>
  <div class="flex" @click="onSelectImg">
    <img v-for="(item, index) in imgs" :key="index" :src="item" alt="" style="width: 200px" />
  </div>
  <select-template :visible="dialogVisible" />
  <EditImg :visible="editImgVisible" @done="editImgDone" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import store from '@/store'
import SelectTemplate from './components/SelectTemplate.vue'
import EditImg from './components/EditImg.vue'

const imgs = ref(['https://cdn.erp.jinweitec.com/erpsys/FqDRsgZqneFWmC_e7Y78qJ1_s1j-?imageMogr2/format/webp/interlace/0/quality/50', 'https://cdn.erp.jinweitec.com/erpsys/Fu4UAygYcP1b1yeSREnFi64DWi0f?imageMogr2/format/webp/interlace/0/quality/50'])
const dialogVisible = ref(false)
const editImgVisible = ref(false)

const onSelectImg = () => {
  store.commit('setImg', imgs.value)
  dialogVisible.value = true
}

const editImgDone = (base64) => {
  imgs.value[0] = base64
  editImgVisible.value = false
}

onMounted(() => {
  setTimeout(() => {
    editImgVisible.value = true
  }, 1000)
})
</script>

<style>
.el-dialog__body {
  padding: 0;
}
</style>
