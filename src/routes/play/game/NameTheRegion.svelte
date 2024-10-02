<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { currentMap } from '$lib/stores/mapStore';
  import { score, gameTime } from '$lib/stores/gameStore';
  import type { Region } from '$lib/types';
  import MapBase from '../../../components/maps/MapBase.svelte';

  let regions: Region[] = [];
  let currentRegion: Region | null = null;
  let userInput = '';
  let feedback = '';
  let showNotification = false;
  let gameStarted = false;
  let gameEnded = false;
  let timer: NodeJS.Timeout;
  let countdown = 5;
  let circleLength = 439.8; // Circumference of the circle
  let inputElement: HTMLInputElement;
  let skipping = false;
  let canSubmit = true; // New variable to control submission

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

  async function startGame() {
    gameStarted = true;
    score.set(0);
    gameTime.set(60);
    selectNextRegion();
    startTimer();
    await tick();
    inputElement.focus();
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
    if (currentRegion && canSubmit) {
      if (normalizeString(userInput) === normalizeString(currentRegion.name)) {
        feedback = 'Correct!';
        score.update(n => n + 1);
        showNotification = true;
        canSubmit = false; // Disable submission after correct answer
        setTimeout(async () => {
          showNotification = false;
          feedback = '';
          selectNextRegion();
          canSubmit = true; // Re-enable submission for the next region
          await tick();
          inputElement.focus(); // Set focus back to input
        }, 300); 
      } else {
        feedback = 'Incorrect. Try again or click "Skip" to move to the next region.';
        showNotification = true;
      }
      userInput = '';
    }
  }

  // Add this new function to normalize strings
  function normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && userInput.trim() !== '' && canSubmit) {
      checkAnswer();
    }
  }

  function skipRegion() {
    if (currentRegion && canSubmit) {
      skipping = true;
      canSubmit = false; // Disable submission when skipping
      feedback = `Skipped. The correct answer was ${currentRegion.name}.`;
      showNotification = true;
      setTimeout(async () => {
        showNotification = false;
        feedback = '';
        selectNextRegion();
        skipping = false;
        canSubmit = true; // Re-enable submission for the next region
        await tick();
        inputElement.focus(); // Set focus back to input
      }, 300); 
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

<div class="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden">
  {#if !gameStarted && !gameEnded}
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-md z-50" in:fade={{ duration: 300 }}>
      <div class="text-center p-4" in:fly={{ y: 20, duration: 300 }}>
        <div class="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 sm:mb-8">
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
        <p class="text-xl sm:text-2xl text-white font-light tracking-wide mb-2 sm:mb-4">Get ready!</p>
        <p class="text-sm sm:text-lg text-white font-light tracking-wide max-w-md mx-auto">
          <span class="italic text-gray-300"><span class="font-semibold text-red-500">How to play</span>: Type the name of the highlighted region as quickly as possible. Score points for each correct answer before time runs out!</span>
        </p>
      </div>
    </div>
  {:else if gameStarted && !gameEnded}
    <div class="flex flex-col h-full">
      <div class="bg-white dark:bg-gray-800 p-4 shadow-md" in:fly={{ y: -20, duration: 300 }}>
        <div class="flex justify-between items-center max-w-4xl mx-auto">
          <div class="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300">
            Time: <span class="text-xl sm:text-2xl text-blue-600 dark:text-blue-400">{$gameTime}s</span>
          </div>
          <div class="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300">
            Score: <span class="text-xl sm:text-2xl text-green-600 dark:text-green-400">{$score}</span>
          </div>
        </div>
      </div>

      <div class="flex-grow flex flex-col p-4 max-w-4xl mx-auto w-full">
        <div class="mb-4" in:fly={{ y: 20, duration: 300 }}>
          <div class="flex flex-col sm:flex-row items-center w-full">
            <input
              type="text"
              bind:value={userInput}
              bind:this={inputElement}
              on:keydown={handleKeydown}
              placeholder="Enter region name"
              class="w-full px-4 py-3 mb-2 sm:mb-0 sm:mr-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              disabled={skipping || !canSubmit}
            />
            <div class="flex w-full sm:w-auto">
              <button
                on:click={checkAnswer}
                class="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mr-2"
                disabled={skipping || !canSubmit}
              >
                Submit
              </button>
              <button
                on:click={skipRegion}
                class="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg font-semibold shadow-lg transition-all duration-300 hover:from-gray-500 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                disabled={skipping || !canSubmit}
              >
                Skip
              </button>
            </div>
          </div>
        </div>

        <div class="flex-grow flex items-center justify-center" in:fade={{ duration: 300 }}>
          <div class="w-full h-full max-w-3xl">
            <MapBase mapData={$currentMap} currentRegion={currentRegion?.id} />
          </div>
        </div>
      </div>
    </div>
  {:else if gameEnded}
    <div class="flex-grow flex items-center justify-center p-4" in:fly={{ y: 20, duration: 300 }}>
      <div class="text-center">
        <h2 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100">Game Over!</h2>
        <p class="text-xl sm:text-2xl mb-6 sm:mb-8 text-gray-700 dark:text-gray-300">Your final score: <span class="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{$score}</span></p>
        <button
          on:click={restartGame}
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          Play Again
        </button>
      </div>
    </div>
  {/if}

  <!-- Add notification component -->
  {#if showNotification}
    <div
      class="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold z-50"
      class:bg-green-500={feedback === 'Correct!'}
      class:bg-red-500={feedback !== 'Correct!'}
      in:fly={{ y: -20, duration: 300 }}
      out:fade={{ duration: 200 }}
    >
      {feedback}
    </div>
  {/if}
</div>