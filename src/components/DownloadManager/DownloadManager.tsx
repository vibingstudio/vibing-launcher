import React, { FC, useEffect, useState } from 'react'
import { getGameInstallPath, isGameInstalled } from '../../utils/gamePathUtils'
import './DownloadManager.css'

interface DownloadManagerProps {}

let files = {
    darwin: 'https://github.com/bitmon-world/bitmon-releases/releases/download/0.0/Bitmon_macos.zip',
    win32: 'https://github.com/bitmon-world/bitmon-releases/releases/download/0.0/Bitmon_windows.zip',
}
//const fs = window.require('fs')
const AdmZip = window.require('adm-zip')
const os = window.require('os')
const request = window.require('request')
const exec = window.require('child_process').execFile

export const DownloadManager: FC<DownloadManagerProps> = () => {
    const [gamePath, setGamePath] = useState('')
    const [gameDir, setGameDir] = useState('')
    const [isInstalled, setIsInstalled] = useState(false)
    const [currentPlatform, setCurrentPlatform] = useState('unknown')
    const [buttonEnabled, setButtonEnabled] = useState(true)
    const [isGameDownloaded, setIsGameDownloaded] = useState(false)
    const [downloadUrl, setDownloadUrl] = useState(false)

    useEffect(() => {
        setButtonEnabled(false)
        setIsInstalled(isGameInstalled())

        console.log('setting all initial values')
        setCurrentPlatform(os.platform())
        setGameDir(getGameInstallPath(currentPlatform, false))
        setGamePath(getGameInstallPath(currentPlatform, true))

        setButtonEnabled(true)
    }, [isInstalled])

    const getGameHttp = async () => {
        console.log('here!')
        await request.get(
            { url: downloadUrl, encoding: null },
            (err: any, res: any, body: any) => {
                console.log('body: ', body)
                var zip = new AdmZip(body)
                var zipEntries = zip.getEntries()
                console.log(zipEntries.length)

                console.log('iterating over contents...')
                zipEntries.forEach((entry: any) => {
                    console.log(entry.entryName)
                })
                console.log('extracting into: ', gameDir)
                zip.extractAllTo(gameDir, true)
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
            {isInstalled && (
                <button disabled={!buttonEnabled} onClick={runGame}>
                    Run Game
                </button>
            )}
            {!isInstalled && (
                <button disabled={!buttonEnabled} onClick={getGameHttp}>
                    Download
                </button>
            )}
        </div>
    )
}
