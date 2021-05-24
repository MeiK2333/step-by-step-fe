<template>
  <card class="box-card">
    <el-table v-loading="loading" :data="groupList" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="120"> </el-table-column>
      <el-table-column prop="code" label="Code" width="180"> </el-table-column>
      <el-table-column prop="name" label="Name" min-width="180">
      </el-table-column>
      <el-table-column label="Operation">
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            @click="toStepAdmin(scope.row, scope.$index)"
            >计划管理</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="changeGroup(scope.row, scope.$index)"
            >修改</el-button
          >
          <el-popconfirm
            :title="`确定要删除 ${scope.row.code} - ${scope.row.name} ？`"
            @confirm="deleteGroup(scope.row)"
          >
            <template #reference>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 20px">
      <el-button @click="dialogNewFormVisible = true">新增</el-button>
    </div>
  </card>

  <el-dialog title="Edit" v-model="dialogFormVisible" @close="fetchGroups">
    <el-form>
      <el-form-item label="Code">
        <el-input
          v-model="groupList[selectGroupIdx].code"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="Name">
        <el-input
          v-model="groupList[selectGroupIdx].name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="postChangeGroup">确 定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog title="New" v-model="dialogNewFormVisible" @close="fetchGroups">
    <el-form>
      <el-form-item label="Code">
        <el-input v-model="newGroup.code" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Name">
        <el-input v-model="newGroup.name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogNewFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="postNewGroup">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from "../../request";

export default defineComponent({
  setup() {},
  data() {
    const groupList: any[] = [];
    return {
      loading: true,
      groupList,
      selectGroupIdx: 0,
      dialogFormVisible: false,
      dialogNewFormVisible: false,
      newGroup: {
        name: "",
        code: "",
      },
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
    async deleteGroup(row: any) {
      const resp = await request.delete(`/group/${row.id}`);
      await this.fetchGroups();
    },
    changeGroup(row: any, idx: number) {
      this.selectGroupIdx = idx;
      this.dialogFormVisible = true;
    },
    async postChangeGroup() {
      const row = this.groupList[this.selectGroupIdx];
      const resp = await request.put(`/group/${row.id}`, row);
      this.dialogFormVisible = false;
    },
    async postNewGroup() {
      const resp = await request.post(`/group`, this.newGroup);
      this.newGroup.name = "";
      this.newGroup.code = "";
      this.dialogNewFormVisible = false;
    },
    toStepAdmin(row: any, idx: number) {
      this.$router.push({path: `/admin/group/${row.id}/step`});
    }
  },
});
</script>
