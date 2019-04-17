$(document).ready(() => {
  /* Timezones to display
   * id matches in the index.html
   * tz is a moment timezones identifier
   */
  const zones = [
    {
      id: 'vancouver',
      tz: 'America/Vancouver',
    },
    {
      id: 'manila',
      tz: 'Asia/Manila',
    },
    {
      id: 'london',
      tz: 'Europe/London'
    }
  ];

  const STORE_TZ = 'TZ';
  /**
   * Get the stored TZ from localStorage
   */
  function getStoredTZ() {
    const tz = localStorage.getItem(STORE_TZ);
    return tz;
  }

  /**
   * Saves the TZ to localStorage
   * @param {string} tz the id of the timezone, see above `zones`
   */
  function setStoredTZ(tz) {
    localStorage.setItem(STORE_TZ, tz);
  }

  const inputTimezone = $('#inputTimezone');

  zones.forEach((zone) => {
    const selected = zone.id === getStoredTZ() ? 'selected' : '';
    inputTimezone.append(`<option value="${zone.id}" ${selected} >${zone.tz}</option>`);
  });

  // Update localStorage on change
  inputTimezone.on('change', function() {
    setStoredTZ(inputTimezone.val());
  });

  // Returns the currently selected time zone from the `zones`
  function getFromZone() {
    const val = inputTimezone.val();
    let selected;
    zones.forEach((zone) => {
      if (zone.id == val) { selected = zone; }
    });
    return selected;
  }

  /**
   * Returns the difference between time zones, in minutes.
   * @param {string} tz_a timezone location
   * @param {string} tz_b timezone location
   */
  function offset(tz_a, tz_b) {
    const offset_a = moment.tz.zone(tz_a).utcOffset(moment());
    const offset_b = moment.tz.zone(tz_b).utcOffset(moment());
    return offset_a - offset_b;
  }

  /**
   * Formats with a + or - as appropriate
   * @param {numeric} os minute difference to render
   * @returns {string} formatted offset e.g. - 8:00
   */
  function render_offset(os) {
    let out = "";
    if (os > 0) out = "+ ";
    if (os < 0) out = "- ";
    // @HACK they are some offsets that are not even hours
    out = `${out} ${moment.duration(Math.abs(os), 'minutes').asHours()}:00`;
    return out;
  }

  // Update very second
  setInterval(() => {
    const now = moment();
    const from_zone = getFromZone();
    zones.forEach((zone) => {
      const root = $(`#${zone.id}`);
      root.children('.time').text(now.tz(zone.tz).format('LTS'));
      root.children('.offset').text(render_offset(offset(from_zone.tz, zone.tz)));
      root.children('.date').text(now.tz(zone.tz).format('MMM Do YYYY'))
    });
  }, 1000);
});
