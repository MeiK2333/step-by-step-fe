<template>
  <el-card class="box-card">
    <template v-if="!logged">
      您还没登录，<a :href="loginUrl">点击登录</a>
    </template>
    <template v-else>
      欢迎你，{{ $store.state.user.username }}
      <router-link
        :to="{ name: 'user', params: { username: $store.state.user.username } }"
        >个人页面</router-link
      >
    </template>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from "../request";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "Home",
  data() {
    return {
      loginUrl:
        "https://github.com/login/oauth/authorize?client_id=1db4aae055b7d417f366",
      code: this.$route.query.code,
    };
  },
  computed: {
    ...mapGetters(["logged"]),
  },
  created() {},
  methods: {
    async logout() {
      //@ts-ignore
      this.$store.commit("logout");
      this.$router.go(0);
    },
  },
});
</script>
