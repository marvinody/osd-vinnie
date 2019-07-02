import OpenSeadragon from 'openseadragon';
import React from 'react';
import './App.css';
import './deps/osd-filter';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      red: true,
      green: true,
      blue: true,
    }
  }
  genFilters() {
    this.osd.setFilterOptions({
      filters: {
        processors: (context, callback) => {
          let imgData = context.getImageData(
            0, 0, context.canvas.width, context.canvas.height);
          let pixels = imgData.data;
          let originalPixels = context.getImageData(0, 0, context.canvas.width, context.canvas.height).data;
          let idx = 0;
          for (let i = 0; i < context.canvas.height; i += 1) {
            for (let j = 0; j < context.canvas.width; j += 1) {
              const
                r = originalPixels[idx + 0],
                g = originalPixels[idx + 1],
                b = originalPixels[idx + 2],
                a = originalPixels[idx + 3];
              pixels[idx + 0] = this.state.red ? r : 0
              pixels[idx + 1] = this.state.green ? g : 0
              pixels[idx + 2] = this.state.blue ? b : 0
              pixels[idx + 3] = a

              idx += 4;
            }
          }
          context.putImageData(imgData, 0, 0);
          callback();
        }
      }
    });
  }
  componentDidMount() {
    this.osd = new OpenSeadragon({
      id: 'openseadragon',
      prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
      tileSources: '//openseadragon.github.io/example-images/highsmith/highsmith.dzi',
      crossOriginPolicy: 'Anonymous'
    });
    this.genFilters();
  }
  toggleColor = (c) => {
    this.setState(prev => ({
      [c]: !prev[c]
    }), () => {
      this.genFilters()
    })
  }
  render() {
    return (
      <div className="App">
        <div id="openseadragon"></div>
        <div>
          <span>
            Red:
            <input type='checkbox' checked={this.state.red} onChange={() => this.toggleColor('red')}></input>
            Green:
            <input type='checkbox' checked={this.state.green} onChange={() => this.toggleColor('green')}></input>
            Blue:
            <input type='checkbox' checked={this.state.blue} onChange={() => this.toggleColor('blue')}></input>
          </span>
        </div>
      </div>
    );
  }
}


export default App;
