<script>
  import { mapActions, mapGetters, mapState } from 'vuex';

  import ViewAllTime from '../components/view-alltime.vue'

  export default {
    methods: {
      ...mapActions([
        'loadUserId',
      ]),
      ...mapGetters([
        'hasUser',
      ]),
      navigate (e) {
        e.preventDefault();
        this.$router.push({
          name: e.target.dataset.name
        });
      },
      reset (e) {
        e.preventDefault();
        return localforage.clear()
          .then(() => {
              location.reload();
            }
          )
      },
      track (e) {
        e.preventDefault();
        location.href = 'https://login.eveonline.com/oauth/authorize/?response_type=token&client_id=51c4a940a2464ea98df98c8f0dc1bf71&redirect_uri=https://wds-stats.secondfry.ru/track/';
      }
    },
    created () {
      this.loadUserId();
    },
    components: {
      ViewAllTime
    }
  }
</script>

<template>
  <div>
    <nav class="navbar navbar-dark bg-dark navbar-expand-lg">
      <div class="container">
        <a class="navbar-brand" href="/" data-name="root" @click="navigate">Wingspan Delivery Services Statistics</a>
        <ul class="navbar-nav w-100">
          <li class="nav-item mr-auto">
            <a class="nav-item nav-link" href="/achievements" data-name="achievements" @click="navigate">Achievements</a>
          </li>
          <li class="nav-item">
            <a class="nav-item nav-link" href="#" @click="reset">Reset</a>
          </li>
          <li class="nav-item" v-if="!hasUser()">
            <a class="nav-item nav-link" href="#" @click="track">Track your character</a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container my-3">
      <div class="row">
        <div class="col">
          <view-all-time></view-all-time>
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="p-3 my-3 text-center bg-success text-light">We are back!</div>
    <footer class="sf-footer">
      <div class="container">
        <div class="row">
          <div class="col text-center">
            <p>
              Yours truly, <a href="https://twitter.com/Second_Fry">@Second_Fry</a> (<a
                href="https://zkillboard.com/character/91435934/">Lenai Chelien</a>).
              Adapted for web by in January, 2016.<br>
              Rewritten in March, 2016.<br>
              Rewritten in March, 2018. Consistency!<br>
              Also check <a target="_blank" href="https://www.youtube.com/user/SecondFry">my YouTube channel</a> :P.
            </p>
            <p>Original idea by <a href="https://zkillboard.com/character/92805979/">Valtyr Farshield</a> @ <a
                href="https://github.com/farshield/wingspanstats">GitHub</a>.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
  .sf-footer {
    margin-bottom: 80px;
    @include media-breakpoint-up(md) {
      margin-bottom: unset;
    }
  }
</style>
