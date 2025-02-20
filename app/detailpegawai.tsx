import { useLocalSearchParams } from "expo-router";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import React, { useCallback, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import axios from "axios";
import moment from "moment";
import { DatePicker } from "./../components/date-picker";
function Detailpegawai() {
  const { id } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [pegawai, setPegawai] = useState<any[]>([]);
  const [absensi, setAbsensi] = useState<any[]>([]);

  var dateY = new Date();

  const [date, setDate] = useState(
    new Date(dateY.getFullYear(), dateY.getMonth(), 1)
  );
  const [dateTo, setDateTo] = useState(
    new Date(dateY.getFullYear(), dateY.getMonth() + 1, 0)
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPickerToDate, setShowPickerToDate] = useState(false);

  const [visibleModalDetail, SetvisibleModalDetail] = useState(false);
  const [visibleModalAbsensi, SetvisibleModalAbsensi] = useState(false);
  const showPersonalInformation = () => SetvisibleModalDetail(true);
  const hidePersonalInformation = () => SetvisibleModalDetail(false);

  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  const getDataDetail = async () => {
    try {
      const response = await axios.get(`${baseUrl}/pegawai/detail?id=${id}`, {
        headers: headers,
      });
      setPegawai(response.data.datapegawai);
    } catch (error) {
      alert(error);
    }
  };

  const getDataAbsesi = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/pegawai/absensi?id=${id}&fromdate=${moment(date).format(
          "YYYY-MM-DD"
        )}&todate=${moment(dateTo).format("YYYY-MM-DD")}`,
        {
          headers: headers,
        }
      );

      setAbsensi(response.data.dataabsensi);
    } catch (error) {
      alert(error);
    }
  };

  getDataDetail();

  const showAbsensi = useCallback(() => {
    SetvisibleModalAbsensi(true);
    setDate(new Date(dateY.getFullYear(), dateY.getMonth(), 1));
    setDateTo(new Date(dateY.getFullYear(), dateY.getMonth() + 1, 0));
    getDataAbsesi();
  }, [id, date, dateTo]);

  const hideAbsensi = () => {
    setDate(new Date(dateY.getFullYear(), dateY.getMonth(), 1));
    setDateTo(new Date(dateY.getFullYear(), dateY.getMonth() + 1, 0));
    SetvisibleModalAbsensi(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getDataAbsesi();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [id, date, dateTo]);

  return (
    <View style={styles.containerfluid}>
      <View style={styles.container}>
        {pegawai?.length < 1 ? (
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
          pegawai?.map((item) => {
            return (
              <React.Fragment key={item.ID}>
                {item.Gender == "Laki-laki" ? (
                  <Image
                    source={require("./../assets/images/man.png")}
                    style={[styles.circleImageLayout, styles.centerItem]}
                  />
                ) : (
                  <Image
                    source={require("./../assets/images/woman.png")}
                    style={[styles.circleImageLayout, styles.centerItem]}
                  />
                )}

                <View>
                  <Text style={[styles.headingOne, styles.textCenter]}>
                    {item.NAMA}{" "}
                  </Text>
                  <Text style={[styles.smallText, styles.textCenter]}>
                    {item.Jabatan == "" ? "Staff Kantor" : item.Jabatan}{" "}
                  </Text>
                </View>
              </React.Fragment>
            );
          })
        )}

        {pegawai?.map((item) => {
          return (
            <View style={[styles.box, styles.shadowProp]} key={item.ID}>
              <View style={[styles.centerItem, styles.boxChild]}>
                <View>
                  <Text style={[styles.boxTitle, styles.textBox]}>
                    Sisa Cuti
                  </Text>
                </View>

                <View>
                  <Text style={[styles.textBox, styles.smallText]}>
                    {item.sisacuti == null ? "0" : item.sisacuti}
                  </Text>
                </View>
              </View>

              <View style={[styles.centerItem, styles.boxChild]}>
                <View>
                  <Text style={[styles.boxTitle, styles.textBox]}>
                    Cuti Terpakai
                  </Text>
                </View>
                <View>
                  <Text style={[styles.textBox, styles.smallText]}>
                    {item.cutiterpakai == null ? "0" : item.cutiterpakai}
                  </Text>
                </View>
              </View>

              <View
                style={[styles.centerItem, styles.boxChild, styles.boxNoBorder]}
              >
                <View>
                  <Text style={[styles.boxTitle, styles.textBox]}>
                    Total Cuti
                  </Text>
                </View>
                <View>
                  <Text style={[styles.textBox, styles.smallText]}>
                    {item.cuti}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.menuProf}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={showPersonalInformation}
        >
          <View>
            <Text style={{}}>
              <FontAwesome size={18} name="user" color="#3db61b" />
            </Text>
          </View>
          <View>
            <Text style={[styles.textMenuButton, { marginLeft: 10 }]}>
              {" "}
              Informasi Pribadi
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={showAbsensi}>
          <View>
            <Text style={{}}>
              <FontAwesome size={18} name="list" color="#3db61b" />
            </Text>
          </View>
          <View>
            <Text style={[styles.textMenuButton, { marginLeft: 10 }]}>
              {" "}
              Absensi
            </Text>
          </View>
        </TouchableOpacity>
        <Link
          href={{ pathname: "/", params: { id: id } }}
          style={styles.menuButton}
        >
          <View>
            <Text style={{}}>
              <FontAwesome size={18} name="calendar" color="#3db61b" />
            </Text>
          </View>
          <View>
            <Text style={[styles.textMenuButton, { marginLeft: 10 }]}>
              {" "}
              Riwayat Cuti
            </Text>
          </View>
        </Link>
      </View>

      <Modal
        visible={visibleModalDetail}
        onRequestClose={hidePersonalInformation}
        animationType="slide"
      >
        <TouchableOpacity
          onPress={hidePersonalInformation}
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
        </TouchableOpacity>

        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          {pegawai &&
            pegawai.map((item) => {
              return (
                <React.Fragment key={item.ID}>
                  <View>
                    <Text
                      style={{
                        color: "#5e5e5e",
                        fontWeight: "bold",
                        marginTop: 10,
                      }}
                    >
                      NIK
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#f0f0f0",
                      paddingHorizontal: 7,
                      paddingVertical: 10,
                      borderRadius: 7,
                      marginTop: 5,
                    }}
                  >
                    <Text style={{ color: "#8a8a8a" }}>
                      {item.NIK == "" ? "-" : item.NIK}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{
                        color: "#5e5e5e",
                        fontWeight: "bold",
                        marginTop: 10,
                      }}
                    >
                      Nama
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#f0f0f0",
                      paddingHorizontal: 7,
                      paddingVertical: 10,
                      borderRadius: 7,
                      marginTop: 5,
                    }}
                  >
                    <Text style={{ color: "#8a8a8a" }}>{item.NAMA}</Text>
                  </View>

                  <View>
                    <Text
                      style={{
                        color: "#5e5e5e",
                        fontWeight: "bold",
                        marginTop: 10,
                      }}
                    >
                      Tgl Lahir
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#f0f0f0",
                      paddingHorizontal: 7,
                      paddingVertical: 10,
                      borderRadius: 7,
                      marginTop: 5,
                    }}
                  >
                    <Text style={{ color: "#8a8a8a" }}>
                      {item.TglLahir == null ? "-" : item.TglLahir}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{
                        color: "#5e5e5e",
                        fontWeight: "bold",
                        marginTop: 10,
                      }}
                    >
                      Jenis Kelamin
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#f0f0f0",
                      paddingHorizontal: 7,
                      paddingVertical: 10,
                      borderRadius: 7,
                      marginTop: 5,
                    }}
                  >
                    <Text style={{ color: "#8a8a8a" }}>
                      {item.Gender == "" ? "-" : item.Gender}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{
                        color: "#5e5e5e",
                        fontWeight: "bold",
                        marginTop: 10,
                      }}
                    >
                      Agama
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#f0f0f0",
                      paddingHorizontal: 7,
                      paddingVertical: 10,
                      borderRadius: 7,
                      marginTop: 5,
                    }}
                  >
                    <Text style={{ color: "#8a8a8a" }}>
                      {item.Agama == "" ? "-" : item.Agama}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{
                        color: "#5e5e5e",
                        fontWeight: "bold",
                        marginTop: 10,
                      }}
                    >
                      Alamat
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#f0f0f0",
                      paddingHorizontal: 7,
                      paddingVertical: 10,
                      borderRadius: 7,
                      marginTop: 5,
                    }}
                  >
                    <Text style={{ color: "#8a8a8a" }}>
                      {item.Alamat == "" ? "-" : item.Alamat}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{
                        color: "#5e5e5e",
                        fontWeight: "bold",
                        marginTop: 10,
                      }}
                    >
                      No. Handphone
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#f0f0f0",
                      paddingHorizontal: 7,
                      paddingVertical: 10,
                      borderRadius: 7,
                      marginTop: 5,
                    }}
                  >
                    <Text style={{ color: "#8a8a8a" }}>
                      {item.NoKontak == "" ? "-" : item.NoKontak}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{
                        color: "#5e5e5e",
                        fontWeight: "bold",
                        marginTop: 10,
                      }}
                    >
                      Jabatan
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#f0f0f0",
                      paddingHorizontal: 7,
                      paddingVertical: 10,
                      borderRadius: 7,
                      marginTop: 5,
                    }}
                  >
                    <Text style={{ color: "#8a8a8a" }}>
                      {item.Jabatan == "" ? "Staff Kantor" : item.Jabatan}
                    </Text>
                  </View>
                </React.Fragment>
              );
            })}
        </View>
      </Modal>

      <Modal
        visible={visibleModalAbsensi}
        onRequestClose={hideAbsensi}
        animationType="slide"
      >
        <TouchableOpacity
          onPress={hideAbsensi}
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
        </TouchableOpacity>

        <View
          style={{
            paddingHorizontal: 20,
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
              backgroundColor: "#f0f0f0",
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
              backgroundColor: "#f0f0f0",
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
              style={{ fontSize: 12 }}
            ></TextInput>
          </Pressable>

          <TouchableOpacity
            onPress={getDataAbsesi}
            style={{
              marginTop: 10,
              backgroundColor: "#3db61b",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 12, color: "#fff" }}>Proses</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ paddingHorizontal: 20, marginTop: 10, marginBottom: 10 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          persistentScrollbar={false}
        >
          {absensi && absensi.length < 1 ? (
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
            absensi &&
            absensi.map((item, i) => {
              return (
                <React.Fragment key={i}>
                  <View style={styles.listWrap}>
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
      </Modal>
    </View>
  );
}

export default Detailpegawai;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 100,
    backgroundColor: "#f1f4ff",
  },
  containerfluid: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f1f4ff",
  },
  circleImageLayout: {
    width: 120,
    height: 120,
    borderRadius: 200 / 2,
  },
  headingOne: {
    fontSize: 18,
    padding: 10,
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 10,
  },
  textCenter: {
    textAlign: "center",
  },
  centerItem: {
    alignItems: "center",
  },
  box: {
    backgroundColor: "#3db61b",
    marginTop: 60,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    width: "100%",
    flexDirection: "row",
  },
  boxChild: {
    width: 115,
    borderRightWidth: 0.5,
    borderColor: "#ffffff",
  },
  boxNoBorder: {
    borderRightWidth: 0,
  },
  textBox: {
    color: "#ffffff",
    marginTop: 5,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  boxTitle: {
    fontSize: 12,
  },
  menuProf: {
    paddingHorizontal: 10,
    marginTop: 20,
    flexDirection: "column",
  },
  menuButton: {
    flexDirection: "row",
    marginTop: 15,
  },
  textMenuButton: {
    color: "#686a69",
    justifyContent: "center",
  },
  listWrap: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#f8f8f8",
    marginTop: 10,
    borderRadius: 10,
    fontWeight: "bold",
  },
});
