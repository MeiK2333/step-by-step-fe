<template>
  <el-card class="box-card" v-loading="loading">
    <h1>Hello {{ detail.name }}</h1>
  </el-card>

  <el-card class="box-card" style="padding-top: 30px">
    <el-table v-loading="set_loading" :data="set" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="120"> </el-table-column>
      <el-table-column prop="name" label="Name" min-width="180">
        <template #default="scope">
          <router-link :to="{ name: 'set', params: { id: scope.row.id } }">
            {{ scope.row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="source" label="Source" width="180">
      </el-table-column>
      <el-table-column prop="userCount" label="Users" width="180">
      </el-table-column>
      <el-table-column prop="problemCount" label="Prob." width="180">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from "../../request";

export default defineComponent({
  name: "GroupDetail",
  data() {
    return {
      loading: true,
      set_loading: true,
      id: Number(this.$route.params.id),
      detail: {
        name: "",
      },
      set: [],
    };
  },
  created() {
    this.fetchDetail();
    this.fetchSet();
  },
  methods: {
    async fetchDetail() {
      this.loading = true;
      const resp = await request.get(`/group/${this.id}`);
      this.detail = resp.data;
      document.title = this.detail.name + " - StepByStep";
      this.loading = false;
    },
    async fetchSet() {
      this.set_loading = true;
      const resp = await request.get(`/group/${this.id}/steps`);
      this.set = resp.data;
      this.set_loading = false;
    },
  },
});
</script>
