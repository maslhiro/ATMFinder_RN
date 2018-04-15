import React, { Component, PropTypes } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import firebase from "./FirebaseConfig";

class MapRE extends Component {
  constructor(props) {
    super(props);
    database = firebase.database();
    arrayMarker = [];

    this.state = {
      region: {
        latitude: 10.8702117,
        longitude: 106.8037364,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0221
      },
      gps: {
        latitude: 20,
        longitude: 20
      },
      markers: arrayMarker,
      shouldRenderMarker: false
    };
  }

  componentWillMount() {
    console.log("Will Mount");
  }

  componentDidMount() {
    console.log("Did mount");
  }

  componentWillReceiveProps(nextProps) {
    console.log("WILL RECEIVE : NextProp");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("SHOULD UPDATE: NextProp" + nextState.shouldRenderMarker);
  return nextState.shouldRenderMarker;
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("WILL UPDATE: NEXT " + nextState.shouldRenderMarker);

    database
      .ref("VietComBank")
      .child("Ho Chi Minh City")
      .child("Thủ Đức")
      .on("value", snap => {
        snap.forEach(data => {
          arrayMarker.push({
            key: data.key,
            data: data.val()
          });
        });

        nextState.markers = arrayMarker;
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.shouldRenderMarker === true) {
      prevState.shouldRenderMarker = false;
    }
    console.log("DID UPDATE: PREV " + prevState.shouldRenderMarker);
  }

  componentWillUnmount() {
    console.log("Will Unmount");
  }

  renderMarker() {
    console.log("RENDER: " + this.state.shouldRenderMarker);
    markers = [];

    if (this.state.shouldRenderMarker === true) {
      console.log("RENDER Marker")
      for (marker of this.state.markers) {
        markers.push(
          <Marker
            key={marker.data.address}
            title={marker.key}
            coordinate={{
              latitude: parseFloat(marker.data.lat),
              longitude: parseFloat(marker.data.long)
            }}
          />
        );
      }
      return markers;
    }
    console.log("Empty Array Marker");
    return markers;
  }

  showAddress() {
    this.setState({ shouldRenderMarker: true });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map} region={this.state.region}>
          {this.renderMarker()}
        </MapView>
        <View style={styles.buttonContainer}>
          <View style={styles.bubble}>
            <Text onPress={this.showAddress.bind(this)}>Find</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",

    alignItems: "center",
    marginVertical: 30,
    backgroundColor: "transparent"
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center"
  }
});

// MapRE.propTypes = {

// }

export default MapRE;
