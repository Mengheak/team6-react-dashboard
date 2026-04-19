import { useCallback, useEffect, useRef, useState } from "react";
import mqtt from "mqtt";
import { ref, get, child } from "firebase/database";
import { database } from "../config/firebase"; // Make sure this path is correct
import { useDeviceControl } from "./useDeviceControl";
import { topic as roomTopics } from "../constant";

export type ConnectionStatus = "FETCHING_CLOUD" | "CONNECTING" | "CONNECTED" | "RECONNECTING" | "ERROR";

export interface SensorData {
  living_room: {
    temperature: number | null;
    humidity: number | null;
    led1: string | null;
    led2: string | null;
    door: string | null;
    fan1: string | null;
    fan2: string | null;
  };
  kitchen: {
    led: string | null;
    gasLevel: number | null;
    gasAlert: string | null;
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

type RoomKey = "living_room" | "kitchen" | "bathroom" | "bedroom";

type Props = {
  room?: "all" | RoomKey;
};

const defaultState: SensorData = {
  living_room: { temperature: null, humidity: null, led1: null, led2: null, door: null, fan1: null, fan2: null },
  kitchen: { led: null, gasLevel: null, gasAlert: null },
  bathroom: { led: null },
  bedroom: { led: null, fan: null },
  global: { servo: null }
};

const useSensors = ({ room = "all" }: Props) => {
  const { controlDevice, syncDeviceState } = useDeviceControl();
  
  const [status, setStatus] = useState<ConnectionStatus>("FETCHING_CLOUD");
  const [data, setData] = useState<SensorData>(defaultState);
  const clientRef = useRef<mqtt.MqttClient | null>(null);

  // --- 1. BOOT SEQUENCE: Fetch from Firebase ONCE on load ---
  useEffect(() => {
    const fetchCloudState = async () => {
      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, "smart_home/current_state"));
        
        if (snapshot.exists()) {
          const cloudData = snapshot.val();
          console.log("✅ Cloud state loaded:", cloudData);
          
          // Safely merge cloud data with default state
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
      } catch (error) {
        console.error("❌ Firebase Fetch Error:", error);
      } finally {
        connectToMQTT(); // Move on to MQTT connection
      }
    };

    fetchCloudState();
  }, []); // Empty array ensures this only runs on mount

  // --- 2. CONNECT TO MQTT & LISTEN FOR HARDWARE EVENTS ---
  const connectToMQTT = useCallback(() => {
    setStatus("CONNECTING");
    
    if (clientRef.current) return; // Prevent double connections

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

    // Handle messages coming directly from the hardware (Sensors, physical switches)
    client.on("message", (topic, message) => {
      const value = message.toString();

      for (const [roomKey, devices] of Object.entries(roomTopics)) {
        if (typeof devices === 'object') {
          for (const [deviceKey, deviceTopic] of Object.entries(devices)) {
            if (deviceTopic === topic) {
              const rKey = roomKey as keyof SensorData;
              
              // Parse numbers for sensors, keep strings for ON/OFF
              const parsedValue = (deviceKey === 'temperature' || deviceKey === 'humidity' || deviceKey === 'gas_level') 
                ? parseFloat(value) 
                : value;

              // 1. Update React UI
              setData((prev) => ({
                ...prev,
                [rKey]: { ...prev[rKey], [deviceKey]: parsedValue }
              }));

              // 2. Sync to Firebase (so the cloud knows the hardware changed)
              syncDeviceState(roomKey, deviceKey, parsedValue);
              return; 
            }
          }
        }
      }
    });

  }, [room, syncDeviceState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.end();
        clientRef.current = null;
      }
    };
  }, []);

  // --- 3. HANDLE DASHBOARD CLICKS ---
  const publishMessage = useCallback((topic: string, message: string) => {
    if (clientRef.current?.connected) {
      
      for (const [roomKey, devices] of Object.entries(roomTopics)) {
        if (typeof devices === 'object') {
          for (const [deviceKey, deviceTopic] of Object.entries(devices)) {
            if (deviceTopic === topic) {
              const rKey = roomKey as keyof SensorData;
              
              // 1. OPTIMISTIC UI UPDATE
              setData((prev) => ({
                ...prev,
                [rKey]: { ...prev[rKey], [deviceKey]: message }
              }));

              // 2. FIREBASE LOG
              controlDevice(`${topic} changed to ${message}`);

              // 3. FIREBASE STATE OVERWRITE
              syncDeviceState(roomKey, deviceKey, message);

              // 4. HARDWARE COMMAND
              clientRef.current.publish(topic, message, { qos: 1 });
              
              return; 
            }
          }
        }
      }
    }
  }, [controlDevice, syncDeviceState]); 

  // Make sure to return 'status' here so your UI can show the loading screen!
  return { data, publishMessage, status };
};

export default useSensors;