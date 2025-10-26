// ===== GLOBAL VARIABLES =====
let selectedFile = null;
let extractedText = '';

// ===== API KEY =====
const API_NINJAS_KEY = 'iUnzOcox0/GTVcqZnsyfSw==h7gHc4bfS52rxkQc'; // Replace with your API Ninjas key from https://api-ninjas.com/

// ===== DOM ELEMENTS =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadContent = document.getElementById('uploadContent');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeBtn = document.getElementById('removeBtn');
const convertBtn = document.getElementById('convertBtn');
const btnText = document.getElementById('btnText');
const spinner = document.getElementById('spinner');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const toast = document.getElementById('toast');

// ===== THEME MANAGEMENT =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});


// ===== FILE UPLOAD HANDLING =====
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        showToast('Please upload a valid image (JPG, PNG, JPEG)', 'error');
        return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showToast('Image size should be less than 10MB', 'error');
        return;
    }

    selectedFile = file;
    displayImagePreview(file);
}

function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        uploadArea.style.display = 'none';
        imagePreview.style.display = 'block';
        resultSection.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetUpload();
});

function resetUpload() {
    selectedFile = null;
    fileInput.value = '';
    previewImg.src = '';
    uploadArea.style.display = 'block';
    imagePreview.style.display = 'none';
    resultSection.style.display = 'none';
    extractedText = '';
    resultText.value = '';
}

// ===== API NINJAS INTEGRATION =====
convertBtn.addEventListener('click', async () => {
    // Validate inputs
    if (!selectedFile) {
        showToast('Please upload an image first', 'error');
        return;
    }

    if (API_NINJAS_KEY === 'YOUR_API_KEY') {
        showToast('Please configure your API Ninjas key in script.js', 'error');
        return;
    }

    await extractTextFromImage();
});

async function extractTextFromImage() {
    try {
        // Show loading state
        setLoadingState(true);

        // Create FormData and append the image file
        var formData = new FormData();
        formData.append('image', selectedFile);

        // Make API request using jQuery AJAX
        $.ajax({
            method: 'POST',
            url: 'https://api.api-ninjas.com/v1/imagetotext',
            headers: { 'X-Api-Key': API_NINJAS_KEY },
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function(result) {
                console.log('API Response:', result);
                
                // Check if result is an array and has text
                if (Array.isArray(result) && result.length > 0) {
                    // Concatenate all text from the result array with spaces
                    extractedText = result.map(item => item.text).join(' ');
                    
                    if (extractedText.trim()) {
                        displayResult(extractedText);
                        showToast('Text extracted successfully!', 'success');
                    } else {
                        extractedText = 'No text found in the image.';
                        displayResult(extractedText);
                        showToast('No text detected in the image', 'info');
                    }
                } else if (result && result.text) {
                    // Handle single object response
                    extractedText = result.text;
                    displayResult(extractedText);
                    showToast('Text extracted successfully!', 'success');
                } else {
                    extractedText = 'No text found in the image.';
                    displayResult(extractedText);
                    showToast('No text detected in the image', 'info');
                }
                
                setLoadingState(false);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('API Error:', jqXHR.responseText);
                let errorMessage = 'Failed to extract text. ';
                
                try {
                    const errorData = JSON.parse(jqXHR.responseText);
                    if (jqXHR.status === 401) {
                        errorMessage += 'Invalid API key. Please check your API Ninjas key.';
                    } else if (jqXHR.status === 429) {
                        errorMessage += 'API quota exceeded. Please try again later.';
                    } else if (errorData.error) {
                        errorMessage += errorData.error;
                    } else {
                        errorMessage += jqXHR.responseText || textStatus;
                    }
                } catch (e) {
                    errorMessage += jqXHR.responseText || textStatus || 'Unknown error occurred';
                }
                
                showToast(errorMessage, 'error');
                setLoadingState(false);
            }
        });

    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to process image: ' + error.message, 'error');
        setLoadingState(false);
    }
}

// Removed fileToBase64 function - not needed for API Ninjas

function setLoadingState(isLoading) {
    convertBtn.disabled = isLoading;
    if (isLoading) {
        btnText.style.display = 'none';
        spinner.style.display = 'block';
    } else {
        btnText.style.display = 'block';
        spinner.style.display = 'none';
    }
}

function displayResult(text) {
    resultText.value = text;
    resultSection.style.display = 'block';
}

// ===== ACTION BUTTONS =====
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(extractedText);
        showToast('Copied to clipboard! ✓', 'success');
    } catch (error) {
        // Fallback for older browsers
        resultText.select();
        document.execCommand('copy');
        showToast('Copied to clipboard! ✓', 'success');
    }
});

downloadBtn.addEventListener('click', () => {
    if (!extractedText) {
        showToast('No text to download', 'error');
        return;
    }

    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-text-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Text downloaded successfully! ✓', 'success');
});

clearBtn.addEventListener('click', () => {
    resetUpload();
    showToast('Cleared successfully! ✓', 'success');
});

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.style.background = type === 'error' 
        ? 'rgba(239, 68, 68, 0.95)' 
        : 'rgba(34, 197, 94, 0.95)';
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + V to paste image
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        navigator.clipboard.read().then(items => {
            for (let item of items) {
                for (let type of item.types) {
                    if (type.startsWith('image/')) {
                        item.getType(type).then(blob => {
                            const file = new File([blob], 'pasted-image.png', { type: blob.type });
                            handleFile(file);
                        });
                        break;
                    }
                }
            }
        }).catch(err => {
            console.log('Clipboard access denied or no image found');
        });
    }

    // Escape to clear
    if (e.key === 'Escape' && selectedFile) {
        resetUpload();
    }
});
