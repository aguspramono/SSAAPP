import axios from "axios";


const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
  "Content-Type": "multipart/form-data",
};

const lastUpdate = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/lastupdate`,
        {
          headers: headers,
        }
      );
      return response.data.datalastupdate;
    } catch (error) {
      return error;
    }
};


export default lastUpdate;
