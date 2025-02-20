import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "expo-router";
import { dataPegawai } from "./../../function/pegawaiApi";

function Pegawai() {
  const [pegawai, setPegawai] = useState<any[]>([]);
  const [namaPegawai, setNamaPegawai] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  async function getDataPegawai() {
    const response = await dataPegawai(namaPegawai);
    setPegawai(response);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getDataPegawai();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    getDataPegawai();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Daftar Pegawai</Text>
          <View style={styles.items}>
            <View style={{ flexDirection: "row", marginBottom: 15 }}>
              <TextInput
                style={[styles.input, { width: "80%", marginRight: 5 }]}
                placeholder="Cari Nama Pegawai"
                onChangeText={(newNamaPegawai) => {
                  newNamaPegawai == ""
                    ? setNamaPegawai("")
                    : setNamaPegawai(newNamaPegawai);
                }}
                defaultValue={namaPegawai}
              />

              <TouchableOpacity
                onPress={getDataPegawai}
                style={{
                  backgroundColor: "#3db61b",
                  padding: 15,
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 12, color: "#fff" }}>Proses</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              persistentScrollbar={false}
            >
              {pegawai && pegawai.length < 1 ? (
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
                pegawai &&
                pegawai.map((item) => {
                  return (
                    <React.Fragment key={item.ID}>
                      <Link
                        href={{
                          pathname: "/detailpegawai",
                          params: { id: item.ID },
                        }}
                        style={styles.listWrap}
                      >
                        <View>
                          <Text>{item.NAMA}</Text>
                          <Text style={styles.XsmallText}>
                            Jabatan :{" "}
                            {item.Jabatan == "" ? "Staff Kantor" : item.Jabatan}
                          </Text>
                        </View>
                      </Link>
                    </React.Fragment>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </>
  );
}

export default Pegawai;

const styles = StyleSheet.create({
  garisHoriz: {
    borderBottomColor: "#a3a3a3",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#f1f4ff",
  },
  tasksWrapper: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  listWrap: {
    padding: 20,
    backgroundColor: "#ffffff",
    marginTop: 7,
    borderRadius: 10,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items: {
    marginTop: 20,
    marginBottom: 210,
  },
  XsmallText: {
    fontSize: 8,
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    width: "100%",
    opacity: 0.7,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  addText: {},
});
