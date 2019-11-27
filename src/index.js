import { getInput, debug, setFailed, setOutput } from '@actions/core'
import AWS from 'aws-sdk'

const getInputWithDefault = (args) => {
    const { name, defaultValue, required } = args
    let value = getInput(name)
    if (!value && defaultValue) {
        debug(`Info: No value provided for input ${name}. Defaulting to ${defaultValue}`)
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

    aws.config.accessKeyId = accessKeyId
    aws.config.secretAccessKey = secretAccessKeyId
    aws.config.region = region
    aws.apiVersion = apiVersion
}

try {
    configAWS()

    const deviceFarm = AWS.DeviceFarm()

    deviceFarm.listProjects({}, (err, data) => {
        if (err) {
            debug(err)
            throw err
        } else {
            debug(`projects: ${data}`)
            setOutput('projects', data)
        }
    })
} catch (error) {
    setFailed(error.message)
}
