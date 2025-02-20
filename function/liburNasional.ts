import axios from "axios";
//const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
  "Content-Type": "multipart/form-data",
};

export const liburNasional = async (id=null) => {
    try {
      const response = await axios.get(
        `https://api-harilibur.vercel.app/api`,
        {
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };