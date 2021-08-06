<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { PrayerTimes, Prayer, CalculationMethod } from 'adhan';
  import { formatDistanceStrict } from 'date-fns';
  import { timesStore, settingsStore } from './store/store';
  import { fade } from 'svelte/transition';
  import Snackbar from './components/Snackbar.svelte';
  import Headerbox from './components/Headerbox.svelte';
  import Timebox from './components/Timebox.svelte';
  import SettingsDialog from './components/Settings.svelte';
  import getCurrentPosition from './getCurrentPosition';

  const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  let times: Nullable<Prayers> | null = null;
  let settings: Settings | null = null;
  let localTime: Date = new Date();
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  let nextPrayer: Prayer | null = null;
  let timeToNextPrayer: string | null = null;
  let snackbar = false;
  let dialog = false;
  let error: string | null = null;
  const interval = setInterval(() => init(), 60 * 1000);

  const unsubscribeTimesStore = timesStore.subscribe(
    (value) => (times = value)
  );
  const unsubscribeSettingsStore = settingsStore.subscribe(
    (v) => (settings = v)
  );

  function setError(e: any) {
    console.error(e);
    error = e.message;
    snackbar = true;
  }

  onMount(() => {
    if (localStorage.getItem('timeFormat') != null) {
      settingsStore.update((v) => ({
        colorScheme: localStorage.getItem('colorScheme') as ColorScheme,
        timeFormat: localStorage.getItem('timeFormat')!,
        calcMethod: localStorage.getItem('calcMethod')! as CalcMethod,
        latitude: Number(localStorage.getItem('latitude')!),
        longitude: Number(localStorage.getItem('longitude')!),
      }));
      init();
    } else {
      getCurrentPosition()
        .then(([latitude, longitude]) => {
          settingsStore.update((s) => ({
            ...s,
            calcMethod: determineCalcMethod(),
            timeFormat: 'h:mm a',
            latitude,
            longitude,
          }));
        })
        .then(() => {
          init();
        })
        .catch(setError);
    }
  });

  onDestroy(() => {
    unsubscribeSettingsStore();
    unsubscribeTimesStore();
    clearInterval(interval);
  });

  function saveToStorage() {
    localStorage.setItem('timeFormat', settings.timeFormat);
    localStorage.setItem('calcMethod', settings.calcMethod);
    localStorage.setItem('latitude', settings.latitude.toString());
    localStorage.setItem('longitude', settings.longitude.toString());
    localStorage.setItem('colorScheme', settings.colorScheme);
  }

  async function init() {
    snackbar = false;
    setColorScheme();
    setTimes().catch(setError);
  }

  function setColorScheme() {
    switch (settings.colorScheme) {
      case 'default':
        document.body.className = '';
        break;
      case 'dark':
        document.body.className = 'dark';
        break;
      case 'light':
        document.body.className = 'light';
        break;
    }
  }

  async function setTimes() {
    localTime = new Date();

    if (settings == null) {
      throw new Error('Settings were never initialized');
    }

    const { latitude, longitude } = settings;

    if (latitude == null || longitude == null) {
      throw new Error('Location is not set');
    }

    // Define the settings for adhan
    const prayerTimes = new PrayerTimes(
      { latitude, longitude },
      new Date(),
      mapStringToParams(settings.calcMethod)
    );
    const { fajr, sunrise, dhuhr, asr, maghrib, isha } = prayerTimes;
    timesStore.set({ fajr, sunrise, dhuhr, asr, maghrib, isha });

    // Set data
    nextPrayer = prayerTimes.nextPrayer();
    if (nextPrayer != null && nextPrayer !== Prayer.None) {
      timeToNextPrayer = formatDistanceStrict(
        prayerTimes.timeForPrayer(nextPrayer),
        localTime,
        {
          addSuffix: true,
          roundingMethod: 'round',
        }
      );
    }
  }

  function mapStringToParams(method: CalcMethod): adhan.CalculationParameters {
    switch (method) {
      case 'karachi':
        return CalculationMethod.Karachi();
      case 'mwl':
        return CalculationMethod.MuslimWorldLeague();
      case 'egypt':
        return CalculationMethod.Egyptian();
      case 'makkah':
        return CalculationMethod.UmmAlQura();
      case 'kuwait':
        return CalculationMethod.Kuwait();
      case 'isna':
        return CalculationMethod.NorthAmerica();
      case 'singapore':
        return CalculationMethod.Singapore();
      case 'turkey':
        return CalculationMethod.Turkey();
      case 'mcw':
        return CalculationMethod.MoonsightingCommittee();
      default:
        throw new Error('Unsupported calculation method');
    }
  }

  function prayerEnumToString(prayer: Prayer) {
    switch (prayer) {
      case Prayer.Fajr:
        return 'Fajr';
      case Prayer.Dhuhr:
        return 'Dhuhr';
      case Prayer.Asr:
        return 'Asr';
      case Prayer.Maghrib:
        return 'Maghrib';
      case Prayer.Isha:
        return 'Isha';
      case Prayer.Sunrise:
        return 'Sunrise';
      default:
        return null;
    }
  }

  /** Coarse approximation of method from timezone */
  function determineCalcMethod(): CalcMethod {
    const timeZone = -(localTime.getTimezoneOffset() / 60);
    if (timeZone >= 0 && timeZone <= 2) {
      return 'mwl';
    } else if (timeZone >= 3 && timeZone <= 4) {
      return 'makkah';
    } else if (timeZone >= 5 && timeZone <= 7) {
      return 'karachi';
    } else if (timeZone >= 8 && timeZone <= 12) {
      return 'mwl';
    } else if (timeZone <= -5 && timeZone >= -9) {
      return 'mcw';
    } else {
      return 'mwl';
    }
  }
</script>

{#if dialog}
  <SettingsDialog
    {localTime}
    {timeZone}
    onClose={() => {
      dialog = false;
      init();
      saveToStorage();
    }}
  />
{/if}

<div id="boss-container">
  <Headerbox onClick={() => (dialog = true)} />
  {#if times != null}
    <div class="content-boxes">
      {#each prayers as prayer}
        <Timebox
          prayerName={prayer}
          prayerTime={times[prayer.toLowerCase()]}
          isNextPrayer={prayerEnumToString(nextPrayer) === prayer}
          {timeToNextPrayer}
        />
      {/each}
    </div>
  {/if}
</div>

{#if snackbar && error != null}
  <Snackbar onReload={() => init()} message={error} />
{/if}

<style lang="scss">
  .content-boxes {
    display: grid;
    grid-template-columns: repeat(3, 33.3%);
    grid-template-rows: repeat(2, 210px);
  }

  @media (max-width: 800px) {
    .content-boxes {
      grid-template-columns: repeat(2, 50%);
      grid-template-rows: repeat(3, 210px);
    }
  }
  @media (max-width: 575px) {
    .content-boxes {
      grid-template-columns: 100%;
      grid-template-rows: repeat(6, 210px);
    }
    // #header-box {
    //   margin: 30px 50px 10px 50px;
    //   display: block;
    // }
    // #header-text {
    //   text-align: center;
    // }
  }

  @media (min-width: 825px) {
    #boss-container {
      padding: 3% 5%;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
    }
  }
</style>
