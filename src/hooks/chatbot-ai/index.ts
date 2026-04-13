import { API_ENDPOINTS } from "@/services/api-route";
import Cookies from "js-cookie";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export const useChatBot = () => {
  const sendMessage = async (
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    onFinish?: (fullText: string) => void,
    onError?: (error: any) => void,
  ) => {
    try {
      const token = Cookies.get("token");
      const apiUrl = import.meta.env.VITE_API_URL;
      const endpoint = API_ENDPOINTS.CHATBOT.CHAT;
      const url = `${apiUrl}${endpoint}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages }),
      });

      console.log("Response headers:", {
        contentType: response.headers.get("Content-Type"),
        transferEncoding: response.headers.get("Transfer-Encoding"),
        xAccelBuffering: response.headers.get("X-Accel-Buffering"),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || response.statusText);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (!reader) {
        throw new Error("No reader available");
      }

      console.log("Starting to read stream from:", url);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        console.log("Chunk received:", chunk);
        fullText += chunk;
        onChunk(chunk);
      }

      if (onFinish) {
        onFinish(fullText);
      }
    } catch (error) {
      if (onError) {
        onError(error);
      }
      console.error("Chat error:", error);
    }
  };

  return { sendMessage };
};

export interface RoadmapData {
  cert: string;
  target: string;
  weakness: string[];
  timeframe: number;
}

export const useRoadmapAI = () => {
  const generateRoadmap = async (
    data: RoadmapData,
    onChunk: (chunk: string) => void,
    onFinish?: (fullText: string) => void,
    onError?: (error: any) => void,
  ) => {
    try {
      const token = Cookies.get("token");
      const apiUrl = import.meta.env.VITE_API_URL;
      const endpoint = API_ENDPOINTS.CHATBOT.GENERATE_ROADMAP;
      const url = `${apiUrl}${endpoint}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || response.statusText);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (!reader) {
        throw new Error("No reader available");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        onChunk(chunk);
      }

      if (onFinish) {
        onFinish(fullText);
      }
    } catch (error) {
      if (onError) {
        onError(error);
      }
      console.error("Roadmap generation error:", error);
    }
  };

  return { generateRoadmap };
};
