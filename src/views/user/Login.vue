<template>
  <el-card class="box-card">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="账号" prop="username">
        <el-input v-model.number="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" @keyup.enter="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login()">登录</el-button>
        <el-button @click="$router.push({ name: 'register' })">注册</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import request from "./../../request";

export default defineComponent({
  setup() {},
  data() {
    var checkUser = (rule: any, value: any, callback: any) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      }
      callback();
    };
    var validatePass = (rule: any, value: any, callback: any) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
      callback();
    };
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        password: [
          { validator: validatePass, trigger: "blur", required: true },
        ],
        username: [{ validator: checkUser, trigger: "blur", required: true }],
      },
    };
  },
  computed: {
    logged() {
      //@ts-ignore
      return this.$store.state.logged;
    },
  },
  created() {},
  methods: {
    async login() {
      //@ts-ignore
      const vaild = await this.$refs["ruleForm"].validate();
      const resp = await request.post(`/login`, {
        username: this.ruleForm.username,
        password: this.ruleForm.password,
      });

      //@ts-ignore
      this.$store.commit("login", resp.data.access_token);
      //@ts-ignore
      this.$store.dispatch("user");
      this.$router.push({ name: "home" });
    },
  },
});
</script>
