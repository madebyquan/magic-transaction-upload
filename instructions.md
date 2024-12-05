# Product Requirements Document (PRD)

## Project Overview

This web application allows users to upload multiple file types (CSV, PDF, Excel, and image files) to extract financial data using AI. The extracted data is presented in a structured table and can be downloaded in CSV format. The app leverages Next.js 14, shadCN, TailwindCSS, and Lucid Icons for a streamlined user experience and development efficiency.

## Core Functionalities

### 1. File Upload

- Drop Zone:
  - Drag-and-drop area for file uploads
  - Alternative option: file selection via a button
- File Types Supported:
  - Text files: .csv
  - Spreadsheet: .xlsx
  - Document: .pdf
  - Images: .png, .jpg, .jpeg, .tiff, .webp
- Multi-File Support:
  - Users can upload multiple files simultaneously

### 2. File Preview

- Display thumbnails of uploaded files
- Include file name and file type below each thumbnail
- Provide the ability to remove individual files before processing

### 3. AI-Based Data Extraction

- Extracted Data Structure:
  - Stock ticker (e.g., AAPL, TSLA)
  - Number of shares (integer or float)
  - Purchase price (currency format)
  - Purchase date (MM/DD/YYYY or DD/MM/YYYY)
  - Transaction type (buy/sell)
- AI model handles:
  - Parsing tabular data in PDFs or images
  - Reading Excel and CSV files
  - Identifying and cleaning noisy data

### 4. Dynamic Table

- Updates in real-time as new files are processed
- Display extracted data in a tabular format
- Columns: Stock Ticker, Number of Shares, Purchase Price, Purchase Date, Transaction Type
- Supports sorting and filtering by columns

### 5. Download Functionality

- Export all table data as a .csv file
- Filename auto-generated based on date/time, e.g., exported_data_YYYYMMDD.csv

## Technical Specifications

### Tech Stack

- Frontend:
  - Next.js 14 (for SSR and SPA support)
  - TailwindCSS (for responsive styling)
  - shadCN (for UI components)
  - Lucid Icons (for minimalistic icons)
- Backend:
  - Node.js server for processing
  - File upload API for secure handling
  - AI model integration (e.g., via Python backend using Flask/FastAPI or a cloud-based ML service)
- AI Data Extraction:
  - Leverage OpenAI for parsing Excel/CSV files, images and PDFs


### File Structure

#### Frontend
```
/components
  - FileUploader.jsx        # Drop zone component
  - FilePreview.jsx         # Thumbnails for uploaded files
  - DataTable.jsx           # Displays extracted data in table form
  - DownloadButton.jsx      # Exports table data to CSV
/pages
  - index.jsx               # Home page with uploader and table
/styles
  - globals.css            # Global TailwindCSS styles
/utils
  - api.js                 # Fetch wrapper for API calls
```

#### Backend
```
/api
  - upload.js              # Handles file upload
  - processData.js         # Parses uploaded files
/models
  - aiProcessor.py         # AI logic for data extraction
  - fileParser.js          # Handles CSV and Excel parsing
```

### Workflow

1. File Upload:
   - User uploads files via the drag-and-drop zone
   - Files are sent to the server for processing
2. Data Extraction:
   - Backend detects file type and routes it to the appropriate handler (OCR for images/PDFs, file parsers for others)
   - AI processes the file to extract relevant financial data
3. Table Update:
   - Extracted data is returned to the frontend
   - The data table updates dynamically
4. File Removal:
   - Users can remove files before processing to exclude unwanted data
5. Download:
   - After reviewing the table, the user clicks a download button to export the data in CSV format

## Documentation

### API Documentation

- File Upload Endpoint:
  - Method: POST
  - Endpoint: /api/upload
  - Payload:
    - files: array of files
  - Response:
    - status: success/failure
    - data: array of extracted data
- Data Processing Endpoint:
  - Method: POST
  - Endpoint: /api/processData
  - Payload:
    - fileId: unique identifier for uploaded file
  - Response:
    - status: success/failure
    - data: extracted table rows

### Notes for Developers

1. Error Handling:
   - Provide feedback for unsupported file types
   - Validate input data and notify the user about missing or malformed data
2. Performance Considerations:
   - Optimize AI processing to handle large files efficiently
   - Use lazy loading for displaying data in the table to prevent rendering lag
3. Testing:
   - Use mock data to test parsing logic
   - Ensure cross-browser compatibility (e.g., Chrome, Firefox, Safari)
4. Future Scalability:
   - Consider integration with cloud services (e.g., AWS, GCP) for AI model hosting
   - Add support for additional file types based on user feedback`