/**
 * Test payload for the Jira-Gherkin converter app
 * This simulates the payload that would be sent by Jira when an issue transitions
 */

const testPayload = {
  "issue": {
    "id": "10001",
    "key": "PROJ-123",
    "fields": {
      "summary": "User should be able to login with valid credentials",
      "description": {
        "version": 1,
        "type": "doc",
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "As a user, I want to be able to login to the application with my valid credentials so that I can access my account."
              }
            ]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "type": "text",
                "text": "Acceptance Criteria:"
              }
            ]
          },
          {
            "type": "bulletList",
            "content": [
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      {
                        "type": "text",
                        "text": "Given I am on the login page"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      {
                        "type": "text",
                        "text": "When I enter valid username and password"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "listItem",
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      {
                        "type": "text",
                        "text": "Then I should be redirected to the dashboard"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      "status": {
        "name": "Code Review"
      },
      "project": {
        "key": "PROJ"
      },
      "assignee": {
        "displayName": "John Doe"
      },
      "reporter": {
        "displayName": "Jane Smith"
      }
    }
  }
};

const testContext = {
  "extension": {
    "type": "jira:issue-transition-webhook",
    "id": "jira-issue-transition-webhook"
  },
  "product": "jira",
  "accountId": "account-id-123"
};

// Export for use in testing
module.exports = {
  testPayload,
  testContext
};

console.log('Test payload created for Jira-Gherkin converter');
console.log('Issue Key:', testPayload.issue.key);
console.log('Status:', testPayload.issue.fields.status.name);