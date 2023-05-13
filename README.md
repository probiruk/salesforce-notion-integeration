# Salesforce-Notion Integration

This repository contains code that allows you to migrate Salesforce objects data to Notion using the Notion API. 

## Installation

### Before Installation
1. Make sure your added your current ip address in salesforce whitlist before your run the script
2. Create Tables for Lead & Opportunity with the fields that list on config.json

## Leads Notion Table Fields:
```
Id: Title
Name: Text
Title: Text
Company: Text
Phone: Text
Email: Text
Status: Text
```

## Opportunities Notion Table Fields:
```
Id: Title
Name: Text
Amount: Number
StageName: Text
Probability: Number
CloseDate: Text
```

1. Clone the repository to your local machine.
2. Install the required dependencies by running `npm install`.
3. Create a `.env` file and add your Salesforce and Notion API keys as follows:
4. Run `npm start`

```
NOTION_TOKEN=your_notion_api_key
SALESFORCE_USERNAME=your_salesforce_username
SALESFORCE_PASSWORD=your_salesforce_password
SALESFORCE_TOKEN=your_salesforce_security_token
LEAD_DATABASE_ID=your_lead_database_notion_id
OPPORTUNITY_DATABASE_ID=your_opportunity_database_notion_id
```

## Usage

To migrate data from a Salesforce object to a Notion database, First make sure the script is running `npm start` then make a change on salesforce it will reflect on notion in a few

## Log Example

![alt text](https://github.com/probiruk/salesforce-notion-integeration/blob/master/screenshots/image_2023-05-13_09-47-37.png)

## Author

Biruk Erjamo <birukdotwork@gmail.com>
