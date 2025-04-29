<script lang="ts">
  import FaCog from 'svelte-icons/fa/FaCog.svelte';

  interface Props {
    onClick: () => void;
  }

  let { onClick }: Props = $props();
</script>

<div id="header-box">
  <div id="header-text">Waqt</div>

  <button title="Settings" onclick={onClick}>
    <div class="icon">
      <FaCog />
    </div>
  </button>
</div>

<style lang="scss" scoped>
  @use '../styles/variables';

  #header-box {
    font-family: var(--base-font);
    color: #ddd;
    padding: 20px;
    font-size: 20pt;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    #header-text {
      color: #bbb;
    }
  }
  .icon {
    color: #bbb;
    width: 1.6rem;
    height: 1.6rem;
  }
</style>
