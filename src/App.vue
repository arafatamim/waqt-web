<template>
  <div>
    <div id="headerBox">
      <div id="headerText">Prayer Times</div>
      <div id="headerIcon"></div>
    </div>
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
  </div>
</template>

<script>
export default {
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
        darkTheme: true
      },
      currentWaqt: "nothing here"
    };
  },
  created(){
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
        })
        .catch(function(error) {
          if (error) {
            this.settings.snackbar = true;
            console.error(error);
            console.log(this.settings);
          }
        });
    },
    getLocation(){
        this.$axios
        .get("http://api.ipstack.com/check", {
          params: {
            access_key: "13c82c1744ce9416a977d1f350c17cb9", // i dont care
            format: 1
          }
        })
        .then(response => {
          this.settings.city = response.data.city,
          this.settings.country = response.data.country_name;
        });
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Poppins:400,600");
$base-font: "Poppins", "Liberation Sans", sans-serif;

body {
  background-color: #222;
}
#headerBox {
  margin: 30px 75px 40px 75px;
  display: inline-table;
}
#headerText {
  font-family: $base-font;
  font-size: 25pt;
  color: #eee;
  border-bottom: 3px dotted #666;
  cursor: pointer;
}
#headerText:hover {
  border-bottom: 3px solid #666;
}
#headerIcon {
  font-family: $base-font;
  font-size: 25pt;
}

.contentBoxes {
  // margin: 0px 0px 25px 25px;
  display: grid;
  grid-template-columns: repeat(3, 33.3%);
  grid-template-rows: repeat(2, 220px);
}
.contentBox {
  margin: 10px;
  padding: 25px;
  color: white;
  // height: 200px;
  // width: 370px;
  border-radius: 20px;
  box-shadow: 30px 30px 80px rgba($color: black, $alpha: 0.5);
}
.contentBox:nth-child(1) {
  background: linear-gradient(315deg, #0cbaba 0%, #380036 74%);
}
.contentBox:nth-child(2) {
  color: #333;
  background: linear-gradient(315deg, #20bf55 0%, #01baef 74%);
}
.contentBox:nth-child(3) {
  color: #333;
  background: linear-gradient(315deg, #f9d29d 0%, #ffd8cb 74%);
}
.contentBox:nth-child(4) {
  color: #333;
  background: linear-gradient(315deg, #fce043 0%, #fb7ba2 74%);
}
.contentBox:nth-child(5) {
  background: linear-gradient(315deg, #d4418e 0%, #0652c5 74%);
}
.contentBox:nth-child(6) {
  background: linear-gradient(315deg, #537895 0%, #09203f 74%);
}
.waqtName {
  font-family: $base-font;
  font-size: 20pt;
}

.waqtTime {
  margin-top: 20px;
  font-family: $base-font;
  font-size: 40pt;
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
</style>
