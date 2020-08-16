<template>
    <div>
        <v-form class="form" ref="form">
            <v-text-field v-model="tokenId" label="Unique ID"></v-text-field>
            <input type="file" @change="captureFile" />
            <v-btn @click="uploadImg" outlined color="teal">uploadImg</v-btn>
            <img :src="uploadImg" width="300" />
            <v-text-field v-model="dataURI" label="Data URI" required></v-text-field>
            <v-btn @click="submit" outlined color="teal">Submit</v-btn>

            <div v-show="isRegistered">
                <v-btn @click="transferToCA" outlined color="teal">TransferToCA</v-btn>
            </div>
        </v-form>

        <PostAuction :tokenId="tokenId" :metadata="dataURI" />
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import PostAuction from '@/components/PostAuction.vue';

export default {
    data() {
        return {
            file: null,
            tokenId: null,
            isRegistered: false,
            dataURI: null
        }
    },

    components: {
        PostAuction
    },

    mounted() {
        this.tokenId = this._getRandomInt(123456789, 999999999);
    },

    computed: {
        ...mapGetters('wallet', [
            'klaytn'
        ]),

        uploadedImg() {
            return 'https://gateway.ipfs.io/ipfs/'+this.dataURI;
        }
    },

    methods: {
        _getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        captureFile(event) {
            event.stopPropagation();
            this.file = event.target.files[0];
        },

        async uploadImg() {
            if(!this.file) {
                alert('Please put the file on input.');
                return;
            }
            const formData = new FormData();
            formData.append('file', this.file);
            this.axios({
                method: 'post',
                baseURL: 'https://ipfs.infura.io:5001',
                url: '/api/v0/add',
                data: formData,
                headers: {'Content-Type': 'multipart/form-data'}
            }).then(response => this.dataURI = response.data.Hash);
        },

        submit() {
            if(!this.dataURI) {
                alert('Fill in dataURI on the input');
                return;
            }
            this.klaytn.registerUniqueToken(this.tokenId, this.dataURI, receipt => {
                alert(`Token registered...! (#${receipt.blockNumber}, ${receipt.transactionHash})`);
                this.isRegistered = true;
            })
        },

        transferToCA() {
            this.klaytn.transferFrom(this.tokenId, receipt => {
                alert(`Token transfered to CA...! (#${receipt.blockNumber}, ${receipt.transactionHash})`);
            })
        }
    }
}
</script>