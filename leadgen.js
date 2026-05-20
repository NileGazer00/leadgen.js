/**
 * LeadGen.js v1.1.0
 * Zero-dependency JavaScript library for capturing leads directly to Google Sheets
 * Now with Make.com webhook support
 */

const LeadGen = (function() {
    let config = {
        webhookUrl: '',
        apiKey: '',
        headers: {},
        onSuccess: null,
        onError: null,
        formSelector: '#lead-form',
        // Original features preserved
        theme: 'light',
        validation: true
    };

    function init(options) {
        config = { ...config, ...options };
        
        const form = document.querySelector(config.formSelector);
        if (form) {
            form.addEventListener('submit', handleSubmit);
            applyTheme();
            console.log('✅ LeadGen.js v1.1.0 initialized');
        } else {
            console.error('❌ LeadGen.js: Form not found');
        }
    }

    function applyTheme() {
        if (config.theme === 'dark') {
            document.documentElement.style.setProperty('--bg', '#1a1a2e');
            document.documentElement.style.setProperty('--text', '#ffffff');
        }
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Validation
        if (config.validation) {
            if (!data.fullName || !data.email) {
                alert('Please fill all required fields.');
                return;
            }
            if (!validateEmail(data.email)) {
                alert('Please enter a valid email address.');
                return;
            }
        }
        
        // Add metadata
        data.timestamp = new Date().toISOString();
        data.source = 'LeadGen.js v1.1.0';
        
        try {
            // Send to webhook (Make.com)
            const response = await fetch(config.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-make-apikey': config.apiKey,
                    ...config.headers
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                if (config.onSuccess) {
                    config.onSuccess(data);
                } else {
                    console.log('✅ Lead sent successfully:', data);
                    alert('Thank you! Your submission has been received.');
                }
                form.reset();
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('❌ LeadGen.js error:', error);
            if (config.onError) {
                config.onError(error);
            } else {
                alert('Something went wrong. Please try again later.');
            }
        }
    }

    return {
        init: init,
        version: '1.1.0'
    };
})();

// Make available globally
if (typeof window !== 'undefined') {
    window.LeadGen = LeadGen;
}