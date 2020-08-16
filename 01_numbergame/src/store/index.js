import Vue from 'vue';
import VueX from 'vuex';
import wallet from '@/store/modules/wallet';

Vue.use(VueX);

export default new VueX.Store({
    modules: {
        wallet
    }
})