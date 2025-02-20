import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
  "Content-Type": "multipart/form-data",
};

export const getAtasan = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}atasan`,
        {
          headers: headers,
        }
      );

      return response.data.dataatasan;
    } catch (error) {
      return error;
    }
  };




// export default getDataLogin;




