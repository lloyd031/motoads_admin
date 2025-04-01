import { useState } from "react";
import { toast } from 'react-toastify';
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
const CampaignForm=({hideShowForm, uid})=>{
  const [name,setName]=useState("");
  const [start,setStart]=useState("");
  const [end,setEnd]=useState("");
  const [loading,setLoading]=useState(false);
  const today = new Date();
  const min = today.toISOString().split('T')[0];
  const twoDaysFromNow = new Date(today);
  twoDaysFromNow.setDate(today.getDate() + 2);
  const minDate = twoDaysFromNow.toISOString().split('T')[0];

  const handleSubmit=async ()=>{
      if(loading==false){
        setLoading(true);
        try{
            
          await addDoc(collection(db,"ad"),{
          name:name,
          start:start,
          end:end,
          userId:uid
           });
          toast.success("Success!",{position:"top-center"})
          hideShowForm();
         }catch(err){
             toast.error("Invalid details",{position:"top-center"})
         }
      }
    }
    return (
      <div className='w-full h-full bg-black bg-opacity-50 absolute flex items-center justify-center'>
          <div className=' w-[400px] p-4 bg-white rounded-[10px]'>
              <div className='flex justify-between items-center'>
                <h1 className='text-xl'>Create campaign</h1>
                <svg onClick={hideShowForm} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          { <p className="text-red-500 text-sm mb-4"></p>}
          <div className="mb-4">
            <label htmlFor="fname" className="block text-sm font-medium text-gray-700">Campaign name</label>
            <input
              type="text"
              id="fname"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              placeholder="Enter your campaign name"
              value={name}
              onChange={(e) => {setName(e.target.value)}}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lname" className="block text-sm font-medium text-gray-700">Duration-start</label>
            <input
              type="date"
              id="lname"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              placeholder="Enter your last name"
              value={start}
              min={min}
              onChange={(e) =>{setStart(e.target.value)}}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Duration-end</label>
            <input
              type="date"
              id="email"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              value={end}
              min={minDate}
              onChange={(e) => {setEnd(e.target.value)}}
              required
            />
          </div>
          
          
          <button
            type="submit"
            className="w-full py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            {(loading==false)? 'Done':'Loading...'}
          </button>
        </form>
          </div>
        </div>
     );
}

export default CampaignForm