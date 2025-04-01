import React, { useState, useEffect} from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { auth,db } from '../firebase';
import { Component } from 'react';
import { doc, getDoc,setDoc } from 'firebase/firestore';
import CampaignForm from './components/campaignForm';

const MapWrapper = (props) => {
  const [userObj, setUserObj] = useState({
    id:'',
    email:'',
    fn:'',
    ln:''
  });

  const fetchUserData = async () => {
      const user = auth.currentUser; // Directly get the current logged-in user
      if (user) {
          const docRef = doc(db, 'user', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
              const userData = docSnap.data();
              
              setUserObj({
                id:user.uid,
                email:user.email,
                fn:userData.fn,
                ln:userData.ln
              });  // Assuming you want to store 'fn' (first name) as userId
              
            }
      }
  };
  
  useEffect(() => {
      fetchUserData();
  }, []);  // Runs only on component mount

  return <Map {...props} userObj={userObj} />;
};
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: 9.3068,
        lng: 123.3054,
        paths: [],
        showForm:false,
        ad:null
      },
    };
  }
  setShowForm(){
    this.setState({
      showForm:true
    });
  }
  hideForm=()=>{
    this.setState({
      showForm:false
    });
  }
  // Listen to auth state changes
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      this.setState({ user });
    });
  }

  // Set the center and paths from state
  render() {
    const { center,paths , showForm,ad} = this.state;
    const { userObj, } = this.props;

    // Replace with your own Google Maps API key
    const googleMapsApiKey = 'AIzaSyA9VaCuSLwB_-V0gfXv1zBtX5jqdzzv2rc';

    const mapContainerStyle = {
      width: '100%',
      height: '100%',
    };

    const mapOptions = {
      zoom: 16, // Set the map type to 'satellite' to allow tilt
    };

    return (
      <div className='flex flex-col h-screen'>
        <div className="w-full grow relative">
          <div className="w-full h-full absolute inset-0">
            <LoadScript googleMapsApiKey={googleMapsApiKey} defer>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                options={mapOptions}
              >
                <Marker position={center} />
                
              </GoogleMap>
            </LoadScript>
          </div>
        </div>

        <div className='absolute p-4 pl-2 flex w-full justify-between items-start'>
          <div className='p-2 bg-white pr-4 rounded-[2px] shadow-lg'>
            <div className='grid grid-col-1 gap-2'>
              <h2 className='text-xl font-bold'>{(ad==null)?"...":ad.name}</h2>
              <div className='inline-flex gap-2 items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                </svg>
                <h3 className='text-2xl font-bold text-green-600'>
                  {(paths==null || paths.length==0)?0:((paths.length-1)*100) * 50 / 1000} Km
                  
                </h3>
              </div>
              <div className='inline-flex gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <h2>{}</h2>
              </div>
              <div className='inline-flex gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <h3>Rider Name</h3>
              </div>
              <div className='inline-flex gap-6 items-center'>
                <h2 className='font-bold'>Rides History</h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>

          <div className='flex gap-4'>
            <button className='p-1 pl-4 pr-4 rounded-[20px] bg-white shadow-lg' onClick={()=>{this.setShowForm()}}>Start campaign +</button>
            <button className='p-1 pl-4 pr-4 rounded-[20px] bg-white shadow-lg'>View campaign/s</button>
          </div>
        </div>

        {showForm==true && (<CampaignForm hideShowForm={this.hideForm} uid={userObj.id} />)}
      </div>
    );
  }
}

export default MapWrapper;
//(paths.length === 0) ? 0 : (paths.length - 1)
/*
<Polyline
                  path={paths} // Path to draw the polyline
                  options={{
                    strokeColor: '#e3e0e0', // Polyline color
                    strokeOpacity: 1.0, // Full opacity
                    strokeWeight: 6, // Line thickness
                  }}
                />
*/