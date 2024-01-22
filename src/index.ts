// index.js
import erpStore from './store'
import ErpPosterDesign from './views/Home.vue'
import utils from './utils'
import 'normalize.css/normalize.css'
import './global.css'
import '@/assets/styles/index.less'
// import 'element-plus/dist/index.css'
// import elementConfig from './utils/widgets/elementConfig'
// import registerModule from '@/components/modules/index'

const MyPlugin = {
  install(app: any) {
    const vue = app
    // if (typeof window !== 'undefined' && window?.Vue) {
    //   // window.Vue.use(install)
    //   vue = window?.Vue
    // }
    // if (!store) {
    //   console.error('Please provide a Vuex store.')
    //   return
    // }

    // elementConfig.components.forEach((component) => {
    //   vue.component(component.name, component)
    // })

    // elementConfig.plugins.forEach((plugin: any) => {
    //   vue.use(plugin)
    // })

    // utils.install(app)
    vue.use(erpStore)
    vue.use(utils)
    // 注册 Vuex 模块
    // store.registerModule('epd', erpStore)
    // console.log(store)
    // registerModule(vue)

    // 注册组件
    vue.component('ErpPosterDesign', ErpPosterDesign)
  },
}

export default MyPlugin
