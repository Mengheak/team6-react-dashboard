import { useCallback, useEffect, useRef, useState } from "react";
import mqtt from "mqtt";
import { useDeviceControl } from "./useDeviceControl";
import { topics } from "../constant";

interface SensorData {
  temperature: number;
  humidity: number;
  led: "ON" | "OFF" | string;
  servo: "ON" | "OFF" | string;
  gasLevel: number;
  gasAlert: string;
}

export const useSensors = () => {
  const { controlDevice } = useDeviceControl();
  const [data, setData] = useState<SensorData>({
    temperature: 0,
    humidity: 0,
    led: "",
    servo: "",
    gasLevel: 0,
    gasAlert: "",
  });

  const clientRef = useRef<mqtt.MqttClient | null>(null);

  useEffect(() => {
    const client = mqtt.connect(
      import.meta.env.VITE_MQTT_BROKER,
      {
        username: import.meta.env.MQTT_USERNAME,
        password: import.meta.env.VITE_MQTT_PASSWORD,
        clean: true,
        reconnectPeriod: 5000,
      },
    );
    clientRef.current = client;
    client.on("connect", () => {
      console.log("✅ Connected to MQTT broker");

      client.subscribe([
        "home/dht/#",
        "home/led/control",
        "home/door/control",
        "home/gas/#",
      ]);
    });

    client.on("message", (topic, message) => {
      console.log(topic, message.toString())
      const value = message.toString();
      setData((prev) => {
        if (topic.includes("temperature")) {
          return { ...prev, temperature: parseFloat(value) };
        }

        if (topic.includes("humidity")) {
          return { ...prev, humidity: parseFloat(value) };
        }

        if (topic === topics.get("led")) {
          return { ...prev, led: value };
        }

        if (topic === topics.get("door")) {
          return { ...prev, servo: value };
        }

        if (topic === topics.get("gas-level")) {
          return { ...prev, gasLevel: parseFloat(value) };
        }

        if (topic === topics.get("gas-alert")) {
          return { ...prev, gasAlert: value };
        }

        return prev;
      });
    });

    return () => {
      client.end();
    };
  }, []);

  const publishMessage = useCallback((topic: string, message: string) => {
    if (clientRef.current && clientRef.current.connected) {
      controlDevice(topic + " changed status to " + message);
      clientRef.current.publish(topic, message, { qos: 1 }, (err) => {
        if (err) console.error("Publish error:", err);
      });
    } else {
      console.warn("MQTT client not connected");
    }
  }, [controlDevice]);

  return { data, publishMessage };
};
