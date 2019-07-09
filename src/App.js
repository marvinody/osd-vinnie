import memoize from 'fast-memoize';
import OpenSeadragon from 'openseadragon';
import React from 'react';
import './App.css';
import './deps/osd-filter';

const memoizedExp = memoize(Math.exp)

const sigFigExp = (n) => {
  return memoizedExp(n.toFixed(2))
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      b_hema_red: 0.5,
      b_hema_green: 0.5,
      b_hema_blue: 0.5,
      b_eosin_red: 0.5,
      b_eosin_green: 0.5,
      b_eosin_blue: 0.5,
      k: 2.5,
      imageLink: 'http://openseadragon.github.io/example-images/highsmith/highsmith.dzi',
    }
    // this is needed so we can clear the osd div each load
    // otherwise osd just makes a new layout for each button click
    this.osdRef = React.createRef();
  }
  loadOSD = () => {
    // remove all children in the osd div before making new one
    const osd = this.osdRef.current
    while (osd.firstChild) {
      osd.removeChild(osd.firstChild)
    }

    this.osd = new OpenSeadragon({
      id: 'openseadragon',
      prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
      tileSources: this.state.imageLink,
      crossOriginPolicy: 'Anonymous'
    });
    this.genFilters();
  }
  genFilters() {
    const { b_hema_red, b_hema_green, b_hema_blue } = this.state;
    const { b_eosin_red, b_eosin_green, b_eosin_blue } = this.state;
    const { k } = this.state;
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
                I_dna = originalPixels[idx + 0] / 255,
                I_eosin = originalPixels[idx + 1] / 255;
              const
                r_factor = (b_hema_red * I_dna + b_eosin_red * I_eosin),
                g_factor = (b_hema_green * I_dna + b_eosin_green * I_eosin),
                b_factor = (b_hema_blue * I_dna + b_eosin_blue * I_eosin);

              const
                r = sigFigExp(-k * r_factor) * 255,
                g = sigFigExp(-k * g_factor) * 255,
                b = sigFigExp(-k * b_factor) * 255;
              pixels[idx + 0] = r
              pixels[idx + 1] = g
              pixels[idx + 2] = b
              pixels[idx + 3] = originalPixels[idx + 3]

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
    this.loadOSD()
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
    this.genFilters();
  }
  render() {
    return (
      <div className="App">
        <div className='link-container'>
          <input type='text' name='imageLink' onChange={this.handleChange} value={this.state.imageLink}></input>
          <button onClick={this.loadOSD}>Reload</button>
        </div>
        <div className='osd-container'>

          <div id="openseadragon" ref={this.osdRef}></div>
          <div>
            <div className="sliders">
              <div className="hema">
                <span>Hema:</span>
                {this.makeInput("b_hema_red", "red")}
                {this.makeInput("b_hema_green", "green")}
                {this.makeInput("b_hema_blue", "blue")}
              </div>
              <div className="eosin">
                <span>Eosin:</span>
                {this.makeInput("b_eosin_red", "red")}
                {this.makeInput("b_eosin_green", "green")}
                {this.makeInput("b_eosin_blue", "blue")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  makeInput(name, label) {
    return (
      <span>
        <label htmlFor={name}>{label}:</label>
        <input type="range" min="0" max="1" name={name} value={this.state[name]} onChange={this.handleChange} step="0.01" />
      </span>
    )
  }
}


export default App;
