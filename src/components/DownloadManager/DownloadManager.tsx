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
    const [latestVersion, setLatestVersion] = useState('')

    useEffect(() => {
        setIsInstalled(isGameInstalled())
        console.log('setting all initial values')
        setCurrentPlatform(os.platform())
        setGameDir(getGameInstallPath(currentPlatform, false))
        setGamePath(getGameInstallPath(currentPlatform, true))
        setDownloadUrl(getDownloadLink())
        setButtonEnabled(true)
        getLatestVersion().then((data: any) => setLatestVersion(data))
        //setLatestVersion(getLatestVersion())
    }, [isInstalled, currentPlatform])

    // const getGame = async () => {
    //   let rs = await request.get(
    //     { url: downloadUrl, encoding: null },
    //     (err: any, res: any, body: any) => {
    //         console.log('body: ', body)
    //         var zip = new AdmZip(body)
    //         console.log('extracting into: ', gameDir)
    //         zip.extractAllTo(gameDir, true)
    //     }
    // )
    // }
    const getLatestVersion = async () => {
        console.log('getLatestVersion()')
        const options = {
            url: 'https://api.github.com/repos/bitmon-world/bitmon-releases/releases',
            headers: {
                'User-Agent': 'Vibing Studios Launche',
            },
        }

        request.get(options, (err: any, res: any, body: any) => {
            let releases = JSON.parse(body)
            console.log(releases)
            for (let release of releases) {
                console.log('release version: ', release['tag_name'])
            }
            console.log(releases[0]['tag_name'])
            setLatestVersion(releases[0]['tag_name'])
            console.log('latest version: ', latestVersion)
        })
    }

    const downloadGame = () => {
        console.log('ttest!')
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

                setIsDownloading(false)
                setIsInstalled(true)
                setButtonEnabled(true)
            }
        )
    }

    // const getGameHttp = () => {
    //     console.log('downloading')
    //     setIsDownloading(true)
    //     console.log('downloading: ', isDownloading, ' from ', downloadUrl)
    //     //needle('get', downloadUrl).then(function(resp: any) { console.log("resp: ", resp.body) }).catch(function(err: any) { console.error(err) })

    //     // axios({
    //     //     url: downloadUrl,
    //     //     method: 'GET',
    //     //     responseType: 'blob', // important,
    //     //     encoding: null
    //     // }).then((response: any) => {
    //     //     var zip = new AdmZip(response)
    //     //     console.log('extracting into: ', gameDir)
    //     //     zip.extractAllTo(gameDir, true)
    //     // })

    //     downloadGame()

    //     // let rs = await request.get(
    //     //     { url: downloadUrl, encoding: null },
    //     //     (err: any, res: any, body: any) => {
    //     //         console.log('body: ', body)
    //     //         var zip = new AdmZip(body)
    //     //         console.log('extracting into: ', gameDir)
    //     //         zip.extractAllTo(gameDir, true)
    //     //     }
    //     // )

    //     // request.get({url: downloadUrl, encoding: null}).then((err: any, res: any, body: any) => {
    //     //   console.log('body: ', body)
    //     //     var zip = new AdmZip(body)
    //     //     console.log('extracting into: ', gameDir)
    //     //     zip.extractAllTo(gameDir, true)
    //     // })
    //     setIsDownloading(false)
    //     setIsInstalled(true)
    //     console.log(isDownloading)
    // }

    // const getGameHttpWCallback = useCallback(async () => {
    //     console.log('downloading')
    //     await setIsDownloading(true)
    //     console.log('downloading: ', isDownloading)
    //     // let rs = await request.get(
    //     //     { url: downloadUrl, encoding: null },
    //     //     (err: any, res: any, body: any) => {
    //     //         console.log('body: ', body)
    //     //         var zip = new AdmZip(body)
    //     //         console.log('extracting into: ', gameDir)
    //     //         zip.extractAllTo(gameDir, true)
    //     //     }
    //     // )

    //     new Promise((resolve) => {
    //         request(
    //             {
    //                 url: downloadUrl,
    //                 method: 'GET',
    //                 encoding: null,
    //             },
    //             function (error: any, response: any, body: any) {
    //                 if (!error) resolve(body)
    //             }
    //         )
    //     }).then((body) => {
    //         // process value here
    //         console.log('body: ', body)
    //         var zip = new AdmZip(body)
    //         console.log('extracting into: ', gameDir)
    //         zip.extractAllTo(gameDir, true)
    //     })
    //     //console.log("res", rs)
    //     await setIsDownloading(false)
    //     console.log(isDownloading)
    //     await setIsInstalled(true)
    // }, [isDownloading])

    // const getGameHttp2 = async () => {
    //     console.log('downloading')
    //     await setIsDownloading(true)
    //     console.log('downloading: ', isDownloading)
    //     // let rs = await request.get(
    //     //     { url: downloadUrl, encoding: null },
    //     //     (err: any, res: any, body: any) => {
    //     //         console.log('body: ', body)
    //     //         var zip = new AdmZip(body)
    //     //         console.log('extracting into: ', gameDir)
    //     //         zip.extractAllTo(gameDir, true)
    //     //     }
    //     // )

    //     new Promise((resolve) => {
    //         request(
    //             {
    //                 url: downloadUrl,
    //                 method: 'GET',
    //                 encoding: null,
    //             },
    //             function (error: any, response: any, body: any) {
    //                 !error ? resolve(body) : console.log(error)
    //             }
    //         )
    //     }).then((body) => {
    //         // process value here
    //         console.log('body: ', body)
    //         var zip = new AdmZip(body)
    //         console.log('extracting into: ', gameDir)
    //         zip.extractAllTo(gameDir, true)
    //     })
    //     //console.log("res", rs)
    //     setIsDownloading(false)
    //     console.log(isDownloading)
    //     // await setIsInstalled(true)
    // }

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
                {!isInstalled && !isDownloading && (
                    <button disabled={!buttonEnabled} onClick={downloadGame}>
                        Download
                    </button>
                )}

                {!isInstalled && isDownloading && (
                    <button disabled={!buttonEnabled} onClick={downloadGame}>
                        <div>
                            <div>{isDownloading && <BounceLoader />}</div>
                        </div>
                        Downloading...
                    </button>
                )}
            </div>
        </div>
    )
}
