export const topics: Map<string, string> = new Map([
  ["dht", "home/dht/#"],
  ["led", "home/led/control"],
  ["door", "home/door/control"],
  ["gas-level", "home/gas/level"],
  ["gas-alert", "home/gas/alert"],
]);

export const topic = {
  living_room: {
    temperature: "home/livingroom/temperature",
    humidity: "home/livingroom/humidity",
    led1: "home/livingroom/led1",
    led2: "home/livingroom/led2",
    door: "home/livingroom/door",
    fan1: "home/livingroom/fan1",
    fan2: "home/livingroom/fan2",
  },
  kitchen: {
    led: "home/kitchen/led", //ON OFF
    gas_level: "home/kitchen/gasLevel",
    gas_alert: "home/kitchen/gasAlert",
  },
  bathroom: {
    led: "home/bathroom/led",
  },
  bedroom: {
    led: "home/bedroom/led",
    fan: "home/bedroom/fan",
  },
};
