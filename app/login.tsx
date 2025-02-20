import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
  BackHandler,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";
import { getDataLogin } from "./../function/loginApi";
import React, { useState, useEffect, useCallback, useRef } from "react";
import useLogin from "./../function/store/useUserLogin";
import {
  deleteToken,
  createToken,
  deleteTokenbyToken,
} from "./../function/token";
import { useShallow } from "zustand/react/shallow";
import { usePushNotifications } from "./../function/registerForPushNotificationsAsync";

function Login() {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const { expoPushToken, notification } = usePushNotifications();
  const dataNotif = JSON.stringify(notification, undefined, 2);
  const [loading, setLoading] = useState(false);

  const {
    iduser,
    setIdUser,
    isLogin,
    setLogin,
    userLink,
    setUserLink,
    statusUser,
    setStatusUser,
  } = useLogin(
    useShallow((state: any) => ({
      iduser: state.iduser,
      setIdUser: state.setIdUser,
      isLogin: state.isLogin,
      setLogin: state.setLogin,
      userLink: state.userLink,
      setUserLink: state.setUserLink,
      statusUser: state.statusUser,
      setStatusUser: state.setStatusUser,
    }))
  );

  async function tokenDeleted(iduserLogin = null) {
    await deleteToken(iduserLogin);
  }

  async function tokenDeletedByToken(tokenlogin: any) {
    await deleteTokenbyToken(tokenlogin);
  }

  async function tokenCreated(token = "", iduserlogin = 0, statuslogin = "") {
    await createToken(token, iduserlogin, statuslogin);
  }

  async function logProc() {
    if (username === "") {
      Alert.alert("Error", "Username masih kosong", [
        { text: "OK", onPress: () => setLoading(false) },
      ]);
      return;
    }

    if (pass === "") {
      Alert.alert("Error", "Password masih kosong", [
        { text: "OK", onPress: () => setLoading(false) },
      ]);
      return;
    }

    const response = await getDataLogin(username);
    if (response.length < 1) {
      Alert.alert("Error", "Akun tidak ditemukan", [
        { text: "OK", onPress: () => setLoading(false) },
      ]);
    } else {
      if (pass === response[0].PASSWORD) {
        setIdUser(response[0].USERID);
        setUserLink(response[0].USERLINK);
        setLogin(true);
        setStatusUser(response[0].STATUS);
        setUsername("");
        setPass("");

        tokenDeleted(response[0].USERID);
        tokenDeletedByToken(expoPushToken?.data.substring(18).replace("]", ""));
        tokenCreated(
          expoPushToken?.data.substring(18).replace("]", ""),
          response[0].USERID,
          "atasan"
        );

        router.navigate("/(tabs)");
      } else {
        Alert.alert("Error", "Password salah", [
          { text: "OK", onPress: () => setLoading(false) },
        ]);
      }
    }
  }

  const buttonLogin = () => {
    setLoading(true);
    setTimeout(() => {
      logProc();
      setLoading(false);
    }, 2000);
  };

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        BackHandler.exitApp();
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
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("./../assets/images/back.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <Text
          style={{
            marginTop: 150,
            color: "#ffffff",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Selamat Datang!
        </Text>
        <Text style={{ color: "#ffffff", fontSize: 14 }}>
          Silahkan login untuk menggunakan sistem
        </Text>
      </ImageBackground>

      <View
        style={{
          position: "absolute",
          marginTop: "80%",
          backgroundColor: "#f1f4ff",
          width: "100%",
          height: "100%",
          borderRadius: 40,
          flex: 1,
        }}
      >
        <ScrollView>
          <View style={{ marginTop: 50, paddingHorizontal: 20 }}>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#3e3bf7" }}
            >
              Sign In
            </Text>
            <View style={{ marginTop: 50 }}>
              <Text
                style={{
                  marginBottom: 5,
                  color: "#5e5e5e",
                  fontWeight: "bold",
                }}
              >
                Username
              </Text>
              <TextInput
                style={[styles.input, { marginBottom: 15 }]}
                placeholder="Username"
                onChangeText={(newUsername) => {
                  newUsername == ""
                    ? setUsername("")
                    : setUsername(newUsername);
                }}
                defaultValue={username}
              />

              <Text
                style={{
                  marginBottom: 5,
                  color: "#5e5e5e",
                  fontWeight: "bold",
                }}
              >
                Password
              </Text>
              <TextInput
                style={[styles.input]}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(newPass) => {
                  newPass == "" ? setPass("") : setPass(newPass);
                }}
                defaultValue={pass}
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
                onPress={buttonLogin}
              >
                <Text
                  style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}
                >
                  {loading == false ? (
                    "Log In"
                  ) : (
                    <ActivityIndicator size={22} color="#ffffff" />
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0072cf",
  },
  image: {
    flex: 1,
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
  smallText: {
    fontSize: 11,
  },
});
