import React, { Component ,useEffect,useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline} from '@react-google-maps/api';
import { getFirestore, collection,getDocs, query, where, orderBy} from 'firebase/firestore/lite';
import { app, auth , db} from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
const MapWrapper = (props) => {
    const location = useLocation();
    //const rider = {fn:'Juan Dela Cruz'};
    const rider = location.state?.rider;
    const ad = location.state?.ad;
    const [userDetails, setUserDetails]=useState(null);
    const [userId,setUserId]=useState(null);
    const fetchUserData=async()=>{
      auth.onAuthStateChanged(async(user)=>{
       if(user){
        const docRef=doc(db,"user",user.uid);
        const docSnap=await getDoc(docRef);
        if(docSnap.exists){
          setUserDetails(docSnap.data())
          setUserId(user.uid)
        }
       }
      })
    };
    useEffect(()=>{
      fetchUserData();
    },[]);
    return <Map {...props} rider={rider} ad={ad} userDetails={userDetails} userId={userId} />;
  }
class Map extends Component {
    constructor(props){
        super(props);
        this.state={
          paths:[],
          center:{
            lat: 9.3068, // Latitude for the map center (San Francisco in this example)
            lng: 123.3054, // Longitude for the map center
          },
          currentDate:'',
          date:'',
          dates:[]
        }
      }
async getPath(){
  const { rider,ad } = this.props;
  const { date} = this.state;
    if(rider!=null && ad!=null){
        var pathList=[];
        
    const db=getFirestore(app);
    const rideCol=collection(db,'rider',rider.id,'assigned_ads',ad.id,'rides');
    const rideQuery = query(rideCol, where('created_at', '==', date), orderBy('timestamp','asc'));
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
  async getDate(){
    const { rider,ad } = this.props;
    if(rider!=null && ad!=null){
    const db=getFirestore(app);
    var dateList=[];
    const rideCol=collection(db,'rider',rider.id,'assigned_ads',ad.id,'rides');
    const dateSnapShot=await getDocs(rideCol);
      if(!dateSnapShot.empty){
        dateSnapShot.forEach(doc => {
            let path=doc.data();
            path.id=doc.id;
            if(!dateList.includes(path.created_at)){
              dateList.push(path.created_at);
            }
            
            
          });
          this.setState(
            {
              dates:dateList,
             
            }
          );
    }
      }
  }
  selectDate = (selectedDate) => {
    this.setState({ date: selectedDate },()=>{
      this.getPath();
    });
  };
componentDidMount(){
  
    this.getPath();
    this.getDate();
    const date=new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    const year = date.getFullYear(); 

    // Format it to MM-DD-YYYY
    const formattedDate = `${month}-${day}-${year}`;
    this.setState({
      currentDate:formattedDate,
      date:formattedDate
    })
}

  render() {
    const {paths, center,date, currentDate,dates} = this.state;
    const { rider,ad , userDetails,userId} = this.props;
    // Replace with your own Google Maps API key
    const googleMapsApiKey = 'AIzaSyA9VaCuSLwB_-V0gfXv1zBtX5jqdzzv2rc';

    // Set the initial center and zoom level of the map
    const mapContainerStyle = {
      width: '100%',
      height: '100%',
    };
    
   

    const mapOptions = {
      zoom: 16, // Set the map type to 'satellite' to allow tilt
    };

    return (
        /*
          
        */
        <div class="w-full h-screen relative">
           
           <div class="w-full h-screen absolute inset-0">
              <LoadScript googleMapsApiKey={googleMapsApiKey} defer>
            <GoogleMap
              
              mapContainerStyle={mapContainerStyle}
              center={center}
              options={mapOptions}
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
              <div className='p-4 pl-2'>
              <div className='absolute p-2 bg-white pr-4 rounded-[2px]  shadow-lg'>
              {ad && rider  && userDetails ?(
                <div className='grid grid-col-1 gap-2'>
                    <h2 className='text-xl font-bold'>{ad.name}</h2>
                    <div className='inline-flex gap-2 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                    </svg>


                    <h3 className='text-2xl font-bold text-green-600'> {(paths.length==0)?0:(paths.length-1)*50/1000}Km</h3>
                    </div>
                    <div className='inline-flex gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>

                    <h2>{(currentDate==date)?"Today":date}</h2>
                    </div>
                    <div className='inline-flex gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                     
                    <h3> {rider.fn} {rider.ln}</h3>
                    </div>
                    <div className='inline-flex gap-6 items-center ' >
                        <h2 className='font-bold'>Rides History</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>


                    </div>
                    
                    <div className='grid grid-col-1 justify-items-start'>
                    {dates.map(date=>(  
                      <button className='' onClick={()=>{this.selectDate(date)}}>{date}</button>
                    ))}
                    </div>
                    <h2>{userId}</h2>
                    </div>
                ) : (
                <p>No ads information available</p>
                )}
                
            </div>
              </div>
        </div>
    );
  }
}

export default MapWrapper;
