const fetch = require('node-fetch')
const fs = require('fs')

uploadFile = async (filePath, url) => {
    const stats = fs.statSync()
    console.log(`File stats: ${stats}`)
    const fileSizeInBytes = stats.size 
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/octet-stream',
            "Content-Length": fileSizeInBytes
        },
        body: fs.createReadStream(filePath)
    })
}

module.exports.uploadFile = uploadFile
