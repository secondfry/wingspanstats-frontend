<script>
  import LayoutDefault from '../layouts/default.vue'
  import ViewCategory from '../components/view-category.vue'

  export default {
    components: {
      LayoutDefault,
      ViewCategory
    }
  }
</script>

<template>
  <layout-default>
    <view-category :category="$route.params.category"></view-category>
  </layout-default>
</template>
