# VisionText ✨ - AI Image to Text Extractor

A modern, AI-powered web application that extracts text from images using the API Ninjas Image-to-Text API.

## Features

- 🖼️ Drag & drop or click to upload images
- 📝 Extract text from JPG, PNG, and JPEG images
- 🌓 Dark/Light theme toggle
- 📋 Copy extracted text to clipboard
- 💾 Download extracted text as .txt file
- ⌨️ Keyboard shortcuts (Ctrl+V to paste, Esc to clear)
- 📱 Responsive design

## Setup Instructions

### 1. Get Your API Key

1. Visit [API Ninjas](https://api-ninjas.com/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key

### 2. Configure the Application

1. Open `script.js` in your text editor
2. Find line 6: `const API_NINJAS_KEY = 'YOUR_API_KEY';`
3. Replace `'YOUR_API_KEY'` with your actual API Ninjas key
4. Save the file

Example:
```javascript
const API_NINJAS_KEY = 'abcd1234efgh5678ijkl9012mnop3456';
```

### 3. Run the Application

Simply open `index.html` in your web browser. No server required!

## Usage

1. **Upload an Image**: 
   - Drag and drop an image onto the upload area, or
   - Click the upload area to browse and select an image, or
   - Press Ctrl+V to paste an image from clipboard

2. **Extract Text**: 
   - Click the "Convert Image to Text" button
   - Wait for the API to process your image

3. **Use the Results**:
   - Copy the text to clipboard
   - Download as a text file
   - Clear to start over

## API Information

- **Provider**: API Ninjas
- **Endpoint**: `https://api.api-ninjas.com/v1/imagetotext`
- **Free Tier**: 50,000 requests/month
- **Documentation**: [API Ninjas Image to Text](https://api-ninjas.com/api/imagetotext)

## Supported Image Formats

- JPEG/JPG
- PNG
- Maximum file size: 10MB

## Keyboard Shortcuts

- `Ctrl/Cmd + V`: Paste image from clipboard
- `Esc`: Clear current image and results

## Troubleshooting

### "Invalid API key" Error
- Make sure you've replaced `YOUR_API_KEY` with your actual API key
- Verify your API key is active in your API Ninjas dashboard

### "API quota exceeded" Error
- You've reached your monthly request limit
- Upgrade your API Ninjas plan or wait until next month

### No Text Detected
- Ensure the image contains readable text
- Try with a higher quality image
- Check that the text is clearly visible

## Technologies Used

- HTML5
- CSS3 (with CSS Variables for theming)
- JavaScript (ES6+)
- jQuery (for AJAX requests)
- API Ninjas Image-to-Text API

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Privacy

- No images or text are stored on any server
- All processing is done via API Ninjas
- Images are sent directly to the API and not saved

## License

Free to use for personal and commercial projects.
