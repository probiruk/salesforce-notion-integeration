import { Client } from '@notionhq/client'
import dotenv from 'dotenv'

// Importing enviroment variables
dotenv.config()

// Initialising a new notion client to be able to work conveniently with the API
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})

export default notion
