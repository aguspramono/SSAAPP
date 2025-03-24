import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
  "Content-Type": "multipart/form-data",
};

export const deleteToken = async (id=null) => {
    try {
      const response = await axios.delete(
        `${baseUrl}token/delete/${id}`,
        {
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };

  export const deleteTokenbyToken = async (token:any) => {
    try {
      const response = await axios.delete(
        `${baseUrl}token/deletebytoken/${token}`,
        {
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };


  export const createToken = async (token="",iduserlogin=0,statuslogin="") => {
    try {
      const response = await axios.post(
        `${baseUrl}token/create`,
        {
            token: token,
            iduserlogin: iduserlogin,
            statuslogin: statuslogin,
       }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };




