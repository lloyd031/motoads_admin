
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
const RiderList=({setRiderId})=>{
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRider, setSelectedRider] = useState("");
    useEffect(() => {
        const fetchRiders = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, 'rider')); // 'riders' is the collection name in Firestore
            const ridersList = querySnapshot.docs.map(doc => ({
              id: doc.id,    // Document ID
              ...doc.data(), // Document data
            }));
            setRiders(ridersList);  // Set the riders state with the fetched data
          } catch (error) {
            console.error('Error fetching riders:', error);
          } finally {
            setLoading(false);  // Set loading to false once the data is fetched
          }
        };
    
        fetchRiders();
      }, []);
    if (loading) {
    return <div>Loading...</div>;  // Show loading text while data is being fetched
    }
   return (
    <div >
      {riders.length > 0 ? (
        <ul>
          {riders.map((rider) => (
            <div onClick={()=>{setRiderId(rider.id); setSelectedRider(rider.id)}} className={`p-1 pl-4 pr-4 rounded-[15px] float-left mr-1 mb-2 ${
                (selectedRider==rider.id) ? "bg-red-500 text-white" : "bg-white"
              }  hover:bg-red-500 hover:text-white`}> <li >{rider.fn} {rider.ln}</li> </div>
          ))}
        </ul>
      ) : (
        <p>No riders available.</p>
      )}
    </div>
  );
}

export default RiderList