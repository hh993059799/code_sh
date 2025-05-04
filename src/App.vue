<template>
  <div id="app">
      <main-layout v-if="isAdmin">
          <router-view></router-view>
      </main-layout>
      <div v-else>
          <router-view></router-view>
      </div>
  </div>
</template>


<script>
import MainLayout from './layout/layout';
export default {
  components: { MainLayout },
  data() {
      return {
          isAdmin: false
      }
  },
  watch: {
      $route: {
          handler: function (val) {
              console.log(val);
              if (val.meta.type == 'admin') {
                  this.isAdmin = true
              } else {
                  this.isAdmin = false
              }
          },
          // 深度观察监听
          deep: true,
          immediate: true
      }
  },
}
</script>

<style lang="less">
#app{
    min-width: 1700px;
}

</style>