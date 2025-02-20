import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
  "Content-Type": "multipart/form-data",
};

export const getDataLogin = async (user ="") => {
    try {
      const response = await axios.get(
        `${baseUrl}/login?user=${user}`,
        {
          headers: headers,
        }
      );

      return response.data.user;
    } catch (error) {
      return error;
    }
  };


  export const getUserLogin = async (user ="") => {
    try {
      const response = await axios.get(
        `${baseUrl}/login/detail?user=${user}`,
        {
          headers: headers,
        }
      );

      return response.data.user;
    } catch (error) {
      return error;
    }
  };

  export const updateUserLogin = async (id =null,nama="",jeniskelamin="",jabatan="") => {
    try {
      const response = await axios.put(
        `${baseUrl}/loginuser/update/${id}`,
        {
          NAMA: nama,
          JENISKELAMIN: jeniskelamin,
          JABATAN: jabatan,
       }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };


  export const updatePass = async (id =null,password="") => {
    try {
      const response = await axios.put(
        `${baseUrl}/loginuser/uppass/${id}`,
        {
          PASSWORD: password,
       }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };




// export default getDataLogin;




