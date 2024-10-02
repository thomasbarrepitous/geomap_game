<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  let mounted = false;

  onMount(() => {
    mounted = true;
  });
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
  {#if mounted}
    <div in:fade={{ duration: 300, delay: 150 }} class="text-center">
      <h1 class="text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
        GeoMap Game
      </h1>
      <p class="text-2xl mb-12 text-gray-700 dark:text-gray-300">Test your geography knowledge and embark on a global adventure!</p>
    </div>

    <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
      <a
        href="/play"
        in:fly={{ y: 20, duration: 300, delay: 300 }}
        class="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        Play Now
      </a>
      <button
        in:fly={{ y: 20, duration: 300, delay: 450 }}
        class="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
      >
        Log In
      </button>
    </div>

    <div in:fade={{ duration: 300, delay: 600 }} class="mt-16">
      <svg class="w-24 h-24 animate-float text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- ... existing SVG path ... -->
      </svg>
    </div>
  {/if}
</div>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
</style>
