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
        
        return await response.json();
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
async function updateOrCreateFile(content, config, existingFile = null) {
    const { owner, repo, path, branch, token } = config;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    const contentEncoded = btoa(unescape(encodeURIComponent(content)));
    
    const requestBody = {
        message: `Update data.js file via web interface - ${new Date().toISOString()}`,
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
async function pushToGithub(content, config) {
    try {
        // Try to get existing file
        const existingFile = await getFileInfo(config);
        
        // Update or create the file
        const result = await updateOrCreateFile(content, config, existingFile);
        
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
