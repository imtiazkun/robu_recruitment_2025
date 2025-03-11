// excelUtils.js
import xlsx from 'node-xlsx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const downloadExcelFromJson = (jsonData: any[], fileName = 'students.xlsx') => {
  if (!jsonData || !jsonData.length) {
    console.error('No data provided for Excel export.');
    return;
  }

  // Create a union of all keys from all records to include any extra fields.
  const headersSet = new Set();
  jsonData.forEach(item => Object.keys(item).forEach(key => headersSet.add(key)));
  const headers = Array.from(headersSet);

  // Map JSON data into rows corresponding to headers.
  // If a value is an array (e.g., preferred_departments), join it into a string.
  const data = [
    headers, // header row
    ...jsonData.map(item =>
      headers.map(header => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (item as Record<string, any>)[header as string] ?? '';
        if (Array.isArray(value)) {
          return value.join(', ');
        }
        return value;
      })
    )
  ];

  // Build the Excel file using node-xlsx.
  const buffer = xlsx.build([{ name: 'Students', data, options: {} }]);

  // Create a blob from the buffer and trigger a download.
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
