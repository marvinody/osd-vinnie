import OpenSeadragon from 'openseadragon';
import React from 'react';
import './App.css';


class App extends React.Component {

  componentDidMount() {
    this.osd = new OpenSeadragon({
      id: 'openseadragon',
      prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
      tileSources: '//openseadragon.github.io/example-images/highsmith/highsmith.dzi',
      crossOriginPolicy: 'Anonymous'
    });

  }
  render() {
    return (
      <div className="App">
        <div id="openseadragon"></div>
      </div>
    );
  }
}


export default App;
