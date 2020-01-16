<template>
  <div id="bossContainer">
    <settings
      v-if="settings.dialog"
      :tformat="settings.timeFormat"
      :calcMethod="settings.method"
      :lateAsr="settings.lateAsr"
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
import Snackbar from '@/components/Snackbar.vue';
import Headerbox from '@/components/Headerbox.vue';
import Timebox from '@/components/Timebox.vue';
import Settings from '@/components/Settings.vue';
import { setInterval } from 'timers';
const moment = require('moment');
require('moment/locale/en-gb');

moment.locale('en-gb');

export default {
  components: {
    Snackbar,
    Headerbox,
    Timebox,
    Settings
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
        method: 'karachi',
        lateAsr: true,
        snackbar: false,
        dialog: false,
        darkTheme: false, // ignore this
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
      this.settings.method = localStorage.getItem('calcMethod');
      this.settings.lateAsr = localStorage.getItem('lateAsr') == 'true';
    } else {
      this.getLocation();
      this.settings.timeFormat = 'h:mm A';
      this.settings.method = this.determineCalcMethod();
      this.settings.lateAsr = true;
    }
    window.addEventListener('popstate', this.handleHistoryChange);
  },
  destroyed() {
    window.removeEventListener('popstate', this.handleHistoryChange);
  },
  beforeMount() {
    setInterval(this.getLocation(), 600000);
  },
  methods: {
    handleHistoryChange() {
      if (location.hash === '#settings') {
        this.settings.dialog = true;
      } else {
        this.settings.dialog = false;
      }
    },
    async getLocation() {
      var coords = {};
      await navigator.geolocation.getCurrentPosition(
        location => {
          coords.lat = location.coords.latitude.toFixed(4);
          coords.lon = location.coords.longitude.toFixed(4);
          this.getTimes(coords);
        },
        err => {
          console.log(err);
          console.log('Fallback to IP geolocation');
          this.$axios
            .get('https://api.ipgeolocationapi.com/geolocate')
            .then(response => {
              coords.lat = response.data.geo.latitude.toFixed(4);
              coords.lon = response.data.geo.longitude.toFixed(4);
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

      // Define the settings for adhan
      const coordinates = new adhan.Coordinates(coords.lat, coords.lon);
      const date = new Date();
      let params;
      const method = this.settings.method;
      switch (method) {
        case 'karachi':
          params = adhan.CalculationMethod.Karachi();
          break;
        case 'mwl':
          params = adhan.CalculationMethod.MuslimWorldLeague();
          break;
        case 'egypt':
          params = adhan.CalculationMethod.Egyptian();
          break;
        case 'makkah':
          params = adhan.CalculationMethod.UmmAlQura();
          break;
        case 'kuwait':
          params = adhan.CalculationMethod.Kuwait();
          break;
        case 'america':
          params = adhan.CalculationMethod.NorthAmerica();
          break;
      }
      // Asr method; Shafi has early Asrs, while Hanafi delays Asr time
      const lateAsr = this.settings.lateAsr;
      switch (lateAsr) {
        case true:
          params.madhab = adhan.Madhab.Hanafi;
          break;
        case false:
          params.madhab = adhan.Madhab.Shafi;
          break;
      }
      // For regions in higher latitudes
      params.highLatitudeRule = adhan.HighLatitudeRule.TwilightAngle;

      // Initialize
      const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);

      let formattedTimes = {
        fajr: moment(prayerTimes.fajr).format(this.settings.timeFormat),
        sunrise: moment(prayerTimes.sunrise).format(this.settings.timeFormat),
        dhuhr: moment(prayerTimes.dhuhr).format(this.settings.timeFormat),
        asr: moment(prayerTimes.asr).format(this.settings.timeFormat),
        maghrib: moment(prayerTimes.maghrib).format(this.settings.timeFormat),
        isha: moment(prayerTimes.isha).format(this.settings.timeFormat)
      };

      // Set data
      this.times = formattedTimes;
      this.localTime = moment().format('MMMM Do YYYY');
      this.timezone =
        'GMT' +
        moment()
          .parseZone()
          .format('Z');
      const { nextWaqt, timeToNextWaqt } = this.determineNextWaqt(formattedTimes);
      this.nextWaqt = nextWaqt;
      this.timeToNextWaqt = timeToNextWaqt;

      // Hide snackbar on success
      this.settings.snackbar = false;
    },
    determineNextWaqt(formattedTimes) {
      const unixNow = moment().unix();

      const unixFajr = moment(formattedTimes.fajr, this.settings.timeFormat).unix();
      const unixSunrise = moment(formattedTimes.sunrise, this.settings.timeFormat).unix();
      const unixDhuhr = moment(formattedTimes.dhuhr, this.settings.timeFormat).unix();
      const unixAsr = moment(formattedTimes.asr, this.settings.timeFormat).unix();
      const unixMaghrib = moment(formattedTimes.maghrib, this.settings.timeFormat).unix();
      const unixIsha = moment(formattedTimes.isha, this.settings.timeFormat).unix();

      let nextWaqt;
      let timeToNextWaqt;

      if (unixNow < unixFajr) {
        nextWaqt = 'Fajr';
        timeToNextWaqt = moment.unix(unixFajr).fromNow();
      } else if (unixNow < unixSunrise && unixNow > unixFajr) {
        nextWaqt = 'Sunrise';
        timeToNextWaqt = moment.unix(unixSunrise).fromNow();
      } else if (unixNow < unixDhuhr && unixNow > unixSunrise) {
        nextWaqt = 'Dhuhr';
        timeToNextWaqt = moment.unix(unixDhuhr).fromNow();
      } else if (unixNow < unixAsr && unixNow > unixDhuhr) {
        nextWaqt = 'Asr';
        timeToNextWaqt = moment.unix(unixAsr).fromNow();
      } else if (unixNow < unixMaghrib && unixNow > unixAsr) {
        nextWaqt = 'Maghrib';
        timeToNextWaqt = moment.unix(unixMaghrib).fromNow();
      } else if (unixNow < unixIsha && unixNow > unixMaghrib) {
        nextWaqt = 'Isha';
        timeToNextWaqt = moment.unix(unixIsha).fromNow();
      } else if (unixNow > unixIsha) {
        nextWaqt = 'Fajr';
        timeToNextWaqt = 'tomorrow';
      }

      return {
        nextWaqt,
        timeToNextWaqt
      };
    },
    /** Determines calculation method coarsely from timezone */
    determineCalcMethod() {
      const timeZone = parseInt(
        moment()
          .parseZone()
          .format('Z')
      );
      if (timeZone >= 0 && timeZone <= 2) {
        return 'mwl';
      } else if (timeZone >= 3 && timeZone <= 4) {
        return 'makkah';
      } else if (timeZone >= 5 && timeZone <= 7) {
        return 'karachi';
      } else if (timeZone >= 8 && timeZone <= 12) {
        return 'mwl';
      } else {
        return 'mwl';
      }
    },
    updateSettings(parameters) {
      this.settings.timeFormat = parameters.timeFormat;
      this.settings.method = parameters.calcMethod;
      this.settings.lateAsr = parameters.lateAsr;
      this.settings.dialog = false;
      this.getLocation();
      localStorage.setItem('timeFormat', parameters.timeFormat);
      localStorage.setItem('calcMethod', parameters.calcMethod);
      localStorage.setItem('lateAsr', parameters.lateAsr);
      // location.reload();
    }
  },
  watch: {
    'settings.dialog': function(val) {
      if (val === true) {
        location.hash = 'settings';
      } else {
        location.hash = '';
      }
    }
  }
};
</script>

<style lang="scss">
@import './styles/base';

.contentBoxes {
  display: grid;
  grid-template-columns: repeat(3, 33.3%);
  grid-template-rows: repeat(2, 210px);
}

@media (max-width: 800px) {
  .contentBoxes {
    grid-template-columns: repeat(2, 50%);
    grid-template-rows: repeat(3, 210px);
  }
}
@media (max-width: 575px) {
  .contentBoxes {
    grid-template-columns: 100%;
    grid-template-rows: repeat(6, 210px);
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
