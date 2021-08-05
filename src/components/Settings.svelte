<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import FaSave from 'svelte-icons/fa/FaSave.svelte';
  import FaGithub from 'svelte-icons/fa/FaGithub.svelte';
  import image from '../assets/kofi3.png';
  import { settingsStore } from '../store/store';

  export let localTime: Date;
  export let timeZone: string;

  export let onClose: () => void;
</script>

<div>
  <div id="bg" transition:fade on:click={onClose} />
  <div id="settings-box" transition:fly={{ duration: 150, y: 100 }}>
    <div id="settings-header">
      <div id="settings-text">Settings</div>
      <button on:click={onClose} title="Save and close">
        <div class="icon">
          <FaSave />
        </div>
      </button>
    </div>
    <div id="settings-content">
      <div class="control">
        <label class="label" for="cmb-format">Time format</label>
        <select id="cmb-format" bind:value={$settingsStore.timeFormat}>
          <option value="h:mm a">12-hour</option>
          <option value="H:mm">24-hour</option>
        </select>
      </div>
      <div class="control">
        <label class="label" for="cmb-method">Calculation method</label>
        <select id="cmb-method" bind:value={$settingsStore.calcMethod}>
          <option value="karachi">Karachi</option>
          <option value="mwl">Muslim World League</option>
          <option value="egypt">Egyptian</option>
          <option value="makkah">Makkah</option>
          <option value="kuwait">Kuwait</option>
          <option value="america">North America</option>
        </select>
      </div>
      <div class="control" id="latlong">
        <label class="label" for="latlong-controls">Coordinates</label>
        <div class="grouped" id="latlong-controls">
          <span>
            <input
              type="number"
              placeholder="Latitude"
              bind:value={$settingsStore.latitude}
            />
            °&nbsp;N
          </span>
          <span>
            <input
              type="number"
              placeholder="Longitude"
              bind:value={$settingsStore.longitude}
            />°&nbsp;W
          </span>
        </div>
      </div>

      <div class="control">
        <label class="label" for="color-scheme">Color scheme</label>
        <select id="color-scheme" bind:value={$settingsStore.colorScheme}>
          <option value="default">System default</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>

      <div id="local-time">Local date: {localTime.toLocaleDateString()}</div>
      <div id="timezone">Timezone: {timeZone}</div>
      <div id="about-info">
        An app to display current prayer times for the selected location.
        <br />Made with ♥️ by Tamim Arafat.
        <br />
        <a
          href="http://github.com/arafatamim/waqt-web"
          target="_blank"
          class="about-link"
        >
          <div class="icon">
            <FaGithub />
          </div>
          <span>&nbsp;Source on GitHub</span>
        </a>
        <br />
        <br />
        <a href="https://ko-fi.com/Q5Q1TLM1" target="_blank">
          <img
            height="36"
            style="border:0px;height:36px;"
            src={image}
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
      </div>
    </div>
  </div>
</div>

<svelte:window
  on:keydown={(e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }}
/>

<style lang="scss" scoped>
  @import '../styles/variables';

  .icon {
    width: 1rem;
    height: 1rem;
    display: inline-block;
    vertical-align: middle;
  }

  #bg {
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.4;
    z-index: 1000;
  }
  #settings-box {
    position: fixed;
    width: 30%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--bg-color);
    border-radius: 20px;
    box-shadow: 20px 20px 50px rgba(0, 0, 0, 0.4);
    padding: 25px;
    z-index: 1001;
  }
  #settings-header {
    font-family: var(--base-font);
    font-size: 15pt;
    color: var(--text-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  /* width */
  ::-webkit-scrollbar {
    width: 8px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: var(--control-bg-color);
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: var(--control-bg-color-secondary);
  }

  #settings-content {
    font-family: var(--base-font);
    color: var(--text-color);
    position: relative;
    display: grid;
    grid-row-gap: 12px;
    font-size: 11pt;
    select {
      -moz-appearance: none;
    }

    .control {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 0.6rem;
      & > :nth-child(2) {
        flex-grow: 0;
        flex-shrink: 1;
      }
    }

    .label {
      flex-grow: 1;
      flex-shrink: 0;
    }

    .grouped {
      display: flex;
      flex-direction: row;
      gap: 0.6rem;
      flex-grow: 0;
      flex-shrink: 1;

      & > span {
        display: flex;
      }
    }

    #about-info {
      color: var(--text-color-light);
    }
    .about-link {
      margin-top: 2px;
    }
  }
  @media (max-width: 768px) {
    #settings-box {
      width: 60%;
    }
  }
  @media (max-width: 825px) {
    #settings-box {
      width: 60%;
    }
  }
  @media (max-width: 1024px) {
    #settings-box {
      width: 50%;
    }
  }
  @media (max-width: 575px) {
    #settings-box {
      width: 90%;
      border-radius: 0;
    }
  }
  @media (max-width: 640px) {
    #settings-box {
      border-radius: 0;
    }
  }
</style>
