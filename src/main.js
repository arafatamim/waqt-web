import Vue from "vue";
import './plugins/axios';
import moment from 'moment';
import App from "./App.vue";
import "./registerServiceWorker";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCog, faTimesCircle, faTimes, faRedo, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTimesCircle, faCog, faTimes, faRedo, faSave);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

Vue.prototype.moment = moment