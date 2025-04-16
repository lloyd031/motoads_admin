import { collection, getDocs, where,query } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect, useState } from "react";
const AdContainer=({setHideAdList,uid,setAd})=>{
  const [campaignList, setCampaignList]=useState([]);
  const [loading, setLoading]=useState(true);
    useEffect(() => {
            const fetchCampaign = async () => {
              try {
                const querySnapshot = await getDocs(query(collection(db, 'ad'),where('userId', '==', uid))); // 'riders' is the collection name in Firestore
                const adList = querySnapshot.docs.map(doc => ({
                  id: doc.id,    // Document ID
                  ...doc.data(), // Document data
                }));
                setCampaignList(adList);  // Set the riders state with the fetched data
              } catch (error) {
                console.error('Error fetching riders:', error);
              } finally {
                setLoading(false);  // Set loading to false once the data is fetched
              }
            };
        
            fetchCampaign();
          }, []);
    
    return (
      <div className='w-full h-full bg-black bg-opacity-50 absolute flex items-center justify-center'>
          <div className=' w-[400px] p-4 bg-white rounded-[10px]'>
              <div className='flex justify-between items-center'>
                <h1 className='text-xl'>Create campaign</h1>
                <svg onClick={setHideAdList} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              {(loading==true)? (
                <h1>Loading...</h1>
               ):((campaignList.length > 0)  ? (
                <ul>
                  {campaignList.map((ad) => (
                    <div  className="" onClick={()=>{setAd(ad,ad.riderId)}}> {ad.name} </div>
                  ))}
                </ul>
              ) : (
                <p>No ads available.</p>
              ))
               }

              
          </div>
    </div>
     );
}

export default AdContainer