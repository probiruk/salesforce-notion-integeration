import jsforce from "jsforce";
import dotenv from "dotenv"
import config from "./config.json"
import notion from "../../helpers/notion.helper";
import logger from "../../helpers/logger.helper";

// Importing enviroment variables
dotenv.config()

const object = "opportunity"
const database_id = String(process.env.OPPORTUNITY_DATABASE_ID)

export default async (events: string[], sforce: jsforce.Connection) => {
    try {
        // streaming method here used to establish connection with the streaming API
        const channel = sforce.streaming.topic(config.topic_name);

        // subscripe method used here to subscribe to the changes of the object
        let replyId: number
        channel.subscribe((message) => {
            logger.info(`Received message for ${object.charAt(0).toUpperCase() + object.slice(1)} Object`)

            if(events.includes(`${message.event.type}-${object}`)) {
                const { sobject } = message;
                
                if (message.event.type == `created`) {
                    logger.info(`Creating new ${object}: ${sobject.Name}`)
                    notion.AddItem(sobject, object, database_id);
                    replyId = Number(message.event.replayId)
                }
                else if (message.event.type == `updated` && message.event.replayId != replyId + 1) {
                    logger.info(`Updating ${object} record with id of ${sobject.Id}`)
                    notion.UpdateItem(sobject.Id, sobject, object, database_id)
                }
                else if (message.event.type == 'deleted') {
                    const id = sobject.Id
                    logger.info(`Deleting ${object} record with id of ${id}`)
                    notion.DeleteItem(id, database_id)
                }
            } else {
                logger.info(`${message.event.type}-${object} event isn't subscribed`)
            }
        });
    } catch (err) {
        logger.error(`Opps! Something went wrong ${err}`)
    }
}