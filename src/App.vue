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
          <div class="waqtTime" id="waqtTime1">{{waqtFajr}}</div>
        </div>
      </div>

      <div class="contentBox">
        <div class="divWaqt" id="divWaqt2">
          <div class="waqtName">Sunrise</div>
          <div class="waqtTime" id="waqtTime2">{{waqtSunrise}}</div>
        </div>
      </div>

      <div class="contentBox">
        <div class="divWaqt" id="divWaqt3">
          <div class="waqtName">Dhuhr</div>
          <div class="waqtTime" id="waqtTime3">{{waqtDhuhr}}</div>
        </div>
      </div>

      <div class="contentBox">
        <div class="divWaqt" id="divWaqt4">
          <div class="waqtName">Asr</div>
          <div class="waqtTime" id="waqtTime4">{{waqtAsr}}</div>
        </div>
      </div>

      <div class="contentBox">
        <div class="divWaqt" id="divWaqt5">
          <div class="waqtName">Maghrib</div>
          <div class="waqtTime" id="waqtTime5">{{waqtMaghrib}}</div>
        </div>
      </div>

      <div class="contentBox">
        <div class="divWaqt" id="divWaqt6">
          <div class="waqtName">Isha</div>
          <div class="waqtTime" id="waqtTime6">{{waqtIsha}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "app",
  components: {
    HelloWorld
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
