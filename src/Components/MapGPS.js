import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

import Geocoder from "react-native-geocoder";

export default class MapGPS extends Component {
  constructor(props) {
    super(props);
    Geocoder.fallbackToGoogle("AIzaSyASXNMgcK0TPsu8RIA5ceulYo_bMJIH6iU");
    this.state = {
      region: {
        latitude: 10.8702117,
        longitude: 106.8037364,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0221
      },
      maker: {
        latitude: 20,
        longitude: 20
      },
      getGPS: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("Should update");
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    
  }

  componentDidUpdate(prevProps, prevState) {
    
  }
  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          },
          maker: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      },
      error => console.log(error),
      { enableHighAcuracy: true, timeout: 20000, maximumAge: 1000,distanceFilter :1 }
    );
  }

  componentWillUnmount() {
    navigator.geolocation .clearWatch(this.watchId);
  }

  showAddress() {
    var GPS = {
      lat: this.state.maker.latitude,
      lng: this.state.maker.longitude
    };

    Geocoder.geocodePosition(GPS)
      .then(res => {
        //res[1].locality //Ho Chi Minh City
        //  res[1].feature,// Trường tho
        //  res[2].feature,
        //  res[3].feature, //Phước long
        //  res[4].feature ,//Thủ đức,
        //  res[5].feature ,//Ho Chi Minh City
        console.log("5 : " + res[5].feature);
        console.log("4 : " + res[4].feature);
        console.log("3 : " + res[3].feature);
        console.log("2 : " + res[2].feature);
        console.log("1 : " + res[1].feature);
        alert(res[4].feature);
      })
      .catch(err => console.log(err));
  }

  onRegionChangeComplete = region => {
    console.log(" region", region);
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            region={this.state.region}
            onRegionChangeComplete={this.onRegionChangeComplete}
          >
            <Marker coordinate={this.state.maker} />
          </MapView>
          <View style={styles.buttonContainer}>
            <View style={styles.bubble}>
              <Text onPress={()=>this.setState({getGPS:true})}>Find</Text>
            </View>
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
  buttonContainer01: {
    flexDirection: "row",
    justifyContent: "flex-start",

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
