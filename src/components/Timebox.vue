<template>
  <div class="contentBox" :class="{ active: activeWaqt }">
    <div class="divWaqt" id="divWaqt1">
      <div class="waqtName">
        {{ waqtName }}
        <span v-if="activeWaqt" class="nextWaqtTime">{{ timeToNextWaqt }}</span>
      </div>
      <div class="waqtTime" id="waqtTime1">{{ waqtTime }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Timebox',
  props: {
    waqtName: String,
    waqtTime: String,
    timeToNextWaqt: String,
    activeWaqt: Boolean
  }
};
</script>

<style lang="scss">
@import '../styles/base';

.contentBox {
  margin: 10px;
  padding: 25px;
  color: white;
  border-radius: 20px;
  box-shadow: 0 0 0.5px rgba(#000, 0.1), 0 5px 8px rgba(#000, 0.15), 0 20px 20px rgba(#000, 0.2);
}
.contentBox:nth-child(1) {
  color: map-get($map: $fajr-style, $key: foreground);
  background: map-get($map: $fajr-style, $key: background);
}
.contentBox:nth-child(2) {
  color: map-get($map: $sunrise-style, $key: foreground);
  background: map-get($map: $sunrise-style, $key: background);
}
.contentBox:nth-child(3) {
  color: map-get($map: $dhuhr-style, $key: foreground);
  background: map-get($map: $dhuhr-style, $key: background);
}
.contentBox:nth-child(4) {
  color: map-get($map: $asr-style, $key: foreground);
  background: map-get($map: $asr-style, $key: background);
}
.contentBox:nth-child(5) {
  color: map-get($map: $maghrib-style, $key: foreground);
  background: map-get($map: $maghrib-style, $key: background);
}
.contentBox:nth-child(6) {
  color: map-get($map: $isha-style, $key: foreground);
  background: map-get($map: $isha-style, $key: background);
}
.divWaqt {
  .waqtName {
    font-family: $base-font;
    font-size: 20pt;
    white-space: nowrap;
    overflow: auto;
  }

  .waqtTime {
    margin-top: 20px;
    font-family: $base-font;
    font-size: 40pt;
    white-space: nowrap;
    overflow: auto;
    // text-overflow: ellipsis;
  }
  // .nextWaqtTime {
  //   font-size: 18pt;
  // }
}

@keyframes flash {
  0% {
    border-color: rgba($color: #333, $alpha: 1);
  }
  100% {
    border-color: rgba($color: #fff, $alpha: 1);
  }
}
.active {
  border: 5px solid #ccc;
  animation: flash 1.5s infinite alternate;
}
</style>
