/**
 * Main handler for the Jira-Gherkin converter app
 * This function is triggered when a Jira issue transitions to the "Code Review" status
 */

// Import necessary modules
import { invoke } from '@forge/api';

/**
 * Handler function that processes the Jira issue transition event
 * @param {object} payload - The event payload containing issue information
 * @param {object} context - Context containing authentication and other metadata
 * @returns {object} - Response object
 */
export async function handler(payload, context) {
  try {
    console.log('Jira issue transitioned to Code Review:', payload);

    // Extract issue details from the payload
    const issue = payload.issue;
    const issueId = issue.id;
    const issueKey = issue.key;
    const summary = issue.fields?.summary || '';
    const description = issue.fields?.description?.content ? 
      extractTextFromContent(issue.fields.description.content) : 
      issue.fields?.description || '';
    
    // Prepare data to send to the Python app
    const requestData = {
      issueId: issueId,
      issueKey: issueKey,
      summary: summary,
      description: description,
      status: issue.fields?.status?.name,
      projectKey: issue.fields?.project?.key,
      assignee: issue.fields?.assignee?.displayName || 'Unassigned',
      reporter: issue.fields?.reporter?.displayName || 'Unknown'
    };

    console.log('Sending data to Python app:', requestData);

    // Call the external Python application
    const pythonAppResponse = await callPythonApp(requestData);
    
    console.log('Response from Python app:', pythonAppResponse);

    // Process the response from the Python app
    if (pythonAppResponse && pythonAppResponse.convertedGherkin) {
      // Add the converted Gherkin as a comment to the Jira issue
      await addGherkinAsComment(issueId, pythonAppResponse.convertedGherkin, context);
      
      // Optionally update a custom field with the Gherkin script
      await updateGherkinField(issueId, pythonAppResponse.convertedGherkin, context);
    }

    return {
      success: true,
      message: `Successfully processed issue ${issueKey} and sent to Python app`,
      gherkinGenerated: !!pythonAppResponse?.convertedGherkin
    };
  } catch (error) {
    console.error('Error processing Jira issue:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Calls the external Python application to convert test design to Gherkin
 * @param {object} data - Data to send to the Python app
 * @returns {object} - Response from the Python app
 */
async function callPythonApp(data) {
  try {
    // This assumes you have configured the external app URL in your app properties
    const response = await invoke({
      // The URL should be configured in your app's properties
      // For now using a placeholder - you'll need to configure this in the app settings
      uri: 'https://your-python-app-url.com/convert', 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return response;
  } catch (error) {
    console.error('Error calling Python app:', error);
    throw error;
  }
}

/**
 * Adds the converted Gherkin as a comment to the Jira issue
 * @param {string} issueId - The ID of the Jira issue
 * @param {string} gherkinScript - The converted Gherkin script
 * @param {object} context - The context object
 */
async function addGherkinAsComment(issueId, gherkinScript, context) {
  try {
    const comment = {
      body: {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Converted Gherkin Script' }]
          },
          {
            type: 'codeBlock',
            attrs: { language: 'gherkin' },
            content: [
              {
                type: 'text',
                text: gherkinScript
              }
            ]
          }
        ]
      }
    };

    await invoke({
      uri: `/rest/api/3/issue/${issueId}/comment`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    });
  } catch (error) {
    console.error('Error adding comment to issue:', error);
    throw error;
  }
}

/**
 * Updates a custom field with the Gherkin script
 * @param {string} issueId - The ID of the Jira issue
 * @param {string} gherkinScript - The converted Gherkin script
 * @param {object} context - The context object
 */
async function updateGherkinField(issueId, gherkinScript, context) {
  try {
    // This assumes you have created a custom field called "Gherkin Script"
    // You'll need to find the actual custom field ID in your Jira instance
    const updateData = {
      fields: {
        // Replace 'customfield_12345' with the actual custom field ID for Gherkin Script
        'customfield_gherkin': gherkinScript  
      }
    };

    await invoke({
      uri: `/rest/api/3/issue/${issueId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
  } catch (error) {
    console.error('Error updating custom field:', error);
    // This error might be acceptable if the custom field doesn't exist
  }
}

/**
 * Extracts plain text from Jira's Atlassian Document Format (ADF)
 * @param {array} content - ADF content array
 * @returns {string} - Extracted plain text
 */
function extractTextFromContent(content) {
  if (!content || !Array.isArray(content)) {
    return '';
  }

  let text = '';
  for (const node of content) {
    if (node.type === 'text') {
      text += node.text || '';
    } else if (node.content) {
      text += extractTextFromContent(node.content);
    }
  }
  return text;
}