import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import store from './store';
import App from './app.vue';
import 'iview/dist/styles/iview.css';

Vue.use(iView);

//将毫秒数转换成年月日
Vue.filter('ConvertTime', function (value) {
    if (!value) return ''
    let date=new Date(value);
      let str="";
      let year = date.getFullYear();
      let month= date.getMonth()+1;
      let day = date.getDate();
      str=year+'/'+month+"/"+day;
      return str
})
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    mounted () {
        this.$store.commit('updateMenulist');
    }
});
