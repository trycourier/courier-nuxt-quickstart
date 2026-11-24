<script setup lang="ts">
import { onMounted, ref } from "vue";
import { CourierInbox, useCourier } from "@trycourier/courier-vue";

const courier = useCourier();
const error = ref("");

// onMounted runs only in the browser, so the token is fetched and the user is
// signed in after hydration, never during server rendering.
onMounted(async () => {
  try {
    const { userId, token } = await $fetch("/api/courier-token");
    courier.shared.signIn({ userId, jwt: token });
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : "Sign-in failed.";
  }
});
</script>

<template>
  <p v-if="error" class="error">{{ error }}</p>
  <!-- The inbox takes its height from this prop, or from its parent. -->
  <CourierInbox v-else height="32rem" />
</template>
