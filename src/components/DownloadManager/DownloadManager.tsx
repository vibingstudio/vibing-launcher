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
import { platform } from 'os';

interface DownloadManagerProps {}

const AdmZip = window.require('adm-zip')
const os = window.require('os')
const request = window.require('request')
const exec = window.require('child_process').exec
var execWin = window.require('child_process').execFile;
//const Loader = window.require('halogen/PulseLoader');

export const DownloadManager: FC<DownloadManagerProps> = () => {
    const [gamePath, setGamePath] = useState('')
    const [gameDir, setGameDir] = useState('')
    const [isInstalled, setIsInstalled] = useState(false)
    const [needsUpdate, setNeedsUpdate] = useState(false)
    const [currentPlatform, setCurrentPlatform] = useState('unknown')
    const [buttonEnabled, setButtonEnabled] = useState(false)
    // const [isGameDownloaded, setIsGameDownloaded] = useState(false)
    const [downloadUrl, setDownloadUrl] = useState('')
    const [isDownloading, setIsDownloading] = useState(false)
    const [latestVersion, setLatestVersion] = useState('v0.0.0')
    const [installedVersion, setInstalledVersion] = useState('v0.0.0')

    useEffect(() => {
        // console.log('setting all initial values')
        setCurrentPlatform(os.platform())

        setIsInstalled(isGameInstalled())

        setGameDir(getGameInstallPath(currentPlatform, false))
        setGamePath(getGameInstallPath(currentPlatform, true))
        setDownloadUrl(getDownloadLink())
        setButtonEnabled(true)
        getLatestVersion()
        setInstalledVersion(getInstalledVersion(currentPlatform))

        if (latestVersion && installedVersion) {
            if (compare(latestVersion, installedVersion, '>')) {
                // console.log(
                //     latestVersion,
                //     ' > ',
                //     installedVersion,
                //     ': new update is available'
                // )
                setNeedsUpdate(true)
            } else {
                // console.log(
                //     latestVersion,
                //     ' = ',
                //     installedVersion,
                //     ': latest version is installed'
                // )
                setNeedsUpdate(false)
            }
        }

        // console.log('latest version main: ', latestVersion)
        //setLatestVersion(getLatestVersion())
    }, [
        isInstalled,
        currentPlatform,
        needsUpdate,
        installedVersion,
        latestVersion,
    ])

    const getLatestVersion = () => {
        // console.log('getLatestVersion()')
        const options = {
            url: 'https://api.github.com/repos/bitmon-world/bitmon-releases/releases',
            headers: {
                'User-Agent': 'Vibing Studios Launcher',
            },
        }

        // console.log('gettingVersions() =>')
        try {
            request.get(options, (err: any, res: any, body: any) => {
                let releases = JSON.parse(body)
                console.log('releases', releases)
                // for (let release of releases) {
                //     //console.log('release version: ', release['tag_name'])
                // }
                if (releases[0]) {
                    console.log('latestVersion?  ', releases[0]['tag_name'])
                    //setLatestVersion(releases[0]['tag_name'])
                    //console.log('returning REAL version value')
                    setLatestVersion(releases[0]['tag_name'])
                }
                //console.log('latest version: ', latestVersion)
            })
        } catch (error) {
            // console.log('error: ', error)
        }
    }

    const downloadGame = () => {
        setIsDownloading(true)
        setButtonEnabled(false)
        // console.log('isDownloadingTest', isDownloading)

        setTimeout(() => {
            // console.log('test')
        }, 1000)
        // console.log('isDownloadingTest', isDownloading)

        request.get(
            { url: downloadUrl, encoding: null },
            (err: any, res: any, body: any) => {
                // console.log('body: ', body)
                var zip = new AdmZip(body)
                // console.log('extracting into : ', gameDir)
                zip.extractAllTo(gameDir, true)
                writeFileVersion(os.platform(), latestVersion)
                setInstalledVersion(latestVersion)

                setIsDownloading(false)
                setIsInstalled(true)
                setButtonEnabled(true)
                setNeedsUpdate(false)
            }
        )
    }

    const runGame = async () => {
        // console.log('running game!')

        // file permissions on mac only
        console.log("current platform", currentPlatform)
        if (currentPlatform === 'darwin') {
            await exec("chmod -R 755 " + gamePath, function (err: any, data: any) {
                // console.log('755 err: ', err)
                // console.log('755 data: ', data.toString())
            })

            // command to open the Bitmon app
            await exec("open " + gamePath, function (err: any, data: any) {
                // console.log('err: ', err)
                // console.log('data: ', data.toString())
            })
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
                    <button
                        className="main-btn disabled-btn"
                        disabled={true}
                        onClick={downloadGame}
                    >
                        {/* <div>
                            <div>{isDownloading && <PulseLoader loading={isDownloading} color="#26A65B" size="16px"  />}</div>
                        </div> */}
                        <Spinner animation="border" style={{marginTop: '1vh'}} />
                        {/* {needsUpdate && 'UPDATING...'}
                        {!needsUpdate && 'DOWNLOADING...'} */}
                    </button>
                )}
                {/* <Spinner animation="border" variant='danger'/> */}

                <div className='bottom-info right Vibing-text'>
                    <div>Latest Version: {latestVersion}</div>
                    {isInstalled && (
                        <div style={{fontSize: 'small'}}>Installed Version: {installedVersion}</div>
                    )}
                    {/* {needsUpdate && <div>Needs Update</div>} */}
                </div>

                <div className='bottom-info left launcher-text'>
                    <div>ALPHA LAUNCHER</div>
                </div>
                
            </div>
        </div>
    )
}
