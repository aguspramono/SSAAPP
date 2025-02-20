import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState, useEffect } from "react";
import { router, useFocusEffect } from "expo-router";
import { SelectList } from "react-native-dropdown-select-list";
import { useShallow } from "zustand/react/shallow";
import useLogin from "./../../function/store/useUserLogin";
import {
  getUserLogin,
  updateUserLogin,
  updatePass,
} from "./../../function/loginApi";

function Settings() {
  const [pegawai, setPegawai] = useState<any[]>([]);
  const [visibleModalDetail, SetvisibleModalDetail] = useState(false);
  const [visibleModalUPass, SetvisibleModalUpass] = useState(false);
  const showPersonalInformation = () => SetvisibleModalDetail(true);
  const hidePersonalInformation = () => SetvisibleModalDetail(false);

  const showUPass = () => SetvisibleModalUpass(true);
  const hideUpass = () => SetvisibleModalUpass(false);
  const [selectedJK, setSelectedJK] = useState("");
  const [username, setUsername] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jabatan, setJabatan] = useState("");

  const [password, setPassword] = useState("");
  const [rpassword, setRpassword] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [strength, setStrength] = useState("");

  const dataGender = [
    { key: "1", value: "Laki-laki" },
    { key: "2", value: "Perempuan" },
  ];

  const { iduser, setIdUser, isLogin, setLogin, userLink, setUserLink } =
    useLogin(
      useShallow((state: any) => ({
        iduser: state.iduser,
        setIdUser: state.setIdUser,
        isLogin: state.isLogin,
        setLogin: state.setLogin,
        userLink: state.userLink,
        setUserLink: state.setUserLink,
      }))
    );

  const logout = () => {
    Alert.alert("Logout", "Yakin logout?", [
      {
        text: "Batal",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "Yakin",
        onPress: () => {
          setIdUser(0);
          setLogin(false);
          router.navigate("/login");
        },
      },
    ]);
  };

  async function userLogin() {
    const response = await getUserLogin(iduser);
    setPegawai(response);
    setUsername(response[0].USERNAME);
    setNamaLengkap(response[0].NAMA);
    setJabatan(response[0].JABATAN);
    setSelectedJK(response[0].JENISKELAMIN);
  }

  async function updateUserLoginFun() {
    const response = await updateUserLogin(
      iduser,
      namaLengkap,
      selectedJK,
      jabatan
    );

    userLogin();
  }

  async function updatePasswordFun() {
    const response = await updatePass(iduser, password);
  }

  const updateProfile = () => {
    updateUserLoginFun();
    Alert.alert("Sukses", "Data berhasil diupdate");
  };

  const validatePassword = (input: any) => {
    let newSuggestions = [];
    if (input.length < 8) {
      newSuggestions.push("Password terdiri dari 8 karakter atau lebih");
    }
    if (!/\d/.test(input)) {
      newSuggestions.push("Tambahkan setidaknya 1 angka");
    }

    if (!/[A-Z]/.test(input) || !/[a-z]/.test(input)) {
      newSuggestions.push("Tambahkan setidaknya 1 huruf besar dan kecil");
    }

    if (!/[^A-Za-z0-9]/.test(input)) {
      newSuggestions.push("Tambahkan setidaknya 1 karakter spesial");
    }

    setSuggestions(newSuggestions);

    if (newSuggestions.length === 0) {
      setStrength("Sangat Kuat");
    } else if (newSuggestions.length <= 1) {
      setStrength("Kuat");
    } else if (newSuggestions.length <= 2) {
      setStrength("Sedang");
    } else if (newSuggestions.length <= 3) {
      setStrength("Lemah");
    } else {
      setStrength("Terlalu Lemah");
    }
  };

  const updatePassword = () => {
    if (password === "") {
      Alert.alert("Error", "Password masih kosong");
      return;
    }
    if (suggestions.length != 0) {
      Alert.alert("Error", "Password belum sesuai dengan kriteria");
      return;
    }
    if (rpassword === "") {
      Alert.alert("Error", "Ulangi password masih kosong");
      return;
    }

    if (rpassword != password) {
      Alert.alert("Error", "Password tidak sama");
      return;
    }

    updatePasswordFun();

    Alert.alert(
      "Sukses",
      "Password berhasil diubah, anda akan logout dari aplikasi",
      [
        {
          text: "Ok",
          onPress: () => {
            setPassword("");
            setRpassword("");
            setIdUser(0);
            setLogin(false);
            router.navigate("/login");
          },
        },
      ]
    );
  };

  useEffect(() => {
    userLogin();
  }, [selectedJK]);

  return (
    <View style={styles.containerfluid}>
      <View style={styles.container}>
        {pegawai?.map((item) => {
          return (
            <React.Fragment key={item.USERID}>
              {item.JENISKELAMIN == "Laki-laki" ? (
                <Image
                  source={require("./../../assets/images/man.png")}
                  style={[
                    styles.circleImageLayout,
                    styles.centerItem,
                    { marginTop: 70 },
                  ]}
                />
              ) : (
                <Image
                  source={require("./../../assets/images/woman.png")}
                  style={[
                    styles.circleImageLayout,
                    styles.centerItem,
                    { marginTop: 70 },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}

        {pegawai?.length < 1 ? (
          <ActivityIndicator
            animating={true}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              height: 30,
            }}
            size="large"
          />
        ) : (
          pegawai?.map((item) => {
            return (
              <React.Fragment key={item.USERID}>
                <View>
                  <Text
                    style={[
                      styles.headingOne,
                      styles.textCenter,
                      { marginTop: 20 },
                    ]}
                  >
                    {item.NAMA}{" "}
                  </Text>
                  <Text style={[styles.smallText, styles.textCenter]}>
                    {item.STATUS == "" ? "Staff Kantor" : item.STATUS}{" "}
                  </Text>
                </View>
              </React.Fragment>
            );
          })
        )}

        <TouchableOpacity
          style={[
            styles.menuButton,
            {
              marginTop: 50,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              borderColor: "#3db61b",
            },
          ]}
          onPress={showPersonalInformation}
        >
          <View>
            <Text
              style={[
                styles.textMenuButton,
                { marginLeft: 5, color: "#3db61b" },
              ]}
            >
              {" "}
              Ubah Profile
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.menuButton,
            {
              marginTop: 10,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              borderColor: "#3db61b",
            },
          ]}
          onPress={showUPass}
        >
          <View>
            <Text
              style={[
                styles.textMenuButton,
                { marginLeft: 5, color: "#3db61b" },
              ]}
            >
              {" "}
              Ubah Password
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.menuButton,
            {
              marginBottom: 100,
              marginTop: 10,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              borderColor: "#b61b1b",
            },
          ]}
          onPress={logout}
        >
          <View>
            <Text style={{}}>
              <FontAwesome size={18} name="sign-out" color="#b61b1b" />
            </Text>
          </View>
          <View>
            <Text
              style={[
                styles.textMenuButton,
                { marginLeft: 5, color: "#b61b1b" },
              ]}
            >
              {" "}
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
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
                <React.Fragment key={item.USERID}>
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
                    style={[
                      styles.input,
                      { marginBottom: 15, color: "#949393" },
                    ]}
                    placeholder="Username"
                    onChangeText={(newUsername) => {
                      newUsername == ""
                        ? setUsername("")
                        : setUsername(newUsername);
                    }}
                    defaultValue={username}
                    editable={false}
                  />

                  <Text
                    style={{
                      marginBottom: 5,
                      color: "#5e5e5e",
                      fontWeight: "bold",
                    }}
                  >
                    Nama Lengkap
                  </Text>
                  <TextInput
                    style={[styles.input, { marginBottom: 15 }]}
                    placeholder="Nama Lengkap"
                    onChangeText={(newNamaLengkap) => {
                      newNamaLengkap == ""
                        ? setNamaLengkap("")
                        : setNamaLengkap(newNamaLengkap);
                    }}
                    defaultValue={namaLengkap}
                  />

                  <Text
                    style={{
                      marginBottom: 5,
                      color: "#5e5e5e",
                      fontWeight: "bold",
                    }}
                  >
                    Jabatan
                  </Text>
                  <TextInput
                    style={[styles.input, { marginBottom: 15 }]}
                    placeholder="Jabatan"
                    onChangeText={(newJabatab) => {
                      newJabatab == ""
                        ? setJabatan("")
                        : setJabatan(newJabatab);
                    }}
                    defaultValue={jabatan}
                  />

                  <Text
                    style={{
                      marginBottom: 5,
                      color: "#5e5e5e",
                      fontWeight: "bold",
                    }}
                  >
                    Jenis Kelamin
                  </Text>

                  <SelectList
                    setSelected={(val: any) => setSelectedJK(val)}
                    data={dataGender}
                    save="value"
                    placeholder="Pilih Jenis Kelamin"
                    boxStyles={{ borderColor: "#ebebeb" }}
                    inputStyles={{ color: "#5e5e5e" }}
                    dropdownTextStyles={{ color: "#5e5e5e" }}
                    defaultOption={{ key: "1", value: selectedJK }}
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
                    onPress={updateProfile}
                  >
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Simpan Perubahan
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
        </View>
      </Modal>

      <Modal
        visible={visibleModalUPass}
        onRequestClose={hideUpass}
        animationType="slide"
      >
        <TouchableOpacity
          onPress={hideUpass}
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
          <Text
            style={{
              marginBottom: 5,
              color: "#5e5e5e",
              fontWeight: "bold",
            }}
          >
            Password Baru
          </Text>
          <TextInput
            style={[styles.input, { color: "#949393" }]}
            placeholder="Password Baru"
            secureTextEntry={true}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
          />

          <Text style={styles.suggestionsText}>
            {suggestions.map((suggestion, index) => (
              <Text key={index}>
                {suggestion}
                {"\n"}
              </Text>
            ))}
          </Text>

          <Text style={styles.strengthText}>Kekuatan Password: {strength}</Text>
          <View style={styles.strengthMeter}>
            <View
              style={{
                width: `${
                  strength === "Sangat Kuat"
                    ? 100
                    : strength === "Kuat"
                    ? 75
                    : strength === "Sedang"
                    ? 50
                    : strength === "Lemah"
                    ? 25
                    : 0
                }%`,
                height: 20,
                backgroundColor:
                  strength === "Terlalu Lemah"
                    ? "red"
                    : strength === "Lemah"
                    ? "orange"
                    : strength === "Sedang"
                    ? "yellow"
                    : strength === "Kuat"
                    ? "green"
                    : "limegreen",
              }}
            ></View>
          </View>

          <Text
            style={{
              marginBottom: 5,
              color: "#5e5e5e",
              fontWeight: "bold",
            }}
          >
            Ulangi Password
          </Text>
          <TextInput
            style={[styles.input, { marginBottom: 15, color: "#949393" }]}
            placeholder="Ulangi Password"
            secureTextEntry={true}
            onChangeText={(text) => {
              setRpassword(text);
            }}
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
            onPress={updatePassword}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Ubah Password
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f1f4ff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "bold",
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  textMenuButton: {
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
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#ebebeb",
    borderRadius: 10,
    width: "100%",
    opacity: 0.7,
  },
  smallText: {
    fontSize: 11,
  },
  strengthText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#007700",
  },
  suggestionsText: {
    color: "red",
  },
  strengthMeter: {
    width: "100%",
    height: 20,
    backgroundColor: "#ccc",
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
});
