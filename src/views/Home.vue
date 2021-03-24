<template>
  <el-card class="box-card">
    <template v-if="!logged">
      您还没登录，<a :href="loginUrl">点击登录</a>
    </template>
    <template v-else>
      欢迎你，{{ user.nickname }}
      <el-popconfirm title="确定要退出登录吗？">
        <template #reference>
          <a href="javascript:void(0)" @click="logout">退出登录</a>
        </template>
      </el-popconfirm>
    </template>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from "../request";

export default defineComponent({
  name: "Home",
  data() {
    return {
      loginUrl:
        "https://github.com/login/oauth/authorize?client_id=1db4aae055b7d417f366",
      code: this.$route.query.code,
      user: {
        nickname: "",
        username: "",
        email: "",
        id: 0,
      },
    };
  },
  computed: {
    logged() {
      //@ts-ignore
      return this.$store.state.access_token && this.$store.state.access_token.length > 0;
    },
  },
  created() {
    //@ts-ignore
    if (this.logged) {
      this.fetchMe();
    }
  },
  methods: {
    async fetchMe() {
      const resp = await request.get("/me");
      this.user = resp.data;
      console.log(resp.data);
    },
    async logout() {
      //@ts-ignore
      this.$store.commit("logout");
      this.$router.go(0);
    },
  },
});
</script>
