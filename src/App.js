import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'; // Import necessary Firestore functions
import { app } from './firebase';
import AdDetail from './AdDetail';

class App extends Component {
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
  render(){
    const { ads, selectedAd } = this.state;
    return (
      <div className="App">
        <div className="ads-list">
          {ads.map(ad => (
            <div key={ad.id} className="ad-item" onClick={() => this.handleAdClick(ad)}>
              <h3>{ad.name}</h3>
              <p>{ad.description}</p> {/* Preview description or other info */}
            </div>
          ))}
        </div>

        {selectedAd && (
          <AdDetail ad={selectedAd} onClose={this.handleClose} />
        )}
      </div>
    );
  }
}

export default App;
