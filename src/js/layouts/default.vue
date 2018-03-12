<script>
  import ViewAllTime from '../components/view-alltime.vue'

  export default {
    methods: {
      navigate (e) {
        e.preventDefault();
        this.$router.push({
          name: 'root'
        });
      }
    },
    components: {
      ViewAllTime
    }
  }
</script>

<template>
  <div>
    <nav class="navbar navbar-dark bg-dark navbar-fixed-top">
      <div class="container">
        <a class="navbar-brand" href="/" @click="navigate">Wingspan Delivery Services Statistics</a>
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
    <footer>
      <div class="container">
        <div class="row">
          <div class="col text-center">
            <p>
              Adapted for web by <a href="https://twitter.com/Second_Fry">@Second_Fry</a> (<a
                href="https://zkillboard.com/character/91435934/">Lenai Chelien</a>) in January, 2016.<br>
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
