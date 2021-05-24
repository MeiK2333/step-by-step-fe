<template>
  <card class="box-card">
    <el-table v-loading="loading" :data="groupList" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="120"> </el-table-column>
      <el-table-column prop="code" label="Code" width="180"> </el-table-column>
      <el-table-column prop="name" label="Name" min-width="180">
        <template #default="scope">
          <router-link :to="{ name: 'group', params: { id: scope.row.id } }">
            {{ scope.row.name }}
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from '../../request';

export default defineComponent({
  name: "Groups",
  data() {
    return {
      loading: true,
      groupList: [],
    };
  },
  created() {
    this.fetchGroups();
  },
  methods: {
    async fetchGroups() {
      this.loading = true;
      const resp = await request.get("/groups");
      this.groupList = resp.data;
      this.loading = false;
    },
  },
});
</script>
