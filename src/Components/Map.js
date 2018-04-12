import React, { Component } from "react";
import { View, Button, StyleSheet } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

const LAT = 10.8710591;
const LONG = 106.7996051;

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 10.8702117,
        longitude: 106.8037364,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0221
      },
      markers: [
        {
          id: 0,
          amount: 99,
          title: "Nhân văn",
          coordinates: {
            latitude: 10.8710591,
            longitude: 106.7996051
          }
        },
        {
          id: 1,
          title: "Cntt",
          amount: 199,
          coordinates: {
            // latitude: LAT+0.0004,
            // longitude: LONG+0.003
            latitude: 10.8710591,
            longitude: 106.7996051
          }
        }
      ]
    };
  }

  componentWillMount() {
    // navigator.geolocation.getCurrentPosition(
    //   position => {
    //     this.setState({
    //       region: {
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //         latitudeDelta: 0.01,
    //         longitudeDelta: 0.01
    //       },
    //     });
    //   },
    //   error => console.log(error),
    //   { enableHighAcuracy: true, timeout: 20000, maximumAge: 1000 }
    // );
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map} region={this.state.region}>
          {this.state.markers.map(marker => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinates}
              title={marker.title}
            />
          ))}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
