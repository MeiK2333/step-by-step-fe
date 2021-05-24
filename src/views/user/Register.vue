<template>
  <card class="box-card">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
      <el-form-item label="账号" prop="username">
        <el-input
          v-model="ruleForm.username"
          placeholder="大小写字母 + 数字，1-1024 位"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          placeholder="1-1024 位"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="password2">
        <el-input
          type="password"
          v-model="ruleForm.password2"
          placeholder="再次输入密码"
          @keyup.enter="register"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="register()">注册</el-button>
        <el-button @click="this.$refs['ruleForm'].resetFields()"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </card>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import request from "./../../request";

export default defineComponent({
  setup() {},
  data() {
    var checkUser = (rule: any, value: string, callback: any) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      }
      if (value.length < 1 || value.length > 1024) {
        return callback(new Error("长度在 1 到 1024 位之间"));
      }
      for (const char of value) {
        if (
          !"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".includes(
            char
          )
        ) {
          return callback(new Error("用户名只支持大小写字母 + 数字"));
        }
      }
      callback();
    };
    var validatePass = (rule: any, value: string, callback: any) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
      if (value.length < 1 || value.length > 1024) {
        return callback(new Error("长度在 1 到 1024 位之间"));
      }
      callback();
    };
    var validatePass2 = (rule: any, value: any, callback: any) => {
      if (!value) {
        return callback(new Error("确认密码不能为空"));
      }
      //@ts-ignore
      if (this.ruleForm.password !== this.ruleForm.password2) {
        return callback(new Error("两次输入的密码不一致"));
      }
      callback();
    };
    return {
      ruleForm: {
        username: "",
        password: "",
        password2: "",
      },
      rules: {
        password: [
          { validator: validatePass, trigger: ["blur", "change"], required: true },
        ],
        password2: [
          { validator: validatePass2, trigger: ["blur", "change"], required: true },
        ],
        username: [{ validator: checkUser, trigger: ["blur", "change"], required: true }],
      },
    };
  },
  created() {},
  methods: {
    async register() {
      //@ts-ignore
      const vaild = await this.$refs["ruleForm"].validate();
      const resp = await request.post(`/register`, {
        username: this.ruleForm.username,
        password: this.ruleForm.password,
      });
      this.$router.push({ name: 'login' })
    },
  },
});
</script>
