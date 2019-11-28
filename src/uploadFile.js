const request = require('fetch')
const fs = require('fs')

export default async (filePath, url) => {
    return fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": 'application/octet-stream'
        },
        body: fs.createReadStream(filePath)
    })
}
