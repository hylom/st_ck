import Vue from 'vue';

import mainView from './main-view.vue';
import itemEditor from './item-editor.vue';

function bootstrap() {
  Vue.component('main-view', mainView);
  Vue.component('item-editor', itemEditor);
  const vm = new Vue({el: "#main-frame"});
}

// global.bootstrap = bootstrap;
window.addEventListener('load', ev => {
  bootstrap();
});
