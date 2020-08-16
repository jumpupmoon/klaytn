<template>
  <div class="containWrap">      
      <v-card class="cardG">
        <template v-if="isConnectWallet">
          <div>
            <p class="text-center address">
               {{myaddress}} <span class="reftxt">(Address)</span>
            </p>
            <p class="text-center balance">
               {{balance}} Klay <span class="reftxt">(Balance)</span>
            </p>
          </div>
        </template>
        <template v-else>
          <v-text-field
              v-model="privateKey"
              label="Private Key"
              type="password"
              solo
              required
            ></v-text-field>

          <v-btn outlined class="btnSubmit" @click="this.handleAddWallet">CONNECT WALLET</v-btn>          
        </template>
      </v-card>      

      <h2>Transfer</h2>
      <v-select v-model="selectedAuction" :items="auctionIds" label="Asset" @change="getAuctionById"></v-select>
      <div v-show="selectedAuction">
        <h3>Auction Info</h3>
        <div>Title: {{auctionInfo.title}}</div>
        <div>Price: {{auctionInfo.price}} KLAY</div>
        <div>TokenId: {{auctionInfo.tokenId}}</div>
        <div>Owner: {{auctionInfo.owner}}</div>
      </div>

      <v-text-field
        v-model="toAddress"
        label="To Address"
        required
      ></v-text-field>

      <v-btn @click="finalizeAuction" outlined color="teal">Finalize</v-btn>

      <v-snackbar
        v-model="snackbar" top>
        {{ snackbarMsg }}
        <v-btn
          color="pink"
          text
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import KlaytnService from '@/klaytn/klaytnService'

  export default {
    data() {
      return {
        auctionIds:[],
        toAddress: null,
        selectedAuction: null,

        auctionInfo: {
          title: '',
          price: 0,
          tokenId: '',
          owner: ''
        },

        snackbar: false,
        snackbarMsg: '',

        privateKey: null,
      }      
    },

    computed: {
      ...mapGetters('wallet', [
        'klaytn',
        'isConnectWallet',
        'myaddress',
        'balance'
      ])
    },

    async mounted() {
      const klaytn = new KlaytnService()
      this.setKlaytn(klaytn)
      const address = await klaytn.init()

      if (address) {
        await this.getWalletInfo()     
        await this.getMyAuctions()
      }      
    },

    methods: {
      ...mapMutations('wallet', [
        'setKlaytn',
        'setIsConnectWallet',
        'setMyAddress',
        'setBalance'
      ]),
      async handleAddWallet () {
        try {          
          if(this.privateKey) {
            await this.klaytn.integrateWallet(this.privateKey)
            await this.getWalletInfo()
            await this.getMyAuctions()
          }
        } catch (e) {        
          this.snackbarMsg = `private key doesn't match.`
          this.snackbar = true
        }
      },

      async getWalletInfo () {        
        const walletInstance = this.klaytn.getWallet()
        if(walletInstance && walletInstance.address) {          
          this.setMyAddress(walletInstance.address)          
          const balance = await this.klaytn.getBalance(walletInstance.address)
          this.setBalance(balance) 

          this.setIsConnectWallet(true)
        } else {
          this.setIsConnectWallet(false)
        }
      },
      
      async getMyAuctions() {
        this.auctionIds = await this.klaytn.getAuctionsOf(this.myaddress)
      },

      async getAuctionById() {
        this.auctionInfo = await this.klaytn.getAuctionById(this.selectedAuction)        
      },

      finalizeAuction() {
        if(!this.toAddress) {
          alert("please fill in to Address")
          return
        }

        this.klaytn.finalizeAuction(this.selectedAuction, this.toAddress, (receipt) => {
          alert(`Auction finalized...! (#${receipt.blockNumber} ,${receipt.transactionHash})`)
        }, (error) => {
          console.error(error)
        })
      }
    }

  }
</script>
<style scoped>  
  .containWrap {
    max-width: 600px;
    margin: 0 auto;
  }

  .cardG {
    margin: 10px;
    padding: 10px;
  }

  .cardG .reftxt {
    color: #b7afaf;
  }
</style>