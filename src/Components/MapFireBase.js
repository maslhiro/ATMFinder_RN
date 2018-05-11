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
import Geocoder from "react-native-geocoder";

const GOOGLE_MAPS_APIKEY = "AIzaSyDmMKv6H1UmRN-1D8HUFj-C_WrdAlkwwB8";

export default class MapFireBase extends Component {
  constructor(props) {
    super(props);
    database = firebase.database();
    arrayMarker = [];
    Geocoder.fallbackToGoogle("AIzaSyASXNMgcK0TPsu8RIA5ceulYo_bMJIH6iU");

    this.state = {
      region: {
        latitude: 10.8702117,
        longitude: 106.8037364,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0221
      },
      gps: {
        latitude: 10.8230989,
        longitude: 106.6296638
      },
      address:{},
      markers: arrayMarker,
      renderDirection: false,
      getAdress:false,
      currentMarker: {},
      arrayVincenty: {},
      arrayDistrict:{},
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
    if(nextState.getAdress===false) return false;
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    //if(nextState.getAdress===true){
      //nextState.arrayVincenty=getArrMarkerBound(nextState.gps.latitude,nextState.gps.longitude,45,10)
    //}
  }

  componentDidUpdate(prevProps, prevState) {
    prevState.renderDirection = false;
    prevState.getAdress = false
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      position => {
        Geocoder.geocodePosition({lat:position.coords.latitude,lng:position.coords.longitude}).then(res => {
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
              },
              //address:getDistrict(String(res[0].formattedAddress))


            });
          
          })
          .catch(err => console.log(err));
      },
      error => console.log(error), {
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
 
  async  getGeoArr() {
    Geocoder.fallbackToGoogle("AIzaSyASXNMgcK0TPsu8RIA5ceulYo_bMJIH6iU");
    var annotations = []
    for (var l of this.state.arrayVincenty) {
      var r = await getGeo(l)
      if (r == null) continue; // or display error message or whatever
      annotations.push(r)
    
    }
    console.log("annotations")
    console.log(annotations)
    this.setState({arrayDistrict:annotations}); // move this after the loop if you want only one update
  }
     

  renderMarkerWithDirection() {
    console.log(this.state.currentMarker);
  //  if (this.state.renderDirection === true) {
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
    // }
    // console.log("No Marker Directions");
  }

 
  render() {
    console.log("Address")
    console.log(this.state.address.district)
    return (
      <View style={styles.container}>
     <Text onPress={()=>this.setState({getAdress:true})}>Hiiii</Text> 
        {/* <MapView
          style={styles.map}
          showsUserLocation={true}
          region={this.state.region}
          ref={c => this.mapView = c}
          onRegionChangeComplete={e => this.setState({ region: e })}
        >
          {this.renderMarker()}
          {this.renderMarkerWithDirection()}
        </MapView> */}
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


function getDistrict(str){
  var temp = formatVietnamese(str);
  // Get country
  var country = temp.slice(temp.lastIndexOf(",")+2,temp.length);
  temp= temp.slice(0,temp.lastIndexOf(","));
  // Get City
  var city = temp.slice(temp.lastIndexOf(",")+2,temp.length);
  temp= temp.slice(0,temp.lastIndexOf(","));
  // Get District
  var district = temp.slice(temp.lastIndexOf(",")+2,temp.length);
  temp= temp.slice(0,temp.lastIndexOf(","));
  return ({
    city:city,
    district:district
  });
}

function getArrMarkerBound(latGPS, longGPS,radian, dist) {
  var i = 0,
    pos = {},
    arrayVincenty = [];
  for (i = 0; i < 360; i += radian) {
    pos=destVincenty(latGPS, longGPS, i, dist);
    console.log(pos)
    arrayVincenty.push((pos));
  }
  return arrayVincenty;
}

async function getGeo(pos) {
  try {
   let res =  await geocoder.geocodePosition(pos)
   return(getDistrict(res[0].formattedAddress))

  }catch (err) {
    console.log(err);
  }

  
}


function destVincenty(lat, lon, brng, dist) {
  var a = 6378137,
    b = 6356752.3142,
    f = 1 / 298.257223563, // WGS-84 ellipsiod
    s = dist * 1000, // km
    alpha1 = brng.toRad(),
    sinAlpha1 = Math.sin(alpha1),
    cosAlpha1 = Math.cos(alpha1),
    tanU1 = (1 - f) * Math.tan(lat.toRad()),
    cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1),
    sinU1 = tanU1 * cosU1,
    sigma1 = Math.atan2(tanU1, cosAlpha1),
    sinAlpha = cosU1 * sinAlpha1,
    cosSqAlpha = 1 - sinAlpha * sinAlpha,
    uSq = cosSqAlpha * (a * a - b * b) / (b * b),
    A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
    B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
    sigma = s / (b * A),
    sigmaP = 2 * Math.PI;
  while (Math.abs(sigma - sigmaP) > 1e-12) {
    var cos2SigmaM = Math.cos(2 * sigma1 + sigma),
      sinSigma = Math.sin(sigma),
      cosSigma = Math.cos(sigma),
      deltaSigma =
        B *
        sinSigma *
        (cos2SigmaM +
          B /
            4 *
            (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
              B /
                6 *
                cos2SigmaM *
                (-3 + 4 * sinSigma * sinSigma) *
                (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    sigmaP = sigma;
    sigma = s / (b * A) + deltaSigma;
  }
  var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1,
    lat2 = Math.atan2(
      sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
      (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)
    ),
    lambda = Math.atan2(
      sinSigma * sinAlpha1,
      cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1
    ),
    C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha)),
    L =
      lambda -
      (1 - C) *
        f *
        sinAlpha *
        (sigma +
          C *
            sinSigma *
            (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM))),
    revAz = Math.atan2(sinAlpha, -tmp); // final bearing
  return {
    lat: lat2.toDeg(),
    lng: lon + L.toDeg()
  };
}

function formatVietnamese(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
}
