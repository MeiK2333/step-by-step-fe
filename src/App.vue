<template>
  <el-container class="main">
    <el-header class="header">
      <div class="header-row">
        <router-link to="/">StepByStep</router-link>
        <router-link :to="{ name: 'groups', params: {} }">Groups</router-link>
        <router-link :to="{ name: 'about', params: {} }">About</router-link>
        <router-link v-if="isAdmin" :to="{ path: '/admin', params: {} }"
          >Admin</router-link
        >
      </div>
    </el-header>

    <el-main class="content">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from 'vuex';

export default defineComponent({
  setup() {},
  created() {
    this.$store.dispatch("user");
  },
  computed: {
    ...mapGetters([
      'isAdmin',
    ])
  },
});
</script>


<style>
a {
  color: #337ab7;
  text-decoration: none;
}
a:hover {
  color: #1890ff;
}
body,
html,
#app {
  margin: 0px !important;
  height: 100%;
}
.main {
  border: 1px solid #eee;
  display: flex;
  height: 100%;
  flex-direction: column;
  flex: auto;
  background-color: #f4f4f4;
}
@media (min-width: 1024px) {
  .content {
    padding: 20px 50px 20px 50px;
  }
}
.header {
  padding: 0 50px;
  height: 60px;
  background-color: #fff;
  font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI,
    PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica,
    Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
}
.header-row a {
  font-size: 14px;
  line-height: 60px;
  color: rgba(0, 0, 0, 0.75);
  outline: none;
  cursor: pointer;
  text-decoration: none;
  padding: 20px 20px 20px 20px;
}
.header-row a:hover {
  color: #1890ff;
}
.header-row a:first-child {
  font-weight: 600;
  font-size: 16px;
}
</style>