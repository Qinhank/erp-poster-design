import { createStore } from 'vuex'

import base from './modules/base'
import design from './modules/design'

export default createStore({
  ...base,
  modules: {
    design,
  },
})

// export function createMyStore() {
//   return createStore({
//     ...base,
//     modules: {
//       design,
//     },
//   })
// }
