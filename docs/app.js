$(document).ready(() => {
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

  function offset(tz_a, tz_b) {
    const offset_a = moment.tz.zone(tz_a).utcOffset(moment());
    const offset_b = moment.tz.zone(tz_b).utcOffset(moment());
    return offset_a - offset_b;
  }

  function render_offset(os) {
    let out = "";
    if (os > 0) out = "+ ";
    if (os < 0) out = "- ";
    // @HACK they are some offsets that are not even hours
    out = `${out} ${moment.duration(os, 'minutes').asHours()}:00`;
    return out;
  }

  setInterval(() => {
    const now = moment();
    const from_zone = zones[0];
    zones.forEach((zone) => {
      const root = $(`#${zone.id}`);
      root.children('.time').text(now.tz(zone.tz).format('LTS'));
      root.children('.offset').text(render_offset(offset(from_zone.tz, zone.tz)));
      root.children('.date').text(now.tz(zone.tz).format('MMM Do YYYY'))
    });
  }, 1000);
});
