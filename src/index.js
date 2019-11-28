const path = require('path')
const core = require('@actions/core')
const AWS = require('aws-sdk')
const uploadFile = require('./uploadFile')

const getInputWithDefault = (args) => {
    const { name, defaultValue, required } = args
    let value = core.getInput(name)
    if (!value && defaultValue) {
        core.debug(`Info: No value provided for input ${name}. Defaulting to ${defaultValue}`)
        value = defaultValue
    }
    if (!value && required) {
        throw `Error: No value provided for required input ${name}`
    }
    return value
}

const configAWS = () => {
    const accessKeyId = getInputWithDefault({ name: 'accessKeyId', required: true })
    const secretAccessKeyId = getInputWithDefault({ name: 'secretAccessKeyId', required: true })
    const region = getInputWithDefault({ name: 'region', defaultValue: 'us-west-2' })
    const apiVersion = '2015-06-23'

    AWS.config.accessKeyId = accessKeyId
    AWS.config.secretAccessKey = secretAccessKeyId
    AWS.config.region = region
    AWS.apiVersion = apiVersion
}

const run = async () => {
    try {
        const projectName = getInputWithDefault({ name: 'projectName', required: true })
        const devicePoolName = getInputWithDefault({ name: 'devicePoolName', required: true })
        const appBinaryPath = getInputWithDefault({ name: 'appBinaryPath', required: true })
        // const testPackagePath = getInputWithDefault({ name: 'testPackagePath', required: true })
        // const testPackageType = getInputWithDefault({ name: 'testPackageType', required: true })

        configAWS()
        const deviceFarm = new AWS.DeviceFarm()

        const projectResults = await deviceFarm.listProjects().promise()
        const projects = projectResults.projects
        const project = projects.find(({ name }) => name === projectName)
        if (!projectName) {
            throw `Could not find a project with the name ${projectName}`
        }

        const devicePoolsParams = {
            arn: project.arn
        }
        const devicePoolResults = await deviceFarm.listDevicePools(devicePoolsParams).promise()
        const devicePools = devicePoolResults.devicePools
        const devicePool = devicePools.find(({ name }) => name === devicePoolName)
        if (!devicePool) {
            throw `Could not find a device pool in project ${projectName} with the name ${devicePoolName}`
        }

        const appBinaryFileExtension = path.extname(appBinaryPath).toLowerCase()
        const appBinaryType = {
            '.ipa': 'IOS_APP',
            '.apk': 'ANDROID_APP'
        }[appBinaryFileExtension]
        if (!appBinaryType) {
            throw `Invalid appBinaryPath file extension ${appBinaryFileExtension}. Must be ".ipa" or ".apk".`
        }

        const appBinaryName = path.basename(appBinaryPath)

        const appUploadParams = {
            name: appBinaryName,
            projectArn: project.arn,
            type: appBinaryType,
            contentType: 'application/octet-stream'
        }
        const appUploadResults = await deviceFarm.createUpload(appUploadParams).promise()
        const uploadURL = appUploadResults.upload.url

        const fileUploadResults = await uploadFile(appBinaryPath, uploadURL)
        console.log(JSON.stringify(fileUploadResults))

    } catch (error) {
        core.setFailed(error.message)
    }
}

run()