# Jira-Gherkin Converter App Summary

## Overview
This Atlassian Forge app automatically converts Jira ticket descriptions to Gherkin scripts when tickets transition to the "Code Review" column/status. The app calls your external Python application to perform the conversion and adds the result back to the Jira issue.

## Components

### 1. manifest.yml
- Defines the app structure and permissions
- Configures the webhook that triggers on "Code Review" status transition
- Sets up the web request to your external Python application

### 2. src/index.js
- Main handler function that processes Jira issue transitions
- Extracts issue details (summary, description, etc.)
- Calls your external Python application
- Processes the response and adds the Gherkin script to the issue

### 3. package.json
- Defines app dependencies and scripts
- Includes required Forge API dependencies

### 4. README.md
- Complete installation and configuration instructions
- API specifications for your Python application

### 5. config.example.json
- Example configuration file showing app settings
- Maps data fields between Jira and your Python app

### 6. test-payload.js
- Sample payload for testing the app functionality
- Simulates what Jira sends when an issue transitions

## How to Deploy

1. Update the `manifest.yml` with your Python application URL
2. Install Atlassian Forge CLI: `npm install -g @forge/cli`
3. Navigate to the app directory: `cd jira-gherkin-converter`
4. Install dependencies: `npm install`
5. Deploy the app: `forge deploy`
6. Install in Jira: `forge install`

## Integration with Your Python App

Your Python application should:
- Accept POST requests with JSON payload containing issue details
- Convert the test design in the description to Gherkin format
- Return a JSON response with the converted Gherkin script

Expected request format:
```json
{
  "issueId": "10001",
  "issueKey": "PROJ-123",
  "summary": "Issue summary",
  "description": "Issue description",
  "status": "Code Review",
  "projectKey": "PROJ",
  "assignee": "John Doe",
  "reporter": "Jane Smith"
}
```

Expected response format:
```json
{
  "convertedGherkin": "Feature: User Login\n  Scenario: Valid user login\n    Given I am on the login page\n    When I enter valid credentials\n    Then I should be logged in successfully"
}
```

## Customization Options

- Modify trigger condition in manifest.yml to respond to different status transitions
- Adjust which fields are sent to your Python application
- Change how the response is handled (comment format, custom field storage)
- Add additional error handling and logging