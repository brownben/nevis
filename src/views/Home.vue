<template>
  <div>
    <div class="gradient text-center w-full shadow-md mb-3">
      <img src="@/assets/images/Nevis Logo.png" alt="Nevis Logo" class="h-40 py-5">
      <h1 class="pb-4 text-3xl text-white">Welcome to Nevis</h1>
    </div>
    <div id="nav" class="mx-8">
      <router-link tag="button" class="button" to="/about">About</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>
