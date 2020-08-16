<template>
  <v-app>
    <v-app-bar app clipped-left dense>
      <v-toolbar-title>NFT APP</v-toolbar-title>
      <v-spacer></v-spacer>

      <div class="nav">
        <a href="/">Home</a>
        <a href="/wallet">Wallet</a>
        <a href="/upload">Upload</a>
      </div>
    </v-app-bar>

    <v-content class="contentWrapper">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import {mapMutations} from 'vuex';
import KlaytnService from './klaytn/klaytnService';

export default {
  name: 'App',

  async mounted() {
    await this.connect();
  },

  methods: {
    ...mapMutations('wallet', [
      'setKlaytn',
      'setMyAddress'
    ]),
    async connect() {
      const klaytn = new KlaytnService();
      this.setKlaytn(klaytn);
      const address = await klaytn.init();
      if(address) {
        this.setMyAddress(address);
      }
    }
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.nav a {
  font-weight: bold;
  color: #2c3e50;
  margin: 10px;
}

.nav a.router-link-exact-active {
  color: #42b983;
}

.contentWrapper {
  padding-top: 20px;
}
</style>