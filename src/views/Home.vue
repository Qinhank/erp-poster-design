<template>
  <select-template @close="closeModal" />
</template>

<script setup lang="ts">
import { onMounted, defineProps, watch, computed, defineEmits } from 'vue'
import store from '@/store'
import SelectTemplate from './components/SelectTemplate.vue'

const props = defineProps(['companyId', 'data', 'config', 'modelValue'])
const emits = defineEmits('close', 'update:modelValue')

const data = computed(() => props.data)
const isShow = computed(() => props.modelValue)

watch(
  () => data.value,
  (n) => {
    store.commit('setImg', n)
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

const closeModal = () => {
  emits('update:modelValue', false)
  store.commit('setState', { key: 'templateVisible', value: false })
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
