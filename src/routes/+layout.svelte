<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import DarkModeToggle from '../components/common/DarkModeToggle.svelte';
</script>

<div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
  <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <a href="/" class="text-2xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          GeoMap Game
        </a>
        <div class="flex items-center space-x-6">
          <ul class="flex space-x-6">
            <li><a href="/" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" class:font-semibold={$page.url.pathname === '/'}>Home</a></li>
            <li><a href="/play" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" class:font-semibold={$page.url.pathname === '/play'}>Play</a></li>
            <li><a href="/leaderboard" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" class:font-semibold={$page.url.pathname === '/leaderboard'}>Leaderboard</a></li>
            <li><a href="/about" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" class:font-semibold={$page.url.pathname === '/about'}>About</a></li>
          </ul>
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  </header>

  <main class="flex-grow container mx-auto px-4 py-8">
    <slot />
  </main>

  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4">
    <div class="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
      <p>&copy; 2024 GeoMap Game. All rights reserved.</p>
    </div>
  </footer>
</div>
