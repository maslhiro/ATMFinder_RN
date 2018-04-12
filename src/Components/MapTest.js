import React, { Component } from "react";
import { View, Button, StyleSheet } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

export default class MapTest extends Component {
  constructor(props) {
    super(props);
    arrayMarker = [
      {
        latitude: 10.8710591,
        longitude: 106.7996051
      }
    ];

    this.state = {
      region: {
        latitude: 10.8702117,
        longitude: 106.8037364,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0221
      },
      markers: arrayMarker
    };
  }

  onRegionChance(data) {}

  onPress(data) {
    let lat = data.nativeEvent.coordinate.latitude;
    let long = data.nativeEvent.coordinate.longitude;

    arrayMarker.push({
      latitude: lat,
      longitude: long
    });

    this.setState({ markers: arrayMarker });

  
  }

  renderMarker() {
    markers=[];
    for (marker of this.state.markers) {
        markers.push(
            <Marker
            key={marker.longitude}
            coordinate={marker}
          />
        );
     
    }
    return markers;
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={this.state.region}
          onPress={this.onPress.bind(this)}
        >
        {this.renderMarker()}

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
