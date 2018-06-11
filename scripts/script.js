$(document).ready(function () {
    setTimes();
});

function setTimes() {
    var city = "Jahra";
    var country = "Kuwait";
    $.ajax({
        url: `http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=9`,
        dataType: 'json',
        success: function (results) {
            var milFajr = results['data']['timings']['Fajr'].substring(0, 5);
            var milSunrise = results['data']['timings']['Sunrise'].substring(0, 5);
            var milDhuhr = results['data']['timings']['Dhuhr'].substring(0, 5);
            var milAsr = results['data']['timings']['Asr'].substring(0, 5);
            var milMaghrib = results['data']['timings']['Maghrib'].substring(0, 5);
            var milIsha = results['data']['timings']['Isha'].substring(0, 5);

            var getFajr = moment(milFajr, 'HH:mm').format('h:mm A');
            var getDhuhr = moment(milDhuhr, 'HH:mm').format('h:mm A');
            var getSunrise = moment(milSunrise, 'HH:mm').format('h:mm A');
            var getAsr = moment(milAsr, 'HH:mm').format('h:mm A');
            var getMaghrib = moment(milMaghrib, 'HH:mm').format('h:mm A');
            var getIsha = moment(milIsha, 'HH:mm').format('h:mm A');
            $("#waqtTime1").text(getFajr);
            $("#waqtTime2").text(getSunrise);
            $("#waqtTime3").text(getDhuhr);
            $("#waqtTime4").text(getAsr);
            $("#waqtTime5").text(getMaghrib);
            $("#waqtTime6").text(getIsha);

            $("#headerText").click(function () {
                alert("Today: " + results['data']['date']['readable'] + "\nTimezone: " + results['data']['meta']['timezone'] + "\n\nBy Tamim Arafat. Uses Al Adhan Prayer Timings API.");
            });
        }
    });
}
