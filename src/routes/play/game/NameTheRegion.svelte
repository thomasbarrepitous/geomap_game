<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { currentMap } from '$lib/stores/mapStore';
  import { score, gameTime } from '$lib/stores/gameStore';
  import type { Region } from '$lib/types';
  import MapBase from '../../../components/maps/MapBase.svelte';

  let regions: Region[] = [];
  let currentRegion: Region | null = null;
  let userInput = '';
  let feedback = '';
  let gameStarted = false;
  let gameEnded = false;
  let timer: NodeJS.Timeout;
  let countdown = 5;
  let circleLength = 439.8; // Circumference of the circle

  onMount(() => {
    if ($currentMap) {
      regions = [...$currentMap.regions];
      startCountdown();
    }
  });

  onDestroy(() => {
    clearInterval(timer);
  });

  function startCountdown() {
    const countdownTimer = setInterval(() => {
      countdown -= 0.1; // Decrease by 0.1 instead of 1
      if (countdown <= 0) {
        clearInterval(countdownTimer);
        countdown = 0; // Ensure it doesn't go below 0
        startGame();
      }
    }, 100); // Run every 100ms for smoother animation
  }

  function startGame() {
    gameStarted = true;
    score.set(0);
    gameTime.set(60);
    selectNextRegion();
    startTimer();
  }

  function selectNextRegion() {
    if (regions.length > 0) {
      const randomIndex = Math.floor(Math.random() * regions.length);
      currentRegion = regions[randomIndex];
      regions.splice(randomIndex, 1);
    } else {
      endGame();
    }
  }

  function checkAnswer() {
    if (currentRegion) {
      if (userInput.toLowerCase() === currentRegion.name.toLowerCase()) {
        feedback = 'Correct!';
        score.update(n => n + 1);
      } else {
        feedback = `Incorrect. The correct answer was ${currentRegion.name}.`;
      }
      userInput = '';
      setTimeout(() => {
        feedback = '';
        selectNextRegion();
      }, 1500);
    }
  }

  function startTimer() {
    timer = setInterval(() => {
      gameTime.update(t => {
        if (t <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function endGame() {
    gameEnded = true;
    clearInterval(timer);
  }

  function restartGame() {
    if ($currentMap) {
      regions = [...$currentMap.regions];
      gameEnded = false;
      gameStarted = false; // Reset gameStarted
      countdown = 5;
      userInput = ''; // Reset user input
      startCountdown();
    }
  }
</script>

<div class="container mx-auto px-4 py-8 relative">
  <h1 class="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">Name the Region</h1>

  {#if !gameStarted && !gameEnded}
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-md z-50" in:fade={{ duration: 300 }}>
      <div class="text-center" in:fly={{ y: 20, duration: 300 }}>
        <div class="relative w-40 h-40 mx-auto mb-8">
          <svg class="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#4B5563"
              stroke-width="8"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#60A5FA"
              stroke-width="8"
              stroke-dasharray={circleLength}
              stroke-dashoffset={circleLength * (countdown / 5)}
              class="transition-all duration-100 ease-linear"
            />
          </svg>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div class="text-6xl font-bold text-white">{Math.ceil(countdown)}</div>
          </div>
        </div>
        <p class="text-2xl text-white font-light tracking-wide mb-4">Get ready!</p>
        <p class="text-lg text-white font-light tracking-wide max-w-md mx-auto">
          <span class="italic text-gray-300"><span class="font-semibold text-red-500">How to play</span>: Type the name of the highlighted region as quickly as possible. Score points for each correct answer before time runs out!</span>
        </p>
      </div>
    </div>
  {:else if gameStarted && !gameEnded}
    <div class="mb-8 flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-md" in:fly={{ y: -20, duration: 300 }}>
      <div class="text-xl font-semibold text-gray-700 dark:text-gray-300">
        Time: <span class="text-2xl text-blue-600 dark:text-blue-400">{$gameTime}s</span>
      </div>
      <div class="text-xl font-semibold text-gray-700 dark:text-gray-300">
        Score: <span class="text-2xl text-green-600 dark:text-green-400">{$score}</span>
      </div>
    </div>

    <div class="flex justify-center mb-6" in:fade={{ duration: 300 }}>
      <MapBase mapData={$currentMap} currentRegion={currentRegion?.id} />
    </div>

    <div class="text-center mb-6" in:fly={{ y: 20, duration: 300 }}>
      {#if currentRegion}
        <p class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Name the highlighted region:
        </p>
      {/if}
      <input
        type="text"
        bind:value={userInput}
        placeholder="Enter region name"
        class="px-4 py-2 border rounded-md mr-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      />
      <button
        on:click={checkAnswer}
        class="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        Submit
      </button>
    </div>

    {#if feedback}
      <p class="text-center text-2xl font-semibold p-4 rounded-lg transition-all duration-300 ease-in-out"
         class:bg-green-100={feedback.startsWith('Correct')}
         class:text-green-700={feedback.startsWith('Correct')}
         class:bg-red-100={feedback.startsWith('Incorrect')}
         class:text-red-700={feedback.startsWith('Incorrect')}
         in:fly={{ y: 20, duration: 300 }}
         out:fade={{ duration: 200 }}
      >
        {feedback}
      </p>
    {/if}
  {:else if gameEnded}
    <div class="text-center" in:fly={{ y: 20, duration: 300 }}>
      <h2 class="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Game Over!</h2>
      <p class="text-2xl mb-8 text-gray-700 dark:text-gray-300">Your final score: <span class="text-3xl font-bold text-green-600 dark:text-green-400">{$score}</span></p>
      <button
        on:click={restartGame}
        class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        Play Again
      </button>
    </div>
  {/if}
</div>