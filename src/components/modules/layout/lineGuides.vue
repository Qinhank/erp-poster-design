<!--
 * @Author: ShawnPhang
 * @Date: 2022-04-08 10:31:34
 * @Description:  
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-29 18:07:40
-->
<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { useStore } from 'vuex'
import Guides from '@scena/guides'

export default defineComponent({
  props: ['show'],
  setup(props) {
    const store = useStore()
    const container = 'page-design' // page-design out-page
    let guidesTop: any = null
    let guidesLeft: any = null

    watch(
      () => props.show,
      (open) => {
        open ? render() : destroy()
      },
    )

    watch(
      () => store.getters.dZoom,
      () => {
        changeScroll()
      },
    )

    // onMounted(() => {
    //   // let scrollX = 0
    //   // let scrollY = 0
    //   // window.addEventListener('resize', () => {
    //   //   guides.resize()
    //   // })
    //   // window.addEventListener('wheel', (e) => {
    //   //   scrollX += e.deltaX
    //   //   scrollY += e.deltaY
    //   //   guides.scrollGuides(scrollY)
    //   //   guides.scroll(scrollX)
    //   // })
    // })

    function destroy() {
      guidesTop.destroy()
      guidesLeft.destroy()
      guidesTop = null
      guidesLeft = null
    }
    function render() {
      const sameParams: any = {
        backgroundColor: '#f9f9fa',
        lineColor: '#bec2c7',
        textColor: '#999999',
        // direction: 'start',
        // height: 30,
        displayDragPos: true,
        dragPosFormat: (v: any) => v + 'px',
      }
      guidesTop = new Guides(document.getElementById(container), {
        ...sameParams,
        type: 'horizontal',
        className: 'my-horizontal',
      }).on('changeGuides', (e) => {
        console.log(e, e.guides)
        // const el = document.getElementById('out-page')
        // const top = 20 + (el?.offsetTop || 0)
        // store.commit('updateGuidelines', { horizontalGuidelines: e.guides.map((x) => x + top) })
      })

      guidesLeft = new Guides(document.getElementById(container), {
        ...sameParams,
        type: 'vertical',
        className: 'my-vertical',
      }).on('changeGuides', (e) => {
        console.log(e, e.guides)
        // store.commit('updateGuidelines', { verticalGuidelines: e.guides })
      })

      changeScroll()
    }
    function changeScroll() {
      if (guidesTop && guidesLeft) {
        const zoom = store.getters.dZoom / 100
        guidesTop.zoom = zoom
        guidesLeft.zoom = zoom
        if (zoom < 0.9) {
          guidesTop.unit = Math.floor(1 / zoom) * 50
          guidesLeft.unit = Math.floor(1 / zoom) * 50
        }
        setTimeout(() => {
          const el = document.getElementById('out-page')
          const left = 60 + (el?.offsetLeft || 0)
          const top = 30 + (el?.offsetTop || 0)
          guidesTop.scroll(-left / zoom)
          guidesTop.scrollGuides(-top / zoom)
          guidesLeft.scroll(-top / zoom)
          guidesLeft.scrollGuides(-(left - 30) / zoom)
        }, 300)
      }
    }
  },
})
</script>

<style lang="less" scoped>
// :deep(.shortLineSize) {
//   height: 1px !important;
// }
.my-horizontal,
.my-vertical {
  position: absolute !important;
  z-index: 99;
}
.my-horizontal {
  left: 0px;
  top: 0;
  width: calc(100% - 30px);
  height: 30px !important;
}
.my-vertical {
  top: 30px;
  left: 0px;
  height: calc(100% - 60px);
  width: 30px !important;
}
</style>
