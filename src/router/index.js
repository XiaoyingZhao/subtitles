import Vue from 'vue'
import Router from 'vue-router'
import subtitles from '../components/module/subtitles'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/subtitles',
      name: 'subtitles',
      component: subtitles
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    // 如果未匹配到路由
    // 如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
    from.name ? next({ name: from.name }) : next('/')
  } else {
    // 如果匹配到正确跳转
    next()
  }
})
export default router
