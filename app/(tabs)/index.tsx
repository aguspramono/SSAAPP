import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  BackHandler,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useCallback, useState } from "react";
import { Link, router, useFocusEffect } from "expo-router";
import useLogin from "./../../function/store/useUserLogin";
import lastUpdate from "./../../function/lastUpdate";
import { useShallow } from "zustand/react/shallow";
import moment from "moment";

function Dashboard() {
  const [lastupdate, setLastupdate] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { iduser, setIdUser, isLogin, setLogin } = useLogin(
    useShallow((state: any) => ({
      iduser: state.iduser,
      setIdUser: state.setIdUser,
      isLogin: state.isLogin,
      setLogin: state.setLogin,
    }))
  );

  async function getDatalastUpdate() {
    const response = await lastUpdate();
    setLastupdate(response);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getDatalastUpdate();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Keluar", "Yakin ingin keluar dari aplikasi?", [
          {
            text: "Batal",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Yakin",
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  useEffect(() => {
    if (isLogin == false) {
      router.navigate("/login");
    }

    getDatalastUpdate();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <ImageBackground
          source={require("./../../assets/images/back.png")}
          resizeMode="cover"
          style={{ flex: 0.8 }}
        >
          <View style={styles.header}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              persistentScrollbar={false}
            >
              {lastupdate?.map((item) => {
                return (
                  <React.Fragment key={item.idLASTUPDATE}>
                    <View style={{ marginTop: "20%" }}>
                      <Text
                        style={{
                          color: "#ffffff",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        PT. Swastisiddhi Amagra
                      </Text>
                      <Text style={{ color: "#ffffff", fontSize: 12 }}>
                        Last Data Update{" "}
                        {moment(item.lastUpdate).format(
                          "DD MMMM YYYY, H:mm:ss a"
                        )}
                      </Text>
                    </View>
                  </React.Fragment>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.menugrid}>
            <View>
              <View style={styles.grid}>
                <Link href={{ pathname: "/pegawai" }}>
                  <View style={styles.griditem}>
                    <Image
                      style={{ width: 50, height: 50, marginBottom: 10 }}
                      source={require("./../../assets/images/pegawai.png")}
                    />
                    <Text style={{ color: "#686868", fontSize: 12 }}>
                      Pegawai
                    </Text>
                  </View>
                </Link>

                <Link href={{ pathname: "/filterabsensibytanggal" }}>
                  <View style={styles.griditem}>
                    <Image
                      style={{ width: 50, height: 50, marginBottom: 10 }}
                      source={require("./../../assets/images/absen.png")}
                    />
                    <Text style={{ color: "#686868", fontSize: 12 }}>
                      Absensi
                    </Text>
                  </View>
                </Link>
              </View>

              <View style={styles.grid}>
                <Link href={{ pathname: "/cuti" }}>
                  <View style={styles.griditem}>
                    <Image
                      style={{ width: 50, height: 50, marginBottom: 10 }}
                      source={require("./../../assets/images/cuti.png")}
                    />
                    <Text style={{ color: "#686868", fontSize: 12 }}>Cuti</Text>
                  </View>
                </Link>

                <Link href={{ pathname: "/" }}>
                  <View style={styles.griditem}>
                    <Image
                      style={{ width: 50, height: 50, marginBottom: 10 }}
                      source={require("./../../assets/images/run.png")}
                    />
                    <Text style={{ color: "#686868", fontSize: 12 }}>
                      Izin Telat
                    </Text>
                  </View>
                </Link>
              </View>

              <View style={styles.grid}>
                <Link href={{ pathname: "/" }}>
                  <View style={styles.griditem}>
                    <Image
                      style={{ width: 50, height: 50, marginBottom: 10 }}
                      source={require("./../../assets/images/sick.png")}
                    />
                    <Text style={{ color: "#686868", fontSize: 12 }}>
                      Izin Sakit
                    </Text>
                  </View>
                </Link>
                <Link href={{ pathname: "/" }}>
                  <View style={styles.griditem}>
                    <Image
                      style={{ width: 50, height: 50, marginBottom: 10 }}
                      source={require("./../../assets/images/soon.png")}
                    />
                    <Text style={{ color: "#686868", fontSize: 12 }}>Soon</Text>
                  </View>
                </Link>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f4ff",
  },
  header: {
    color: "#fff",
    padding: 20,
    position: "relative",
    height: "40%",
    flexDirection: "column",
    justifyContent: "center",
    // bac: linear-gradient(135deg, #1a2b8b, #3a4dbb),
  },
  menugrid: {
    backgroundColor: "#f1f4ff",
    padding: 10,
    paddingTop: 50,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
    marginTop: 20,
  },
  griditem: {
    alignItems: "center",
    backgroundColor: "#fff",
    width: 140,
    padding: 20,
    height: 120,
    borderRadius: 20,
  },
});
