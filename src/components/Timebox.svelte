<script lang="ts">
  import { format } from 'date-fns';
  import { onDestroy } from 'svelte';
  import { settingsStore } from '../store/store';

  let timeFormat: string | null = null;

  const unsubscribe = settingsStore.subscribe(
    (v) => (timeFormat = v.timeFormat)
  );

  export let prayerName: string;
  export let prayerTime: Date;
  export let timeToNextPrayer: string;
  export let isNextPrayer: boolean;

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="content-box" class:active={isNextPrayer}>
  <div class="waqt-name">
    {prayerName}
    {#if isNextPrayer}
      <span class="next-waqt-time">{timeToNextPrayer ?? ''}</span>
    {/if}
  </div>
  <div class="waqt-time">
    {#if prayerTime != null && timeFormat != null}
      {format(prayerTime, timeFormat)}
    {:else}
      ...
    {/if}
    <!-- {prayerTime != null && timeFormat != null ? format(prayerTime, timeFormat) : '...'} -->
  </div>
</div>

<style lang="scss">
  @import '../styles/variables';

  .content-box {
    margin: 10px;
    padding: 25px;
    color: white;
    border-radius: 20px;
    box-shadow: 0 0 0.5px rgba(#000, 0.1), 0 5px 8px rgba(#000, 0.15),
      0 20px 20px rgba(#000, 0.2);
  }
  .content-box:nth-child(1) {
    color: map-get($map: $fajr-style, $key: foreground);
    background: map-get($map: $fajr-style, $key: background);
  }
  .content-box:nth-child(2) {
    color: map-get($map: $sunrise-style, $key: foreground);
    background: map-get($map: $sunrise-style, $key: background);
  }
  .content-box:nth-child(3) {
    color: map-get($map: $dhuhr-style, $key: foreground);
    background: map-get($map: $dhuhr-style, $key: background);
  }
  .content-box:nth-child(4) {
    color: map-get($map: $asr-style, $key: foreground);
    background: map-get($map: $asr-style, $key: background);
  }
  .content-box:nth-child(5) {
    color: map-get($map: $maghrib-style, $key: foreground);
    background: map-get($map: $maghrib-style, $key: background);
  }
  .content-box:nth-child(6) {
    color: map-get($map: $isha-style, $key: foreground);
    background: map-get($map: $isha-style, $key: background);
  }
  .waqt-name {
    font-family: var(--base-font);
    font-size: 20pt;
    white-space: nowrap;
    overflow: auto;
    opacity: 80%;
  }

  .waqt-time {
    margin-top: 20px;
    font-family: var(--base-font);
    font-size: 40pt;
    white-space: nowrap;
    overflow: auto;
    // text-overflow: ellipsis;
  }
  // .nextWaqtTime {
  //   font-size: 18pt;
  // }

  @keyframes flash {
    0% {
      border-color: #333;
    }
    100% {
      border-color: #fff;
    }
  }
  .active {
    border: 5px solid #ccc;
    animation: flash 1.5s infinite alternate;
  }
</style>
