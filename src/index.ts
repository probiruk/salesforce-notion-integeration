import salesforce from "./connections/salesforce.con"

// Import salesforce runners
import leadRunner from "./objects/lead/runner"
import logger from "./helpers/logger.helper"

const main = async () => {
    // Login to salesforce
    let sforce
    while (true) {
        sforce = await salesforce()
        if(sforce) break

        logger.info('Retrying in 10 sec...')

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
        await delay(10000)
    }

    if (sforce) {
        // Events that are subscribed
        const events = ['created-lead', 'updated-lead', 'deleted-lead']

        logger.info(`Subscribed Events: [${String(events).split(',').join(', ')}]` )

        // running salesforce objects
        leadRunner(events, sforce)
    }
}

main()