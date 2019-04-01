import Vue from "vue";
import './plugins/axios';
import moment from 'moment';
import App from "./App.vue";
import "./registerServiceWorker";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

Vue.prototype.moment = moment