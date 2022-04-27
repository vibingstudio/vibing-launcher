import React, { FC, useEffect, useState } from 'react'
import {
    getDownloadLink,
    getGameInstallPath,
    isGameInstalled,
} from '../../utils/gamePathUtils'
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
    const [currentPlatform, setCurrentPlatform] = useState('unknown')
    const [buttonEnabled, setButtonEnabled] = useState(false)
    // const [isGameDownloaded, setIsGameDownloaded] = useState(false)
    const [downloadUrl, setDownloadUrl] = useState('')
    const [isDownloading, setIsDownloading] = useState(false)

    useEffect(() => {
        setIsInstalled(isGameInstalled())

        console.log('setting all initial values')
        setCurrentPlatform(os.platform())
        setGameDir(getGameInstallPath(currentPlatform, false))
        setGamePath(getGameInstallPath(currentPlatform, true))
        setDownloadUrl(getDownloadLink())
        setButtonEnabled(true)
    }, [isInstalled, currentPlatform])

    const getGameHttp = async () => {
      console.log("downloading");
        setIsDownloading(true);
        console.log("downloading: ", isDownloading);
        let rs = await request.get(
            { url: downloadUrl, encoding: null },
            (err: any, res: any, body: any) => {
                console.log('body: ', body)
                var zip = new AdmZip(body)
                console.log('extracting into: ', gameDir)
                zip.extractAllTo(gameDir, true)
            }
        )
        console.log("res", rs)
        setIsDownloading(false)
        console.log(isDownloading)
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
            {isInstalled && (
                <button disabled={!buttonEnabled} onClick={runGame}>
                    Run Game
                </button>
            )}
            {!isInstalled && (
                <button disabled={!buttonEnabled} onClick={async () => { await getGameHttp()}}>
                    Download
                </button>
            )}
            </div>
            <div>
            {isDownloading && (<BounceLoader/>)}
            </div>
            
            
        </div>
    )
}
