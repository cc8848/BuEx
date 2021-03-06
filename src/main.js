import Vue from 'vue'
import iView from 'iview'
import { router } from './router/index'
import { appRouter } from './router/router'
import store from './store'
import App from './app.vue'
import '@/locale'
import 'iview/dist/styles/iview.css'
import VueI18n from 'vue-i18n'
import util from './libs/util'
import Enumerable from 'linq'

Vue.use(VueI18n)
Vue.use(iView)

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App),
  data: {
    currentPageName: ''
  },
  mounted() {
    console.log('main.js:开始')
    this.currentPageName = this.$route.name
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList')
    this.$store.commit('initCachepage')
    // 权限菜单过滤相关
    this.$store.commit('updateMenulist')
    // iview-admin检查更新
    // util.checkUpdate(this);

    //在此获取基础数据，为了提升进入程序后的体验提升
    //获取支持的货币
    util.get('/common/currencys').then(res => {
      if (res.status == '200' && res.data.meta.message === 'success') {
        console.log('/common/currencys')
        this.$store.commit('initCurs', res.data.data)
      }
    })
    //获取交易对
    util.get('/common/pairs').then(res => {
      console.log('/common/pairs')
      let list = Enumerable.from(res.data.data)
        .groupBy('$.quoteCurrency')
        .log()
        .toArray()

      console.log('pair', list)
      this.$store.commit('initPairs', list)

      // console.log(list)
    })
    console.log('main.js:结束')
  },
  created() {
    let tagsList = []
    appRouter.map(item => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0])
      } else {
        tagsList.push(...item.children)
      }
    })
    this.$store.commit('setTagsList', tagsList)
  }
})
