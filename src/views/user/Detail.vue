<template>
  <el-card class="box-card profile" v-loading="loading">
    <h2>{{ detail.username }}</h2>
    <el-alert
      v-if="detail.robot"
      title="这是系统自动生成的用户，你可以登录并验证身份后绑定此账号"
      type="info"
      effect="dark"
    >
    </el-alert>
  </el-card>

  <el-card style="padding-top: 30px">
    <h4>参加的计划</h4>
    <el-table
      v-loading="loading"
      :data="detail.steps"
      stripe
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="120"> </el-table-column>
      <el-table-column prop="name" label="Name" min-width="180">
        <template #default="scope">
          <router-link :to="{ name: 'set', params: { id: scope.row.id } }">
            {{ scope.row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="class" label="Class" width="180"> </el-table-column>
      <el-table-column prop="nickname" label="Nickname" width="180"> </el-table-column>
    </el-table>
  </el-card>

  <el-card style="padding-top: 30px">
    <h4>绑定的账号</h4>
    <el-table
      v-loading="loading"
      :data="detail.bind_users"
      stripe
      style="width: 100%"
    >
      <el-table-column prop="source" label="Source" width="120">
      </el-table-column>
      <el-table-column prop="username" label="Username" min-width="180">
        <template #default="scope">
          <a :href="scope.row.link" target="_blank">
            {{ scope.row.username }}
          </a>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from "../../request";

export default defineComponent({
  name: "UserDetail",
  data() {
    return {
      loading: true,
      username: this.$route.params.username,
      detail: {},
    };
  },
  created() {
    document.title = this.username + " - StepByStep";
    this.fetchUserDetail();
  },
  methods: {
    async fetchUserDetail() {
      this.loading = true;
      const resp = await request.get(`/user/${this.username}`);
      this.detail = resp.data;
      this.loading = false;
    },
  },
});
</script>

<style scoped>
.profile {
  text-align: center;
}
</style>