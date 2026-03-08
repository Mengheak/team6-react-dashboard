// src/hooks/useRealtimeData.ts
import { useEffect, useState } from "react";
import { ref, onValue, off, DataSnapshot } from "firebase/database";
import { database } from "../config/firebase";

export interface RealtimeActivity {
  email: string;
  userId: string;
  action: string;
  endpoint?: string;
  method?: string;
  desc?: string;
  status?: "SUCCESS" | "FAILED";
  timestamp: number;
  responseTime?: number;
}

export const useActivity = (path: string = "smart_home/activities") => {
  const [activities, setActivities] = useState<RealtimeActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Create reference to the database path
    const dbRef = ref(database, path);
    
    // Set up realtime listener
    const handleData = (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      
      if (data) {
        // Convert object to array (since Realtime DB returns an object)
        const activitiesArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })) as RealtimeActivity[];
        
        activitiesArray.sort((a, b) => b.timestamp - a.timestamp);
        
        setActivities(activitiesArray);
      } else {
        setActivities([]);
      }
      
      setLoading(false);
    };
    
    const handleError = (error: Error) => {
      console.error("Error fetching from Realtime DB:", error);
      setError(error.message);
      setLoading(false);
    };
    
    // Subscribe to realtime updates
    onValue(dbRef, handleData, handleError);
    
    // Cleanup subscription on unmount
    return () => {
      off(dbRef);
    };
  }, [path]); // Re-run if path changes

  return { activities, loading, error };
};

// Optional: Filtered hook
export const useUserRealtimeActivities = (userEmail: string, path: string = "smart_home/activities") => {
  const { activities, loading, error } = useActivity(path);
  
  // Filter activities by user email
  const filteredActivities = activities.filter(
    activity => activity.email === userEmail
  );
  
  return { activities: filteredActivities, loading, error };
};