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
                <h1 className='game-title'>Bitmon Alpha Launcher</h1>
                <DownloadManager></DownloadManager>
            </div>
        </div>
    )
}

export default App
