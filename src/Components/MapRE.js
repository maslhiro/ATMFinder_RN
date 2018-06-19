<script src="http://localhost:8097"></script>
import React, { Component, PropTypes } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHightLight,
  TouchableOpacity,
  DrawerLayoutAndroid,
  ImageBackground
} from "react-native";

import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
  FadeAnimation,
} from 'react-native-popup-dialog';

import MapView, { Marker, Callout, Circle } from "react-native-maps";
import { Header, Button, Colors,Slider } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import firebase from "./FirebaseConfig";
import Geocoder from "react-native-geocoder";
import geolib from "geolib";
import MapViewDirections from "react-native-maps-directions";
import OfflineBar from 'react-native-offline-status'
import ActionButton from 'react-native-action-button';
import RNGooglePlaces from "react-native-google-places"

import ic_gps from "../assets/ic_gps.png"
import ic_info from "./../../src/assets/ic_info.png"
import ic_findNear from "./../../src/assets/ic_findNear.png"
import ic_search from "./../../src/assets/ic_search.png"
import ic_findAround from "./../../src/assets/ic_findAround.png"
import markerVietcombank from "./../../src/assets/ic_markerVietCom.png"
import markerViettinbank from "./../../src/assets/ic_markerVietTin.png"
import markerDongabank from "./../../src/assets/ic_markerDongA.png"
import markerAgribank from "./../../src/assets/ic_markerAgri.png"
import markerAchaubank from "./../../src/assets/ic_markerACB.png"
import markerBidvbank from "./../../src/assets/ic_markerBidv.png"

import background from "./../../src/assets/background.jpg"
//import MapStyle from "./MapStyle"
const findIcon = <Icon name="search" size={30} color="#333" />;
const GOOGLE_MAPS_APIKEY = "AIzaSyDmMKv6H1UmRN-1D8HUFj-C_WrdAlkwwB8";

const titleHeader_findMode01 = "FIND BY LOCATION";
const titleHeader_findMode02 = "FIND AROUND";
const colorButtonDrawer="rgb(233, 250, 227)"
const colorTextButtonDrawer="rgb(0, 0, 0)"

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
const scaleAnimation = new ScaleAnimation();
const fadeAnimation = new FadeAnimation({ animationDuration: 150 });

class MapRE extends Component {
 
  constructor(props) {
    super(props);
    database = firebase.database();
    Geocoder.fallbackToGoogle("AIzaSyASXNMgcK0TPsu8RIA5ceulYo_bMJIH6iU");
    this.openDrawer = this.openDrawer.bind(this);

    this.mapView=null;
   
    this.state = {
      region: {
        latitude: 10.8702117,
        longitude: 106.8037364,
        latitudeDelta:0.02108755978843213,
        longitudeDelta: 0.012548379600062276
      },
      gps: {
        latitude: 10.8702117,
        longitude: 106.8037364
      },
      arrayBank:["VietComBank","VietTinBank","AChauBank","AgriBank","BIDVBank","DongABank"],
      arrayDistrict:[],
      find_MODE:-1,   
      // = 1 => Find by Locations
      // = 0 => Find around Locations
      distance:"",
      arrayVincenty: [],
      getSearchBoxResult:false,
      address:"",
      // arrayVincenty:[],
      currentMarker:[],
      markers: [],
      shouldRenderListMarker: false,
      renderDirection: false,
      getAdress:false,
      getATM: false,
      getGPS: true,
      distanceValue: 1,
    }
   
  }

  componentWillMount() {
    console.log("Will Mount");
  }

  componentDidMount() {
    console.log("Did mount");

    RNGooglePlaces.getCurrentPlace()
    .then((results) => {
     //     this.getGeoArr_First(results)

    // Test       
           this.setState({
           region: {
              latitude: results[0].latitude,
              longitude: results[0].longitude,
              latitudeDelta: 0.02108755978843213,
              longitudeDelta: 0.012548379600062276
            },
            gps: {
              latitude:results[0].latitude,
              longitude: results[0].longitude,
            },
            // Tính ra mảng 8  tọa đọ nằm gần 
            arrayVincenty: getArrMarkerBound(results[0].latitude,results[0].longitude,45,3),
             
    })
    ,(error) => console.log(error.message),{timeout:20000}
  })
}

  componentWillReceiveProps(nextProps) {
    console.log("WILL RECEIVE : NextProp");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("SHOULD UPDATE: Get ATM " + nextState.shouldRenderListMarker);
    if (
      nextState.getGPS === true ||
      nextState.shouldRenderListMarker === true ||
      nextState.getATM === true||
      nextState.renderDirection === true||
      nextState.getSearchBoxResult===true
    ) {
      // this.getGeoArr(nextState);
      // this.getGeoArr(nextState);

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
      nextState.arrayVincenty=
      getArrMarkerBound(nextState.gps.latitude,nextState.gps.longitude,45,3),

      // nextState.marker = [];

      this.getGeoArr(nextState)
      this.getDataWithKey(nextState)
      nextState.markers = this.getArrayMarker(nextState)
//     nextState.markers=this.getArrayMarker(nextState,this.state.distanceValue*1000)
      }
    else
    // Get GPS
    if (nextState.getGPS === true) {
    }
    else
    // Get Marker Close to Current Pos
    if (nextState.getATM === true) {
      nextState.arrayVincenty=
       getArrMarkerBound(nextState.gps.latitude,nextState.gps.longitude,45,3),
      
      this.getGeoArr(nextState)
      this.getDataWithKey(nextState);
    }
    else
    
    if (nextState.find_MODE!==0 ) {
      
    }

  }

  componentDidUpdate(prevProps, prevState) {

    prevState.shouldRenderListMarker = false;

    if(prevState.getATM===true){
      prevState.markers=[]
    }

    prevState.getGPS = false;
    prevState.getATM = false;
    prevState.renderDirection = false;
    prevState.getSearchBoxResult = false;
    // prevState.markers = [];
    // prevState.arrayVincenty = [];
    
    console.log("DID UPDATE: Get Gps " + prevState.getGPS);
    console.log("DID UPDATE: Get ATM " + prevState.getATM);
  
  }

  componentWillUnmount() {
    console.log("Will Unmount");
   // navigator.geolocation.clearWatch(this.watchId);

  }

  // render list item from firebase
  renderListMarker() {
    console.log("RENDER: " + this.state.shouldRenderListMarker);
    
    if (this.state.shouldRenderListMarker === true) {
      console.log("RENDER List Marker");
      if(this.state.markers.length === 0) console.log("Empty List Marker")
      else
      return (this.state.markers.map(marker => (
        <Marker
          id ={marker.key}
          key={marker.key}
          coordinate={{
            latitude: parseFloat(marker.latitude),
            longitude: parseFloat(marker.longitude)
          }} 
          image={this.renderCustomMarker(marker.key)}
          // title={marker.key}
          onCalloutPress={() => this.markerClick(marker)}
          // description={marker.address+"\n Amount: "+marker.amount}
        >
        <Callout>
          <Text style={{textAlign:"center",fontStyle:"italic",textDecorationStyle:"solid",fontWeight:"bold"}}>{marker.key}</Text>
          <Text>{marker.address}</Text>
          <Text>Amout : {marker.amount}</Text>
          <Text>Working Hour : {marker.workingTime}</Text>
        </Callout>
        </Marker>
      )));
    }
    console.log("Empty Array Marker");
    
  }

  markerClick(data) {
    this.setState({
      currentMarker: {
        key: data.key ? data.key : "",
        address: data.address ? data.address : "",
        amount: data.amount ? data.amount : "",
        workingTime: data.workingTime ? data.workingTime : 0,
        latitude: data.latitude ? data.latitude : 20,
        longitude: data.longitude ? data.longitude : 20
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
      amount: dataMarker.amount ? dataMarker.amount : "",
      workingTime: dataMarker.workingTime ? dataMarker.workingTime : 0,
      latitude: dataMarker.latitude ? dataMarker.latitude : 20,
      longitude: dataMarker.longitude ? dataMarker.longitude : 20
    };
    var key = String(marker.key)
    var description = String(marker.address+"\n Amout:"+marker.amount)
    return (
      
      <View>
        <Marker
          key={marker.address}
        //  title={marker.key}
        //  description={description}
         // pinColor={String(color)}
         
           image={this.renderCustomMarker(key)}
          coordinate={{
            latitude: parseFloat(marker.latitude),
            longitude: parseFloat(marker.longitude)
          }}
        >
         <Callout>
          <Text style={{textAlign:"center",fontStyle:"italic",textDecorationStyle:"solid",fontWeight:"bold"}}>{marker.key}</Text>
          <Text>{marker.address}</Text>
          <Text>Amout : {marker.amount}</Text>
          <Text>Working Hour : {marker.workingTime}</Text>
        </Callout>
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

  renderCustomMarker(key){
    if (key==="") return null;
    switch(checkDescription(key)){
      case 1:
      return markerVietcombank;      
      case 2:
      return markerViettinbank;
      case 3:
      return markerAchaubank
      case 4:
      return markerDongabank
      case 5:
      return markerBidvbank
      case 6:
      return markerAgribank
      default: 
      return null;
   
    }
  }
   
  renderSlider(){
    if(this.state.find_MODE===0){
      return(
        <View style={styles.buttonContainer}>
          <View style={{flex:1}}>
            <Text></Text>
          </View>
          <View style={{flex:3, alignItems: 'stretch', justifyContent: 'center', backgroundColor: "transparent"}}>
          <Slider
            minimumValue={0}
            maximumValue={3}
            step={0.5}
            value={this.state.distanceValue}
            trackStyle={customStylesSlider.track}
            thumbStyle={customStylesSlider.thumb}
            minimumTrackTintColor='#30a935'
            onValueChange={value=>this.setState({ 
              shouldRenderListMarker: true,
              getGPS: false,
              getATM: false,
              distanceValue:value})}
          />

         <Button
              title={String("Radius: "+this.state.distanceValue * 1000+" m")}
              buttonStyle={{
                backgroundColor: "#333",
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 10
              }}
          />
          </View>
        <View style={{flex:2}}>
          <Text></Text>
        </View>
        </View>
        );
    }
  }

  renderViewInfo(){
    return(
      <PopupDialog
      ref={(popupDialog) => {
        this.scaleAnimationDialog = popupDialog;
      }}
      height={400}
      width={300}
      dialogAnimation={scaleAnimation}
      dialogTitle={<DialogTitle title="ATM Finder App" />}
      actions={[
        <DialogButton
          text="Close"
          onPress={() => {
            this.scaleAnimationDialog.dismiss();
          }}
         
        />,
      ]}>
      <View style={styles.dialogContentView}>
        <ImageBackground source={background} style={{width:"100%" ,height:"100%"}}> 
        <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
           <Text style={{fontFamily:"Roboto",fontSize:15,color:"#FFFFFF"}}>Version 1.0.4 </Text> 
           <Text style={{fontFamily:"Roboto",fontSize:15,color:"#FFFFFF"}}>Help find an ATM near you </Text>
           <Text style={{fontFamily:"Roboto",fontSize:15,color:"#FFFFFF"}}>Contact 2amteam.uit@gmail.com  </Text> 
           <Text style={{fontFamily:"Roboto",fontSize:15,color:"#FFFFFF"}}>for more infomation.  </Text>
           <Text style={{fontFamily:"Roboto",fontSize:15,color:"#FFFFFF"}}>Thanks for reading:) </Text>
           <Text></Text>
        </View>
        </ImageBackground> 
        
      </View>
    </PopupDialog>
    )
  }

  renderViewMess(){
    return(
      <PopupDialog
      key={Dialog1}
      ref={(popupDialog) => {
        this.scaleAnimationDialogMess = popupDialog;
      }}
      height={400}
      width={300}
      dialogAnimation={scaleAnimation}
      dialogTitle={<DialogTitle title="ATM Finder App" />}
      actions={[
        <DialogButton
          key={buttonDialog}
          text="Close"
          onPress={() => {
            this.scaleAnimationDialogMess.dismiss();
          }}
         
        />,
      ]}>
      <View style={styles.dialogContentView}>
        <ImageBackground source={background} style={{width:"100%" ,height:"100%"}}> 
           <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
           <Text style={{fontFamily:"Roboto",fontSize:15,color:"#FFFFFF"}}>Sorry, This app only use for the ATM</Text>
           <Text style={{fontFamily:"Roboto",fontSize:15,color:"#FFFFFF"}}>on District 9 and Thu Duc District </Text> 
           <Text style={{fontFamily:"Roboto",fontSize:15,color:"#FFFFFF"}}>Ho Chi Minh City.  </Text> 
           <Text style={{fontFamily:"Roboto",fontSize:15,color:"#FFFFFF"}}>We will update the database</Text>
           <Text style={{fontFamily:"Roboto",fontSize:15,color:"#FFFFFF"}}>for other districts soon.</Text>

           <Text></Text>
        </View>
        </ImageBackground> 
        
      </View>
    </PopupDialog>
   
    )
  }

  showScaleAnimationDialog = () => {
    this.scaleAnimationDialog.show();
  }

  showScaleAnimationDialogMess= () => {
  
    this.scaleAnimationDialogMess.show();
  }

  // getGPS() {
  //   this.setState({
  //     shouldRenderListMarker: false,
  //     getGPS: true,
  //     getATM: false
  //   });
  // }

  showListATM() {
    this.setState({
      shouldRenderListMarker: true,
      getGPS: false,
      getATM: false,
      // markers : [],
      arrayVincenty : getArrMarkerBound(this.state.gps.latitude,this.state.gps.longitude,45,3),
      
    });
  }

  getATM() {
    this.setState({
      shouldRenderListMarker: false,
      getGPS: false,
      getATM: true,
      // markers : [],
      // arrayMarker : [],
      // arrayVincenty : getArrMarkerBound(this.state.gps.latitude,this.state.gps.longitude,45,3),
      // arrayDistrict : [],
    });
  }

  openDrawer() {
    this.refs["DRAWER_REF"].openDrawer();
  }
  
  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal({
      type: 'address||establishment',
      country: 'VN',
      latitude: 10.8702117,
      longitude:  106.8037364,
      radius: 10,
      useOverlay : true
    })
    .then((place) => {
      this.setState({
        getSearchBoxResult:true,
        getATM : false,
        shouldRenderListMarker :false,
        address:place.name,
        gps:{
          latitude:place.latitude,
          longitude:place.longitude
        },
        region: {
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta:0.02108755978843213,
          longitudeDelta: 0.012548379600062276,
        },
        arrayVincenty: getArrMarkerBound(place.latitude,place.longitude,45,3),
        arrayDistrict:[],
        currentMarker: {
          key: "",
          address: "",
          amount: "",
          workingTime: 0,
          latitude:20,
          longitude: 20
        },
        markers:[],
        renderDirection :false
      })
		console.log(place);
		// place represents user's selection from the
		// suggestions and it is a simplified Google Place object.
    })
    .catch(error => console.log(error.message));  // error is a Javascript Error object
  }

  closeDrawer() {
    this.refs["DRAWER_REF"].closeDrawer();
  }

  findAroundMe_MODE(){
    this.closeDrawer()
    this.setState({
      find_MODE:0, //findAroundMe_MODE
      shouldRenderListMarker: true,
      renderDirection: false,
      getAdress:false,
      getATM: false,
      getGPS: false,
      // markers : [],
      // arrayVincenty : [],
      // arrayDistrict : [],
      distanceValue:3
    })
  }

  findNearMe_MODE(){
    this.closeDrawer()
    this.setState({
      find_MODE:1, //find Near_MODE
      shouldRenderListMarker: false,
      renderDirection: false,
      getAdress:false,
      getATM: true,
      getGPS: false,
      // markers : [],
   
      // arrayVincenty : [],
      // arrayDistrict : [],
      distanceValue:3
    })
  }

  addDistance(arrayMarker){
    temp =[];
   for(marker of arrayMarker){
      temp.push({
        key: marker.key,
        address: marker.data.Address,
        amount: marker.data.Amount,
        workingTime: marker.data.WorkingTime,
        latitude: marker.data.lat,
        longitude: marker.data.long,
        distance:geolib.getDistance({
          latitude: marker.data.lat,
          longitude: marker.data.long
        }, {
          latitude: this.state.gps.latitude,
          longitude: this.state.gps.longitude
        })
      })
    }
    return temp;
  }

  getMarkerCloseToCurrentPos(dataState) {
    // Get phần tử đầu tiên và tính khoảng cách đến Pos GPS
    var data = {
      key: "",
      address: "",
      amount: "",
      workingTime: "",
      latitude: 20,
      longitude: 20
    };
    // Get fist Marker in state
    for (marker of dataState.markers) {
      data = {
        key: marker.key,
        address: marker.data.Address,
        amount: marker.data.Amount,
        workingTime: marker.data.WorkingTime,
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
      workingTime: "",
      latitude: 20,
      longitude: 20
    };
  
    for (marker of dataState.markers) {
      temp = {
        key: marker.key,
        address: marker.data.Address,
        amount: marker.data.Amount,
        workingTime: marker.data.WorkingTime,
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
          workingTime: temp.workingTime,
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

  getArrayMarker(dataState,distance=1000){
    var data = {
      key: "",
      address: "",
      amount: "",
      workingTime: "",
      latitude: 20,
      longitude: 20
    }, final =[];
    
    arrMarker = this.addDistance(dataState.markers);

    arrMarker.map(marker=>{
      if(marker.distance<=distance)
      final.push( {
        key: marker.key,
        address: marker.address,
        amount: marker.amount,
        workingTime: marker.workingTime,
        latitude: marker.latitude,
        longitude: marker.longitude
      })

    })


    // dataState.markers.map(marker=>{
    //   final.push( {
    //     key: marker.key,
    //     address: marker.data.Address,
    //     amount: marker.data.Amount,
    //     workingTime: marker.data.WorkingTime,
    //     latitude: marker.data.lat,
    //     longitude: marker.data.long
    //   })

    // })
      //   if(geolib.getDistance(
      //   {
      //     latitude: marker.data.lat,
      //     longitude: marker.data.long
      //   },
      //   {
      //     latitude: dataState.gps.latitude,
      //     longitude: dataState.gps.longitude
      //   }
      // )<=distance)
      // {
        
      //}
    //}
    return final

  }

  getDataWithKey(dataState) {
    arrayMarker=[]
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
        { enableHighAcuracy: true, timeout: 20000 };
      })
     
    })
  
    
    dataState.markers =arrayMarker;
  }

  // Get khoảng cách đường chim bay 
  getDistance(marker){
    var distance= (geolib.getDistance({
      latitude: marker.latitude,
      longitude: marker.longitude
    }, {
      latitude: this.state.gps.latitude,
     longitude: this.state.gps.longitude
    }));
    return distance>90000?0:distance
  }

  async  getGeoArr(dataState) {
    Geocoder.fallbackToGoogle("AIzaSyASXNMgcK0TPsu8RIA5ceulYo_bMJIH6iU");
    var annotations = []
    // var vincenty = getArrMarkerBound(this.state.gps.latitude, this.state.gps.longitude, 45, 5);
    for (var l of dataState.arrayVincenty) {
    var r = await getGeo(l)
    if (r == null) continue; 
    annotations.push(r)
  
    }

    // Kiem tra cac quan hyen trung 
    
    // console.log("annotations - 1")
    // console.log(annotations)
    // annotations = checkDitrictArr(annotations)

    console.log("annotations")
    console.log(annotations)
    dataState.arrayDistrict=annotations 
  }

  async  getGeoArr_First(results) {
    Geocoder.fallbackToGoogle("AIzaSyASXNMgcK0TPsu8RIA5ceulYo_bMJIH6iU");
    var annotations = []
    // var vincenty = getArrMarkerBound(this.state.gps.latitude, this.state.gps.longitude, 45, 5);
    for (var l of arrayVincenty) {
    var r = await getGeo(l)
    if (r == null) continue; 
    annotations.push(r)
  
    }
    console.log("annotations")
    console.log(annotations)

    this.setState({
      region: {
         latitude: results[0].latitude,
         longitude: results[0].longitude,
         latitudeDelta: 0.02108755978843213,
         longitudeDelta: 0.012548379600062276
       },
       gps: {
         latitude:results[0].latitude,
         longitude: results[0].longitude,
       },
       // Tính ra mảng 8  tọa đọ nằm gần 
       arrayVincenty: getArrMarkerBound(results[0].latitude,results[0].longitude,45,3),
        
        arrayDistrict:annotations 
      })
  }
  
  render() {
    console.log("RENDER :"+this.state.arrayDistrict)
    return (
      <View style={{ flex: 1 }}>
        <OfflineBar offlineText="Oops! We cant connect to Internet"/>
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.container01}>
              <MapView
                provider="google"
                style={styles.map}
                // showsUserLocation={true}
                //showsMyLocationButton={true}
                region={this.state.region}
                onRegionChangeComplete={(e)=>console.log(e)}
                customMapStyle={MapStyle}
                showsBuildings={false}
                ref={c => this.mapView = c}
                >
                < Circle center = {
                {
                  latitude: this.state.shouldRenderListMarker===true?this.state.gps.latitude:20,
                  longitude:  this.state.shouldRenderListMarker===true?this.state.gps.longitude:20
                }} 
                radius = {this.state.distanceValue*1000}
                strokeColor="rgba(231, 226, 255, 0.5)"
                fillColor = "rgba(231, 226, 255, 0.5)" / > 
              
                {/* Render marker tại gps */}
                <Marker 
                  coordinate={  {
                  latitude: this.state.gps.latitude,
                  longitude: this.state.gps.longitude
                  }}
                  image={ic_gps}
                />
               
                {/* Mode Show List Atm */}
                {this.renderListMarker()}
                {this.renderDirection()}

                {/* Mode Render a Atm */}
                {this.renderMarkerCloseToPos()}
               </MapView>
                <ActionButton 
                  buttonColor="rgba(231,76,60,1)"
                  renderIcon={active => active ? (<Icon name="healing" style={styles.actionButtonIcon} /> ) 
                  : (<Icon name="healing" style={styles.actionButtonIcon} />)}>
                >
                 <ActionButton.Item buttonColor='#9b59b6' title="Find An Atm Near Me" onPress={() => this.getATM()}>
                 <Image source={ic_findNear}/>
                 </ActionButton.Item>
                 <ActionButton.Item buttonColor='#3498db' title="Find Around Me" onPress={() => this.showListATM()}>
                 <Image source={ic_findAround}/>
                 </ActionButton.Item>
                 <ActionButton.Item buttonColor='#1abc9c' title="Info" onPress={() => this.showScaleAnimationDialog()}>
                 <Image source={ic_info}/>
                 </ActionButton.Item>
                </ActionButton>
            </View>
            {this.renderSlider()}
            </View >
            <View style={styles.searchBox}>
			    	<TouchableOpacity style={styles.inputWrapper}   onPress={()=>this.openSearchModal()}>
					  <Text style={styles.label}>SEARCH LOCATION</Text>
            <Text> </Text>
          	<View style={{flex:1,alignItems:"center",justifyContent:"space-evenly",flexDirection:"row"}}>
						<Icon name="search" size={15} color="#FF5E3A"/>
						<Text
           
            >{this.state.getSearchBoxResult===true?
              this.state.address:"Search"}</Text>
            <Text>  </Text>
					  </View>
            <Text> </Text>
            </TouchableOpacity>
          </View>
          
            {this.renderViewInfo()}
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

    alignItems: "stretch",
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
  dialogContentView: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  inputWrapper:{
    marginLeft:15,
    marginRight:10,
    marginTop:10,
    marginBottom:0,
    backgroundColor:"#DDDDDD",
    opacity:0.7,
    borderRadius:7
  },
  secondInputWrapper:{
    marginLeft:15,
    marginRight:10,
    marginTop:0,
    backgroundColor:"#DDDDDD",
    opacity:0.7,
    borderRadius:7
  } ,
  inputSearch:{
    fontSize:14
  },
  label:{
    fontSize:10,
    fontStyle: "italic",
    marginLeft:10,
    marginTop:10,
    marginBottom:0
  },

});

var customStylesSlider = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: 'white',
    borderColor: '#30a935',
    borderWidth: 1,
  }
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

{/* // Kiem tra marker atm nao ?
// 1 - VietComBank
// 2 - VietTinBank
// 3 - AChauBank
// 4 - DongABank
// 5 - BIDVBank
// 6 - AgriBank */}
function checkDescription(key){
 temp = String(key);
 des = formatVietnamese(temp);
 des=des.slice(0,des.indexOf("Bank")+4);
 switch(des){
   case "VietComBank":
   return 1;
   case "VietTinBank":
   return 2;
   case "AChauBank":
   return 3;
   case "DongABank":
   return 4;
   case "BIDVBank":
   return 5;
   case "AgriBank":
   return 6;
   default: 
   return 0;

 }
}

export default MapRE;

function checkDitrictArr(arr){
  
 
  arr.map(item=>{
    console.log(countNumberDitrict(arr.slice(arr.indexOf(item)+1,arr.length-1),item))
    if(countNumberDitrict(arr.slice(arr.indexOf(item),arr.length-1),item)){
     
      arr.splice(arr.indexOf(item),1);
    }
  })
  return arr;
}

function countNumberDitrict(arr,item){
  
  arr.map(itemarr=>{
    console.log("Item City:"+itemarr.city)
    console.log("Item Dictrict: "+itemarr.district)

    console.log(" City:"+item.city)
    console.log(" Dictrict: "+item.district)
    if(itemarr.city==item.city )
    {
      
      if(itemarr.district==item.district ){
          return true;
      }
    }
    
  })
  return false;
}

const MapStyle = 
[
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
]