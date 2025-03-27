import React, { Component } from 'react';
import './AdDetail.css'; // Ensure you have the appropriate CSS file for styling
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore/lite'; // Import necessary Firestore functions
import { app } from './firebase';
import { Link } from 'react-router-dom';


class AdDetail extends Component {
    constructor(props){
        super(props);
        this.state={
          riders:[],
          selectedRider:null,
        }
      }
      
      async getRider(){
        const { ad } = this.props;
        var riderList=[];
        const db=getFirestore(app);
        const riderCol=collection(db,'rider');
        const riderQuery = query(riderCol, where('ads', 'array-contains', ad.id));
        const riderSnapShot=await getDocs(riderQuery);
        riderSnapShot.forEach(doc => {
          let rider=doc.data();
          rider.id=doc.id;
          riderList.push(rider);
        });
        this.setState(
          {
            riders:riderList
          }
        );
    
      }
      componentDidMount(){
        this.getRider();
      }
      
  render() {
    const { ad, onClose, } = this.props; // Destructure the props
    const { riders} = this.state;
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <h3 className='text-xl'>{ad.name}</h3>
          {riders.map(rider => (
              <Link to='/maps'
                state={{ rider:rider , ad:ad }} ><h5>{rider.fn} {rider.ln}</h5></Link>
              
          ))}
          {/* You can add more fields here */}
        </div>
      </div>
    );
  }
}

export default AdDetail;
