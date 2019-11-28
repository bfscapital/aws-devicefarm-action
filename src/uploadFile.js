const fetch = require('node-fetch')
const fs = require('fs')

uploadFile = async (filePath, url) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/octet-stream'
        },
        body: fs.createReadStream(filePath)
    })
}

module.exports.uploadFile = uploadFile
