import { collectionPoints } from "@/data/home";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

// Peta Android/iOS yang menandai semua TPS.
export function TpsMap({ height = 220 }: { height?: number }) {
  return (
    <MapView
      style={[styles.map, { height }]}
      initialRegion={{
        latitude: -7.4209,
        longitude: 109.247,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }}
    >
      {collectionPoints.map((point) => (
        <Marker
          key={point.name}
          coordinate={{ latitude: point.latitude, longitude: point.longitude }}
          title={point.name}
          description={point.address}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: "100%", borderRadius: 14 },
});
