import { ref, push } from "firebase/database";
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

  return { controlDevice };
};
