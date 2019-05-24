<template>
  <div id="bossContainer">
    <settings
      v-if="settings.dialog"
      :tformat="settings.timeFormat"
      :localtime="localTime"
      :timezone="timezone"
      @updateParameters="updateSettings"
      @closeWithoutSaving="settings.dialog = false"
    />
    <div id="secondBossContainer">
      <headerbox @showDialog="settings.dialog = true" />
      <div class="contentBoxes">
        <timebox
          v-for="(val, i) in waqts"
          :key="i"
          :waqtName="val"
          :waqtTime="times[val.toLowerCase()]"
          :activeWaqt="nextWaqt === val"
          :timeToNextWaqt="timeToNextWaqt"
        />
      </div>
      <snackbar v-show="settings.snackbar" @reloadTimes="getLocation()" />
    </div>
  </div>
</template>

<script>
import snackbar from '@/components/snackbar.vue';
import headerbox from '@/components/headerbox.vue';
import timebox from '@/components/timebox.vue';
import settings from '@/components/settings.vue';
import spinner from '@/components/spinner.vue';
import { setInterval } from 'timers';

export default {
  components: {
    snackbar,
    headerbox,
    timebox,
    settings,
    spinner
  },
  data() {
    return {
      times: {
        fajr: '...',
        sunrise: '...',
        dhuhr: '...',
        asr: '...',
        maghrib: '...',
        isha: '...'
      },
      localTime: '...',
      timezone: '...',
      method: '...',
      settings: {
        city: '',
        country: '',
        timeFormat: 'h:mm A',
        method: 1,
        snackbar: false,
        dialog: false,
        darkTheme: true,
        loader: {
          loading: false
        }
      },
      nextWaqt: null,
      timeToNextWaqt: null,
      waqts: ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
    };
  },
  created() {
    if (localStorage.getItem('timeFormat') != null) {
      this.settings.timeFormat = localStorage.getItem('timeFormat');
    } else {
      this.getLocation();
      this.settings.timeFormat = 'h:mm A';
    }
  },
  beforeMount() {
    setInterval(this.getLocation(), 600000);
  },
  methods: {
    getLocation() {
      var coords = {};
      navigator.geolocation.getCurrentPosition(
        location => {
          coords.lat = location.coords.latitude.toFixed(4);
          coords.lon = location.coords.longitude.toFixed(4);
          this.getTimes(coords);
        },
        err => {
          console.log(err);
          console.log('Fallback to IP geolocation');
          this.$axios
            .get('https://ip-api.io/json/')
            .then(response => {
              coords.lat = response.data.lat.toFixed(4);
              coords.lon = response.data.lon.toFixed(4);
              this.getTimes(coords);
            })
            .catch(error => {
              this.settings.snackbar = true;
              console.log(error);
            });
        }
      );
    },
    getTimes(coords) {
      const adhan = require('adhan');
      const moment = require('moment');

      this.getLocation();
      var date = new Date();
      var coordinates = new adhan.Coordinates(coords.lat, coords.lon);
      var params = adhan.CalculationMethod.Karachi();
      params.madhab = adhan.Madhab.Hanafi;
      params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;
      var prayerTimes = new adhan.PrayerTimes(coordinates, date, params);
      var formattedTime = adhan.Date.formattedTime;
      let UTCOffset = moment
        .duration(
          moment()
            .parseZone()
            .format('Z')
        )
        .asHours();
      var milFajr = formattedTime(prayerTimes.fajr, UTCOffset, '24h');
      var milSunrise = formattedTime(prayerTimes.sunrise, UTCOffset, '24h');
      var milDhuhr = formattedTime(prayerTimes.dhuhr, UTCOffset, '24h');
      var milAsr = formattedTime(prayerTimes.asr, UTCOffset, '24h');
      var milMaghrib = formattedTime(prayerTimes.maghrib, UTCOffset, '24h');
      var milIsha = formattedTime(prayerTimes.isha, UTCOffset, '24h');

      this.times.fajr = moment(milFajr, 'HH:mm').format(this.settings.timeFormat);
      this.times.sunrise = moment(milSunrise, 'HH:mm').format(this.settings.timeFormat);
      this.times.dhuhr = moment(milDhuhr, 'HH:mm').format(this.settings.timeFormat);
      this.times.asr = moment(milAsr, 'HH:mm').format(this.settings.timeFormat);
      this.times.maghrib = moment(milMaghrib, 'HH:mm').format(this.settings.timeFormat);
      this.times.isha = moment(milIsha, 'HH:mm').format(this.settings.timeFormat);
      this.localTime = moment().format('MMMM Do YYYY');
      this.timezone =
        'GMT' +
        moment()
          .parseZone()
          .format('Z');

      let unixNow = moment().unix();

      let unixFajr = moment(milFajr, 'HH:mm').unix();
      let unixSunrise = moment(milSunrise, 'HH:mm').unix();
      let unixDhuhr = moment(milDhuhr, 'HH:mm').unix();
      let unixAsr = moment(milAsr, 'HH:mm').unix();
      let unixMaghrib = moment(milMaghrib, 'HH:mm').unix();
      let unixIsha = moment(milIsha, 'HH:mm').unix();

      if (unixNow < unixFajr) {
        this.nextWaqt = 'Fajr';
        this.timeToNextWaqt = moment.unix(unixFajr).fromNow();
      } else if (unixNow < unixSunrise && unixNow > unixFajr) {
        this.nextWaqt = 'Sunrise';
        this.timeToNextWaqt = moment.unix(unixSunrise).fromNow();
      } else if (unixNow < unixDhuhr && unixNow > unixSunrise) {
        this.nextWaqt = 'Dhuhr';
        this.timeToNextWaqt = moment.unix(unixDhuhr).fromNow();
      } else if (unixNow < unixAsr && unixNow > unixDhuhr) {
        this.nextWaqt = 'Asr';
        this.timeToNextWaqt = moment.unix(unixAsr).fromNow();
      } else if (unixNow < unixMaghrib && unixNow > unixAsr) {
        this.nextWaqt = 'Maghrib';
        this.timeToNextWaqt = moment.unix(unixMaghrib).fromNow();
      } else if (unixNow < unixIsha && unixNow > unixMaghrib) {
        this.nextWaqt = 'Isha';
        this.timeToNextWaqt = moment.unix(unixIsha).fromNow();
      }

      this.settings.snackbar = false;
    },
    updateSettings(parameters) {
      this.settings.timeFormat = parameters.timeFormat;
      this.settings.dialog = false;
      this.getLocation();
      localStorage.setItem('timeFormat', parameters.timeFormat);
      location.reload();
    }
  }
};
</script>

<style lang="scss">
@import './styles/base';

.contentBoxes {
  display: grid;
  grid-template-columns: repeat(3, 33.3%);
  grid-template-rows: repeat(2, 220px);
}

@media (max-width: 800px) {
  .contentBoxes {
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: repeat(3, 220px);
  }
}
@media (max-width: 575px) {
  .contentBoxes {
    grid-template-columns: 100%;
    grid-template-rows: repeat(6, 220px);
  }
  #headerBox {
    margin: 30px 50px 10px 50px;
    display: block;
  }
  #headerText {
    text-align: center;
  }
}

@media (min-width: 825px) {
  #secondBossContainer {
    padding: 3% 5%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
  }
}
</style>
