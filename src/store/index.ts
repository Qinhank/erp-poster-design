// import { createStore } from 'vuex'

import base from './modules/base'
import design from './modules/design'

// const storeOptions = {
//   namespaced: false,
//   ...base,
//   modules: {
//     design,
//   },
// }

export function useMystore(store: any) {
  window.store = store
  store.registerModule('epd', { namespaced: false, ...base })
  store.registerModule('design', { namespaced: false, ...design })
  // window.store.state = store.state.epd
}

export default base
// export function createMyStore() {
//   return createStore({
//     ...base,
//     modules: {
//       design,
//     },
//   })
// }
