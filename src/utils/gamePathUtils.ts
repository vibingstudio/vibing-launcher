const fs = window.require('fs')
const os = window.require('os')
const pathModule = window.require('path')

export function isGameInstalled() {
    let platform = os.platform()
    let gamePath = getGameInstallPath(platform, true)

    if (fs.existsSync(gamePath)) {
        return true
    } else {
        return false
    }
}

export function getDownloadLink() {
    let platform = os.platform()

    switch (platform) {
        case 'darwin':
            return 'https://github.com/bitmon-world/bitmon-releases/releases/latest/download/Bitmon_macos.zip'
        case 'win32':
            return 'https://github.com/bitmon-world/bitmon-releases/releases/latest/download/Bitmon_windows.zip'
        case 'linux':
            return ''
        default:
            return ''
    }
}

export function getLatestRelease() {
    let platform = os.platform()

    switch (platform) {
        case 'darwin':
            return 'https://github.com/bitmon-world/bitmon-releases/releases/latest/download/Bitmon_macos.zip'
        case 'win32':
            return 'https://github.com/bitmon-world/bitmon-releases/releases/download/0.0/Bitmon_windows.zip'
        case 'linux':
            return ''
        default:
            return ''
    }
}

export function getGameInstallPath(platform: string, fullPath: boolean) {
    let outPath = ''
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

    console.log('gamePath:', outPath)
    return outPath
}

function getVersionPath(platform: string, fullPath: boolean) {
    let outPath = ''
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
                outPath = pathModule.join(outPath, 'version.txt')
                break
            case 'win32':
                outPath = pathModule.join(outPath, 'Bitmon', 'version.txt')
                break
            case 'linux':
                outPath = pathModule.join(outPath, 'bitmon', 'version.txt')
                break
            default:
                console.log('setting default game path')
                outPath = ''
                break
        }
    }

    console.log('versionPath:', outPath)
    return outPath
}

export function writeFileVersion(platform: string, version: string) {
    fs.writeFile(getVersionPath(platform, true), version, function (err: any) {
        if (err) return console.log(err)
        console.log('Content Written > helloworld.txt')
    })
}

export function getInstalledVersion(platform: string) : string {
    try {
        const version = fs.readFileSync(getVersionPath(platform, true), 'utf-8')
        console.log("found version: ", version)
        return version
    } catch(error) {
        console.log(error)
        return "v0.0.0"
    }
}

