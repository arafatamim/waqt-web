<template>
  <div id="bossContainer">
    <!-- <spinner v-show="settings.loader.loading"/> -->
    <settings
      v-if="settings.dialog"
      :city="settings.city"
      :country="settings.country"
      :tformat="settings.timeFormat"
      :localtime="localTime"
      :timezone="timezone"
      :coordinates="coordinates"
      @updateParameters="updateSettings"
      @closeWithoutSaving="settings.dialog=false"
    />
    <div id="secondBossContainer">
      <headerbox @showDialog="settings.dialog=true;"/>
      <div class="contentBoxes">
        <div class="contentBox" :class="{ active: nextWaqt=='Fajr' }">
          <div class="divWaqt" id="divWaqt1">
            <div class="waqtName">
              Fajr
              <span v-if="nextWaqt=='Fajr'" class="nextWaqtTime">{{timeToNextWaqt}}</span>
            </div>
            <div class="waqtTime" id="waqtTime1">{{times.fajr}}</div>
          </div>
        </div>

        <div class="contentBox" :class="{ active: nextWaqt=='Sunrise' }">
          <div class="divWaqt" id="divWaqt2">
            <div class="waqtName">
              Sunrise
              <span v-if="nextWaqt=='Sunrise'" class="nextWaqtTime">{{timeToNextWaqt}}</span>
            </div>
            <div class="waqtTime" id="waqtTime2">{{times.sunrise}}</div>
          </div>
        </div>

        <div class="contentBox" :class="{ active: nextWaqt=='Dhuhr' }">
          <div class="divWaqt" id="divWaqt3">
            <div class="waqtName">
              Dhuhr
              <span v-if="nextWaqt=='Dhuhr'" class="nextWaqtTime">{{timeToNextWaqt}}</span>
            </div>
            <div class="waqtTime" id="waqtTime3">{{times.dhuhr}}</div>
          </div>
        </div>

        <div class="contentBox" :class="{ active: nextWaqt=='Asr' }">
          <div class="divWaqt" id="divWaqt4">
            <div class="waqtName">
              Asr
              <span v-if="nextWaqt=='Asr'" class="nextWaqtTime">{{timeToNextWaqt}}</span>
            </div>
            <div class="waqtTime" id="waqtTime4">{{times.asr}}</div>
          </div>
        </div>

        <div class="contentBox" :class="{ active: nextWaqt=='Maghrib' }">
          <div class="divWaqt" id="divWaqt5">
            <div class="waqtName">
              Maghrib
              <span v-if="nextWaqt=='Maghrib'" class="nextWaqtTime">{{timeToNextWaqt}}</span>
            </div>
            <div class="waqtTime" id="waqtTime5">{{times.maghrib}}</div>
          </div>
        </div>

        <div class="contentBox" :class="{ active: nextWaqt=='Isha' }">
          <div class="divWaqt" id="divWaqt6">
            <div class="waqtName">
              Isha
              <span v-if="nextWaqt=='Isha'" class="nextWaqtTime">{{timeToNextWaqt}}</span>
            </div>
            <div class="waqtTime" id="waqtTime6">{{times.isha}}</div>
          </div>
        </div>
      </div>
      <!-- <snackbar v-show="settings.snackbar" @reloadTimes="getTimes()"/> -->
    </div>
  </div>
</template>

<script>
import snackbar from '@/components/snackbar.vue';
import headerbox from '@/components/headerbox.vue';
import settings from '@/components/settings.vue';
import spinner from '@/components/spinner.vue';
import { setInterval } from 'timers';

export default {
    components: {
        snackbar,
        headerbox,
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
            coordinates: {
                latitude: null,
                longitude: null
            }
        };
    },
    created() {
        if (localStorage.getItem('city') != null) {
            this.settings.city = localStorage.getItem('city');
            this.settings.country = localStorage.getItem('country');
            this.settings.timeFormat = localStorage.getItem('timeFormat');
            this.coordinates.latitude = localStorage.getItem('latitude');
            this.coordinates.longitude = localStorage.getItem('longitude');
        } else {
            this.settings.city = 'Oslo';
            this.settings.country = 'Norway';
            this.settings.timeFormat = 'h:mm A';
            this.coordinates.latitude = '59.972';
            this.coordinates.longitude = '10.775';
        }
    },
    beforeMount() {
        setInterval(this.getTimes(), 600000);
    },
    methods: {
        getLocation() {
            navigator.geolocation.getCurrentPosition(location => {
                this.coordinates.latitude = location.coords.latitude;
                this.coordinates.longitude = location.coords.longitude;
            });
        },
        getTimes: function() {
            const adhan = require('adhan');
            const moment = require('moment');

            this.getLocation();
            var date = new Date();
            var coordinates = new adhan.Coordinates(
                this.coordinates.latitude,
                this.coordinates.longitude
            );
            var params = adhan.CalculationMethod.Karachi();
            params.madhab = adhan.Madhab.Hanafi;
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
        },
        updateSettings(parameters) {
            this.settings.city = parameters.cityName;
            this.settings.country = parameters.countryName;
            this.settings.timeFormat = parameters.timeFormat;
            this.coordinates = parameters.coords;
            this.settings.dialog = false;
            this.getTimes();
            localStorage.setItem('timeFormat', parameters.timeFormat);
            localStorage.setItem('city', parameters.cityName);
            localStorage.setItem('country', parameters.countryName);
            localStorage.setItem('latitude', parameters.coords.latitude);
            localStorage.setItem('longitude', parameters.coords.longitude);
        }
    }
};
</script>

<style lang="scss" src="../styles/style.scss">
</style>
