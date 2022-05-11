import React, { FC, useEffect, useState } from 'react'
import {
    getDownloadLink,
    getGameInstallPath,
    isGameInstalled,
    writeFileVersion,
    getInstalledVersion
} from '../../utils/gamePathUtils'
import { compare } from 'compare-versions';
import './DownloadManager.css'
import BounceLoader from 'react-spinners/BounceLoader'

interface DownloadManagerProps {}

const AdmZip = window.require('adm-zip')
const os = window.require('os')
const request = window.require('request')
const exec = window.require('child_process').execFile

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
        console.log('setting all initial values')
        setCurrentPlatform(os.platform())

        setIsInstalled(isGameInstalled())

        
        setGameDir(getGameInstallPath(currentPlatform, false))
        setGamePath(getGameInstallPath(currentPlatform, true))
        setDownloadUrl(getDownloadLink())
        setButtonEnabled(true)
        getLatestVersion()
        setInstalledVersion(getInstalledVersion(currentPlatform))

        console.log("look: ", latestVersion, " vs ", installedVersion)
        if (compare(latestVersion, installedVersion, '>')) {
            console.log(latestVersion, " > ", installedVersion, ": new update is available")
            setNeedsUpdate(true)
        } else {
            console.log(latestVersion, " = ", installedVersion, ": latest version is installed")
            setNeedsUpdate(false)
        }

        console.log('latest version main: ', latestVersion)
        //setLatestVersion(getLatestVersion())
    }, [isInstalled, currentPlatform, needsUpdate])

    const getLatestVersion = () => {
        console.log('getLatestVersion()')
        const options = {
            url: 'https://api.github.com/repos/bitmon-world/bitmon-releases/releases',
            headers: {
                'User-Agent': 'Vibing Studios Launcher',
            },
        }

        console.log('gettingVersions() =>')
        try {
            request.get(options, (err: any, res: any, body: any) => {
                let releases = JSON.parse(body)
                console.log('releases', releases)
                for (let release of releases) {
                    //console.log('release version: ', release['tag_name'])
                }
                console.log('latestVersion?  ', releases[0]['tag_name'])
                //setLatestVersion(releases[0]['tag_name'])
                //console.log('returning REAL version value')
                setLatestVersion(releases[0]['tag_name'])
                //console.log('latest version: ', latestVersion)
            })
        } catch (error) {
            console.log('error: ', error)
        }
    }

    const downloadGame = () => {
        setIsDownloading(true)
        setButtonEnabled(false)
        console.log('isDownloadingTest', isDownloading)

        setTimeout(() => {
            console.log('test')
        }, 1000)
        console.log('isDownloadingTest', isDownloading)

        request.get(
            { url: downloadUrl, encoding: null },
            (err: any, res: any, body: any) => {
                console.log('body: ', body)
                var zip = new AdmZip(body)
                console.log('extracting into : ', gameDir)
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
        console.log('running game!')
        exec(gamePath, function (err: any, data: any) {
            console.log('err: ', err)
            console.log('data: ', data.toString())
        })
    }

    return (
        <div className="DownloadManager">
            <div>
                {isInstalled && !needsUpdate && (
                    <button disabled={!buttonEnabled} onClick={runGame}>
                        Run Game
                    </button>
                )}
                {(!isInstalled || needsUpdate) && !isDownloading && (
                    <button disabled={!buttonEnabled} onClick={downloadGame}>
                        {needsUpdate && "Update"}
                        {!needsUpdate && "Download"}
                    </button>
                )}

                {(!isInstalled || needsUpdate) && isDownloading && (
                    <button disabled={!buttonEnabled} onClick={downloadGame}>
                        <div>
                            <div>{isDownloading && <BounceLoader />}</div>
                        </div>
                        {needsUpdate && "Updating..."}
                        {!needsUpdate && "Downloading...."}
                    </button>
                )}
                <div>Latest Version: {latestVersion}</div>
                {isInstalled && <div>Installed Version: {installedVersion}</div>}
                {needsUpdate && <div>Needs Update</div>}
            </div>
        </div>
    )
}
