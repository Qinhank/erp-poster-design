/*
 * @Author: ShawnPhang
 * @Date: 2021-07-13 02:48:38
 * @Description:
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-03-07 20:25:54
 */
// import store from '../store'
import * as services from '../api/index'
import * as utils from './utils'
import _config from '@/config'
import modules from './plugins/modules'
import cssLoader from './plugins/cssLoader'

/**
 * 全局组件方法
 */
export default {
  install(myVue: Type.Object) {
    /** 全局组件注册 */
    modules(myVue)
    /** iconfont 注入 */
    cssLoader(_config.ICONFONT_EXTRA)
    cssLoader(_config.ICONFONT_URL)

    myVue.config.globalProperties.$ajax = services

    myVue.config.globalProperties.$utils = utils

    // myVue.config.globalProperties.$bus =

    // myVue.prototype.$Ilist = List;
    // myVue.prototype.$Imap = mmap;
  },
}
