import axios from "axios";


export interface FaceData {
  name: string;
  confidence: number;
  distance: number;
}

export interface RecognitionEntry {
  timestamp: string;
  image?: string;       
  image_path?: string;
  faces: FaceData[];
}

export interface ServerHealthResponse {
  status: string;
  total_entries: number;
  telegram_ok: boolean;
  timestamp: string;
}

export interface RecognitionSubmitResponse {
  status: string;
  received: number;
}

export interface ClearLogResponse {
  status: string;
  message: string;
}

export interface SubmitRecognitionPayload {
  image: string; 
  timestamp?: string; 
  faces: Omit<FaceData, 'distance'> & { distance?: number }[];
}

const API_BASE = "https://pythnrender.com/api";


export const getServerHealth = async (): Promise<ServerHealthResponse> => {
  const res = await axios.get<ServerHealthResponse>(`${API_BASE}/health`);
  return res.data;
};

export const getLatestRecognition = async (): Promise<RecognitionEntry> => {
  const res = await axios.get<RecognitionEntry>(`${API_BASE}/latest`);
  return res.data;
};

export const getRecognitionHistory = async (): Promise<RecognitionEntry[]> => {
  const res = await axios.get<RecognitionEntry[]>(`${API_BASE}/history`);
  return res.data;
};

export const sendFaceRecognitionData = async (payload: SubmitRecognitionPayload): Promise<RecognitionSubmitResponse> => {
  const res = await axios.post<RecognitionSubmitResponse>(`${API_BASE}/recognition`, payload);
  return res.data;
};

export const clearInMemoryLog = async (): Promise<ClearLogResponse> => {
  const res = await axios.delete<ClearLogResponse>(`${API_BASE}/clear`);
  return res.data;
};