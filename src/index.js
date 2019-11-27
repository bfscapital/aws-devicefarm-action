const core = require('@actions/core')
const AWS = require('aws-sdk')

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
        configAWS()

        const projectName = getInputWithDefault({ name: 'projectName', required: true })
        const devicePoolName = getInputWithDefault({ name: 'devicePoolName', required: true })

        const deviceFarm = new AWS.DeviceFarm()

        const projectResults = await deviceFarm.listProjects().promise()
        const projects = projectResults.data
        const project = projects.find(({ name }) => name === projectName)
        if (!projectName) {
            throw `Could not find a project with the name ${projectName}`
        }

        const projectParams = {
            arn: project.arn
        }
        const devicePoolResults = await deviceFarm.getDevicePool(projectParams).promise()
        const devicePools = devicePoolResults.data
        const devicePool = devicePools.find(({ name }) => name === devicePoolName)
        if (!devicePoolName) {
            throw `Could not find a device pool with the name ${devicePoolName} in project ${projectName}`
        }

        core.setOutput("project", JSON.stringify(project))
        core.setOutput("devicePool", JSON.stringify(devicePool))

    } catch (error) {
        core.setFailed(error.message)
    }
}

run()