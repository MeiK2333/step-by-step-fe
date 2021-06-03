<template>
  <card>
    <h2>{{ detail.username }}</h2>
    <el-alert
      v-if="detail.robot"
      title="这是系统自动生成的用户，你可以登录并验证身份后绑定此账号"
      type="info"
      effect="dark"
    >
    </el-alert>
  </card>

  <card style="margin-top: 30px">
    <event-graph :username="username"></event-graph>
  </card>

  <card style="margin-top: 30px">
    <recent-solutions :username="username" :size="10"></recent-solutions>
  </card>

  <card style="padding-top: 30px">
    <h4>参加的计划</h4>
    <el-table
      v-loading="loading"
      :data="detail.steps"
      stripe
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="120"> </el-table-column>
      <el-table-column prop="group" label="Group" width="120">
        <template #default="scope">
          <router-link
            :to="{ name: 'group', params: { id: scope.row.group.id } }"
          >
            {{ scope.row.group.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Name" min-width="180">
        <template #default="scope">
          <router-link :to="{ name: 'set', params: { id: scope.row.id } }">
            {{ scope.row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="class" label="Class" width="180">
      </el-table-column>
      <el-table-column prop="nickname" label="Nickname" width="180">
      </el-table-column>
    </el-table>
  </card>

  <card style="padding-top: 30px">
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

    <div
      style="margin-top: 20px"
      v-if="$store.state.user.username === username"
    >
      <el-button @click="dialogNewFormVisible = true">新增</el-button>
    </div>

    <el-dialog
      title="新增账号绑定"
      v-model="dialogNewFormVisible"
      @close="$refs['ruleForm'].resetFields()"
    >
      <el-form
        :model="newBindUserForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="Source" prop="source">
          <el-select v-model="newBindUserForm.source">
            <el-option
              v-for="item in sources"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Username" prop="username">
          <el-input v-model="newBindUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            type="password"
            v-model="newBindUserForm.password"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogNewFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="postNewBindUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from "../../request";
import RecentSolutions from "../../components/RecentSolutions.vue";
import EventGraph from "../../components/EventGraph.vue";

export default defineComponent({
  name: "UserDetail",
  components: { RecentSolutions, EventGraph },
  data() {
    return {
      sources: ["SDUT", "VJ", "POJ", "CF"],
      rules: {
        source: [{ trigger: ["blur", "change"], required: true }],
        username: [{ trigger: ["blur", "change"], required: true }],
        password: [{ trigger: ["blur", "change"], required: true }],
      },
      dialogNewFormVisible: false,
      loading: true,
      username: this.$route.params.username,
      detail: {},
      newBindUserForm: {
        source: "SDUT",
        username: "",
        password: "",
      },
      solutions: [],
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
    async postNewBindUser() {
      //@ts-ignore
      const vaild = await this.$refs["ruleForm"].validate();
      const resp = await request.post(`/user/bind_user`, {
        ...this.newBindUserForm,
      });
      await this.fetchUserDetail();
      this.dialogNewFormVisible = false;
    },
  },
});
</script>

<style scoped>
.profile {
  text-align: center;
}
</style>