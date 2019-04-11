<template>
  <div>
    <div id="bg" @click="$emit('closeWithoutSaving')"></div>
    <div id="settingsBox">
      <div id="divSettingsHeader">
        <div id="settingsText">Settings</div>
        <font-awesome-icon icon="save" id="closeIcon" @click="closeAndUpdate()"/>
      </div>
      <div id="divSettingsContent">
        <div class="control1">
          City
          <input type="text" name="city" id="txtCity" v-model="parameters.cityName">
        </div>
        <div class="control2">
          Country
          <input type="text" name="country" id="txtCountry" v-model="parameters.countryName">
        </div>
        <!-- <div class="control3">
                Method:
                <select id="cmbMethod">
                  <option value="mwl">Muslim World League</option>
                  <option value="isna">Islamic Society of North America</option>
                  <option value="egas">Egyptian General Authority of Survey</option>
                  <option value="makkah">Umm al-Qura University, Makkah</option>
                  <option value="karachi">University of Islamic Sciences, Karachi</option>
                  <option value="tehran">Institute of Geophysics, University of Tehran</option>
                  <option value="shia">Shia Ithna Ansari, Leva Research Institute, Tehran</option>
                </select>
        </div>-->
        <div class="control3">
          Time format
          <select id="cmbFormat" v-model="parameters.timeFormat">
            <option value="h:mm A">12-hour</option>
            <option value="H:mm">24-hour</option>
          </select>
        </div>
        <div id="localTime">Local Time: {{localtime}}</div>
        <div id="timezone">Timezone: {{timezone}}</div>
        <div id="aboutInfo">
          An app to display current prayer times for the selected location.
          <br>Made with ♥️ by Tamim Arafat.
          <br>
          <a href="http://github.com/arafatamim/waqt-web" target="_blank" class="aboutLink"><font-awesome-icon :icon="['fab', 'github']" /> Source on GitHub</a>
          <br><br>
          <!-- &nbsp;|&nbsp;
          <a href="http://github.com/arafatamim/waqt-web" target="_blank" class="aboutLink"><font-awesome-icon :icon="['fas', 'coffee']" /> Support me :-)</a> -->
          <a href='https://ko-fi.com/Q5Q1TLM1' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["city", "country", "format", "localtime", "timezone"],
  data() {
    return {
      parameters: {
        cityName: this.city,
        countryName: this.country,
        timeFormat: this.format
      }
    };
  },
  methods: {
    closeAndUpdate(parameters) {
      this.$emit("updateParameters", this.parameters);
    }
  }
};
</script>

<style lang='scss' scoped>
@import "styles/_base.scss";

#bg {
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.4;
  z-index: 1000;
}
#settingsBox {
  position: fixed;
  width: 30%;
  // height: 45%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #222;
  border-radius: 20px;
  box-shadow: 20px 20px 50px rgba(0, 0, 0, 0.4);
  padding: 25px;
  z-index: 1001;
}
#divSettingsHeader {
  font-family: $base-font;
  font-size: 15pt;
  color: #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  #closeIcon {
    cursor: pointer;
  }
}
#divSettingsContent {
  font-family: $base-font;
  color: #ddd;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  font-size: 11pt;
  #txtCity,
  #txtCountry {
    font-size: 11pt;
    width: 221px;
    padding: 5px 15px;
    border: none;
    border-radius: 100px;
    font-family: $base-font;
    background-color: #333;
    color: #ddd;
    outline: none;
  }
  #cmbFormat {
    background-color: #333;
    width: 221px;
    box-sizing: content-box;
    padding: 5px 15px;
    font-size: 11pt;
    font-family: $base-font;
    border: none;
    border-radius: 100px;
    font-family: $base-font;
    background-color: #333;
    color: #ddd;
    outline: none;
  }
  .control1,
  .control2,
  .control3 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  #aboutInfo {
    color: #aaa;
  }
  .aboutLink {
    margin-top: 2px;
    color: #bbb;
    text-decoration: none;
  }
  .aboutLink:hover {
    color: #ccc;
  }
}
@media (max-width: 768px) {
  #settingsBox {
    width: 60%;
  }
}
@media (max-width: 825px) {
  #settingsBox {
    width: 60%;
  }
}
@media (max-width: 1024px) {
  #settingsBox {
    width: 50%;
  }
}
@media (max-width: 575px) {
  #settingsBox {
    width: 90%;
    border-radius: 0;
  }
}
@media (max-width: 640px) {
  #settingsBox {
    border-radius: 0;
  }
}
</style>
