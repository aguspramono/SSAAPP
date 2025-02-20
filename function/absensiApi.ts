import axios from "axios";
import moment from "moment";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
  "Content-Type": "multipart/form-data",
};

const getDataAbsesi = async (id="",date = new Date(),dateTo=new Date()) => {
    try {
      const response = await axios.get(
        `${baseUrl}/pegawai/absensi?id=${id}&fromdate=${moment(date).format(
          "YYYY-MM-DD"
        )}&todate=${moment(dateTo).format("YYYY-MM-DD")}`,
        {
          headers: headers,
        }
      );

      return response.data.dataabsensi;
    } catch (error) {
      return error;
    }
  };




export default getDataAbsesi;




