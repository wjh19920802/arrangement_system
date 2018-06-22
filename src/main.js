import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import util from '@/libs/util';
import { VirtualScroller } from 'vue-virtual-scroller';
import axios from 'axios'
import Cookies from 'js-cookie'

// import axios from 'axios'
axios.defaults.headers.common['accessToken'] = Cookies.get('accessToken');
Vue.prototype.$http = axios;

Vue.use(iView);
Vue.component('virtual-scroller', VirtualScroller);


new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
        // iview-admin检查更新
        // util.checkUpdate(this);
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);

      axios.defaults.timeout = 15000
      axios.interceptors.request.use((config)=>{
        this.$Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {
                'class': 'demo-spin-icon-load',
                props: {
                  type: 'load-c',
                  size: 38
                }
              }),
              h('div', '努力加载中...')
            ])
          }
        });
        return config;
      },(error)=>{
        //对返回的错误进行一些处理
        this.$Spin.hide();
        return Promise.reject(error);
      });

      axios.interceptors.response.use((response)=>{
        this.$Spin.hide();
        /*console.log('response',response);
        if(response.data.code == 403) {
          Cookies.set('url',window.location.href);
          let vm = this;
          setTimeout(function(){
            vm.$router.push({
              name:'login'
            });
          },1500)
        }*/
        return response;
      },(error)=>{
        //对返回的错误进行一些处理
        this.$Spin.hide();
        return Promise.reject(error);
      });
    }
});
