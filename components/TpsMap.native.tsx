import type { CollectionPointRow } from "@/types/home";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

// Peta Android/iOS yang menandai semua TPS.
export function TpsMap({
  points,
  height = 220,
}: {
  points: CollectionPointRow[];
  height?: number;
}) {
  return (
    <MapView
      style={[styles.map, { height }]}
      initialRegion={{
        latitude: points[0]?.latitude ?? -7.4209,
        longitude: points[0]?.longitude ?? 109.247,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }}
    >
      {points.map((point) => (
        <Marker
          key={point.id}
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
