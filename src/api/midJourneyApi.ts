import axios from "axios";

const baseURL = "https://api.gpt.ge";

export interface ImagineRequest {
  botType?: "MID_JOURNEY" | "NIJI_JOURNEY";
  prompt: string;
  base64Array?: string[];
  notifyHook?: string;
  state?: string;
}


export const submitImagine = (data: any, token: string) => {
  return axios.post("https://api.gpt.ge/mj/submit/imagine", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

