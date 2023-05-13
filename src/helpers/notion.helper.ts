import notionCon from '../connections/notion.con'
import leadConfig from '../objects/lead/config.json'
import opportunityConfig from '../objects/opportunity/config.json'
import logger from './logger.helper'

const notion = {
    AddItem: async (data: any, object: string, database_id: string) => {
        try {
            const fieldsConfig =
                object == 'lead' ? leadConfig : opportunityConfig
            let properties: any = {}

            fieldsConfig.fields.forEach((field) => {
                if (field.type == 'title') {
                    properties[field.name] = {
                        type: 'title',
                        title: [
                            {
                                type: 'text',
                                text: {
                                    content: data[field.name],
                                    link: null,
                                },
                            },
                        ],
                    }
                } else if (field.type == 'text') {
                    properties[field.name] = {
                        rich_text: [
                            {
                                type: 'text',
                                text: {
                                    content:
                                        data[field.name] == null
                                            ? ''
                                            : data[field.name],
                                },
                            },
                        ],
                    }
                } else if (field.type == 'number') {
                    properties[field.name] = {
                        number: data[field.name],
                    }
                }
            })

            await notionCon.pages.create({
                parent: { database_id: database_id },
                properties: properties,
            })

            logger.info('Entry succeed!')
        } catch (err) {
            logger.error(`Entry failed ${String(err).replace('Error: ', '')}`)
        }
    },
    UpdateItem: async (
        title: string,
        data: any,
        object: string,
        database_id: string
    ) => {
        try {
            const response = await notionCon.databases.query({
                database_id: database_id,
                filter: {
                    property: 'Id',
                    title: {
                        equals: title,
                    },
                },
            })

            if (response.results.length === 0) {
                logger.error(`No record found with title ${title}`)
                return
            }

            const recordId = response.results[0].id
            const fieldsConfig =
                object == 'lead' ? leadConfig : opportunityConfig
            let properties: any = {}

            fieldsConfig.fields.forEach((field) => {
                if (field.type == 'title') {
                    properties[field.name] = {
                        type: 'title',
                        title: [
                            {
                                type: 'text',
                                text: {
                                    content: data[field.name],
                                    link: null,
                                },
                            },
                        ],
                    }
                } else if (field.type == 'text') {
                    properties[field.name] = {
                        rich_text: [
                            {
                                type: 'text',
                                text: {
                                    content:
                                        data[field.name] == null
                                            ? ''
                                            : data[field.name],
                                },
                            },
                        ],
                    }
                } else if (field.type == 'number') {
                    properties[field.name] = {
                        number: data[field.name],
                    }
                }
            })

            await notionCon.pages.update({
                page_id: recordId,
                properties: properties,
            })

            logger.info('Modification succeed!')
        } catch (err) {
            logger.error(
                `Modification failed ${String(err).replace('Error: ', '')}`
            )
        }
    },
    DeleteItem: async (title: string, database_id: string) => {
        try {
            const response = await notionCon.databases.query({
                database_id: database_id,
                filter: {
                    property: 'Id',
                    title: {
                        equals: title,
                    },
                },
            })

            if (response.results.length === 0) {
                logger.error(`No record found with title ${title}`)
                return
            }

            const recordId = response.results[0].id

            await notionCon.pages.update({
                page_id: recordId,
                archived: true,
            })

            logger.info('Deletion succeed!')
        } catch (err) {
            logger.error(
                `Deletion failed ${String(err).replace('Error: ', '')}`
            )
        }
    },
}

export default notion
