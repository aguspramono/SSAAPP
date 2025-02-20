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
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import moment from "moment";
import { DatePicker } from "./../components/date-picker";
import getDataAbsesi from "./../function/absensiApi";
import { useLocalSearchParams } from "expo-router";

function Filterabsensibytanggal() {
  const { id, nama } = useLocalSearchParams();
  var dateY = new Date();

  const [date, setDate] = useState(
    new Date(dateY.getFullYear(), dateY.getMonth(), 1)
  );
  const [dateTo, setDateTo] = useState(
    new Date(dateY.getFullYear(), dateY.getMonth() + 1, 0)
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPickerToDate, setShowPickerToDate] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [absensi, setAbsensi] = useState<any[]>([]);

  async function getDataAbsesiVal() {
    const response = await getDataAbsesi(id.toString(), date, dateTo);
    setAbsensi(response);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    getDataAbsesiVal();
  }, [id, nama]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", marginTop: 30 }}>
        <Link
          href={{ pathname: "/semuaabsensi" }}
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
            Absensi [ {nama} ]
          </Text>
        </View>
      </View>

      <View style={styles.containerFluid}>
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
        </View>

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
});
