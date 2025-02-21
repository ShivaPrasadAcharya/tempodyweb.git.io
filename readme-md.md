# Dynamic Code Generator

This web application allows you to dynamically generate and push code to a GitHub repository directly from your browser.

## Features

- Input fields for customizing the generated code
- Automatic code generation for data.js file
- Preview of generated data
- One-click GitHub repository integration to push changes
- Copy to clipboard functionality
- Simple authentication for GitHub API access

## File Structure

- `index.html` - Main HTML document
- `styles.css` - Styling and layout
- `script.js` - Main application logic
- `github-api.js` - GitHub API integration functions
- `data.js` - Sample data file that gets updated

## Setup Instructions

1. Clone this repository to your local machine or GitHub Pages site.
2. Update the GitHub repository configuration in `script.js`:
   ```javascript
   const config = {
     owner: 'YourGitHubUsername',
     repo: 'YourRepositoryName',
     path: 'data.js',
     branch: 'main'
   };
   ```
3. Generate a GitHub Personal Access Token with `repo` scope.
4. Open the webpage in your browser.

## How to Use

1. Enter values in the first and second input fields.
2. Click "Generate Code" to create the data.js code.
3. Review the generated code and preview.
4. Click "Push to GitHub" when ready to commit the changes.
5. Enter your GitHub Personal Access Token when prompted.
6. The code will be pushed directly to your GitHub repository.

## Security Considerations

- Your GitHub token is stored only in session storage and is cleared when you close the browser.
- No server-side code is needed; all API calls are made directly from the browser.
- Always use a token with the minimum required permissions.

## GitHub Pages Integration

To host this on GitHub Pages:

1. Push all files to a GitHub repository.
2. Enable GitHub Pages in the repository settings.
3. Access your page at `https://[username].github.io/[repository-name]/`

## Customization

You can modify the code generation template in `script.js` to create different file formats or structures as needed.

## License

MIT
