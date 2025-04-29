<script lang="ts">
  import { format } from 'date-fns';
  import { settings } from '../store/store';

  interface Props {
    prayerName: string;
    prayerTime: Date;
    timeToNextPrayer: string;
    isNextPrayer: boolean;
  }

  let { prayerName, prayerTime, timeToNextPrayer, isNextPrayer }: Props =
    $props();
</script>

<div
  class="content-box"
  class:active={isNextPrayer}
  class:muted={!isNextPrayer}
>
  <div class="waqt-name">
    {prayerName}
    {#if isNextPrayer}
      <span class="next-waqt-time">{timeToNextPrayer ?? ''}</span>
    {/if}
  </div>
  <div class="waqt-time">
    {#if prayerTime != null && !isNaN(prayerTime.getTime()) && $settings.timeFormat != null}
      {format(prayerTime, $settings.timeFormat)}
    {:else}
      ...
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../styles/variables';
  @use 'sass:map';

  .content-box {
    margin: 10px;
    padding: 25px;
    color: white;
    z-index: 1;
    border-radius: 1.4rem;
    backdrop-filter: blur(10px);
  }
  .content-box:nth-child(1) {
    color: map.get($map: variables.$fajr-style, $key: foreground);
    background: map.get($map: variables.$fajr-style, $key: background);
  }
  .content-box:nth-child(2) {
    color: map.get($map: variables.$sunrise-style, $key: foreground);
    background: map.get($map: variables.$sunrise-style, $key: background);
  }
  .content-box:nth-child(3) {
    color: map.get($map: variables.$dhuhr-style, $key: foreground);
    background: map.get($map: variables.$dhuhr-style, $key: background);
  }
  .content-box:nth-child(4) {
    color: map.get($map: variables.$asr-style, $key: foreground);
    background: map.get($map: variables.$asr-style, $key: background);
  }
  .content-box:nth-child(5) {
    color: map.get($map: variables.$maghrib-style, $key: foreground);
    background: map.get($map: variables.$maghrib-style, $key: background);
    backdrop-filter: blur(90px);
  }
  .content-box:nth-child(6) {
    color: map.get($map: variables.$isha-style, $key: foreground);
    background: map.get($map: variables.$isha-style, $key: background);
  }
  .waqt-name {
    font-family: var(--base-font);
    font-size: 20pt;
    white-space: nowrap;
    overflow: auto;
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
    opacity: 80%;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .waqt-time {
    margin-top: 20px;
    font-family: var(--base-font);
    font-size: 40pt;
    font-weight: bold;
    white-space: nowrap;
    overflow: auto;
  }

  @keyframes flash {
    0% {
      border-color: #333;
    }
    100% {
      border-color: #fff;
    }
  }
  .active {
    z-index: 99;
    box-shadow:
      0 0 25px 2px white,
      inset 0 0 30px 2px rgba(255, 255, 255, 0.5);
    @include variables.backlight(
      0,
      0,
      5vw,
      1.2,
      var(--glow-color),
      var(--glow-color-secondary),
      10s
    );
  }
  .muted {
    filter: grayscale(80%) opacity(50%);
  }
</style>
