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
      shouldRenderMarker: false,
      getGPS: true
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
    console.log("SHOULD UPDATE: Render Markers " + nextState.shouldRenderMarker);
    console.log("SHOULD UPDATE: Get Gps " + nextState.getGPS);
    if (nextState.getGPS==true || nextState.shouldRenderMarker===true){
      return true;
    }
    return false;
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("WILL UPDATE: Render Markers " + nextState.shouldRenderMarker);
    console.log("WILL UPDATE: Get Gps " + nextState.getGPS);
    // Get Array Markers from FireBase
    if (nextState.shouldRenderMarker === true) {
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

    // Get GPS 
    if (nextState.getGPS === true) {
      navigator.geolocation.getCurrentPosition(
        position => {
          nextState.region = {
           latitude  : position.coords.latitude,
           longitude: position.coords.longitude,
          latitudeDelta :0.01,
          longitudeDelta : 0.01

          },
          nextState.gps={
            latitude : position.coords.latitude,
            longitude: position.coords.longitude
         
        },
        error => console.log(error),
        { enableHighAcuracy: true, timeout: 20000, maximumAge: 1000 }
          }
                   
          
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.shouldRenderMarker === true) {
      prevState.shouldRenderMarker = false;
    }
    prevState.getGPS = false;
    console.log("DID UPDATE: Render Markers " + prevState.shouldRenderMarker);
    console.log("DID UPDATE: Get Gps " + prevState.getGPS);
  }

  componentWillUnmount() {
    console.log("Will Unmount");
  }

  renderMarker() {
    console.log("RENDER: " + this.state.shouldRenderMarker);
    markers = [];
    // if(this.state.getGPS===true){
    //   <Marker coordinate={this.state.gps} />

    // }

    if (this.state.shouldRenderMarker === true) {
      console.log("RENDER Marker");
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

  getGPS() {
    this.setState({ getGPS: true });
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
          <View style={styles.bubble}>
            <Text onPress={this.getGPS.bind(this)}>GPS</Text>
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

export default MapRE;
