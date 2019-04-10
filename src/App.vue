<template>
  <div id="bossContainer">
    <spinner v-show="settings.loader.loading"/>
    <headerbox @showDialog="settings.dialog=true;"/>
    <div class="contentBoxes">
      <div class="contentBox">
        <div class="divWaqt" id="divWaqt1">
          <div class="waqtName">Fajr</div>
          <div class="waqtTime" id="waqtTime1">{{times.fajr}}</div>
        </div>
      </div>

      <div class="contentBox">
        <div class="divWaqt" id="divWaqt2">
          <div class="waqtName">Sunrise</div>
          <div class="waqtTime" id="waqtTime2">{{times.sunrise}}</div>
        </div>
      </div>

      <div class="contentBox">
        <div class="divWaqt" id="divWaqt3">
          <div class="waqtName">Dhuhr</div>
          <div class="waqtTime" id="waqtTime3">{{times.dhuhr}}</div>
        </div>
      </div>

      <div class="contentBox">
        <div class="divWaqt" id="divWaqt4">
          <div class="waqtName">Asr</div>
          <div class="waqtTime" id="waqtTime4">{{times.asr}}</div>
        </div>
      </div>

      <div class="contentBox">
        <div class="divWaqt" id="divWaqt5">
          <div class="waqtName">Maghrib</div>
          <div class="waqtTime" id="waqtTime5">{{times.maghrib}}</div>
        </div>
      </div>

      <div class="contentBox">
        <div class="divWaqt" id="divWaqt6">
          <div class="waqtName">Isha</div>
          <div class="waqtTime" id="waqtTime6">{{times.isha}}</div>
        </div>
      </div>
    </div>
    <snackbar v-show="settings.snackbar" @reloadTimes="getTimes()"/>
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
      localTime: "Loading...",
      timezone: "Loading...",
      method: "Loading...",
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
      currentWaqt: "nothing here"
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
    getTimes() {
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
    updateSettings(parameters) {
      if (
        parameters.cityName != this.settings.city ||
        parameters.countryName != this.settings.country ||
        parameters.timeFormat != this.settings.format
      ) {
        this.settings.city = parameters.cityName;
        this.settings.country = parameters.countryName;
        this.settings.format = parameters.timeFormat;
        this.settings.dialog = false;
        this.getTimes();
        localStorage.setItem("format", parameters.timeFormat);
        localStorage.setItem("city", parameters.cityName);
        localStorage.setItem("country", parameters.countryName);
      } else {
        this.settings.dialog = false;
      }
    },
    getLocation() {
      this.$axios
        .get("http://api.ipstack.com/check", {
          params: {
            access_key: "13c82c1744ce9416a977d1f350c17cb9", // i dont care
            format: 1
          }
        })
        .then(response => {
          (this.settings.city = response.data.city),
            (this.settings.country = response.data.country_name);
        });
    }
  }
};
</script>

<style lang="scss" src="../styles/style.scss">
</style>
