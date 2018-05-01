import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import firebase from "./FirebaseConfig";
import MapViewDirections from "react-native-maps-directions";
const GOOGLE_MAPS_APIKEY = "AIzaSyDmMKv6H1UmRN-1D8HUFj-C_WrdAlkwwB8";

export default class MapFireBase extends Component {
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
      renderDirection: false,
      currentMarker: {},
      currentRegion:{}
    };
    this.mapView = null;
  }

  componentWillMount() {
    let count = 0;
    database
      .ref("VietComBank")
      .child("Ho Chi Minh City")
      .child("Thu Duc")
      .on("value", snap => {
        snap.forEach(data => {
          arrayMarker.push({
            key: String(count),
            data: data.val()
          });
          count += 1;
        });

        console.log(arrayMarker);
        this.setState({ markers: arrayMarker });
      }),
      { timeout: 20000 };
  }

  componentWillReceiveProps(nextProps) {}

  shouldComponentUpdate(nextProps, nextState) {
    //if(nextState.renderDirection===false) return false;
    return true;
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, prevState) {
    prevState.renderDirection = false;
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          },
          gps: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      },
      error => console.log(error),
      {
        enableHighAcuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 1
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  renderMarker() {
    return this.state.markers.map(marker => (
      <Marker
        key={marker.key}
        coordinate={{
          latitude: parseFloat(marker.data.lat),
          longitude: parseFloat(marker.data.long)
        }}
        title={marker.key}
        onCalloutPress={() => this.markerClick(marker)}
        description={marker.data.Address}
      />
    ));
  }

  markerClick(data) {
    this.setState({
      currentMarker: {
        key: data.key ? data.key : "",
        address: data.data.Address ? data.data.Address : "",
        amount: data.data.Amount ? data.data.Amount : "",
        workingHour: data.data.WorkingHour ? data.data.WorkingHour : 0,
        latitude: data.data.lat ? data.data.lat : 20,
        longitude: data.data.long ? data.data.long : 20
      },
      renderDirection: true
    });
  }
 
  renderMarkerWithDirection() {
    console.log(this.state.currentMarker);
    if (this.state.renderDirection === true) {
      //var address = String(marker.address)
      return (
        <View>
          <MapViewDirections
            origin={{
              latitude: parseFloat(this.state.gps.latitude),
              longitude: parseFloat(this.state.gps.longitude)
            }}
            destination={{
              latitude: parseFloat(this.state.currentMarker.latitude),
              longitude: parseFloat(this.state.currentMarker.longitude)
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={6}
            strokeColor="hotpink"
            // onStart={(params) => {
            //   console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            // }}
            onReady={(result) => {
              this.mapView.fitToCoordinates(result.coordinates, {});
              // return km
              console.log("Result : "+result.distance)
            }}
          />
        </View>
      );
    }
    console.log("No Marker Directions");
  }

  


  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          region={this.state.region}
          ref={c => this.mapView = c}
          onRegionChangeComplete={e => this.setState({ region: e })}
        >
          {this.renderMarker()}
          {this.renderMarkerWithDirection()}
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
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    ...StyleSheet.absoluteFillObject
  },
  button: {
    padding: 10,
    backgroundColor: "green",
    borderColor: "black",
    borderRadius: 10,
    margin: 10
  }
});
