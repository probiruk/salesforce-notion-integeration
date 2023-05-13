import jsforce from 'jsforce'
import dotenv from 'dotenv'
import logger from '../helpers/logger.helper'
import pushTopics from '../constant'

// Importing enviroment variables
dotenv.config()

const loginUrl = 'https://login.salesforce.com' // or use https://test.salesforce.com for sandbox environment

const username = process.env.SALESFORCE_USERNAME
const password = process.env.SALESFORCE_PASSWORD
const securityToken = process.env.SALESFORCE_TOKEN

const conn = new jsforce.Connection({ loginUrl })

// check push topic and create new one if don't exist
const checkPushTopic = async (query: string, pushTopicName: string) => {
    try {
        const result = await conn.query(query)
        if (result.totalSize > 0) {
            logger.info(`PushTopic ${pushTopicName} already exists`)
            return
        }

        logger.info(`PushTopic ${pushTopicName} does not exist, creating...`)
        if (pushTopics.includes(pushTopicName)) {
            let pushTopic
            if (pushTopicName == 'Lead') {
                pushTopic = {
                    Name: pushTopicName,
                    Query: 'SELECT Id, Name, Title, Company, Phone, Email, Status FROM Lead',
                    NotifyForOperationCreate: true,
                    NotifyForOperationUpdate: true,
                    NotifyForOperationUndelete: false,
                    NotifyForOperationDelete: true,
                    NotifyForFields: 'All',
                    ApiVersion: '48.0',
                }
            } else if (pushTopicName == 'Opportunity') {
                pushTopic = {
                    Name: pushTopicName,
                    Query: 'SELECT Id, Name, Amount, StageName, Probability, CloseDate FROM opportunity',
                    NotifyForOperationCreate: true,
                    NotifyForOperationUpdate: true,
                    NotifyForOperationUndelete: false,
                    NotifyForOperationDelete: true,
                    NotifyForFields: 'All',
                    ApiVersion: '48.0',
                }
            } else {
                return
            }
            await conn.create('PushTopic', pushTopic)
        }

        logger.info(`PushTopic ${pushTopicName} created successfully`)
    } catch (err) {
        logger.info(
            `Salesforce push topic check failed: ${String(err).replace(
                'Error: ',
                ''
            )}`
        )
    }
}

export default async (): Promise<jsforce.Connection | undefined> => {
    try {
        await conn.login(username || '', password || '' + securityToken || '')
        logger.info(`Logged in to Salesforce as: ${username}`)

        pushTopics.forEach((pushTopic) => {
            const query = `SELECT Id FROM PushTopic WHERE Name = '${pushTopic}'`
            checkPushTopic(query, pushTopic)
        })

        return conn
    } catch (err) {
        logger.error(
            `Salesforce login failed: ${String(err).replace('Error: ', '')}`
        )
    }
}
