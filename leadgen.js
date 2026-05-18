/**
 * LeadGen.js v1.0.0
 * Zero-dependency JavaScript library for capturing leads directly to Google Sheets
 * https://github.com/NileGazer00/leadgen.js
 * MIT License
 */
;(function(global) {
    'use strict';

    let currentConfig = null;
    let currentForm = null;

    // Helper: send POST request
    function sendData(data, config) {
        return new Promise(function(resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', config.sheetUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            if (config.customHeaders) {
                Object.keys(config.customHeaders).forEach(function(key) {
                    xhr.setRequestHeader(key, config.customHeaders[key]);
                });
            }
            xhr.timeout = config.timeout || 10000;
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch(e) {
                        resolve({ status: 'success', raw: xhr.responseText });
                    }
                } else {
                    reject(new Error('HTTP ' + xhr.status + ': ' + xhr.statusText));
                }
            };
            xhr.onerror = function() { reject(new Error('Network error')); };
            xhr.ontimeout = function() { reject(new Error('Request timeout')); };
            xhr.send(JSON.stringify(data));
        });
    }

    // Collect form data as object
    function getFormData(form) {
        const data = {};
        const elements = form.elements;
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            if (el.name && !el.disabled) {
                if (el.type === 'checkbox' || el.type === 'radio') {
                    if (el.checked) data[el.name] = el.value;
                } else if (el.type === 'select-multiple') {
                    const values = [];
                    for (let j = 0; j < el.options.length; j++) {
                        if (el.options[j].selected) values.push(el.options[j].value);
                    }
                    data[el.name] = values;
                } else {
                    data[el.name] = el.value;
                }
            }
        }
        return data;
    }

    // Validation
    function validateForm(form) {
        const errors = [];
        const elements = form.querySelectorAll('[required]');
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            if (!el.value.trim()) {
                errors.push(el.name + ' is required');
                el.classList.add('leadgen-error');
            } else {
                el.classList.remove('leadgen-error');
            }
        }
        const emails = form.querySelectorAll('[type="email"]');
        for (let j = 0; j < emails.length; j++) {
            const email = emails[j];
            if (email.value && !/^\S+@\S+\.\S+$/.test(email.value)) {
                errors.push(email.name + ' must be a valid email address');
                email.classList.add('leadgen-error');
            }
        }
        return { valid: errors.length === 0, errors: errors };
    }

    // Theme injection
    function applyTheme(theme) {
        if (theme === 'none') return;
        const styleId = 'leadgen-theme';
        const existing = document.getElementById(styleId);
        if (existing) existing.remove();
        let css = '';
        if (theme === 'light') {
            css = '.leadgen-form input, .leadgen-form textarea, .leadgen-form select { border:1px solid #ccc; padding:8px; margin:5px 0; width:100%; } .leadgen-form button { background:#007bff; color:white; border:none; padding:10px 20px; cursor:pointer; } .leadgen-error { border-color:red !important; }';
        } else if (theme === 'dark') {
            css = '.leadgen-form input, .leadgen-form textarea, .leadgen-form select { background:#333; color:#fff; border:1px solid #555; padding:8px; margin:5px 0; width:100%; } .leadgen-form button { background:#28a745; color:white; border:none; padding:10px 20px; cursor:pointer; } .leadgen-error { border-color:#ff6b6b !important; }';
        }
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Analytics storage
    function getAnalytics() {
        const stored = sessionStorage.getItem('leadgen_analytics');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch(e) {}
        }
        return {
            totalAttempts: 0,
            successful: 0,
            failed: 0,
            validationErrors: 0,
            conversionRate: '0%'
        };
    }

    function updateAnalytics(success, validationError = false) {
        const analytics = getAnalytics();
        if (validationError) {
            analytics.validationErrors++;
        } else if (success === true) {
            analytics.successful++;
        } else if (success === false) {
            analytics.failed++;
        }
        analytics.totalAttempts++;
        if (analytics.totalAttempts > 0) {
            analytics.conversionRate = ((analytics.successful / analytics.totalAttempts) * 100).toFixed(1) + '%';
        }
        sessionStorage.setItem('leadgen_analytics', JSON.stringify(analytics));
    }

    // Main init
    function init(config) {
        if (!config || !config.formId || !config.sheetUrl) {
            console.error('LeadGen: formId and sheetUrl are required');
            return;
        }
        const form = document.getElementById(config.formId);
        if (!form) {
            console.error('LeadGen: Form with id "' + config.formId + '" not found');
            return;
        }
        currentConfig = {
            sheetUrl: config.sheetUrl,
            validate: config.validate !== false,
            debug: config.debug === true,
            onSuccess: config.onSuccess || null,
            onError: config.onError || null,
            resetForm: config.resetForm !== false,
            disableOnSubmit: config.disableOnSubmit !== false,
            timeout: config.timeout || 10000,
            customHeaders: config.customHeaders || {},
            redirectUrl: config.redirectUrl || null
        };
        currentForm = form;
        form.classList.add('leadgen-form');
        if (config.theme && config.theme !== 'none') applyTheme(config.theme);

        const submitHandler = function(e) {
            e.preventDefault();
            if (currentConfig.disableOnSubmit) {
                const submitBtn = form.querySelector('[type="submit"]');
                if (submitBtn) submitBtn.disabled = true;
            }

            // Validation
            let validation = { valid: true };
            if (currentConfig.validate) {
                validation = validateForm(form);
            }
            if (!validation.valid) {
                if (currentConfig.debug) console.warn('Validation errors:', validation.errors);
                if (currentConfig.onError) currentConfig.onError({ message: 'Validation failed', errors: validation.errors });
                updateAnalytics(false, true);
                if (currentConfig.disableOnSubmit) {
                    const btn = form.querySelector('[type="submit"]');
                    if (btn) btn.disabled = false;
                }
                return;
            }

            const formData = getFormData(form);
            sendData(formData, currentConfig)
                .then(function(response) {
                    if (currentConfig.debug) console.log('LeadGen success:', response);
                    if (currentConfig.onSuccess) currentConfig.onSuccess(response);
                    if (currentConfig.resetForm) form.reset();
                    if (currentConfig.redirectUrl) window.location.href = currentConfig.redirectUrl;
                    updateAnalytics(true);
                })
                .catch(function(error) {
                    if (currentConfig.debug) console.error('LeadGen error:', error);
                    if (currentConfig.onError) currentConfig.onError(error);
                    updateAnalytics(false);
                })
                .finally(function() {
                    if (currentConfig.disableOnSubmit) {
                        const btn = form.querySelector('[type="submit"]');
                        if (btn) btn.disabled = false;
                    }
                });
        };

        form.addEventListener('submit', submitHandler);
        form._leadgenListener = submitHandler;

        if (currentConfig.debug) console.log('LeadGen initialized on form', config.formId);
    }

    function setTheme(theme) {
        applyTheme(theme);
    }

    function destroy() {
        if (currentForm && currentForm._leadgenListener) {
            currentForm.removeEventListener('submit', currentForm._leadgenListener);
            delete currentForm._leadgenListener;
            currentForm.classList.remove('leadgen-form');
            currentForm = null;
        }
        const style = document.getElementById('leadgen-theme');
        if (style) style.remove();
        currentConfig = null;
    }

    function validateFormPublic(formId) {
        const form = document.getElementById(formId);
        if (!form) return { valid: false, errors: ['Form not found'] };
        return validateForm(form);
    }

    function calculateNeeded(target, avg) {
        if (typeof target !== 'number' || typeof avg !== 'number' || avg <= 0) return 0;
        return Math.ceil(target / avg);
    }

    // Expose public API
    global.LeadGen = {
        init: init,
        setTheme: setTheme,
        getAnalytics: getAnalytics,
        destroy: destroy,
        validateForm: validateFormPublic,
        calculateNeeded: calculateNeeded,
        sendData: function(data, configOverride) {
            const cfg = currentConfig || configOverride;
            if (!cfg || !cfg.sheetUrl) return Promise.reject(new Error('No sheetUrl configured'));
            return sendData(data, cfg);
        }
    };
})(window);
