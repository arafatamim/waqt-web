import Vue from "vue";
import './plugins/axios';
import moment from 'moment';
import App from "./App.vue";
import "./registerServiceWorker";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCog, faTimesCircle, faTimes, faRedo, faSave, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTimesCircle, faCog, faTimes, faRedo, faSave, faGithub, faCoffee);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

Vue.prototype.moment = moment