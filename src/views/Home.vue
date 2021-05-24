<template>
  <card class="box-card">
    <template v-if="!logged">
      您还没登录，<router-link :to="{ name: 'login' }">点击登录</router-link>
    </template>
    <template v-else>
      欢迎你，{{ $store.state.user.username }}
      <router-link
        :to="{ name: 'user', params: { username: $store.state.user.username } }"
        >个人页面</router-link
      >，
      <a @click="$store.commit('logout')">退出</a>
    </template>
  </card>

  <div style="height: 30px"></div>

  <card>
    <recent-solutions :size="20"></recent-solutions>
  </card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import RecentSolutions from "../components/RecentSolutions.vue";

export default defineComponent({
  name: "Home",
  components: { RecentSolutions },
  data() {
    return {
      loading: true,
      solutions: [],
    };
  },
  computed: {
    ...mapGetters(["logged"]),
  },
  created() {},
  methods: {
    async logout() {
      //@ts-ignore
      this.$store.commit("logout");
      this.$router.go(0);
    },
  },
});
</script>

<style scoped>
.box-card {
  font-family: "Helvetica Neue", Helvetica, "Microsoft Yahei", Arial, sans-serif;
}
</style>