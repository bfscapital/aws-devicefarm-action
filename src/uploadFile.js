const fetch = require('fetch')
const fs = require('fs')

module.exports.uploadFile = async (filePath, url) => {
    return fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": 'application/octet-stream'
        },
        body: fs.createReadStream(filePath)
    })
}
