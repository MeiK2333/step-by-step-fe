<template>
  <el-card class="box-card"
    ><el-alert v-if="error" :title="error" type="error" effect="dark"> </el-alert>
    从远程服务器获取登录状态中，请稍候～
  </el-card>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ElMessage } from "element-plus";
import request from "./../../request";

export default defineComponent({
  setup() {},
  data() {
    return {
      error: "",
    };
  },
  computed: {
    logged() {
      //@ts-ignore
      return this.$store.state.logged;
    },
  },
  created() {
    const code = this.$route.query.code;
    if (!code) {
      ElMessage.error("请先登录");
      this.$router.push({ name: "home" });
      return;
    }
    this.login();
  },
  methods: {
    async login() {
      const code = this.$route.query.code;
      try {
        const resp = await request.get(`/login?code=${code}`);
        //@ts-ignore
        this.$store.commit("login", resp.data.access_token);
        this.$router.push({ name: "home" });
      } catch (e) {
        this.error = `登录失败：${e}`;
      }
    },
  },
});
</script>
