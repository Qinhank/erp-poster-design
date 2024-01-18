/*
 * @Author: ShawnPhang
 * @Date: 2021-12-16 16:20:16
 * @Description:
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-28 17:42:25
 */
import mutations from './mutations'
import actions from './actions'
import _config from '@/config'

const all = {
  state: {
    loading: null,
    online: true, // 登录状态，
    user: {
      name: localStorage.getItem('username'),
    }, // 储存用户信息
    scroll: true,
    manager: '', // 是否为管理员模式
    tempEditing: true, // 管理员是否正在编辑模板
    fonts: [], // 缓存字体列表
    app: null, // 抠图服务
    imgs: [],
    imgIndex: 0,
    editImgVisible: false,
    imageCutoutVisible: false,
    imageCutoutRaw: null,
    imageCutoutResult: null,
    templateVisible: false,
    templateMode: 1,
    templateId: null,
    templateDate: Date.now(),
  },
  getters: {
    online: (state: any) => {
      console.log(state)
      return state.online
    },
    user: (state: any) => {
      return state.user
    },
    manager: (state: any) => {
      return state.manager
    },
    tempEditing: (state: any) => {
      return state.tempEditing
    },
    fonts: (state: any) => {
      return state.fonts
    },
  },
  mutations: {
    ...mutations,
  },
  actions: {
    ...actions,
  },
}
export default all
