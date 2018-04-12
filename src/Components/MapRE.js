import React, { Component } from "react";
import { View, Button,Text, StyleSheet, TouchableOpacity,Dimensions } from "react-native";
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
          gps:{
            latitude: 20,
            longitude: 20
          },
          markers: arrayMarker,
        
        };

    }

    componentWillMount () {
    
        navigator.geolocation.getCurrentPosition(
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
            { enableHighAcuracy: true, timeout: 20000, maximumAge: 1000 }
          );
    }

   

    showAddress() {
        var GPS = {
          lat: this.state.gps.latitude,
          lng: this.state.gps.longitude
        };
        console.log("LAT"+this.state.gps.latitude)
        var District,City;
        Geocoder.geocodePosition(GPS)
          .then(res => {
            //  res[1].feature,// Trường tho
            //  res[2].feature,
            //  res[3].feature, //Phước long
            //  res[4].feature ,//Thủ đức,
            //  res[5].feature ,//Ho Chi Minh City
            console.log("5 : "+res[5].feature);
            console.log("4 : "+res[4].feature);
            console.log("3 : "+res[3].feature);
            console.log("2 : "+res[2].feature);
            console.log("1 : "+res[1].feature);
            City = res[5].feature;
            District =res[4].feature;
            alert(City + District);
          })
          .catch(err => console.log(err));
      }
    
      render() {
        return (
          <View style={styles.container}>
            <MapView style={styles.map} region={this.state.region}>
              <Marker coordinate={this.state.maker} />
            
            </MapView>
            {/* <View style={styles.buttonContainer}>
              <View style={styles.bubble}>
                <Text onPress={this.showAddress.bind(this)}>Find</Text>
              </View>
            </View> */}
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
    


export default MapRE