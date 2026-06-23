import { useCallback, useEffect, useRef, useState } from "react";
import mqtt from "mqtt";
import { ref, onValue } from "firebase/database";
import { database } from "../config/firebase";
import { useDeviceControl } from "./useDeviceControl";
import { topic as roomTopics } from "../constant";

export type ConnectionStatus =
  | "FETCHING_CLOUD"
  | "CONNECTING"
  | "CONNECTED"
  | "RECONNECTING"
  | "ERROR";

export interface SensorData {
  livingroom: {
    temperature: number | null;
    humidity: number | null;
    led1: string | null;
    led2: string | null;
    door: string | null;
    fan1: string | null;
    fan2: string | null;
    motion: string | null;
    fire: string | null;
  };
  garden: {
    soil: number | null;
    pump: string | null;
    pumptime: string | null;
  };
  kitchen: {
    led: string | null;
    gasLevel: number | null;
    gasAlert: string | null;
    fire: "SAFE" | string | null;
  };
  bathroom: {
    led: string | null;
  };
  bedroom: {
    led: string | null;
    fan: string | null;
  };
  global: {
    servo: string | null;
  };
}

type RoomKey = "livingroom" | "kitchen" | "bathroom" | "bedroom" | "garden";

type Props = {
  room?: "all" | RoomKey;
};

const defaultState: SensorData = {
  livingroom: {
    temperature: null,
    humidity: null,
    led1: null,
    led2: null,
    door: null,
    fan1: null,
    fan2: null,
    motion: null,
    fire: null,
  },
  garden: {
    soil: null,
    pump: null,
    pumptime: null,
  },
  kitchen: { led: null, gasLevel: null, gasAlert: null, fire: null },
  bathroom: { led: null },
  bedroom: { led: null, fan: null },
  global: { servo: null },  
};

const useSensors = ({ room = "all" }: Props) => {
  const { controlDevice, syncDeviceState } = useDeviceControl();

  const [status, setStatus] = useState<ConnectionStatus>("FETCHING_CLOUD");
  const [data, setData] = useState<SensorData>(defaultState);
  const clientRef = useRef<mqtt.MqttClient | null>(null);

  const connectToMQTT = useCallback(() => {
    if (clientRef.current) return;

    const client = mqtt.connect(import.meta.env.VITE_MQTT_BROKER, {
      username: import.meta.env.VITE_MQTT_USERNAME,
      password: import.meta.env.VITE_MQTT_PASSWORD,
      clean: true,
      reconnectPeriod: 5000,
    });
    clientRef.current = client;

    const getSubscribeTopics = () => {
      if (room === "all") return ["home/#"];
      const selectedRoomTopics = roomTopics[room as RoomKey];
      return Object.values(selectedRoomTopics);
    };

    client.on("connect", () => {
      setStatus("CONNECTED");
      client.subscribe(getSubscribeTopics());
    });

    client.on("reconnect", () => setStatus("RECONNECTING"));
    client.on("error", () => setStatus("ERROR"));
    client.on("offline", () => setStatus("RECONNECTING"));

    client.on("message", (topic, message) => {
      const value = message.toString();

      for (const [roomKey, devices] of Object.entries(roomTopics)) {
        if (typeof devices === "object") {
          for (const [deviceKey, deviceTopic] of Object.entries(devices)) {
            if (deviceTopic === topic) {
              const rKey = roomKey as keyof SensorData;

              const parsedValue =
                deviceKey === "temperature" ||
                deviceKey === "humidity" ||
                deviceKey === "gas_level" ||
                deviceKey === "soil"
                  ? parseFloat(value)
                  : value;

              setData((prev) => ({
                ...prev,
                [rKey]: { ...prev[rKey], [deviceKey]: parsedValue },
              }));

              syncDeviceState(roomKey, deviceKey, parsedValue);
              return;
            }
          }
        }
      }
    });
  }, [room, syncDeviceState]);

  useEffect(() => {
    const dbRef = ref(database, "smart_home/current_state");

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const cloudData = snapshot.val();
          console.log("⚡ Firebase Live Sync:", cloudData);

          setData((prev) => {
            const mergedState = { ...prev };
            for (const key in cloudData) {
              const rKey = key as keyof SensorData;
              if (mergedState[rKey]) {
                mergedState[rKey] = { ...mergedState[rKey], ...cloudData[key] };
              }
            }
            return mergedState;
          });
        } else {
          console.log("ℹ️ No cloud state found. Using defaults.");
        }

        setStatus((currentStatus) => {
          if (currentStatus === "FETCHING_CLOUD") {
            connectToMQTT();
            return "CONNECTING";
          }
          return currentStatus;
        });
      },
      (error) => {
        console.error("❌ Firebase Live Sync Error:", error);
      },
    );

    return () => unsubscribe();
  }, [connectToMQTT]);

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.end();
        clientRef.current = null;
      }
    };
  }, []);

  const publishMessage = useCallback(
    (topic: string, message: string) => {
      if (clientRef.current?.connected) {
        for (const [roomKey, devices] of Object.entries(roomTopics)) {
          if (typeof devices === "object") {
            for (const [deviceKey, deviceTopic] of Object.entries(devices)) {
              if (deviceTopic === topic) {
                const rKey = roomKey as keyof SensorData;

                setData((prev) => ({
                  ...prev,
                  [rKey]: { ...prev[rKey], [deviceKey]: message },
                }));

                controlDevice(`${topic} changed to ${message}`);

                syncDeviceState(roomKey, deviceKey, message);

                clientRef.current.publish(topic, message, { qos: 1 });

                return;
              }
            }
          }
        }
      }
    },
    [controlDevice, syncDeviceState],
  );

  return { data, publishMessage, status };
};

export default useSensors;
