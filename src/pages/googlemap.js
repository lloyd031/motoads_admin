import React, { Component } from 'react';
import '../App.css';
import { GoogleMap, LoadScript, Marker, Polyline} from '@react-google-maps/api';
import { getFirestore, collection,getDocs, query, where, orderBy} from 'firebase/firestore/lite';
import { app } from '../firebase';
import { useLocation } from 'react-router-dom';
const MapWrapper = (props) => {
    const location = useLocation();
    //const rider = {fn:'Juan Dela Cruz'};
    const rider = location.state?.rider;
    const ad = location.state?.ad;
  
    return <Map {...props} rider={rider} ad={ad} />;
  }
class Map extends Component {
    constructor(props){
        super(props);
        this.state={
          paths:[],
          center:{
            lat: 9.3068, // Latitude for the map center (San Francisco in this example)
            lng: 123.3054, // Longitude for the map center
          }
        }
      }
async getPath(){
    const { rider,ad } = this.props;
    if(rider!=null && ad!=null){
        var pathList=[];
    const db=getFirestore(app);
    const rideCol=collection(db,'rider',rider.id,'assigned_ads',ad.id,'rides');
    const rideQuery = query(rideCol, where('created_at', '==', '3-25-2025'), orderBy('timestamp','asc'));
    const adSnapShot=await getDocs(rideQuery);
    if(!adSnapShot.empty){
        adSnapShot.forEach(doc => {
            let path=doc.data();
            path.id=doc.id;
            let latlng = { lat: path.lat, lng: path.long };
            //alert("lat "+latlng.lat + " long "+latlng.lng);
            pathList.push(latlng);
            
          });
          this.setState(
            {
              paths:pathList,
              center:{lat:pathList[pathList.length-1].lat, lng:pathList[pathList.length-1].lng }
            }
          );
    }
    
    
    }
    
  }
componentDidMount(){
    this.getPath();
}
  render() {
    const {paths, center} = this.state;
    const { rider,ad } = this.props;
    // Replace with your own Google Maps API key
    const googleMapsApiKey = 'AIzaSyA9VaCuSLwB_-V0gfXv1zBtX5jqdzzv2rc';

    // Set the initial center and zoom level of the map
    const mapContainerStyle = {
      width: '100%',
      height: '100%',
    };

   

    const zoom = 16;
    const tilt = 45;

    return (
        /*
          <div>
           {ad ? (
            <div>
                <h2>{ad.name}</h2>
            </div>
            ) : (
            <p>No ads information available</p>
            )}
            {rider ? (
            <div>
                <h3> {rider.fn} {rider.ln}</h3>
            </div>
            ) : (
            <p>No rider information available</p>
            )}
        </div>
        */
        <div class="map-container">
           
            <LoadScript googleMapsApiKey={googleMapsApiKey} defer>
        <GoogleMap
          
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          tilt={tilt}
        >
          <Marker position={center} />
          <Polyline
            path={paths} // Path to draw the polyline
            options={{
              strokeColor: '#e3e0e0', // Red color for the polyline
              strokeOpacity: 1.0, // Full opacity
              strokeWeight: 6, // Line thickness
            }}
          />
        </GoogleMap>
      </LoadScript>
        </div>
    );
  }
}

export default MapWrapper;
