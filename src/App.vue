<template>
  <div id="bossContainer">
    <spinner v-show="settings.loader.loading"/>
    <transition name="fade">
      <settings
        v-if="settings.dialog"
        :city="settings.city"
        :country="settings.country"
        :format="settings.format"
        :localtime="localTime"
        :timezone="timezone"
        @updateParameters="updateSettings"
        @closeWithoutSaving="settings.dialog=false"
      />
    </transition>
    <div id="secondBossContainer">
      <headerbox @showDialog="settings.dialog=true;"/>
      <div class="contentBoxes">
        <div class="contentBox" :class="{ active: currentWaqt=='Fajr' }">
          <div class="divWaqt" id="divWaqt1">
            <div class="waqtName">Fajr</div>
            <div class="waqtTime" id="waqtTime1">{{times.fajr}}</div>
          </div>
        </div>

        <div class="contentBox" :class="{ active: currentWaqt=='Sunrise' }">
          <div class="divWaqt" id="divWaqt2">
            <div class="waqtName">Sunrise</div>
            <div class="waqtTime" id="waqtTime2">{{times.sunrise}}</div>
          </div>
        </div>

        <div class="contentBox" :class="{ active: currentWaqt=='Dhuhr' }">
          <div class="divWaqt" id="divWaqt3">
            <div class="waqtName">Dhuhr</div>
            <div class="waqtTime" id="waqtTime3">{{times.dhuhr}}</div>
          </div>
        </div>

        <div class="contentBox" :class="{ active: currentWaqt=='Asr' }">
          <div class="divWaqt" id="divWaqt4">
            <div class="waqtName">Asr</div>
            <div class="waqtTime" id="waqtTime4">{{times.asr}}</div>
          </div>
        </div>

        <div class="contentBox" :class="{ active: currentWaqt=='Maghrib' }">
          <div class="divWaqt" id="divWaqt5">
            <div class="waqtName">Maghrib</div>
            <div class="waqtTime" id="waqtTime5">{{times.maghrib}}</div>
          </div>
        </div>

        <div class="contentBox" :class="{ active: currentWaqt=='Isha' }">
          <div class="divWaqt" id="divWaqt6">
            <div class="waqtName">Isha</div>
            <div class="waqtTime" id="waqtTime6">{{times.isha}}</div>
          </div>
        </div>
      </div>
      <snackbar v-show="settings.snackbar" @reloadTimes="getTimes()"/>
    </div>
  </div>
</template>

<script>
import snackbar from "@/components/snackbar.vue";
import headerbox from "@/components/headerbox.vue";
import settings from "@/components/settings.vue";
import spinner from "@/components/spinner.vue";

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
        fajr: "...",
        sunrise: "...",
        dhuhr: "...",
        asr: "...",
        maghrib: "...",
        isha: "..."
      },
      localTime: "...",
      timezone: "...",
      method: "...",
      settings: {
        city: "Dhaka",
        country: "Bangladesh",
        method: 1,
        format: "h:mm A",
        snackbar: false,
        dialog: false,
        darkTheme: true,
        loader: {
          loading: false
        }
      },
      currentWaqt: null,
      coordinates: {
        latitude: null,
        longitude: null
      }
    };
  },
  created() {
    axios.interceptors.request.use(
      config => {
        this.settings.loader.loading = true;
        return config;
      },
      error => {
        this.settings.snackbar = true;
        this.settings.loader.loading = false;
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      response => {
        this.settings.loader.loading = false;
        // this.settings.snackbar = true;
        return response;
      },
      error => {
        this.settings.loader.loading = false;
        this.settings.snackbar = true;
        return Promise.reject(error);
      }
    );
    if (localStorage.getItem("city") != null) {
      this.settings.city = localStorage.getItem("city");
      this.settings.country = localStorage.getItem("country");
      this.settings.format = localStorage.getItem("format");
    } else {
      this.settings.city = "Oslo";
      this.settings.country = "Norway";
      this.settings.format = "h:mm A";
    }
  },
  beforeMount() {
    this.getTimes();
  },
  methods: {
    getTimewllaa() {
      //TODO : Delete this
      this.$axios
        .get("https://api.aladhan.com/v1/timingsByCity", {
          params: {
            city: this.settings.city,
            country: this.settings.country,
            method: this.settings.method
          }
        })
        .then(response => {
          let milFajr = response.data.data.timings.Fajr.substring(0, 5);
          let milSunrise = response.data.data.timings.Sunrise.substring(0, 5);
          let milDhuhr = response.data.data.timings.Dhuhr.substring(0, 5);
          let milAsr = response.data.data.timings.Asr.substring(0, 5);
          let milMaghrib = response.data.data.timings.Maghrib.substring(0, 5);
          let milIsha = response.data.data.timings.Isha.substring(0, 5);

          this.times.fajr = this.moment(milFajr, "HH:mm").format(
            this.settings.format
          );
          this.times.sunrise = this.moment(milSunrise, "HH:mm").format(
            this.settings.format
          );
          this.times.dhuhr = this.moment(milDhuhr, "HH:mm").format(
            this.settings.format
          );
          this.times.asr = this.moment(milAsr, "HH:mm").format(
            this.settings.format
          );
          this.times.maghrib = this.moment(milMaghrib, "HH:mm").format(
            this.settings.format
          );
          this.times.isha = this.moment(milIsha, "HH:mm").format(
            this.settings.format
          );

          this.localTime = response.data.data.date.readable;
          this.timezone = response.data.data.meta.timezone;
          this.method = response.data.data.meta.method.name;

          let unixNow = this.moment().unix();

          let unixFajr = this.moment(milFajr, "HH:mm").unix();
          let unixSunrise = this.moment(milSunrise, "HH:mm").unix();
          let unixDhuhr = this.moment(milDhuhr, "HH:mm").unix();
          let unixAsr = this.moment(milAsr, "HH:mm").unix();
          let unixMaghrib = this.moment(milMaghrib, "HH:mm").unix();
          let unixIsha = this.moment(milIsha, "HH:mm").unix();

          if (unixNow < unixFajr) {
            this.currentWaqt = "Fajr";
          } else if (unixNow < unixSunrise && unixNow > unixFajr) {
            this.currentWaqt = "Sunrise";
          } else if (unixNow < unixDhuhr && unixNow > unixSunrise) {
            this.currentWaqt = "Dhuhr";
          } else if (unixNow < unixAsr && unixNow > unixDhuhr) {
            this.currentWaqt = "Asr";
          } else if (unixNow < unixMaghrib && unixNow > unixAsr) {
            this.currentWaqt = "Maghrib";
          } else if (unixNow < unixIsha && unixNow > unixMaghrib) {
            this.currentWaqt = "Isha";
          }

          this.settings.snackbar = false;
          this.settings.loader.loading = false;
        })
        .catch(function(error) {
          if (error) {
            console.error(error);
          }
        });
    },
    getTimes() {
      this.getLocation();
      const adhan = require("adhan");
      var date = new Date();
      var coordinates = new adhan.Coordinates(
        this.coordinates.latitude,
        this.coordinates.longitude
      );
      var params = adhan.CalculationMethod.Karachi();
      params.madhab = adhan.Madhab.Hanafi;
      var prayerTimes = new adhan.PrayerTimes(coordinates, date, params);
      var formattedTime = adhan.Date.formattedTime;
      let milFajr = formattedTime(prayerTimes.fajr, 0, "24h");
      let milSunrise = formattedTime(prayerTimes.sunrise, 0, "24h");
      let milDhuhr = formattedTime(prayerTimes.dhuhr, 0, "24h");
      let milAsr = formattedTime(prayerTimes.asr, 0, "24h");
      let milMaghrib = formattedTime(prayerTimes.maghrib, 0, "24h");
      let milIsha = formattedTime(prayerTimes.isha, 0, "24h");

      this.times.fajr = this.moment(milFajr, "HH:mm").format(
        this.settings.format
      );
      this.times.sunrise = this.moment(milSunrise, "HH:mm").format(
        this.settings.format
      );
      this.times.dhuhr = this.moment(milDhuhr, "HH:mm").format(
        this.settings.format
      );
      this.times.asr = this.moment(milAsr, "HH:mm").format(
        this.settings.format
      );
      this.times.maghrib = this.moment(milMaghrib, "HH:mm").format(
        this.settings.format
      );
      this.times.isha = this.moment(milIsha, "HH:mm").format(
        this.settings.format
      );

      console.log(this.times.fajr);
      console.log(this.times.isha);
      
      
    },
    updateSettings(parameters) {
      this.settings.city = parameters.cityName;
      this.settings.country = parameters.countryName;
      this.settings.format = parameters.timeFormat;
      this.settings.dialog = false;
      this.getTimes();
      localStorage.setItem("format", parameters.timeFormat);
      localStorage.setItem("city", parameters.cityName);
      localStorage.setItem("country", parameters.countryName);
    },
    getLocation() {
      navigator.geolocation.getCurrentPosition(location => {
        this.coordinates.latitude = location.coords.latitude;
        this.coordinates.longitude = location.coords.longitude;
      });
    }
  }
};
</script>

<style lang="scss" src="../styles/style.scss">
</style>
