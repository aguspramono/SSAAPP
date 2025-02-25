import axios from "axios";
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

const headers = {
  "Content-Type": "multipart/form-data",
};


export const createCuti = async (IDUSER=0,TANGGALDARI=new Date(),TANGGALSAMPAI=new Date(),ALASANCUTI="",JUMLAHCUTI=0,IDDIKETAHUI="",IDDISETUJUI="",TANGGALPENGAJUAN=new Date(),IDUSELOGIN=0) => {
    try {
      const response = await axios.post(
        `${baseUrl}tambahcuti`,
        {
            IDUSER: IDUSER,
            TANGGALDARI: TANGGALDARI,
            TANGGALSAMPAI: TANGGALSAMPAI,
            ALASANCUTI: ALASANCUTI,
            JUMLAHCUTI: JUMLAHCUTI,
            IDDIKETAHUI: IDDIKETAHUI,
            IDDISETUJUI: IDDISETUJUI,
            TANGGALPENGAJUAN: TANGGALPENGAJUAN,
            IDUSELOGIN: IDUSELOGIN,
       }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };

  export const deleteCuti = async (idcuti:any) => {
    try {
      const response = await axios.delete(
        `${baseUrl}batalcuti/${idcuti}`,
        {
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };


  export const updateSetujuCuti = async (id =null,status="",statusdiket="",statusdiset="",statuscuti="") => {
    try {
      const response = await axios.put(
        `${baseUrl}updatecutidisetujui/${id}/${status}`,
        {
          STATUSDIKET : statusdiket,
          STATUSDISET: statusdiset,
          STATUSCUTI: statuscuti,
       }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };



  export const cekcuti = async (iduser =0) => {
    try {
      const response = await axios.get(
        `${baseUrl}cekcutiuser?id=${iduser}`,
        {
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };

  export const getCutiWhereID = async (idcuti =null) => {
    try {
      const response = await axios.get(
        `${baseUrl}getcutiwhere?id=${idcuti}`,
        {
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };

  export const riwayatcuti = async (iduser ="",tanggaldari= "",tanggalsampai="",idpegawai="") => {
    try {
      const response = await axios.get(
        `${baseUrl}riwayatcuti?id=${iduser}&tanggaldari=${tanggaldari}&tanggalsampai=${tanggalsampai}&idpegawai=${idpegawai}`,
        {
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };

  export const notiftome = async (iduser =0,status="") => {
    try {
      const response = await axios.get(
        `${baseUrl}notifcutime?id=${iduser}&status=${status}`,
        {
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };


  export const notiftoatasan = async (idket ="",idset="",idkar="") => {
    try {
      const response = await axios.get(
        `${baseUrl}notifcutibos?iddiket=${idket}&iddiset=${idset}&idkar=${idkar}`,
        {
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };