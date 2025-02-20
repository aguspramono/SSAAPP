import { Stack } from "expo-router";

function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="detailpegawai" options={{ headerShown: false }} />
      <Stack.Screen
        name="filterabsensibytanggal"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="semuaabsensi" options={{ headerShown: false }} />
      <Stack.Screen name="cuti" options={{ headerShown: false }} />
      <Stack.Screen name="tambahcuti" options={{ headerShown: false }} />
    </Stack>
  );
}

export default Layout;
