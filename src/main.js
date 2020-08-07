import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './common/myaxios'
import './plugins/element'
import TreeTable from 'vue-table-with-tree-grid'
//富文本
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.prototype.$axios = axios
Vue.component('tree-table',TreeTable)
Vue.config.productionTip = false
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
