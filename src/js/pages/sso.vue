<script>
  import { mapActions } from 'vuex';

  import axios from 'axios';

  export default {
    computed: {
      sso () {
        const arr = this.$route.hash.split('#')[1].split('&');
        return arr.reduce((obj, keyValue) => {
          const [key, value] = keyValue.split('=');
          obj[key] = value;
          return obj;
        }, {});
      },
    },
    methods: {
      ...mapActions([
        'trackUserId'
      ]),
      async fetchCharId () {
        const res = await axios({
          url: 'https://esi.evetech.net/verify/',
          headers: {
            Authorization: 'Bearer ' + this.sso.access_token,
          },
        });
        await this.trackUserId(res.data.CharacterID);
        this.$router.push({
          name: 'root'
        });
      }
    },
    created () {
      this.fetchCharId();
    }
  }
</script>

<template>
  <div class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center">Redirecting...</div>
</template>
