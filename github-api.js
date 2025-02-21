/**
 * GitHub API wrapper for pushing file changes
 */

// Get the current file content and SHA
async function getFileInfo(config) {
    const { owner, repo, path, branch, token } = config;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to get file info: ${response.status}`);
        }
        
        const fileInfo = await response.json();
        
        // Decode the content if it exists
        if (fileInfo.content) {
            fileInfo.decodedContent = decodeURIComponent(escape(atob(fileInfo.content)));
        }
        
        return fileInfo;
    } catch (error) {
        console.error('Error getting file info:', error);
        
        // If file doesn't exist (404), return null
        if (error.message.includes('404')) {
            return null;
        }
        
        throw error;
    }
}

// Update or create a file on GitHub
async function updateOrCreateFile(newEntryContent, config, existingFile = null) {
    const { owner, repo, path, branch, token } = config;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    let finalContent = '';
    
    // If file exists, append the new entry to existing data
    if (existingFile && existingFile.decodedContent) {
        // Try to find where the array entries are
        const content = existingFile.decodedContent;
        
        if (content.includes('const dataEntries = [')) {
            // Find position to insert new entry (after the opening bracket)
            const arrayStartPos = content.indexOf('const dataEntries = [') + 'const dataEntries = ['.length;
            
            // Insert new entry at the beginning of the array
            finalContent = 
                content.substring(0, arrayStartPos) + 
                '\n' + newEntryContent + ',' + 
                content.substring(arrayStartPos);
        } else {
            // If file exists but doesn't have our expected format, replace it
            finalContent = `// Data entries
const dataEntries = [
${newEntryContent}
];

// Function to render entries to the page
function renderDataEntries() {
  const container = document.getElementById('data-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  dataEntries.forEach((entry, index) => {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'data-entry';
    entryDiv.innerHTML = \`
      <h3>Entry #\${index + 1}</h3>
      <p><strong>First Value:</strong> \${entry.firstValue}</p>
      <p><strong>Second Value:</strong> \${entry.secondValue}</p>
      <p><strong>Timestamp:</strong> \${new Date(entry.timestamp).toLocaleString()}</p>
    \`;
    container.appendChild(entryDiv);
  });
}

// Export the data
export { dataEntries, renderDataEntries };

// Auto-render when the page loads
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', renderDataEntries);
}`;
        }
    } else {
        // No existing file, create a new one
        finalContent = `// Data entries
const dataEntries = [
${newEntryContent}
];

// Function to render entries to the page
function renderDataEntries() {
  const container = document.getElementById('data-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  dataEntries.forEach((entry, index) => {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'data-entry';
    entryDiv.innerHTML = \`
      <h3>Entry #\${index + 1}</h3>
      <p><strong>First Value:</strong> \${entry.firstValue}</p>
      <p><strong>Second Value:</strong> \${entry.secondValue}</p>
      <p><strong>Timestamp:</strong> \${new Date(entry.timestamp).toLocaleString()}</p>
    \`;
    container.appendChild(entryDiv);
  });
}

// Export the data
export { dataEntries, renderDataEntries };

// Auto-render when the page loads
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', renderDataEntries);
}`;
    }
    
    const contentEncoded = btoa(unescape(encodeURIComponent(finalContent)));
    
    const requestBody = {
        message: `Add new data entry via web interface - ${new Date().toISOString()}`,
        content: contentEncoded,
        branch
    };
    
    // If updating an existing file, include the SHA
    if (existingFile) {
        requestBody.sha = existingFile.sha;
    }
    
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to update file: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating file:', error);
        throw error;
    }
}

// Main function to push content to GitHub
async function pushToGithub(config) {
    try {
        // Get the new entry content from window object
        const newEntryContent = window.newDataEntry;
        
        if (!newEntryContent) {
            throw new Error('No data entry found. Please generate code first.');
        }
        
        // Try to get existing file
        const existingFile = await getFileInfo(config);
        
        // Update or create the file with the new entry
        const result = await updateOrCreateFile(newEntryContent, config, existingFile);
        
        // Store the token in session storage (will be cleared when browser is closed)
        if (config.token) {
            sessionStorage.setItem('githubToken', config.token);
        }
        
        return {
            success: true,
            sha: result.commit.sha,
            url: result.content.html_url
        };
    } catch (error) {
        console.error('Error pushing to GitHub:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
