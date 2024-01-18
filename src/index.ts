// index.js
import erpStore from './store'
import ErpPosterDesign from './views/Home.vue'
import utils from './utils'
import 'normalize.css/normalize.css'
import './global.css'
import '@/assets/styles/index.less'
// import elementConfig from './utils/widgets/elementConfig'

const MyPlugin = {
  install(app: any, { store }: any) {
    if (!store) {
      console.error('Please provide a Vuex store.')
      return
    }

    utils.install(app)
    app.use(erpStore)
    // 注册 Vuex 模块
    // store.registerModule('epd', erpStore)
    // console.log(store)

    // 注册组件
    app.component('ErpPosterDesign', ErpPosterDesign)
  },
}

export default MyPlugin
