

import { Component,useEffect,useState } from 'react';
import { getFirestore, collection, getDocs,query,where } from 'firebase/firestore/lite'; // Import necessary Firestore functions
import { app } from '../firebase';
import AdDetail from '../AdDetail';
import { auth} from '../firebase';



class Home extends Component {
  constructor(props){
    super(props);
    this.state={
      ads:[],
      selectedAd: null,
    }
  }

  async getAds(){
    var adsList=[];
    const db=getFirestore(app);
    const adsCol=collection(db,'ad');
    //const adsQuery = query(adsCol, where('acc_id', '==', 'tk4RLbkFJVTeN15mCJoEG4oJ5ck2'));
    const adSnapShot=await getDocs(adsCol);
    adSnapShot.forEach(doc => {
      let ad=doc.data();
      ad.id=doc.id;
      adsList.push(ad);
    });
    this.setState(
      {
        ads:adsList
      }
    );

  }
  componentDidMount(){
    this.getAds();
  }
  handleAdClick = (ad) => {
    this.setState({ selectedAd: ad }); // Set the selected ad to open the modal
  };

  handleClose = () => {
    this.setState({ selectedAd: null }); // Close the modal
  };
  async handleLogOut(){
    try{
      await auth.signOut();
      window.location.href="/";
    }catch(err){
  
    }
  }
  render(){
    const { ads, selectedAd } = this.state;
    
    return (
      <div className="App">
        <div className='inline-flex ' >
        <div className="ads-list grid grid-cols-1 inline-block">
          {ads.map(ad => (
            <div key={ad.id} className="ad-item p-2 rounded-10 bg-white shadow-lg gap-2 text-center" onClick={() => this.handleAdClick(ad)}>
              <h3 className="text-2xl">{ad.name}</h3>
              <p>{ad.description}</p> {/* Preview description or other info */}
            </div>
          ))}
          
        </div>
        </div>

        {selectedAd && (
          <AdDetail ad={selectedAd} onClose={this.handleClose} />
        )}
      </div>
    );
  }
}

export default Home;
