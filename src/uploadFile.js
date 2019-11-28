const fetch = require('node-fetch')
const fs = require('fs')

uploadFile = async (filePath, url) => {
    const stats = fs.statSync(filePath)
    const fileSizeInBytes = stats.size 
    return fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": 'application/octet-stream',
            "Content-Length": fileSizeInBytes
        },
        body: fs.readFileSync(filePath)
    })
}

module.exports.uploadFile = uploadFile
