// ../hooks/usePythonApiData.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServerHealth,
  getLatestRecognition,
  getRecognitionHistory,
  sendFaceRecognitionData,
  clearInMemoryLog
} from "../service/pythonApiService";
import type {
  ServerHealthResponse,
  RecognitionEntry,
  SubmitRecognitionPayload
} from "../service/pythonApiService";

// Separate base key context to satisfy the block-scoped declaration safety rule
const RECOGNITION_BASE_KEY = ["recognition"] as const;

export const recognitionQueries = {
  all: RECOGNITION_BASE_KEY,
  health: () => [...RECOGNITION_BASE_KEY, "health"] as const,
  latest: () => [...RECOGNITION_BASE_KEY, "latest"] as const,
  history: () => [...RECOGNITION_BASE_KEY, "history"] as const,
};

interface UsePythonApiDataResult {
  health: ServerHealthResponse | undefined;
  latestRecognition: RecognitionEntry | undefined;
  history: RecognitionEntry[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isUploading: boolean;
  isClearing: boolean;
  uploadFace: (payload: SubmitRecognitionPayload) => Promise<unknown>;
  clearLogs: () => Promise<unknown>;
  refreshDashboard: () => void;
}

export const usePythonApiData = (): UsePythonApiDataResult => {
  const queryClient = useQueryClient();


  // GET: /api/health
  const healthQuery = useQuery({
    queryKey: recognitionQueries.health(),
    queryFn: getServerHealth,
    refetchInterval: 15000,
  });

  // GET: /api/latest 
  const latestQuery = useQuery({
    queryKey: recognitionQueries.latest(),
    queryFn: getLatestRecognition,
    refetchInterval: 3000, // Poll every 3 seconds
  });

  // GET: /api/history 
  const historyQuery = useQuery({
    queryKey: recognitionQueries.history(),
    queryFn: getRecognitionHistory,
  });


  // POST: /api/recognition
  const uploadFaceMutation = useMutation({
    mutationFn: sendFaceRecognitionData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recognitionQueries.latest() });
      queryClient.invalidateQueries({ queryKey: recognitionQueries.history() });
    },
  });

  // DELETE: /api/clear
  const clearLogsMutation = useMutation({
    mutationFn: clearInMemoryLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recognitionQueries.latest() });
      queryClient.invalidateQueries({ queryKey: recognitionQueries.history() });
    },
  });


  const isLoading = healthQuery.isLoading || latestQuery.isLoading || historyQuery.isLoading;
  const isError = healthQuery.isError || latestQuery.isError || historyQuery.isError;

  return {
    health: healthQuery.data,
    latestRecognition: latestQuery.data,
    history: historyQuery.data,

    isLoading,
    isError,
    isUploading: uploadFaceMutation.isPending,
    isClearing: clearLogsMutation.isPending,

    // Functional Invocations
    uploadFace: uploadFaceMutation.mutateAsync,
    clearLogs: clearLogsMutation.mutateAsync,

    refreshDashboard: () => {
      queryClient.invalidateQueries({ queryKey: recognitionQueries.all });
    },
  };
};

export default usePythonApiData;