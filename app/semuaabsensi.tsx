import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import { dataPegawai } from "./../function/pegawaiApi";
import { StatusBar } from "expo-status-bar";

function Semuaabsensi() {
  const [refreshing, setRefreshing] = useState(false);
  const [pegawai, setPegawai] = useState<any[]>([]);

  async function getDataPegawai() {
    const response = await dataPegawai("");
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          persistentScrollbar={false}
          style={{ marginTop: 15, marginBottom: 35 }}
        >
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
                <Link
                  href={{
                    pathname: "/filterabsensibytanggal",
                    params: { id: item.ID, nama: item.NAMA },
                  }}
                  style={styles.listWrap}
                  key={item.ID}
                >
                  <View>
                    <Text>{item.NAMA}</Text>
                    <Text style={styles.XsmallText}>
                      Jabatan :{" "}
                      {item.Jabatan == "" ? "Staff Kantor" : item.Jabatan}
                    </Text>
                  </View>
                </Link>
              );
            })
          )}
        </ScrollView>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

export default Semuaabsensi;

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
    backgroundColor: "#f8f8f8",
    marginTop: 10,
    borderRadius: 10,
    fontWeight: "bold",
  },
});
