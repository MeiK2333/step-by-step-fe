<template>
  <card class="box-card">
    <el-table
      :span-method="objectSpanMethod"
      v-loading="loading"
      :data="users"
      stripe
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="120"> </el-table-column>
      <el-table-column prop="class" label="Class" width="180">
      </el-table-column>
      <el-table-column prop="nickname" label="Nickname" width="180">
      </el-table-column>
      <el-table-column prop="source" label="Source" width="180">
      </el-table-column>
      <el-table-column prop="username" label="Username" width="180">
      </el-table-column>
      <el-table-column label="Operation" width="120">
        <template #default="scope">
          <el-popconfirm
            :title="`确定要删除 ${scope.row.class} - ${scope.row.nickname} ？`"
            @confirm="deleteStepUser(scope.row)"
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
      <el-button @click="onClickUpload">导入 Excel</el-button>
    </div>
  </card>

  <el-dialog title="New" v-model="dialogNewFormVisible" @close="fetchUsers">
    <el-form>
      <el-form-item label="Class">
        <el-input v-model="newStepUser.class" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Nickname">
        <el-input v-model="newStepUser.nickname" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Source">
        <el-input v-model="newStepUser.source" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Username">
        <el-input v-model="newStepUser.username" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogNewFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="postNewStepUser">确 定</el-button>
      </span>
    </template>
  </el-dialog>
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

export default defineComponent({
  data() {
    const users: any[] = [];
    return {
      users,
      loading: true,
      group_id: Number(this.$route.params.group_id),
      step_id: Number(this.$route.params.step_id),
      dialogNewFormVisible: false,
      newStepUser: {
        class: "",
        nickname: "",
        source: "",
        username: "",
      },
    };
  },
  setup() {},
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      const resp = await request.get(`/step/${this.step_id}/users`);
      this.users = [];
      for (const user of resp.data) {
        for (let i = 0; i < user.bind_users.length; i++) {
          const bind = user.bind_users[i];
          let rowspan;
          if (i === 0) {
            rowspan = user.bind_users.length;
          } else {
            rowspan = 0;
          }
          this.users.push({
            id: user.id,
            class: user.class,
            nickname: user.nickname,
            source: bind.source,
            username: bind.username,
            rowspan,
          });
        }
        if (user.bind_users.length === 0) {
          this.users.push({
            id: user.id,
            class: user.class,
            nickname: user.nickname,
          });
        }
      }
      this.loading = false;
    },
    //@ts-ignore
    objectSpanMethod({ row, column }) {
      if (column.property === "username" || column.property === "source") {
        return {
          rowspan: 1,
          colspan: 1,
        };
      }
      return {
        rowspan: row.rowspan,
        colspan: 1,
      };
    },
    async deleteStepUser(row: any) {
      const resp = await request.delete(
        `/group/${this.group_id}/step/${this.step_id}/user/${row.id}`
      );
      await this.fetchUsers();
    },
    async postNewStepUser() {
      const resp = await request.post(
        `/group/${this.group_id}/step/${this.step_id}/user`,
        this.newStepUser
      );
      this.newStepUser.username = "";
      this.newStepUser.nickname = "";
      this.newStepUser.class = "";
      this.newStepUser.source = "";
      this.dialogNewFormVisible = false;
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
        for (let i = 0; i < json.length; i++) {
          try {
            const resp = await request.post(
              `/group/${this.group_id}/step/${this.step_id}/user`,
              json[i]
            );
          } catch (e) {}
        }
        await this.fetchUsers();
        this.loading = false;
      };
      reader.readAsArrayBuffer(file);
    },
  },
});
</script>
