// DOM Elements
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const codeOutput = document.getElementById('codeOutput');
const generateBtn = document.getElementById('generateBtn');
const pushToGithubBtn = document.getElementById('pushToGithubBtn');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const statusMessage = document.getElementById('statusMessage');
const preview = document.getElementById('preview');
const githubAuthModal = document.getElementById('githubAuth');
const submitAuthBtn = document.getElementById('submitAuthBtn');
const cancelAuthBtn = document.getElementById('cancelAuthBtn');
const githubTokenInput = document.getElementById('githubToken');

// GitHub API configuration
const config = {
    owner: 'ShivaPrasadAcharya',
    repo: 'tempodyweb.git.io',
    path: 'data.js',
    branch: 'main',
    token: null
};

// Generate code function
function generateCode() {
    const val1 = input1.value.trim();
    const val2 = input2.value.trim();
    
    if (!val1 || !val2) {
        showStatus('Please fill both input fields', 'error');
        return;
    }
    
    const timestamp = new Date().toISOString();
    
    // Create a new data entry
    const newEntry = {
        firstValue: val1,
        secondValue: val2,
        timestamp: timestamp
    };
    
    // Format the entry as a JavaScript object
    const entryCode = `  {
    firstValue: "${val1}",
    secondValue: "${val2}",
    timestamp: "${timestamp}"
  }`;
    
    // Create code for a new data.js file if none exists
    const initialCode = `// Data entries
const dataEntries = [
${entryCode}
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
    
    codeOutput.value = initialCode;
    
    // Store the new entry for use when pushing to GitHub
    window.newDataEntry = entryCode;
    
    updatePreview(val1, val2, timestamp);
    showStatus('Code generated successfully', 'success');
}

// Update preview function
function updatePreview(val1, val2, timestamp) {
    preview.innerHTML = `
First Value: ${val1}
Second Value: ${val2}
Timestamp: ${timestamp}
    `;
}

// Show status message
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status ' + type;
    
    // Auto clear after 5 seconds
    setTimeout(() => {
        statusMessage.textContent = '';
        statusMessage.className = 'status';
    }, 5000);
}

// Copy code to clipboard
function copyCode() {
    if (!codeOutput.value) {
        showStatus('No code to copy', 'error');
        return;
    }
    
    codeOutput.select();
    document.execCommand('copy');
    showStatus('Code copied to clipboard', 'success');
}

// Show GitHub auth modal
function showGitHubAuthModal() {
    if (!codeOutput.value) {
        showStatus('No code to push', 'error');
        return;
    }
    githubAuthModal.style.display = 'flex';
}

// Hide GitHub auth modal
function hideGitHubAuthModal() {
    githubAuthModal.style.display = 'none';
    githubTokenInput.value = '';
}

// Submit GitHub auth and push code
async function submitGitHubAuth() {
    const token = githubTokenInput.value.trim();
    
    if (!token) {
        showStatus('GitHub token is required', 'error');
        return;
    }
    
    config.token = token;
    hideGitHubAuthModal();
    
    try {
        pushToGithubBtn.disabled = true;
        pushToGithubBtn.innerHTML = 'Pushing... <span class="loading"></span>';
        
        const result = await pushToGithub(codeOutput.value, config);
        
        if (result.success) {
            showStatus(`Code pushed to GitHub successfully! Commit: ${result.sha}`, 'success');
        } else {
            showStatus(`Error: ${result.error}`, 'error');
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        pushToGithubBtn.disabled = false;
        pushToGithubBtn.textContent = 'Push to GitHub';
    }
}

// Event listeners
generateBtn.addEventListener('click', generateCode);
copyCodeBtn.addEventListener('click', copyCode);
pushToGithubBtn.addEventListener('click', showGitHubAuthModal);
submitAuthBtn.addEventListener('click', submitGitHubAuth);
cancelAuthBtn.addEventListener('click', hideGitHubAuthModal);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Store token in session storage if available
    const storedToken = sessionStorage.getItem('githubToken');
    if (storedToken) {
        githubTokenInput.value = storedToken;
    }
});

// Sample data.js file for initial preview
const sampleData = {
    firstValue: "example value 1",
    secondValue: "example value 2",
    timestamp: new Date().toISOString()
};

// Initialize with example values
input1.value = "example value 1";
input2.value = "example value 2";
generateCode();
