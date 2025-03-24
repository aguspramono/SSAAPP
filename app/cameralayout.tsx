import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import React, { useState, useCallback, useEffect } from "react";

function Tambahcuti() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", paddingBottom: 10 }}>
          Aplikasi butuh izin membuka kamera
        </Text>

        <TouchableOpacity
          style={{
            marginTop: 25,
            backgroundColor: "#3db61b",
            paddingHorizontal: 25,
            paddingVertical: 15,
            borderRadius: 20,
            alignItems: "center",
          }}
          onPress={requestPermission}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Izinkan Akses Kamera
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

export default Tambahcuti;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
