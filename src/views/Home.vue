<template>
  <el-card class="box-card">
    <template v-if="!logged">
      您还没登录，<router-link :to="{ name: 'login' }">点击登录</router-link>
    </template>
    <template v-else>
      欢迎你，{{ $store.state.user.username }}
      <router-link
        :to="{ name: 'user', params: { username: $store.state.user.username } }"
        >个人页面</router-link
      >，
      <a @click="$store.commit('logout')">退出</a>
    </template>
  </el-card>
  <el-card class="box-card" style="padding-top: 30px">
    <h3>最近更新的提交</h3>
    <el-table v-loading="loading" :data="solutions" stripe style="width: 100%">
      <el-table-column prop="source" label="Source" width="120">
      </el-table-column>
      <el-table-column prop="username" label="Username" width="180">
        <template #default="scope">
          <router-link
            :to="{ name: 'user', params: { username: scope.row.username } }"
          >
            {{ scope.row.username }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="Nickname" width="180">
      </el-table-column>
      <el-table-column prop="problem_id" label="Prob." width="120">
        <template #default="scope">
          <a :href="scope.row.link" target="_blank">
            {{ scope.row.problem_id }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="Title" min-width="180">
        <template #default="scope">
          <a :href="scope.row.link" target="_blank">
            {{ scope.row.title }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="Res." width="180">
        <template #default="scope">
          <template v-if="scope.row.result === 'Accepted'">
            <span style="color: green">{{ scope.row.result }}</span>
          </template>
          <template v-else>
            <span style="color: red">{{ scope.row.result }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="time_used" label="Time" width="80">
      </el-table-column>
      <el-table-column prop="memory_used" label="Mem." width="80">
      </el-table-column>
      <el-table-column prop="code_len" label="Len." width="80">
      </el-table-column>
      <el-table-column prop="language" label="Lang." width="80">
      </el-table-column>
      <el-table-column prop="submitted_at" label="At" width="180">
      </el-table-column>
    </el-table>
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
      loading: true,
      solutions: [],
    };
  },
  computed: {
    ...mapGetters(["logged"]),
  },
  created() {
    this.fetchSolutions();
  },
  methods: {
    async logout() {
      //@ts-ignore
      this.$store.commit("logout");
      this.$router.go(0);
    },
    async fetchSolutions() {
      this.loading = true;
      const resp = await request.get("/solutions");
      this.solutions = resp.data;
      this.loading = false;
    },
  },
});
</script>

<style scoped>
.box-card {
  font-family: "Helvetica Neue", Helvetica, "Microsoft Yahei", Arial, sans-serif;
}
</style>