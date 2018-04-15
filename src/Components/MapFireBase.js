import React, { Component } from "react";
import { View, Button, StyleSheet, TouchableOpacity,Dimensions } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import firebase from "./FirebaseConfig";


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
    
    };
  }

  onRegionChance(data) {
   
  }

  componentWillMount() {
   
    database
      .ref("VietComBank")
      .child("HoChiMinh")
      .child("ThuDuc")
      .on("value", snap => {
        snap.forEach(data => {
          arrayMarker.push({
            key: data.key,
            data: data.val()
          });
        });
        
  
        this.setState({ markers: arrayMarker });
      });
  }

  componentWillReceiveProps(nextProps) {}

  shouldComponentUpdate(nextProps, nextState) {
  return true;
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, prevState) {}

  renderMarker() {
    markers = [];
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

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map}
        onRegionChange={this.onRegionChance()} 
        region={this.state.region}>
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
