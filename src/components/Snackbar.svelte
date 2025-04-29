<script lang="ts">
  import { fly } from 'svelte/transition';
  import FaRedo from 'svelte-icons/fa/FaRedo.svelte';
  import FaTimesCircle from 'svelte-icons/fa/FaTimesCircle.svelte';

  interface Props {
    onReload: () => void;
    message?: string;
  }

  let { onReload, message = 'Something went wrong' }: Props = $props();
</script>

<div class="error-banner" transition:fly={{ y: 100, duration: 150 }}>
  <div class="message">
    <div class="icon">
      <FaTimesCircle />
    </div>
    <span class="banner-text">{message}</span>
  </div>
  <button id="btn-reload" onclick={onReload}>
    <div class="icon">
      <FaRedo />
    </div>
  </button>
</div>

<style lang="scss" scoped>
  @use '../styles/variables';

  .icon {
    width: 1.5rem;
    height: 1.5rem;
    display: inline-block;
  }
  .message {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  .error-banner {
    background-color: #ff1c1c;
    font-family: var(--base-font);
    color: white;
    position: fixed;
    bottom: 0px;
    left: 0;
    width: 100vw;
    max-width: 100%;
    padding: 10px 15px;
    box-shadow: 0px -7px 50px rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    max-width: 100%;
    box-sizing: border-box;
    z-index: 50;
  }

  #btn-reload {
    display: inline-block;
    background-color: #cc1919;
    padding: 5px;
    border-radius: 50%;
    width: 2.2rem;
    height: 2.2rem;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    &:active {
      background-color: #b61515;
    }
  }
</style>
