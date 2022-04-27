const fs = window.require('fs')
const os = window.require('os')
const pathModule = window.require('path')

export function isGameInstalled() {
    let platform = os.platform()
    let gamePath = getGameInstallPath(platform, true)

    console.log('searching for game installation at: ', gamePath)
    if (fs.existsSync(gamePath)) {
        return true
    } else {
        console.log('game not found')
        return false
    }
}

export function getGameInstallPath(platform: string, fullPath: boolean) {
    let outPath = ''
    console.log('log getPath: ', platform)
    switch (platform) {
        case 'darwin':
            outPath = pathModule.join(os.homedir(), 'Applications')
            break
        case 'win32':
            outPath = pathModule.join(os.homedir(), 'Bitmon')
            break
        case 'linux':
            outPath = pathModule.join(
                os.homedir(),
                'usr',
                'local',
                'bin',
                'bitmon'
            )
            break
        default:
            console.log('setting default game path')
            outPath = ''
            break
    }

    if (fullPath) {
        switch (platform) {
            case 'darwin':
                outPath = pathModule.join(outPath, 'Bitmon.app')
                break
            case 'win32':
                outPath = pathModule.join(outPath, 'Bitmon', 'Bitmon.exe')
                break
            case 'linux':
                outPath = pathModule.join(outPath, 'bitmon')
                break
            default:
                console.log('setting default game path')
                outPath = ''
                break
        }
    }
    return outPath
}
