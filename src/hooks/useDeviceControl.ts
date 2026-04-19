import { ref, push, update } from "firebase/database";
import { auth, database } from "../config/firebase";

export const useDeviceControl = () => {
  const controlDevice = async (description: string, email?: string) => {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not authenticated");
    }
    const activity = {
      email: email || user.email,
      type: "DEVICE_CONTROL",
      desc: description,
      timestamp: Date.now(),
    };
    console.log("Pushing activity")
    await push(ref(database, "smart_home/activities"), activity);
  };


  const syncDeviceState = async (roomKey: string, deviceKey: string, value: string | number) => {
    const stateRef = ref(database, `smart_home/current_state/${roomKey}`);
    try {
      await update(stateRef, { [deviceKey]: value });
    } catch (error) {
      console.error("Failed to sync state to Firebase:", error);
    }
  };
  return { controlDevice, syncDeviceState };
};
