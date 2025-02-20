import axios from "axios";


const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
  "Content-Type": "multipart/form-data",
};

export const dataPegawai = async (namaPegawai="") => {
    try {
      const response = await axios.get(
        `${baseUrl}/pegawai?nama=${namaPegawai}`,
        {
          headers: headers,
        }
      );
      return response.data.datapegawai;
    } catch (error) {
      return error;
    }
};


//export default dataPegawai;

export const getDataDetail = async (id=null) => {
  try {
    const response = await axios.get(`${baseUrl}/pegawai/detail?id=${id}`, {
      headers: headers,
    });
    return response.data.datapegawai;
  } catch (error) {
    alert(error);
  }
};
