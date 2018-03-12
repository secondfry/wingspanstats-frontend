<script>
  import LayoutDefault from '../layouts/default.vue'
  import ViewMonth from '../components/view-month.vue'

  export default {
    components: {
      LayoutDefault,
      ViewMonth
    }
  }
</script>

<template>
  <layout-default>
    <view-month></view-month>
  </layout-default>
</template>
