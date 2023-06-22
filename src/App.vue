<script>
export default {
  name: 'App',
}
</script>

<template>
  <div>
    <router-view :key="$route.fullPath" />
  </div>
</template>

<style scoped>
</style>
