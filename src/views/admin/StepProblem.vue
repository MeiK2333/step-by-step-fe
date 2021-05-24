<template>
  <card class="box-card">
    <el-table v-loading="loading" :data="problems" stripe style="width: 100%">
      <el-table-column prop="project" label="Project" min-width="180">
      </el-table-column>
      <el-table-column prop="topic" label="Topic" width="180">
      </el-table-column>
      <el-table-column prop="problem.problem_id" label="Problem" width="120">
        <template #default="scope">
          <a :href="scope.row.problem.link" target="_blank">
            {{ scope.row.problem.problem_id }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="problem.title" label="Title" min-width="180">
      </el-table-column>
      <el-table-column prop="problem.source.name" label="Source" width="120">
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="onClickUpload">导入 Excel</el-button>
    </div>
  </card>
  <input
    ref="excel_upload_input"
    @change="handleFile"
    type="file"
    accept=".xlsx"
    style="display: none"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from "../../request";
import XLSX from "xlsx";
import { ElMessage } from "element-plus";

export default defineComponent({
  setup() {},
  data() {
    return {
      problems: [],
      loading: true,
      group_id: Number(this.$route.params.group_id),
      step_id: Number(this.$route.params.step_id),
    };
  },
  created() {
    this.fetchProblems();
  },
  methods: {
    async fetchProblems() {
      this.loading = true;
      const resp = await request.get(`/step/${this.step_id}/problems`);
      this.problems = resp.data;
      this.loading = false;
    },
    onClickUpload() {
      const dom = this.$refs.excel_upload_input;
      //@ts-ignore
      dom.click();
    },
    async handleFile(e: any) {
      this.loading = true;
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet) as any[];
        // 第一项必须提供 project 与 topic
        if (
          Object.keys(json[0]).includes("project") &&
          Object.keys(json[0]).includes("topic")
        ) {
        } else {
          ElMessage.error("格式错误！");
          this.loading = false;
          return;
        }
        for (const row of json) {
          const keys = Object.keys(row);
          // 每一项都必须提供 problem 与 source
          if (keys.includes("problem") && keys.includes("source")) {
            continue;
          } else {
            ElMessage.error("格式错误！");
            this.loading = false;
            return;
          }
        }
        const resp = await request.put(
          `/group/${this.group_id}/step/${this.step_id}/problems`,
          json
        );
        await this.fetchProblems();
        this.loading = false;
      };
      reader.readAsArrayBuffer(file);
    },
  },
});
</script>
