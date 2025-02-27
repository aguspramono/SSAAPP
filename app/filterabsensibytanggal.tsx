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
  Modal,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import moment from "moment";
import { DatePicker } from "./../components/date-picker";
import getDataAbsesi from "./../function/absensiApi";
import { useLocalSearchParams } from "expo-router";
import { SelectList } from "react-native-dropdown-select-list";
import { useShallow } from "zustand/react/shallow";
import useLogin from "./../function/store/useUserLogin";
import { dataPegawai } from "./../function/pegawaiApi";

function Filterabsensibytanggal() {
  //const { id, nama } = useLocalSearchParams();
  var dateY = new Date();

  const [date, setDate] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [noData, setNoData] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPickerToDate, setShowPickerToDate] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [absensi, setAbsensi] = useState<any[]>([]);
  const [pegawai, setPegawai] = useState([]);
  const [isModalFilterVisible, setIsModalFilterVisible] = useState(false);
  const [selectIDPegawai, setSelectIDPegawai] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { iduser, userLink, statusUser } = useLogin(
    useShallow((state: any) => ({
      iduser: state.iduser,
      userLink: state.userLink,
      statusUser: state.statusUser,
    }))
  );

  async function getDataPegawai() {
    const response = await dataPegawai("");
    let newPegawai = response.map((item: any) => {
      return { key: item.ID, value: item.NAMA };
    });

    setPegawai(newPegawai);
  }

  async function getDataAbsesiVal(iduserval = "") {
    const response = await getDataAbsesi(iduserval, date, dateTo);
    setAbsensi(response);
  }

  const onFilterData = () => {
    setIsModalFilterVisible(true);
    getDataPegawai();
  };

  const onModalFilterDataClose = () => {
    setIsModalFilterVisible(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadingDatas();
    setTimeout(() => {
      setRefreshing(false);
    }, 10);
  }, []);

  const loadingDatas = useCallback(() => {
    setLoadingData(true);
    setNoData("");
    getDataAbsesiVal(userLink);
    setIsModalFilterVisible(false);
    setTimeout(() => {
      setLoadingData(false);
      if (absensi.length < 1) {
        setNoData("Data Tidak Ditemukan");
      } else {
        setNoData("");
      }
    }, 10);
  }, [getDataAbsesiVal(userLink)]);

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
          <Text style={{ fontSize: 16, fontWeight: "bold" }}> Absensi</Text>
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
                    <Text style={{ color: "#686a69" }}>Filter Absensi</Text>
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

                {statusUser === "Umum" ? (
                  ""
                ) : (
                  <View>
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
                    />
                  </View>
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
                  onPress={() => loadingDatas()}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {loading == false ? (
                      "Filter Absensi"
                    ) : (
                      <ActivityIndicator size={22} color="#ffffff" />
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        {/* <View
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
              backgroundColor: "#ffffff",
              width: 150,
              paddingLeft: 10,
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
              backgroundColor: "#ffffff",
              width: 150,
              paddingLeft: 10,
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

          <TouchableOpacity
            onPress={getDataAbsesiVal}
            style={{
              marginTop: 10,
              backgroundColor: "#3db61b",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 12, color: "#fff" }}>Proses</Text>
          </TouchableOpacity>
        </View> */}

        <ScrollView
          style={{ marginTop: 10, marginBottom: 90 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          persistentScrollbar={false}
        >
          {absensi?.length < 1 ? (
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
            absensi?.map((item, i) => {
              return (
                <React.Fragment key={i}>
                  <View style={styles.listWrapAbs}>
                    <Text style={{ fontWeight: "bold", color: "#686a69" }}>
                      {item.tanggal}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ color: "#686a69", fontSize: 12 }}>
                        Masuk : {item.scanMasuk}
                      </Text>
                      <Text style={{ color: "#686a69", fontSize: 12 }}>
                        Pulang : {item.scanPulang}
                      </Text>
                    </View>
                    <Text
                      style={{
                        backgroundColor:
                          item.telat.split(":")[0].trim() == "-00"
                            ? "#3db61b55"
                            : "#b61b1b55",
                        color: "#353535",
                        padding: 5,
                        borderRadius: 10,
                        marginTop: 5,
                        fontSize: 12,
                      }}
                    >
                      Telat :{" "}
                      {item.telat.split(":")[0].trim() == "-00"
                        ? "-"
                        : item.telat.split(":")[0].trim() +
                          " Jam " +
                          (item.telat.split(":")[1].trim() < 1
                            ? "00 Menit "
                            : item.telat.split(":")[1].trim() + " Menit ") +
                          (item.telat.split(":")[2].trim() < 1
                            ? "00 Detik "
                            : item.telat.split(":")[2].trim() + " Detik ")}
                    </Text>
                  </View>
                </React.Fragment>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default Filterabsensibytanggal;

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
});
