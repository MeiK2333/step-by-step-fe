<template>
  <el-card class="box-card">
    <h2>{{ detail.name }}</h2>
    <el-table v-loading="loading" :data="steps" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="120"> </el-table-column>
      <el-table-column prop="name" label="Name" min-width="180">
      </el-table-column>
      <el-table-column prop="userCount" label="Users" width="180">
      </el-table-column>
      <el-table-column prop="problemCount" label="Prob." width="180">
      </el-table-column>
      <el-table-column label="Operation" min-width="180">
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            @click="toStepUser(scope.row, scope.$index)"
            >用户管理</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="toStepProblem(scope.row, scope.$index)"
            >题目管理</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="changeStep(scope.row, scope.$index)"
            >修改</el-button
          >
          <el-popconfirm
            :title="`确定要删除 ${scope.row.code} - ${scope.row.name} ？`"
            @confirm="deleteStep(scope.row)"
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
  </el-card>

  <el-dialog title="Edit" v-model="dialogFormVisible" @close="fetchSteps">
    <el-form>
      <el-form-item label="Name">
        <el-input
          v-model="steps[selectStepIdx].name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="postChangeStep">确 定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog title="New" v-model="dialogNewFormVisible" @close="fetchSteps">
    <el-form>
      <el-form-item label="Name">
        <el-input v-model="newStep.name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogNewFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="postNewStep">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from "../../request";

export default defineComponent({
  data() {
    const steps: any[] = [];
    return {
      loading: true,
      steps,
      detail: {
        name: "",
      },
      id: Number(this.$route.params.id),
      selectStepIdx: 0,
      dialogFormVisible: false,
      dialogNewFormVisible: false,
      newStep: {
        name: "",
        code: "",
      },
    };
  },
  created() {
    this.fetchDetail();
    this.fetchSteps();
  },
  setup() {},
  methods: {
    async fetchDetail() {
      this.loading = true;
      const resp = await request.get(`/group/${this.id}`);
      this.detail = resp.data;
      document.title = this.detail.name + " - StepByStep";
      this.loading = false;
    },
    async fetchSteps() {
      this.loading = true;
      const resp = await request.get(`/group/${this.id}/steps`);
      this.steps = resp.data;
      this.loading = false;
    },
    async deleteStep(row: any) {
      const resp = await request.delete(`/group/${this.id}/step/${row.id}`);
      await this.fetchSteps();
    },
    changeStep(row: any, idx: number) {
      this.selectStepIdx = idx;
      this.dialogFormVisible = true;
    },
    async postChangeStep() {
      const row = this.steps[this.selectStepIdx];
      const resp = await request.put(`/group/${this.id}/step/${row.id}`, row);
      this.dialogFormVisible = false;
    },
    async postNewStep() {
      const resp = await request.post(`/group/${this.id}/step`, this.newStep);
      this.newStep.name = "";
      this.newStep.code = "";
      this.dialogNewFormVisible = false;
    },
    toStepUser(row: any, idx: number) {
      this.$router.push({
        path: `/admin/group/${this.id}/step/${row.id}/user`,
      });
    },
    toStepProblem(row: any, idx: number) {
      this.$router.push({
        path: `/admin/group/${this.id}/step/${row.id}/problem`,
      });
    },
  },
});
</script>
