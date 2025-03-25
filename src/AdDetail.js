import React, { Component } from 'react';
import './AdDetail.css'; // Ensure you have the appropriate CSS file for styling
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'; // Import necessary Firestore functions
import { app } from './firebase';
class AdDetail extends Component {
    constructor(props){
        super(props);
        this.state={
          riders:[],
        }
      }
      async getRider(){
        var riderList=[];
        const db=getFirestore(app);
        const riderCol=collection(db,'rider');
        const riderSnapShot=await getDocs(riderCol);
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
    const { ad, onClose } = this.props; // Destructure the props
    const { riders } = this.state;
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <h4>{ad.name}</h4>
          {riders.map(rider => (
              <h5>{rider.fn} {rider.ln} </h5>
          ))}
          {/* You can add more fields here */}
        </div>
      </div>
    );
  }
}

export default AdDetail;
