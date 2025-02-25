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
  Modal,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import moment from "moment";
import { DatePicker } from "./../components/date-picker";
import { SelectList } from "react-native-dropdown-select-list";
import { dataPegawai } from "./../function/pegawaiApi";
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
  var dateY = new Date();

  const [date, setDate] = useState(
    new Date(dateY.getFullYear(), dateY.getMonth(), 1)
  );
  const [dateTo, setDateTo] = useState(
    new Date(dateY.getFullYear(), dateY.getMonth() + 1, 0)
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPickerToDate, setShowPickerToDate] = useState(false);
  const [pegawai, setPegawai] = useState([]);
  const [riwayatcutidata, setRiwayatcutidata] = useState<any[]>([]);
  const [datacutival, setDatacuti] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalFilterVisible, setIsModalFilterVisible] = useState(false);
  const [selectIDPegawai, setSelectIDPegawai] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [noData, setNoData] = useState("");

  async function getDataPegawai() {
    const response = await dataPegawai("");
    let newPegawai = response.map((item: any) => {
      return { key: item.ID, value: item.NAMA };
    });

    setPegawai(newPegawai);
  }

  const { iduser, userLink, statusUser } = useLogin(
    useShallow((state: any) => ({
      iduser: state.iduser,
      userLink: state.userLink,
      statusUser: state.statusUser,
    }))
  );

  const onFilterData = () => {
    setIsModalFilterVisible(true);
    getDataPegawai();
  };

  const onModalFilterDataClose = () => {
    setIsModalFilterVisible(false);
  };

  async function getRiwayatCuti() {
    let response = await riwayatcuti(
      "",
      moment(date).format("YYYY-MM-DD"),
      moment(dateTo).format("YYYY-MM-DD"),
      selectIDPegawai
    );
    if (statusUser === "Umum") {
      response = await riwayatcuti(
        iduser,
        moment(date).format("YYYY-MM-DD"),
        moment(dateTo).format("YYYY-MM-DD"),
        ""
      );
    }

    setRiwayatcutidata(response.datacuti);
    console.log(response.datacuti);
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

  const setujuCutiFunc = useCallback((idcuti = null) => {
    getDataCutiByID(idcuti);

    if (iduser == datacutival[0].IDDISETUJUI) {
      if (
        datacutival[0].STATUSDIKET === null ||
        datacutival[0].STATUSDIKET === ""
      ) {
        Alert.alert(
          "Error",
          "Pengajuan cuti belum diterima oleh pihak diketahui"
        );
        return;
      }

      if (datacutival[0].STATUSDIKET === "Tidak Diterima") {
        Alert.alert(
          "Error",
          "Pengajuan cuti tidak diterima oleh pihak diketahui"
        );
        return;
      }

      updateSetujuCutiFunc(
        idcuti,
        "disetujui",
        datacutival[0].STATUSDIKET,
        "Diterima",
        "Diterima"
      );
      getRiwayatCuti();

      sendNotifToMe(datacutival[0].IDUSELOGIN, "disetujui");
    } else if (iduser == datacutival[0].IDDIKETAHUI) {
      updateSetujuCutiFunc(idcuti, "disetujui", "Diterima", "", "Diterima 1");
      getRiwayatCuti();
    } else {
      Alert.alert(
        "Error",
        "Tidak memiliki hak akses untuk menerima pengajuan cuti ini"
      );
      return;
    }
  }, []);

  const TidaksetujuCutiFunc = useCallback((idcuti = null) => {
    getDataCutiByID(idcuti);

    if (iduser == datacutival[0].IDDISETUJUI) {
      if (
        datacutival[0].STATUSDIKET === null ||
        datacutival[0].STATUSDIKET === ""
      ) {
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
        "Tidak Diterima",
        "Tidak Diterima"
      );

      sendNotifToMe(datacutival[0].IDUSELOGIN, "tidaksetuju");
      getRiwayatCuti();
    } else if (iduser == datacutival[0].IDDIKETAHUI) {
      updateSetujuCutiFunc(
        idcuti,
        "tidakdisetujui",
        "Tidak Diterima",
        "Tidak Diterima",
        "Tidak Diterima"
      );
      sendNotifToMe(datacutival[0].IDUSELOGIN, "tidaksetuju");
      getRiwayatCuti();
    } else {
      Alert.alert(
        "Error",
        "Tidak memiliki hak akses untuk menerima pengajuan cuti ini"
      );
      return;
    }
  }, []);

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
    Alert.alert("Warning", "Ingin menerima pengajuan cuti?", [
      {
        text: "Tutup",
        style: "cancel",
      },
      { text: "Ya, Terima", onPress: () => setujuCutiFunc(idcuti) },
    ]);
  };

  const tidakSetujuCutiAct = (idcuti = null) => {
    Alert.alert("Warning", "Ingin tidak menerima pengajuan cuti?", [
      {
        text: "Tutup",
        style: "cancel",
      },
      { text: "Ya", onPress: () => TidaksetujuCutiFunc(idcuti) },
    ]);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadingDatas();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const loadingDatas = () => {
    setLoadingData(true);
    getRiwayatCuti();
    setNoData("");
    setTimeout(() => {
      setLoadingData(false);
      setNoData("Data Tidak Ditemukan");
    }, 1000);
  };

  useEffect(() => {
    loadingDatas();
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
          <Text style={{ fontSize: 16, fontWeight: "bold" }}> Cuti</Text>
        </View>
      </View>

      <View style={styles.containerFluid}>
        <View style={{ marginTop: 30 }}>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={onFilterData}
          >
            <Text style={{ marginRight: 5 }}>
              <FontAwesome size={18} name="filter" color="#3db61b" />
            </Text>
            <Text style={{ color: "#686a69" }}>Filter</Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalFilterVisible}
            onRequestClose={() => {
              onModalFilterDataClose;
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View
                  style={{
                    backgroundColor: "#ffffff",
                    width: "100%",
                    paddingVertical: 10,
                    marginBottom: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ marginRight: 5 }}>
                      <FontAwesome size={18} name="filter" color="#3db61b" />
                    </Text>
                    <Text style={{ color: "#686a69" }}>Filter Cuti</Text>
                  </View>

                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    onPress={() => setIsModalFilterVisible(false)}
                  >
                    <Text style={{ marginRight: 5 }}>
                      <FontAwesome size={18} name="times" color="#3db61b" />
                    </Text>
                    <Text style={{ color: "#686a69" }}>Tutup</Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    color: "#5e5e5e",
                    fontWeight: "bold",
                  }}
                >
                  Rentang Tanggal
                </Text>
                <View
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
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
                      backgroundColor: "#e4e4e454",
                      width: "49%",
                      padding: 15,
                      borderRadius: 5,
                      marginTop: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextInput
                      placeholder={moment().format("DD MMMM YYYY")}
                      value={moment(date).format("DD MMMM YYYY")}
                      editable={false}
                      style={{ fontSize: 12 }}
                    ></TextInput>
                  </Pressable>

                  <Pressable
                    onPress={() => setShowPickerToDate(true)}
                    style={{
                      backgroundColor: "#e4e4e454",
                      width: "49%",
                      padding: 15,
                      borderRadius: 5,
                      marginTop: 10,
                      justifyContent: "center",
                    }}
                  >
                    <TextInput
                      placeholder={moment().format("DD MMMM YYYY")}
                      value={moment(dateTo).format("DD MMMM YYYY")}
                      editable={false}
                      style={{
                        fontSize: 12,
                      }}
                    ></TextInput>
                  </Pressable>
                </View>

                <Text
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    color: "#5e5e5e",
                    fontWeight: "bold",
                  }}
                >
                  Pilih Pegawai
                </Text>

                <SelectList
                  setSelected={(val: any) => setSelectIDPegawai(val)}
                  data={pegawai}
                  save="key"
                  placeholder="Pilih Pegawai"
                  boxStyles={{
                    borderColor: "#e4e4e454",
                    backgroundColor: "#e4e4e454",
                  }}
                  inputStyles={{ color: "#5e5e5e" }}
                  dropdownTextStyles={{ color: "#5e5e5e" }}
                  // onSelect={() => {
                  //   getCountDays();
                  // }}
                />

                <TouchableOpacity
                  style={{
                    marginTop: 25,
                    backgroundColor: "#3db61b",
                    paddingHorizontal: 25,
                    paddingVertical: 15,
                    borderRadius: 20,
                    alignItems: "center",
                  }}
                  onPress={loadingDatas}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {loading == false ? (
                      "Filter Cuti"
                    ) : (
                      <ActivityIndicator size={22} color="#ffffff" />
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator
                  animating={loadingData}
                  style={{
                    height: 80,
                  }}
                  size="large"
                />

                <Text style={{ color: "#686a69" }}>{noData}</Text>
              </View>
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
                        Diket. : {item.namadiket}{" "}
                        <Text
                          style={{
                            color: "#353535",
                            fontSize: 12,
                            textTransform: "capitalize",
                          }}
                        >
                          {item.STATUSDIKET === null ||
                          item.STATUSDIKET === "" ? (
                            <FontAwesome
                              size={14}
                              name="clock-o"
                              color="#353535"
                            />
                          ) : item.STATUSDIKET === "Tidak Diterima" ? (
                            <FontAwesome
                              size={14}
                              name="times"
                              color="#b61b1b"
                            />
                          ) : (
                            <FontAwesome
                              size={14}
                              name="check"
                              color="#3db61b"
                            />
                          )}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          color: "#353535",
                          fontSize: 12,
                          textTransform: "capitalize",
                        }}
                      >
                        Diset. : {item.namaset}{" "}
                        <Text
                          style={{
                            color: "#353535",
                            fontSize: 12,
                            textTransform: "capitalize",
                          }}
                        >
                          {item.STATUSDISET === null ||
                          item.STATUSDISET === "" ? (
                            <FontAwesome
                              size={14}
                              name="clock-o"
                              color="#353535"
                            />
                          ) : item.STATUSDISET === "Tidak Diterima" ? (
                            <FontAwesome
                              size={14}
                              name="times"
                              color="#b61b1b"
                            />
                          ) : (
                            <FontAwesome
                              size={14}
                              name="check"
                              color="#3db61b"
                            />
                          )}
                        </Text>
                      </Text>
                    </View>

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
                            Batal
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        ""
                      )}

                      {item.STATUSCUTI != "Diterima" &&
                      item.STATUSCUTI != "Tidak Diterima" &&
                      statusUser != "Umum" ? (
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity
                            style={{ flexDirection: "row", marginRight: 10 }}
                            onPress={() => tidakSetujuCutiAct(item.IDCUTI)}
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
                                name="times"
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
                              Tidak Diterima
                            </Text>
                          </TouchableOpacity>

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
                              Terima
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        ""
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
  centeredView: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  modalView: {
    //margin: 20,
    backgroundColor: "#ffffff",
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
