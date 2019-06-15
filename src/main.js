import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import './registerServiceWorker';
import 'typeface-poppins';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faRedo, faSave, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCog, faRedo, faSave, faTimesCircle, faGithub);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');
