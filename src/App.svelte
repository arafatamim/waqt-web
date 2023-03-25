<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { PrayerTimes, Prayer, CalculationMethod, Coordinates } from 'adhan';
  import type { ValueOf } from 'adhan/lib/types/TypeUtils';
  import { formatDistanceStrict } from 'date-fns';
  import { times, settings } from './store/store';
  import Snackbar from './components/Snackbar.svelte';
  import Headerbox from './components/Headerbox.svelte';
  import Timebox from './components/Timebox.svelte';
  import SettingsDialog from './components/Settings.svelte';
  import { Ombro } from 'ombro';

  type Prayer = ValueOf<typeof Prayer>;

  const prayers = [
    'Fajr',
    'Sunrise',
    'Dhuhr',
    'Asr',
    'Maghrib',
    'Isha',
  ] as const;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Update times every set interval
  const interval = setInterval(() => setTimes().catch(setError), 60 * 1000);

  let localTime: Date = new Date();
  let nextPrayer: Prayer = Prayer.None;
  let timeToNextPrayer: string;
  let snackbar = false;
  let dialog = false;
  let error: string;

  function setError(e: any) {
    console.error(e);
    error = e.message;
    snackbar = true;
  }

  const calculateShadows = () => {
    let light: HTMLDivElement | undefined =
      document.querySelector<HTMLDivElement>('.active');
    let muted = document.querySelectorAll<HTMLDivElement>('.muted');
    if (light == null) {
      return;
    }
    const pos = light.getBoundingClientRect();
    const lightX = (pos.left + pos.right) / 2,
      lightY = (pos.top + pos.bottom) / 2;
    light.style.boxShadow = ''; // reset existing shadow before redrawing
    for (const el of muted) {
      el.style.boxShadow = ''; // reset shadow
      const ombro = new Ombro(el, { opacity: 0.3, enableAutoUpdates: false });
      ombro.setLightPosition(lightX, lightY);
      ombro.draw();
    }
  };

  $: {
    if (nextPrayer != null && nextPrayer != Prayer.None) {
      setTimeout(() => calculateShadows());
    }
  }

  const resizeHandler = () => {
    if (nextPrayer != null && nextPrayer != Prayer.None) {
      setTimeout(() => calculateShadows());
    }
  };

  onMount(() => {
    window.addEventListener('resize', resizeHandler);

    if (localStorage.getItem('timeFormat') != null) {
      $settings = {
        colorScheme: localStorage.getItem('colorScheme') as ColorScheme,
        timeFormat: localStorage.getItem('timeFormat')!,
        calcMethod: localStorage.getItem('calcMethod')!,
        city: localStorage.getItem('city') ?? null,
        latitude: Number(localStorage.getItem('latitude')!),
        longitude: Number(localStorage.getItem('longitude')!),
      };
      init();
    } else {
      getCurrentPosition()
        .then(([latitude, longitude]) => {
          $settings = {
            ...$settings,
            city: null,
            calcMethod: determineCalcMethod(),
            timeFormat: 'h:mm a',
            latitude,
            longitude,
          };
        })
        .then(() => {
          init();
        })
        .catch((e) => {
          if (e instanceof GeolocationPositionError) {
            setError(new Error('Could not automatically detect your location'));
          }
          dialog = true;
        });
    }
  });

  onDestroy(() => {
    clearInterval(interval);
    window.removeEventListener('resize', calculateShadows);
  });

  function saveToStorage() {
    localStorage.setItem('timeFormat', $settings.timeFormat);
    localStorage.setItem('calcMethod', $settings.calcMethod);
    localStorage.setItem('city', $settings.city);
    localStorage.setItem('latitude', $settings.latitude.toString());
    localStorage.setItem('longitude', $settings.longitude.toString());
    localStorage.setItem('colorScheme', $settings.colorScheme);
  }

  async function init() {
    snackbar = false;
    setColorScheme();
    setTimes().catch(setError);
  }

  function setColorScheme() {
    switch ($settings.colorScheme) {
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

    const { latitude, longitude } = $settings;
    if (latitude == null || longitude == null) {
      throw new Error('Location is not set. Specify coordinates in settings.');
    }

    // Define the settings for adhan
    const prayerTimes = new PrayerTimes(
      new Coordinates(latitude, longitude),
      localTime,
      CalculationMethod[$settings.calcMethod]()
    );

    const { fajr, sunrise, dhuhr, asr, maghrib, isha } = prayerTimes;
    $times = { fajr, sunrise, dhuhr, asr, maghrib, isha };

    // Set data
    nextPrayer = prayerTimes.nextPrayer(localTime);
    if (nextPrayer != Prayer.None) {
      document.documentElement.style.setProperty(
        '--glow-color',
        `var(--${
          prayerEnumToString(nextPrayer)?.toLowerCase() ?? 'noop'
        }-color)`
      );
      document.documentElement.style.setProperty(
        '--glow-color-secondary',
        `var(--${
          prayerEnumToString(nextPrayer)?.toLowerCase() ?? 'noop'
        }-color-secondary)`
      );
    }
    if (nextPrayer !== Prayer.None) {
      const nextPrayerTime = prayerTimes.timeForPrayer(nextPrayer);
      if (isNaN(nextPrayerTime.getTime())) {
        return;
      }
      timeToNextPrayer = formatDistanceStrict(nextPrayerTime, localTime, {
        addSuffix: true,
        roundingMethod: 'round',
      });
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
  function determineCalcMethod(): string {
    const utcOffset = -(localTime.getTimezoneOffset() / 60);
    if (utcOffset >= 0 && utcOffset <= 2) {
      return CalculationMethod.MuslimWorldLeague().method;
    } else if (utcOffset >= 3 && utcOffset <= 4) {
      return CalculationMethod.UmmAlQura().method;
    } else if (utcOffset >= 5 && utcOffset <= 7) {
      return CalculationMethod.Karachi().method;
    } else if (utcOffset >= 8 && utcOffset <= 12) {
      return CalculationMethod.MuslimWorldLeague().method;
    } else if (utcOffset <= -5 && utcOffset >= -9) {
      return CalculationMethod.MoonsightingCommittee().method;
    } else {
      return CalculationMethod.MuslimWorldLeague().method;
    }
  }

  async function getCurrentPosition() {
    return new Promise<[lat: number, long: number]>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => resolve([coords.latitude, coords.longitude]),
        reject
      );
    });
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
  <div class="content-boxes">
    {#each prayers as prayer}
      <Timebox
        prayerName={prayer}
        prayerTime={$times[prayer?.toLowerCase()]}
        isNextPrayer={prayerEnumToString(nextPrayer) === prayer}
        {timeToNextPrayer}
      />
    {/each}
  </div>
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
