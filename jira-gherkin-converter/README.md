# Jira-Gherkin Converter

A custom Atlassian Forge app that automatically converts Jira ticket descriptions to Gherkin scripts when tickets are moved to the "Code Review" column.

## Overview

This app listens for Jira issue transitions to the "Code Review" status and automatically calls your external Python application to convert the ticket description into a Gherkin script. The converted script is then added as a comment to the Jira issue and optionally stored in a custom field.

## Features

- Automatically triggers when a Jira issue moves to the "Code Review" status
- Sends issue details to your external Python application
- Receives converted Gherkin script and adds it to the Jira issue
- Stores Gherkin script as a comment with proper formatting
- Optionally updates a custom field with the Gherkin script

## Prerequisites

- An Atlassian Forge license
- An external Python application that converts test designs to Gherkin scripts
- Access to install Forge apps in your Jira instance

## Configuration

### 1. Update the External Application URL

Before deploying, you need to configure the URL of your Python application:

1. In the `manifest.yml` file, locate the `call-python-app` module
2. Replace `'{{{externalAppUrl}}}'` with your actual Python application URL
3. Or configure it as an app property during installation

### 2. Custom Field Setup (Optional)

If you want to store the Gherkin script in a custom field:

1. Create a custom field in Jira called "Gherkin Script" (or use an existing text area field)
2. Find the custom field ID in your Jira instance
3. Update the `updateGherkinField` function in `src/index.js` to use the correct field ID

## Installation

### 1. Install Atlassian Forge CLI

```bash
npm install -g @forge/cli
```

### 2. Login to Atlassian

```bash
forge login
```

### 3. Install Dependencies

```bash
cd jira-gherkin-converter
npm install
```

### 4. Deploy the App

```bash
forge deploy
forge install
```

## Configuration in Jira

After installation, you may need to configure:

1. The specific status name that triggers the conversion (default is "Code Review")
2. The URL of your external Python application
3. Any custom field mappings

## How It Works

1. A user moves a Jira issue to the "Code Review" column/status
2. The Forge app webhook is triggered
3. The app extracts the issue details (summary, description, etc.)
4. The details are sent to your external Python application via HTTP POST
5. Your Python app converts the test design to Gherkin and returns the result
6. The app adds the converted Gherkin as a formatted comment to the Jira issue
7. Optionally, the Gherkin is stored in a custom field

## Data Sent to Python App

The following data is sent to your Python application:

```json
{
  "issueId": "12345",
  "issueKey": "PROJ-123",
  "summary": "Issue summary",
  "description": "Issue description content",
  "status": "Code Review",
  "projectKey": "PROJ",
  "assignee": "John Doe",
  "reporter": "Jane Smith"
}
```

## Expected Response from Python App

Your Python application should return a JSON response with the converted Gherkin:

```json
{
  "convertedGherkin": "Feature: User Login\n  Scenario: Valid user login\n    Given I am on the login page\n    When I enter valid credentials\n    Then I should be logged in successfully"
}
```

## Customization

You can customize the app by:

- Modifying the trigger condition in `manifest.yml`
- Adjusting the data sent to your Python app in `src/index.js`
- Changing how the response is handled (comment format, custom field, etc.)
- Adding error handling and logging as needed

## Troubleshooting

- Check the app logs in the Atlassian developer console
- Verify that your Python application URL is accessible from Atlassian's servers
- Ensure the Jira issue has the required fields populated
- Confirm that the status name matches exactly what's configured in your Jira instance

## Security Considerations

- Ensure your Python application endpoint is secure
- Validate and sanitize input from Jira
- Consider using authentication between the Forge app and your Python application