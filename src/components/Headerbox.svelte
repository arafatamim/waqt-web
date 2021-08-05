<script lang="ts">
  import FaCog from 'svelte-icons/fa/FaCog.svelte';

  export let onClick: () => void;
</script>

<div id="header-box">
  <div id="header-text">Waqt</div>

  <button title="Settings" on:click={onClick}>
    <div class="icon">
      <FaCog />
    </div>
  </button>
</div>

<style lang="scss" scoped>
  @import '../styles/variables';

  #header-box {
    font-family: var(--base-font);
    color: #eee;
    padding: 20px;
    font-size: 20pt;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    #header-text {
      color: var(--text-color);
    }
  }
  .icon {
    width: 1.6rem;
    height: 1.6rem;
  }
</style>
