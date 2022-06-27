import React from 'react'
import launcherImage from './assets/launcher-imagen.png'
import windowBackground from './assets/launcher-ventana.png'
import bitmonLogo from './assets/logo bitmon.png'

import './App.css'
import { DownloadManager } from './components/DownloadManager/DownloadManager'
const ipcRenderer = window.require('electron').ipcRenderer;

function App() {

    const handleCloseButton = () => {
        ipcRenderer.send('close')
    }
    
    const handleMinButton = () => {
        ipcRenderer.send('minimize')
    }

    return (
        <div className="App" >
            <div>
                <img
                    draggable="false"
                    className="Bitmon-background"
                    src={windowBackground}
                    alt="main banner"
                ></img>
                <img
                    draggable="false"
                    className="Launcher-image"
                    src={launcherImage}
                    alt='launcher img'
                ></img>
                <img
                    draggable="false"
                    className="Bitmon-logo"
                    src={bitmonLogo}
                    alt='bitmon logo'
                ></img>
                <div className="Draggable-Frame-Area" />
                <button
                    id='close-btn'
                    className="x-btn"
                    onClick={handleCloseButton}
                >
                </button>
                <button
                    id='min-btn'
                    className="min-btn"
                    onClick={handleMinButton}
                > 
                </button>
                <DownloadManager></DownloadManager>
            </div>
        </div>
    )
}

export default App
