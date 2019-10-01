<script>
  import LayoutDefault from '../layouts/default.vue'
  import ViewAchievements from '../components/view-achievements.vue'

  export default {
    components: {
      LayoutDefault,
      ViewAchievements
    }
  }
</script>

<template>
  <layout-default>
    <view-achievements />
  </layout-default>
</template>
