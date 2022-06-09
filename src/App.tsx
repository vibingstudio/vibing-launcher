import React from 'react'
import launcherImage from './assets/launcher-imagen.png'
import windowBackground from './assets/launcher-ventana.png'
import bitmonLogo from './assets/logo bitmon.png'
import minimizar from './assets/launcher-minimizar.png'
import equis from './assets/launcher-cerrar.png'

import './App.css'
import { DownloadManager } from './components/DownloadManager/DownloadManager'

function App() {
    return (
        <div className="App" >
            <div>
                
                <img
                    className="Bitmon-background"
                    src={windowBackground}
                    alt="main banner"
                ></img>
                <img
                    className="Launcher-image"
                    src={launcherImage}
                    alt='launcher img'
                ></img>
                <img
                    className="Bitmon-logo"
                    src={bitmonLogo}
                    alt='bitmon logo'
                ></img>
                <button 
                    className="x-btn"
                    // onClick={exitGame}
                >
                </button>
                <button 
                    className="min-btn"
                    // onClick={exitGame}
                > 
                </button>
                <h1 className='game-title'>Bitmon Alpha Launcher</h1>
                <DownloadManager></DownloadManager>
            </div>
        </div>
    )
}

export default App
