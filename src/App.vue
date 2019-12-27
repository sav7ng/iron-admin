<template>
  <div id="app">
    <!-- <img src="./assets/logo.png" />
    <a-button type="primary">Button</a-button> -->
    <LOGIN />
  </div>
</template>

<script>
import LOGIN from "./components/Login.vue";
export default {
  name: "app",
  components: {
    LOGIN
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
