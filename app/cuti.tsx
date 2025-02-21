import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import moment from "moment";
import { DatePicker } from "./../components/date-picker";
import {
  riwayatcuti,
  deleteCuti,
  getCutiWhereID,
  updateSetujuCuti,
  notiftome,
} from "./../function/cuti";
import { useShallow } from "zustand/react/shallow";
import useLogin from "./../function/store/useUserLogin";

function Cuti() {
  const { iduser, userLink, statusUser } = useLogin(
    useShallow((state: any) => ({
      iduser: state.iduser,
      userLink: state.userLink,
      statusUser: state.statusUser,
    }))
  );

  const [riwayatcutidata, setRiwayatcutidata] = useState<any[]>([]);
  const [datacutival, setDatacuti] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function getRiwayatCuti() {
    let response = await riwayatcuti("");
    if (statusUser === "Umum") {
      response = await riwayatcuti(iduser);
    }

    setRiwayatcutidata(response.datacuti);
  }

  async function getDataCutiByID(idCuti = null) {
    const response = await getCutiWhereID(idCuti);
    setDatacuti(response.datacuti);
  }

  async function updateSetujuCutiFunc(
    idCuti = null,
    status = "",
    statusdiket = "",
    statusdiset = "",
    statuscuti = ""
  ) {
    await updateSetujuCuti(
      idCuti,
      status,
      statusdiket,
      statusdiset,
      statuscuti
    );
  }

  async function sendNotifToMe(idme = 0, status = "") {
    await notiftome(idme, status);
  }

  async function hapuscutifunc(idcuti = null) {
    await deleteCuti(idcuti);
    getRiwayatCuti();
  }

  const setujuCutiFunc = (idcuti = null) => {
    getDataCutiByID(idcuti);

    if (iduser != datacutival[0].IDDISETUJUI) {
      if (datacutival[0].STATUSDIKET === null) {
        Alert.alert(
          "Error",
          "Pengajuan cuti belum disetujui oleh pihak diketahui"
        );
        return;
      }

      if (datacutival[0].STATUSDIKET === "Tidak Disetujui") {
        Alert.alert(
          "Error",
          "Pengajuan cuti tidak disetujui oleh pihak diketahui"
        );
        return;
      }

      updateSetujuCutiFunc(
        idcuti,
        "disetujui",
        datacutival[0].STATUSDIKET,
        "Disetujui",
        "Disetujui"
      );

      sendNotifToMe(datacutival[0].IDUSELOGIN, "disetujui");
    } else if (iduser != datacutival[0].IDDIKETAHUI) {
      updateSetujuCutiFunc(
        idcuti,
        "disetujui",
        "Disetujui",
        datacutival[0].STATUSDISET,
        "Disetuji Pihak Diketahui"
      );
    } else {
      Alert.alert(
        "Error",
        "Tidak memiliki hak akses untuk menyetujui pengajuan cuti ini"
      );
      return;
    }

    getRiwayatCuti();
  };

  const TidaksetujuCutiFunc = (idcuti = null) => {
    getDataCutiByID(idcuti);

    if (iduser != datacutival[0].IDDISETUJUI) {
      if (datacutival[0].STATUSDIKET === null) {
        Alert.alert(
          "Error",
          "Pengajuan cuti belum di tanggapi oleh pihak diketahui"
        );
        return;
      }

      updateSetujuCutiFunc(
        idcuti,
        "tidakdisetujui",
        datacutival[0].STATUSDIKET,
        "Tidak Disetujui",
        "Tidak Disetujui"
      );

      sendNotifToMe(datacutival[0].IDUSELOGIN, "tidaksetuju");
    } else if (iduser != datacutival[0].IDDIKETAHUI) {
      updateSetujuCutiFunc(
        idcuti,
        "tidakdisetujui",
        "Tidak Disetujui",
        datacutival[0].STATUSDISET,
        "Tidak Disetujui"
      );
    } else {
      Alert.alert(
        "Error",
        "Tidak memiliki hak akses untuk menyetujui pengajuan cuti ini"
      );
      return;
    }

    getRiwayatCuti();
  };

  const hapusCutiAct = (idcuti = null) => {
    Alert.alert("Warning", "Ingin membatalkan pengajuan cuti?", [
      {
        text: "Jangan Batalkan",
        style: "cancel",
      },
      { text: "Ya, Batalkan", onPress: () => hapuscutifunc(idcuti) },
    ]);
  };

  const setujuCutiAct = (idcuti = null) => {
    Alert.alert("Warning", "Ingin menyetujui pengajuan cuti?", [
      {
        text: "Jangan Batalkan",
        style: "cancel",
      },
      { text: "Ya, Batalkan", onPress: () => setujuCutiFunc(idcuti) },
    ]);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getRiwayatCuti();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    getRiwayatCuti();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", marginTop: 30 }}>
        <Link
          href={{ pathname: "/(tabs)" }}
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
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {" "}
            Riwayat Cuti
          </Text>
        </View>
      </View>

      <View style={styles.containerFluid}>
        <View style={{ marginTop: 30 }}>
          <TouchableOpacity style={{ flexDirection: "row" }}>
            <Text style={{ marginRight: 5 }}>
              <FontAwesome size={18} name="filter" color="#3db61b" />
            </Text>
            <Text style={{ color: "#686a69" }}>Filter</Text>
          </TouchableOpacity>

          <ScrollView
            style={{ marginTop: 10, marginBottom: 90 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            persistentScrollbar={false}
          >
            {riwayatcutidata?.length < 1 ? (
              <ActivityIndicator
                animating={true}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 80,
                }}
                size="large"
              />
            ) : (
              riwayatcutidata?.map((item) => {
                return (
                  <View style={styles.listWrapAbs} key={item.IDCUTI}>
                    <View
                      style={{
                        marginBottom: 5,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: "#686a69" }}>
                        {item.NAMA}
                      </Text>

                      <Text style={{ fontWeight: "bold", color: "#686a69" }}>
                        {item.JUMLAHCUTI} Hari
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ color: "#686a69", fontSize: 12 }}>
                        Dari :
                        {moment(new Date(item.TANGGALDARI)).format(
                          "DD MMMM YYYY"
                        )}
                      </Text>
                      <Text style={{ color: "#686a69", fontSize: 12 }}>
                        Sampai :{" "}
                        {moment(new Date(item.TANGGALSAMPAI)).format(
                          "DD MMMM YYYY"
                        )}
                      </Text>
                    </View>

                    <Text
                      style={{
                        backgroundColor: "#3db61b55",
                        color: "#353535",
                        padding: 5,
                        borderRadius: 10,
                        marginTop: 5,
                        fontSize: 12,
                      }}
                    >
                      Ket : {item.ALASANCUTI}
                    </Text>

                    <View
                      style={{
                        padding: 5,
                        borderRadius: 10,
                        marginTop: 5,
                        width: "auto",
                        backgroundColor: "#e4e4e454",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: "#353535",
                          fontSize: 12,
                          textTransform: "capitalize",
                        }}
                      >
                        Status : {item.STATUSCUTI}
                      </Text>

                      {item.STATUSCUTI === "proses" && statusUser == "Umum" ? (
                        <TouchableOpacity
                          style={{ flexDirection: "row" }}
                          onPress={() => hapusCutiAct(item.IDCUTI)}
                        >
                          <Text
                            style={{
                              color: "#353535",
                              fontSize: 12,
                              textTransform: "capitalize",
                            }}
                          >
                            <FontAwesome
                              size={14}
                              name="trash"
                              color="#b61b1b"
                            />
                          </Text>
                          <Text
                            style={{
                              color: "#b61b1b",
                              fontSize: 12,
                              textTransform: "capitalize",
                              marginLeft: 5,
                            }}
                          >
                            Batalkan Cuti
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{ flexDirection: "row" }}
                          onPress={() => setujuCutiAct(item.IDCUTI)}
                        >
                          <Text
                            style={{
                              color: "#353535",
                              fontSize: 12,
                              textTransform: "capitalize",
                            }}
                          >
                            <FontAwesome
                              size={14}
                              name="check"
                              color="#3db61b"
                            />
                          </Text>
                          <Text
                            style={{
                              color: "#3db61b",
                              fontSize: 12,
                              textTransform: "capitalize",
                              marginLeft: 5,
                            }}
                          >
                            Setujui Cuti
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => router.navigate("/tambahcuti")}
        style={{
          position: "absolute",
          bottom: 20,
          right: 10,
          paddingHorizontal: 25,
          paddingVertical: 23,
          backgroundColor: "#3db61b",
          borderRadius: 200 / 2,
          elevation: 5,
        }}
      >
        <Text style={{}}>
          <FontAwesome size={18} name="plus" color="#ffffff" />
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default Cuti;

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

  listWrapAbs: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    marginTop: 10,
    borderRadius: 10,
    fontWeight: "bold",
    width: "100%",
  },
});
