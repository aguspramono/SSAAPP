import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
``;
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import moment from "moment";
import { SelectList } from "react-native-dropdown-select-list";
import { DatePicker } from "./../components/date-picker";
import { getAtasan } from "./../function/atasan";
import { liburNasional } from "./../function/liburNasional";
import { useShallow } from "zustand/react/shallow";
import useLogin from "./../function/store/useUserLogin";
import { getDataDetail } from "./../function/pegawaiApi";
import {
  createCuti,
  notiftome,
  notiftoatasan,
  cekcuti,
} from "./../function/cuti";

function Tambahcuti() {
  const [atasan, setAtasan] = useState([]);
  const [liburnasional, setLiburnasional] = useState<any[]>([]);
  const [datacuti, setDatacuti] = useState(0);
  const [date, setDate] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPickerToDate, setShowPickerToDate] = useState(false);
  const [userterkait, setUserterkait] = useState<any[]>([]);

  const [jumlahHari, setJumlahHari] = useState(1);
  const [hariLibur, setHariLibur] = useState<any[]>([]);
  const [alasanCuti, setAlasanCuti] = useState("");
  const [selectedDiket, setSelectedDiket] = useState("");
  const [selectedDiset, setSelectedDiset] = useState("");
  const [loading, setLoading] = useState(false);

  const bersih = () => {
    setDate(new Date());
    setDateTo(new Date());
    setJumlahHari(1);
    setAlasanCuti("");
    setSelectedDiket("");
    setSelectedDiset("");
  };

  const { iduser, userLink } = useLogin(
    useShallow((state: any) => ({
      iduser: state.iduser,
      userLink: state.userLink,
    }))
  );

  async function getDataUserKaryawan() {
    const response = await getDataDetail(userLink);
    setUserterkait(response);
  }

  async function checkDataCuti() {
    const response = await cekcuti(iduser);
    setDatacuti(response.datacuti.length);
  }

  async function cekLiburNasional() {
    const response = await liburNasional();
    setLiburnasional(response);
  }

  async function cutiCreate(
    IDUSER = 0,
    TANGGALDARI = new Date(),
    TANGGALSAMPAI = new Date(),
    ALASANCUTI = "",
    JUMLAHCUTI = 0,
    IDDIKETAHUI = "",
    IDDISETUJUI = "",
    TANGGALPENGAJUAN = new Date(),
    IDUSELOGIN = 0
  ) {
    const response = await createCuti(
      IDUSER,
      TANGGALDARI,
      TANGGALSAMPAI,
      ALASANCUTI,
      JUMLAHCUTI,
      IDDIKETAHUI,
      IDDISETUJUI,
      TANGGALPENGAJUAN,
      IDUSELOGIN
    );
  }

  async function sendNotifToMe(idme = 0, status = "") {
    await notiftome(idme, status);
  }

  async function sendNotifToBigBoz(idket = "", idset = "", idkar = "") {
    await notiftoatasan(idket, idset, idkar);
  }

  const getCountDays = () => {
    cekLiburNasional();
    var aslidef = 0;
    var Difference_In_Time = dateTo.getTime() - date.getTime();
    var Difference_In_Days =
      Math.round(Difference_In_Time / (1000 * 3600 * 24)) + 1;
    if (Difference_In_Days < 1) {
      Difference_In_Days = 0;
    }

    aslidef = Difference_In_Days;

    const arrLiburTerDampak = [];

    for (let i = 0; i <= aslidef - 1; i++) {
      const newdate = new Date(new Date(date).getTime() + i * 864e5);

      if (
        moment(newdate).format("dddd") === "Sunday" ||
        moment(newdate).format("dddd") === "sunday"
      ) {
        arrLiburTerDampak.push(
          moment(newdate).format("DD/MM/YYYY") + "( Hari Minggu )"
        );
        Difference_In_Days = Difference_In_Days - 1;
      }

      liburnasional?.map((item: any) => {
        if (
          moment(newdate).format("YYYY-MM-DD") ==
            moment(new Date(item.holiday_date)).format("YYYY-MM-DD") &&
          (moment(newdate).format("dddd") != "Sunday" ||
            moment(newdate).format("dddd") != "sunday")
        ) {
          Difference_In_Days = Difference_In_Days - 1;
          arrLiburTerDampak.push(
            moment(new Date(item.holiday_date)).format("DD/MM/YYYY") +
              "( " +
              item.holiday_name +
              " )"
          );
        }
      });
    }

    setJumlahHari(Difference_In_Days);
    setHariLibur(arrLiburTerDampak);
  };

  const pengajuanCuti = () => {
    //cek apakah ada cuti yang belum diproses
    if (datacuti > 0) {
      Alert.alert(
        "Error",
        "Tidak bisa mengajukan cuti dikarenakan ada cuti yang masih dalam tahap diproses",
        [{ text: "OK", onPress: () => setLoading(false) }]
      );
      return;
    }

    //cek user terkait
    if (userLink === "") {
      Alert.alert(
        "Error",
        "Tidak dapat mengajukan cuti, karena akun tidak terkait dengan karyawan manapun",
        [{ text: "OK", onPress: () => setLoading(false) }]
      );
      return;
    }

    //cek jumlah sisa cuti
    if (jumlahHari > userterkait[0].sisacuti) {
      Alert.alert(
        "Error",
        "Tidak dapat mengajukan cuti, sisa cuti tidak cukup",
        [{ text: "OK", onPress: () => setLoading(false) }]
      );
      return;
    }

    //Cek Alasan
    if (alasanCuti === "") {
      Alert.alert("Error", "Alasan cuti wajib diisi", [
        { text: "OK", onPress: () => setLoading(false) },
      ]);
      return;
    }

    //Cek diket
    if (selectedDiket === "") {
      Alert.alert("Error", "Diketahui belum dipilih", [
        { text: "OK", onPress: () => setLoading(false) },
      ]);
      return;
    }

    //Cek diket
    if (selectedDiset === "") {
      Alert.alert("Error", "Disetujui belum dipilih", [
        { text: "OK", onPress: () => setLoading(false) },
      ]);
      return;
    }

    cutiCreate(
      userLink,
      date,
      dateTo,
      alasanCuti,
      jumlahHari,
      selectedDiket,
      selectedDiset,
      new Date(),
      iduser
    );

    sendNotifToMe(iduser, "pengajuan");
    sendNotifToBigBoz(selectedDiket, selectedDiset, userLink);
    Alert.alert("Sukses", "Pengajuan cuti telah terkirim");
    bersih();
  };

  async function getDataAtasan() {
    const response = await getAtasan();
    let NewAtasan = response.map((item: any) => {
      return { key: item.USERID, value: item.NAMA };
    });

    setAtasan(NewAtasan);
  }

  const buttonPengajuanCuti = useCallback(() => {
    checkDataCuti();
    pengajuanCuti();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [checkDataCuti, pengajuanCuti]);

  useEffect(() => {
    getDataAtasan();
    getDataUserKaryawan();
  }, [getCountDays]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", marginTop: 30 }}>
        <Link
          href={{ pathname: "/cuti" }}
          style={{
            padding: 15,
            marginLeft: 10,
            marginTop: 10,
            borderWidth: 0.5,
            width: 45,
            borderRadius: 10,
            borderColor: "#d1d1d1",
          }}
        >
          <Text style={{}}>
            <FontAwesome size={14} name="chevron-left" color="#3db61b" />
          </Text>
        </Link>
        <View style={{ padding: 15, marginTop: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}> Tambah Cuti</Text>
        </View>
      </View>

      <View style={styles.containerFluid}>
        <View
          style={{
            marginTop: 30,
          }}
        >
          <Text
            style={{
              marginBottom: 5,
              color: "#5e5e5e",
              fontWeight: "bold",
            }}
          >
            Periode Cuti
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <DatePicker
              onChange={setDate}
              value={date}
              close={() => setShowDatePicker(false)}
              show={showDatePicker}
            />

            <DatePicker
              onChange={setDateTo}
              value={dateTo}
              close={() => setShowPickerToDate(false)}
              show={showPickerToDate}
            />

            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={{
                backgroundColor: "#ffffff",
                width: 180,
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 10,
              }}
            >
              <TextInput
                placeholder={moment().format("DD MMMM YYYY")}
                value={moment(date).format("DD MMMM YYYY")}
                editable={false}
                style={{ color: "#949393" }}
                onContentSizeChange={getCountDays}
              ></TextInput>
            </Pressable>

            <Pressable
              onPress={() => setShowPickerToDate(true)}
              style={{
                backgroundColor: "#ffffff",
                width: 180,
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 10,
              }}
            >
              <TextInput
                placeholder={moment().format("DD MMMM YYYY")}
                value={moment(dateTo).format("DD MMMM YYYY")}
                editable={false}
                style={{ color: "#949393" }}
                onContentSizeChange={getCountDays}
              ></TextInput>
            </Pressable>
          </View>

          <Text
            style={{
              marginBottom: 5,
              marginTop: 10,
              color: "#5e5e5e",
              fontWeight: "bold",
            }}
          >
            Alasan Cuti
          </Text>
          <TextInput
            style={[
              styles.input,
              { marginBottom: 10, color: "#949393", height: 150 },
            ]}
            placeholder="Alasan Cuti"
            multiline={true}
            numberOfLines={10}
            value={alasanCuti}
            onChangeText={(text) => {
              setAlasanCuti(text);
            }}
          />

          <Text
            style={{
              marginBottom: 5,
              color: "#5e5e5e",
              fontWeight: "bold",
            }}
          >
            Dikatahui
          </Text>

          <SelectList
            setSelected={(val: any) => setSelectedDiket(val)}
            data={atasan}
            save="key"
            placeholder="Pilih Diketahui"
            boxStyles={{
              borderColor: "#ffffff",
              backgroundColor: "#ffffff",
              marginBottom: 15,
            }}
            inputStyles={{ color: "#5e5e5e" }}
            dropdownTextStyles={{ color: "#5e5e5e" }}
            onSelect={() => {
              getCountDays();
            }}
          />

          <Text
            style={{
              marginBottom: 5,
              color: "#5e5e5e",
              fontWeight: "bold",
            }}
          >
            Disetujui
          </Text>

          <SelectList
            setSelected={(val: any) => setSelectedDiset(val)}
            data={atasan}
            save="key"
            placeholder="Pilih Disetujui"
            boxStyles={{ borderColor: "#ffffff", backgroundColor: "#ffffff" }}
            inputStyles={{ color: "#5e5e5e", backgroundColor: "#ffffff" }}
            dropdownTextStyles={{ color: "#5e5e5e" }}
            onSelect={() => {
              getCountDays();
            }}
          />

          <Text
            style={{
              marginBottom: 5,
              marginTop: 10,
              color: "#5e5e5e",
              fontWeight: "bold",
            }}
          >
            Jumlah Hari
          </Text>
          <TextInput
            style={[styles.input, { color: "#949393" }]}
            placeholder="Jumlah Hari"
            value={jumlahHari.toString()}
            editable={false}
          />
          <Text
            style={{
              fontSize: 10,
              marginTop: 5,
              color: "#5e5e5e",
              fontWeight: "bold",
            }}
          >
            Hari libur yang tidak dihitung :
          </Text>
          {hariLibur?.length < 1 ? (
            <Text
              style={{
                fontSize: 10,
                color: "#5e5e5e",
              }}
            >
              Tidak ada hari libur dalam kalender yang dipilih
            </Text>
          ) : (
            hariLibur?.map((item, i) => {
              return (
                <Text
                  style={{
                    fontSize: 10,
                    color: "#5e5e5e",
                  }}
                  key={i}
                >
                  {i + 1 + ". " + item}
                </Text>
              );
            })
          )}

          <TouchableOpacity
            style={{
              marginTop: 25,
              backgroundColor: "#3db61b",
              paddingHorizontal: 25,
              paddingVertical: 15,
              borderRadius: 20,
              alignItems: "center",
            }}
            onPress={buttonPengajuanCuti}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {loading == false ? (
                "Ajukan Cuti"
              ) : (
                <ActivityIndicator size={22} color="#ffffff" />
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Tambahcuti;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f4ff",
  },

  containerFluid: {
    paddingHorizontal: 20,
    marginBottom: 65,
  },
  filterAbsen: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  XsmallText: {
    fontSize: 8,
  },
  listWrap: {
    padding: 20,
    backgroundColor: "#ffffff",
    marginTop: 7,
    borderRadius: 10,
    fontWeight: "bold",
  },

  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    width: "100%",
    opacity: 0.7,
  },

  listWrapAbs: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    marginTop: 10,
    borderRadius: 10,
    fontWeight: "bold",
  },
});
