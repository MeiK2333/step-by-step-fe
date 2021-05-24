<template>
  <h4>最近的提交</h4>
  <el-table v-loading="loading" :data="solutions" stripe style="width: 100%">
    <el-table-column prop="source" label="Source" width="120">
    </el-table-column>
    <el-table-column prop="username" label="User" width="180">
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
    <el-table-column prop="code_len" label="Len." width="80"> </el-table-column>
    <el-table-column prop="language" label="Lang." width="80">
    </el-table-column>
    <el-table-column prop="submitted_at" label="At" width="180">
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from "../request";

export default defineComponent({
  props: ["username", "size"],
  data() {
    const limit = this.size ? this.size : 20;
    return {
      loading: false,
      limit,
      solutions: [],
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      const url = this.username
        ? `/solutions?username=${this.username}&limit=${this.limit}`
        : `/solutions?limit=${this.limit}`;
      const resp = await request.get(url);
      this.solutions = resp.data;
      this.loading = false;
    },
  },
});
</script>