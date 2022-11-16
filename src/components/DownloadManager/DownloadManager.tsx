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
import { tmpdir } from 'os'
interface DownloadManagerProps {}

const AdmZip = window.require('adm-zip')
const os = window.require('os')
const fs = window.require('fs')
const request = window.require('request')
const exec = window.require('child_process').exec
const ipcRenderer = window.require('electron').ipcRenderer
var execWin = window.require('child_process').execFile

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
    const [currProg, setCurrProg] = useState('0')
    const [timestampVersion, setTimestampVersion] = useState(0)

    useEffect(() => {
        setCurrentPlatform(os.platform())
        setIsInstalled(isGameInstalled())
        setGameDir(getGameInstallPath(currentPlatform, false))
        setGamePath(getGameInstallPath(currentPlatform, true))
        setDownloadUrl(getDownloadLink())
        setButtonEnabled(true)
        setInstalledVersion(getInstalledVersion(currentPlatform))
        getLatestVersion()

        console.log('latest version: ', latestVersion)

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

        if ((!isInstalled || needsUpdate) && isDownloading) {
            const progressBar = document.getElementById('bar')
            progressBar!.style.width = currProg + '%'
        }

        console.log('state gamedir: ', gameDir)
        console.log('state gamepath: ', gamePath)
        console.log(
            'state installed version: ',
            getInstalledVersion(currentPlatform)
        )
    }, [
        isInstalled,
        currentPlatform,
        needsUpdate,
        installedVersion,
        latestVersion,
        currProg,
        isDownloading,
    ])

    const getLatestVersion = () => {
        console.log('Cached Version: ', latestVersion)
        if (Date.now() > timestampVersion + 60000) {
            const options = {
                url: 'https://api.github.com/repos/bitmon-world/bitmon-releases/releases',
                headers: {
                    'User-Agent': 'Vibing Studios Launcher',
                },
            }

            request.get(options, (err: any, res: any, body: any) => {
                let releases = JSON.parse(body)
                console.log('releases: ', releases)
                if (releases[0]) {
                    setLatestVersion(releases[0]['tag_name'])
                }
            })
            setTimestampVersion(Date.now())
            console.log('Date new: ', timestampVersion)
        } else {
            console.log('Date: using cached version')
        }
    }

    const downloadGame = () => {
        setIsDownloading(true)
        setButtonEnabled(false)

        ipcRenderer.send('download', {
            url: downloadUrl,
            properties: { directory: gameDir },
        })
        ipcRenderer.on('progress', function (event: any, response: any) {
            setCurrProg(response)
        })
        ipcRenderer.on('save-path', (event: any, response: any) => {
            var zip = new AdmZip(response)
            zip.extractAllTo(gameDir, true)
            fs.unlinkSync(response)
            writeFileVersion(os.platform(), latestVersion)
            setInstalledVersion(latestVersion)
            setIsDownloading(false)
            setIsInstalled(true)
            setButtonEnabled(true)
            setNeedsUpdate(false)
        })
    }

    const runGame = async () => {
        // file permissions on mac only
        if (currentPlatform === 'darwin') {
            await exec('chmod -R 755 ' + '"' + gamePath + '"')
            await exec('open ' + '"' + gamePath + '"')
        } else if (currentPlatform === 'win32') {
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
                        className={needsUpdate ? 'main-btn' : 'download-btn'}
                        disabled={!buttonEnabled}
                        onClick={downloadGame}
                    >
                        {needsUpdate ? 'UPDATE' : 'DOWNLOAD'}
                    </button>
                )}

                {(!isInstalled || needsUpdate) && isDownloading && (
                    <div>
                        <div id="bar-container2" />
                        <div id="bar-container1" />
                        <div id="container-invisible">
                            <div id="bar" />
                        </div>
                        <div className="percentage Vibing-text">
                            {currProg}%
                        </div>
                    </div>
                )}

                <div className="bottom-info right Vibing-text">
                    <div>Latest Version: {latestVersion}</div>
                    {isInstalled && (
                        <div style={{ fontSize: 'small' }}>
                            Installed Version: {installedVersion}
                        </div>
                    )}
                </div>

                <div className="bottom-info left launcher-text">
                    <div>ALPHA LAUNCHER</div>
                </div>
            </div>
        </div>
    )
}
