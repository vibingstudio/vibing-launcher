import { FC, useEffect, useState } from 'react'
import {
    getDownloadLink,
    getGameInstallPath,
    isGameInstalled,
    writeFileVersion,
    getInstalledVersion,
} from '../../utils/gamePathUtils'
import { compare } from 'compare-versions'
import './DownloadManager.css'
import Spinner from 'react-bootstrap/Spinner';
import carga1 from '../../assets/launcher-carga1.png'
import carga2 from '../../assets/launcher-carga2.png'
import carga3 from '../../assets/launcher-carga3.png'
import { ProgressBar } from 'react-bootstrap';

interface DownloadManagerProps {}

const AdmZip = window.require('adm-zip')
const os = window.require('os')
const request = window.require('request')
const exec = window.require('child_process').exec
const ipcRenderer = window.require('electron').ipcRenderer;
const ipcMain = window.require('electron').ipcMain;
var execWin = window.require('child_process').execFile;

export const DownloadManager: FC<DownloadManagerProps> = () => {
    const [gamePath, setGamePath] = useState('')
    const [gameDir, setGameDir] = useState('')
    const [isInstalled, setIsInstalled] = useState(false)
    const [needsUpdate, setNeedsUpdate] = useState(false)
    const [currentPlatform, setCurrentPlatform] = useState('unknown')
    const [buttonEnabled, setButtonEnabled] = useState(false)
    const [downloadUrl, setDownloadUrl] = useState('')
    const [isDownloading, setIsDownloading] = useState(false)
    const [latestVersion, setLatestVersion] = useState('v0.0.0')
    const [installedVersion, setInstalledVersion] = useState('v0.0.0')
    const progressBar = document.getElementById('bar');
    var result:any;
   
    useEffect(() => {
        setCurrentPlatform(os.platform())
        setIsInstalled(isGameInstalled())
        setGameDir(getGameInstallPath(currentPlatform, false))
        setGamePath(getGameInstallPath(currentPlatform, true))
        setDownloadUrl(getDownloadLink())
        setButtonEnabled(true)
        setInstalledVersion(getInstalledVersion(currentPlatform))
        getLatestVersion()

        if (latestVersion && installedVersion) {
            if (installedVersion === 'v0.0.0') {
                setNeedsUpdate(false)
            } else {
                if (compare(latestVersion, installedVersion, '>')) {
                    setNeedsUpdate(true)
                } else {
                    setNeedsUpdate(false)
                }
            }
        }
    }, [
        isInstalled,
        currentPlatform,
        needsUpdate,
        installedVersion,
        latestVersion,
    ])


    const getLatestVersion = () => {
        const options = {
            url: 'https://api.github.com/repos/bitmon-world/bitmon-releases/releases',
            headers: {
                'User-Agent': 'Vibing Studios Launcher',
            },
        }

        request.get(options, (err: any, res: any, body: any) => {
            let releases = JSON.parse(body)
            if (releases[0]) {
                setLatestVersion(releases[0]['tag_name'])
            }
        })
    }
    // useEffect(()=>{
    //     // progressBar!.style.width = "20%";
    //     console.log(progressBar!.style.width);
        
    // },[progressBar!.style])

    const downloadGame = () => {
        setIsDownloading(true)
        setButtonEnabled(false)
        
        ipcRenderer.send("download", {
            url: downloadUrl,
            properties: { directory: gameDir }
        });

        // result =  ipcRenderer.invoke('progress',{
        //     url: downloadUrl,
        //     properties: { directory: gameDir }
        // })

        result = ipcRenderer.on('progress', function(event: any, response: any){
            // result = response
            console.log("resp: ",response);
        })
        
        //extract zip until done downloading
            var zipPath = gameDir + '\\' + getDownloadLink().substring(73,getDownloadLink().length);
            console.log(zipPath);
            var zip = new AdmZip(zipPath)
            zip.extractAllTo(gameDir, true)
            writeFileVersion(os.platform(), latestVersion)
            setInstalledVersion(latestVersion)
            setIsDownloading(false)
            setIsInstalled(true)
            setButtonEnabled(true)
            setNeedsUpdate(false)
    }

    const runGame = async () => {
        // file permissions on mac only
        console.log("current platform", currentPlatform)
        if (currentPlatform === 'darwin') {
            await exec("chmod -R 755 " + gamePath)
            await exec("open " + gamePath)
        } else if (currentPlatform === 'win32'){
            await execWin(gamePath, function (err: any, data: any) {
                console.log('err: ', err)
                console.log('data: ', data.toString())
            })
        }
    }

    return (
        <div className="DownloadManager">
            <div>
                {isInstalled && !needsUpdate && (
                    <button
                        className="main-btn"
                        disabled={!buttonEnabled}
                        onClick={runGame}
                    >
                        START
                    </button>
                )}
                {(!isInstalled || needsUpdate) && !isDownloading && (
                    <button
                        className={needsUpdate ? "main-btn" : "download-btn"}
                        disabled={!buttonEnabled}
                        onClick={downloadGame}
                    >
                        {needsUpdate ? "UPDATE" : "DOWNLOAD"}
                    </button>
                )}

                {(!isInstalled || needsUpdate) && isDownloading && (
                        <div>
                            <div id="bar-container2"></div>
                            <div id="bar-container1"></div>
                            <div id="container-invisible">
                                <div id="bar"></div>
                            </div>          
                            <div className='percentage Vibing-text'>99%</div>           
                        </div>
                )}

                <div className='bottom-info right Vibing-text'>
                    <div>Latest Version: {latestVersion}</div>
                    {isInstalled && (
                        <div style={{fontSize: 'small'}}>Installed Version: {installedVersion}</div>
                    )}
                </div>

                <div className='bottom-info left launcher-text'>
                    <div>ALPHA LAUNCHER</div>
                </div>
                
            </div>
        </div>
    )
}
