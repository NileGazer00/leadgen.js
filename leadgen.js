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
        formSelector: '#lead-form'
    };

    function init(options) {
        config = { ...config, ...options };
        
        const form = document.querySelector(config.formSelector);
        if (form) {
            form.addEventListener('submit', handleSubmit);
            console.log('✅ LeadGen.js initialized');
        } else {
            console.error('❌ LeadGen.js: Form not found');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Add timestamp
        data.timestamp = new Date().toISOString();
        
        try {
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