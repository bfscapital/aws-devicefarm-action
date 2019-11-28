const fetch = require('node-fetch')
const fs = require('fs')

uploadFile = async (filePath, url) => {
    const stats = fs.statSync(filePath)
    console.log(`File stats: ${JSON.stringify(stats)}`)
    const fileSizeInBytes = stats.size 
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/octet-stream',
            "Content-Length": fileSizeInBytes
        },
        body: fs.readFileSync(filePath)
    })
}

module.exports.uploadFile = uploadFile
