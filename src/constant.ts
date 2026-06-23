export const topics: Map<string, string> = new Map([
  ["dht", "home/dht/#"],
  ["led", "home/led/control"],
  ["door", "home/door/control"],
  ["gas-level", "home/gas/level"],
  ["gas-alert", "home/gas/alert"],
]);

export const topic = {
  livingroom: {
    temperature: "home/livingroom/temperature",
    humidity: "home/livingroom/humidity",
    led1: "home/livingroom/led1",
    led2: "home/livingroom/led2",
    door: "home/livingroom/door",
    fan1: "home/livingroom/fan1",
    fan2: "home/livingroom/fan2",

    // soil: "home/livingroom/soil", //int
    // pump: "home/livingroom/pump", //ON | OFF
    // pumptime: "home/livingroom/pumptime", //string
    motion: "home/livingroom/motion",
    fire:  "home/livingroom/fire"
  },
  kitchen: {
    led: "home/kitchen/led", //ON OFF
    gas_level: "home/kitchen/gasLevel",
    gas_alert: "home/kitchen/gasAlert",
    fire: "home/kitchen/fire"
  },
  bathroom: {
    led: "home/bathroom/led",
  },
  bedroom: {
    motion: "home/bedroom/motion",
    led: "home/bedroom/led",
    fan: "home/bedroom/fan",
  },
  garden: {
    soil: "home/garden/soil",
    pump: "home/garden/pump",
    pumptime:  "home/garden/pumptime"
  }
};

export const baseUrl = "https://python-web-api-hd4b.onrender.com"
export const endpoints = {
  health: "/api/health",  //get
  recognition: "/api/recognition", //post
  latest_recognition: "/api/latest", //get
  history: "/api/history", //get
  clear: "/api/clear" //delete
}