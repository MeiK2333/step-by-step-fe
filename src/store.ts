import { createStore } from 'vuex';
import Cookies from 'js-cookie';
import request from './request';

export default createStore({
  state() {
    return {
      access_token: Cookies.get('access_token'),
      user: {
        username: null,
        nickname: null,
        id: null,
        email: null,
        roles: []
      }
    }
  },
  mutations: {
    login(state: any, access_token: string) {
      state.access_token = access_token;
      Cookies.set('access_token', access_token, { expires: 365 });
    },
    logout(state: any) {
      state.access_token = '';
      Cookies.set('access_token', '');
    },
    user(state: any, user: any) {
      Object.assign(state.user, user);
    }
  },
  actions: {
    async user({ commit, getters }) {
      if (!getters.logged) {
        return;
      }
      const resp = await request.get('/me');
      commit('user', resp.data);
    }
  },
  getters: {
    isAdmin(state, getters) {
      for (const role of state.user.roles) {
        if (role.name == "admin") {
          return true;
        }
      }
      return false;
    },
    logged(state, getters) {
      return state.access_token && state.access_token.length > 0;
    }
  }
})