import Vue from "vue";
import {
  Button,
  Input
} from "ant-design-vue";
import App from "./App";

Vue.component(Button.name, Button);
Vue.component(Input.name, Input);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");