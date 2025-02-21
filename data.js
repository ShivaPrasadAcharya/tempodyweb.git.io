// Data entries
const dataEntries = [
  {
    firstValue: "example value 3",
    secondValue: "example value 3",
    timestamp: "2025-02-21T16:30:00.000Z"
  },
  {
    firstValue: "example value 2",
    secondValue: "example value 2",
    timestamp: "2025-02-21T14:15:00.000Z"
  },
  {
    firstValue: "example value 1",
    secondValue: "example value 1",
    timestamp: "2025-02-21T12:00:00.000Z"
  }
];

// Function to render entries to the page
function renderDataEntries() {
  const container = document.getElementById('data-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  dataEntries.forEach((entry, index) => {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'data-entry';
    entryDiv.innerHTML = `
      <h3>Entry #${index + 1}</h3>
      <p><strong>First Value:</strong> ${entry.firstValue}</p>
      <p><strong>Second Value:</strong> ${entry.secondValue}</p>
      <p><strong>Timestamp:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>
    `;
    container.appendChild(entryDiv);
  });
}

// Export the data
export { dataEntries, renderDataEntries };

// Auto-render when the page loads
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', renderDataEntries);
}
