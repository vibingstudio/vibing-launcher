import React from 'react'
import backgroundImage from './assets/banner.png'

import './App.css'
import { DownloadManager } from './components/DownloadManager/DownloadManager'

function App() {
    return (
        <div className="App">
            <div>
                <img
                    className="Bitmon-background"
                    src={backgroundImage}
                    alt="main banner"
                ></img>
                <h1>Bitmon Alpha Launcher</h1>
                <DownloadManager></DownloadManager>
            </div>
            {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
        </div>
    )
}

export default App
