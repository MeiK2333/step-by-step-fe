import { createStore } from 'vuex';
import Cookies from 'js-cookie';

export default createStore({
  state() {
    return {
      access_token: Cookies.get('access_token')
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
    }
  }
})