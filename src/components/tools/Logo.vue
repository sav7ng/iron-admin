<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <!-- <LogoSvg alt="logo" /> -->
      <h1 class="iron-logo" v-if="showTitle">iRON</h1>
      <h1 v-if="showTitle" :style="{'padding-left': '10px'}">Dashboard</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      default: 'iRON    Dashboard',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
