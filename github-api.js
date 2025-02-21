// GitHub API handling

// Configuration - Replace these with actual values
const GITHUB_TOKEN = ''; // You'll need to provide this securely
const REPO_OWNER = 'ShivaPrasadAcharya';
const REPO_NAME = 'tempodyweb.git.io';
const FILE_PATH = 'data.js';

// Function to save the current contentData to GitHub
function saveToGitHub() {
    // Check if token is available
    if (!GITHUB_TOKEN) {
        console.error('GitHub token is not configured. Cannot save to GitHub.');
        alert('GitHub token is not configured. Changes will not be saved to GitHub.');
        return;
    }
    
    // First, get the current file to get its SHA
    getFileContent()
        .then(fileData => {
            // Prepare the updated content
            const updatedContent = `const contentData = ${JSON.stringify(contentData, null, 2)};`;
            
            // Update the file
            return updateFile(fileData.sha, updatedContent);
        })
        .then(response => {
            console.log('Successfully updated data.js file');
            alert('Content successfully saved to GitHub!');
        })
        .catch(error => {
            console.error('Error saving to GitHub:', error);
            alert('Failed to save to GitHub. See console for details.');
        });
}

// Function to get current file content and SHA
function getFileContent() {
    return fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`GitHub API request failed: ${response.status}`);
        }
        return response.json();
    });
}

// Function to update the file with new content
function updateFile(fileSha, content) {
    return fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Update data.js via web app',
            content: btoa(content), // Base64 encode the content
            sha: fileSha
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`GitHub API request failed: ${response.status}`);
        }
        return response.json();
    });
}

// Alternative implementation for environments where GitHub API cannot be used directly
// This displays a text area with the code that needs to be copied manually
function showManualUpdateOption() {
    const updatedContent = `const contentData = ${JSON.stringify(contentData, null, 2)};`;
    
    // Create modal or other UI to show the content
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'white';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    modal.style.zIndex = '1000';
    modal.style.maxWidth = '80%';
    modal.style.maxHeight = '80%';
    modal.style.overflow = 'auto';
    
    const heading = document.createElement('h3');
    heading.textContent = 'Copy this code to data.js file:';
    
    const textarea = document.createElement('textarea');
    textarea.value = updatedContent;
    textarea.style.width = '100%';
    textarea.style.height = '300px';
    textarea.style.marginTop = '10px';
    textarea.style.marginBottom = '10px';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.padding = '8px 16px';
    closeButton.style.backgroundColor = '#4285f4';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
        document.body.removeChild(modal);
    };
    
    modal.appendChild(heading);
    modal.appendChild(textarea);
    modal.appendChild(closeButton);
    
    document.body.appendChild(modal);
}
