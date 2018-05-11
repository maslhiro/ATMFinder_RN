import React, { Component, PropTypes } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHightLight,
  TouchableOpacity,
  DrawerLayoutAndroid
} from "react-native";
import MapView, { Marker, Callout, Circle } from "react-native-maps";
import { Header, Button, colors } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import firebase from "./FirebaseConfig";
import Geocoder from "react-native-geocoder";
import geolib from "geolib";
import MapViewDirections from "react-native-maps-directions";
import girl from "../../src/girl.png";
import logo_vietcombank from "./../../src/logo-vietcombank.jpg"

const findIcon = <Icon name="search" size={30} color="#333" />;
const GOOGLE_MAPS_APIKEY = "AIzaSyDmMKv6H1UmRN-1D8HUFj-C_WrdAlkwwB8";

const titleHeader = "호앙 난";
const colorButtonDrawer="#E9FAE3"
const colorTextButtonDrawer="#00000"

class MapRE extends Component {
  constructor(props) {
    super(props);
    database = firebase.database();
   // Geocoder.fallbackToGoogle("AIzaSyASXNMgcK0TPsu8RIA5ceulYo_bMJIH6iU");
    this.openDrawer = this.openDrawer.bind(this);
    arrayMarker = [];
    this.mapView=null;
   
    this.state = {
      region: {
        latitude: 10.8702117,
        longitude: 106.8037364,
        latitudeDelta: 0.0222,
        longitudeDelta: 0.0221
      },
      gps: {
        latitude: 10,
        longitude: 106
      },
      arrayBank:["VietComBank","VietTinBank"],
      arrayDistrict:[],
      // findNext_MODE:false,
      distance:"",
      arrayVincenty:[],
      currentMarker:[],
      markers: arrayMarker,
      shouldRenderListMarker: false,
      renderDirection: false,
      getAdress:false,
      getATM: false,
      getGPS: true,
    };
   
  }

  componentWillMount() {
    console.log("Will Mount");
  }

  componentDidMount() {
    console.log("Did mount");
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
            },
            arrayVincenty: getArrMarkerBound(position.coords.latitude,position.coords.longitude,45,5),
            //  arrayDistrict:this.getGeoArr()
            
            });
      
      },
      error => console.log(error),
      {
        enableHighAcuracy: true,
        timeout: 30000,
        maximumAge: 1000,
        distanceFilter: 1
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    console.log("WILL RECEIVE : NextProp");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(
      "SHOULD UPDATE: Render List Markers " + nextState.shouldRenderListMarker
    );
    console.log("SHOULD UPDATE: Get Gps " + nextState.getGPS);
    if (
      nextState.getGPS === true ||
      nextState.shouldRenderListMarker === true ||
      nextState.getATM === true||
      nextState.renderDirection === true
    ) {
      return true;
    }
    return false;
  }

  componentWillUpdate(nextProps, nextState) {
    console.log(
      "WILL UPDATE: Render List Markers " + nextState.shouldRenderListMarker
    );
    console.log("WILL UPDATE: Get Gps " + nextState.getGPS);
    console.log("WILL UPDATE: Get ATM " + nextState.getATM);

    // Get Array Markers from FireBase
    if (nextState.shouldRenderListMarker === true) {
      this.getGeoArr(nextState)
      this.getDataWithKey(nextState)
    }

    // Get GPS
    if (nextState.getGPS === true) {
    }

    // Get Marker Close to Current Pos
    if (nextState.getATM === true) {
      this.getDataWithKey(nextState);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    prevState.shouldRenderListMarker = false;
    prevState.getGPS = false;
    prevState.getATM = false;
    prevState.renderDirection = false;
    console.log(
      "DID UPDATE: Render List Markers " + prevState.shouldRenderListMarker
    );
    console.log("DID UPDATE: Get Gps " + prevState.getGPS);
    console.log("DID UPDATE: Get ATM " + prevState.getATM);
  //  console.log("DID UPDATE: City " + prevState.address.city);
  //  console.log("DID UPDATE: Address " + prevState.address.district);
  }

  componentWillUnmount() {
    console.log("Will Unmount");
    navigator.geolocation.clearWatch(this.watchId);

  }

  // render list item from firebase
  renderListMarker() {
    console.log("RENDER: " + this.state.shouldRenderListMarker);
    
    if (this.state.shouldRenderListMarker === true) {
      console.log("RENDER Marker");
      return (this.state.markers.map(marker => (
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
      )));
    }
    console.log("Empty Array Marker");
    
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

  //  render one marker with Directions
  renderMarkerCloseToPos() {
    if (this.state.getATM === true) {
      var marker = this.getMarkerCloseToCurrentPos(this.state);
      // distance=this.getDistance(marker);
      // console.log("Distance :"+distance)
      return this.renderMarkerWithDirection(marker);
    }
    console.log("No Marker");
  }

  renderMarkerWithDirection(dataMarker,color="red") {
    var marker = {
      key: dataMarker.key ? dataMarker.key : "",
      address: dataMarker.address ? dataMarker.address : "",
      amount: dataMarker.amount ? dataMarker.longitude : "",
      workingHour: dataMarker.longitude ? dataMarker.amount : 0,
      latitude: dataMarker.latitude ? dataMarker.latitude : 20,
      longitude: dataMarker.longitude ? dataMarker.longitude : 20
    };
    var address = String(marker.address)
    return (
      <View>
        <Marker
          key={marker.address}
          title={marker.key}
          description={address}
        
          pinColor={String(color)}
          coordinate={{
            latitude: parseFloat(marker.latitude),
            longitude: parseFloat(marker.longitude)
          }}
        >
   
        </Marker>
        <MapViewDirections
          origin={{
            latitude: parseFloat(this.state.gps.latitude),
            longitude: parseFloat(this.state.gps.longitude)
          }}
          destination={{
            latitude: parseFloat(marker.latitude),
            longitude: parseFloat(marker.longitude)
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={6}
          strokeColor="hotpink"
          onReady={(result) => {
            this.mapView.fitToCoordinates(result.coordinates, {});
            // return km
            console.log("Result : "+result.distance)
          }}
        />
      </View>
    );
  }

  renderDirection(){
    console.log("RENDER DIRECTION: "+this.state.renderDirection)
    if(this.state.renderDirection===true)
    return(
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
          onReady={(result) => {
            this.mapView.fitToCoordinates(result.coordinates, {});
            // return km
            console.log("Result : "+result.distance)
          }}
        />
      </View>
    );
  }

  showListATM() {
    this.setState({
      shouldRenderListMarker: true,
      getGPS: false,
      getATM: false
    });
  }

  getGPS() {
    this.setState({
      shouldRenderListMarker: false,
      getGPS: true,
      getATM: false
    });
  }

  getATM() {
    this.setState({
      shouldRenderListMarker: false,
      getGPS: false,
      getATM: true
    });
  }

  openDrawer() {
    this.refs["DRAWER_REF"].openDrawer();
  }

  closeDrawer() {
    this.refs["DRAWER_REF"].closeDrawer();
  }

  addDistance(arrayMarker){
    temp =[],
    arrayMarker.map(marker=>{
      temp.push({
        key: marker.key,
        address: marker.data.Address,
        amount: marker.data.Amount,
        workingHour: marker.data.WorkingHour,
        latitude: marker.data.lat,
        longitude: marker.data.long,
        distance:geolib.getDistance({
          latitude: marker.latitude,
          longitude: marker.longitude
        }, {
          latitude: this.state.gps.latitude,
          longitude: this.state.gps.longitude
        })
      })
    })
    return temp;
  }

  getMarkerCloseToCurrentPos(dataState) {
    // Get phần tử đầu tiên và tính khoảng cách đến Pos GPS
    var data = {
      key: "",
      address: "",
      amount: "",
      workingHour: "",
      latitude: 20,
      longitude: 20
    };
    // Get fist Marker in state
    for (marker of dataState.markers) {
      data = {
        key: marker.key,
        address: marker.data.Address,
        amount: marker.data.Amount,
        workingHour: marker.data.WorkingHour,
        latitude: marker.data.lat,
        longitude: marker.data.long
      };
      break;
    }
    console.log("DATA");
    console.log(data);
    var minDistance = geolib.getDistance(
      {
        latitude: data.latitude,
        longitude: data.longitude
      },
      {
        latitude: dataState.gps.latitude,
        longitude: dataState.gps.longitude
      }
    );

    var temp = {
      key: "",
      address: "",
      amount: "",
      workingHour: "",
      latitude: 20,
      longitude: 20
    };
  
    for (marker of dataState.markers) {
      temp = {
        key: marker.key,
        address: marker.data.Address,
        amount: marker.data.Amount,
        workingHour: marker.data.WorkingHour,
        latitude: marker.data.lat,
        longitude: marker.data.long
      };
      // Check minDistance
      if (
        minDistance >
        geolib.getDistance(
          {
            latitude: temp.latitude,
            longitude: temp.longitude
          },
          {
            latitude: dataState.gps.latitude,
            longitude: dataState.gps.longitude
          }
        )
      ) {
        data = {
          key: temp.key,
          address: temp.address,
          amount: temp.amount,
          workingHour: temp.workingHour,
          latitude: temp.latitude,
          longitude: temp.longitude
        };
        minDistance = geolib.getDistance(
          {
            latitude: temp.latitude,
            longitude: temp.longitude
          },
          {
            latitude: dataState.gps.latitude,
            longitude: dataState.gps.longitude
          }
        );
      }
    }

    console.log("DATA MIN");
    console.log(data);
    return data;
  }

  getDataWithKey(dataState) {
    dataState.arrayDistrict.map(add=>{
      dataState.arrayBank.map(item=>{
        database
        .ref(String(item))
        .child(String(add.city))
        .child(String(add.district))
        .on("value", snap => {
          snap.forEach(data => {
            arrayMarker.push({
              key: String(item)+" "+data.key,
              data: data.val()
            });
          });
        }),
        { enableHighAcuracy: true, timeout: 20000, maximumAge: 1000 };
      })
     
    })
  

    dataState.markers = arrayMarker;
  }

  getDistance(marker){
    var distance= (geolib.getDistance({
    latitude: marker.latitude,
    longitude: marker.longitude
  }, {
    latitude: this.state.gps.latitude,
    longitude: this.state.gps.longitude
  }));
  return distance>90000?0:distance}

async  getGeoArr(dataState) {
  Geocoder.fallbackToGoogle("AIzaSyASXNMgcK0TPsu8RIA5ceulYo_bMJIH6iU");
  var annotations = []
 // var vincenty = getArrMarkerBound(this.state.gps.latitude, this.state.gps.longitude, 45, 5);
  for (var l of dataState.arrayVincenty) {
    var r = await getGeo(l)
    if (r == null) continue; 
    annotations.push(r)
  
  }
  console.log("annotations")
  console.log(annotations)
  dataState.arrayDistrict=annotations 
}
   
render() {
  console.log("Vincenty")
  console.log(this.state.arrayVincenty)
   console.log("District")
   console.log(this.state.arrayDistrict)
    var navigationView = (
      <View style={{ flex: 1, backgroundColor: "#fff", justifyContent:"center"}}>
         <View style={{flex:1,alignItems:"center",padding:20}}>
          <Image
            style={{width: 80, height: 80}}
            source={girl}    ></Image>

        </View>
        <View style={{ flex: 4, backgroundColor: "#fff", justifyConten: "center" }}>
          <Button
            raised
            icon={{ name: 'cached' ,color:{colorTextButtonDrawer}}}
            color={colorTextButtonDrawer}
            title='BUTTON WITH ICON'
            onPress={()=>this.showListATM()}
            buttonStyle={{
              backgroundColor: colorButtonDrawer,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 10
            }} />
          <Text>   </Text>     
          <Button
            raised
            icon={{ name: 'healing',color:{colorTextButtonDrawer} }}
            title='BUTTON WITH ICON'
            color={colorTextButtonDrawer}
            onPress={()=>this.closeDrawer()}
            buttonStyle={{
              backgroundColor: colorButtonDrawer,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 10
            }} />
        </View>      
        
      </View>
    );
    return (
      <DrawerLayoutAndroid
        drawerWidth={240}
        ref={"DRAWER_REF"}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}
      >
        <View style={styles.container}>
          <View style={styles.container01}>
            <MapView
              provider="google"
              style={styles.map}
              showsUserLocation={true}
              showsMyLocationButton={true}
              region={this.state.region}
              mapType="terrain"
              showsBuildings={false}
              ref={c => this.mapView = c}
              //onRegionChangeComplete={e => this.setState({ region: e })}
            >
             
              {this.renderListMarker()}
              {this.renderDirection()}
            
            </MapView>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.mapButton}
              onPress={()=>this.getATM()}
              // onPress={this.getGPS.bind(this)}
            >
              {findIcon}
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            {/* <Button
              // loadingProps={{ size: "large", color: "rgba(111, 202, 186, 1)" }}
              //icon={{ name: "search", type: "font-awesome" }}
              title = {
                this.state.getATM ? "Distance: " + this.getDistance(this.getMarkerCloseToCurrentPos(this.state)) + " m" : "Distance: 0 m"
              }
              buttonStyle={{
                backgroundColor: "#333",
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 10
              }}
              // onPress={this.getATM.bind(this)}
            /> */}
          </View>
        </View>

        <Header
          placement="left"
          leftComponent={{
            icon: "menu",
            color: "#fff",
            onPress: () => this.openDrawer()
          }}
          centerComponent={{ text: titleHeader, style: { color: "#fff" } }}
          backgroundColor={"#333333"}
        />
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  container01: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "flex-end"
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
  },
  mapButton: {
    width: 75,
    height: 75,
    borderRadius: 85 / 2,
    backgroundColor: "rgba(252, 253, 253, 0.9)",
    justifyContent: "center",
    marginBottom: 20,
    marginRight: 20,
    alignItems: "center",
    shadowColor: "black",
    shadowRadius: 8,
    shadowOpacity: 0.12,
    opacity: 0.6,
    zIndex: 10
    
  },

});

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

async function getGeo(pos) {
  try {
   let res =  await Geocoder.geocodePosition(pos)
   return(getDistrict(res[0].formattedAddress))

  }catch (err) {
    console.log(err);
  }

  
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

export default MapRE;
