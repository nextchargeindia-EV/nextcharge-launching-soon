document.addEventListener('DOMContentLoaded', () => {
    // Helper function for simulated form submission
    function handleFormSubmit(formId, messageId, successMessage) {
        const form = document.getElementById(formId);
        const messageEl = document.getElementById(messageId);

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                if (!submitBtn) return;
                
                const originalText = submitBtn.innerHTML;
                const formAction = form.getAttribute('action');
                
                // Simulate loading state
                submitBtn.innerHTML = '<span>Submitting...</span>';
                submitBtn.style.opacity = '0.8';
                submitBtn.disabled = true;

                // Function to handle the success/reset flow
                const handleCompletion = (msg, type = 'success') => {
                    messageEl.textContent = msg;
                    messageEl.className = `form-message ${type}`;
                    if (type === 'success') form.reset();
                    
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;

                    // Clear message after 5 seconds
                    setTimeout(() => {
                        messageEl.textContent = '';
                        messageEl.className = 'form-message';
                    }, 5000);
                };

                // If formspree action URL is set by the user, perform actual fetch request
                if (formAction && !formAction.includes("YOUR_FORM_ID") && formAction !== "#") {
                    fetch(formAction, {
                        method: form.getAttribute('method') || 'POST',
                        body: new FormData(form),
                        headers: {
                            'Accept': 'application/json'
                        }
                    }).then(response => {
                        if (response.ok) {
                            handleCompletion(successMessage, 'success');
                        } else {
                            response.json().then(data => {
                                if (Object.hasOwn(data, 'errors')) {
                                    handleCompletion(data["errors"].map(error => error["message"]).join(", "), 'error');
                                } else {
                                    handleCompletion("Oops! There was a problem submitting your form", 'error');
                                }
                            });
                        }
                    }).catch(error => {
                        handleCompletion("Oops! There was a problem submitting your form", 'error');
                    });
                } else {
                    // Fallback simulate API call delay if Formspree ID is not yet provided
                    setTimeout(() => handleCompletion(successMessage, 'success'), 1500);
                }
            });
        }
    }

    // Waitlist Form
    handleFormSubmit('waitlistForm', 'formMessage', "You're on the list! We'll notify you when we launch.");
    
    // Feedback Form
    handleFormSubmit('feedbackForm', 'feedbackMessage', "Thank you for your feedback! It helps us build a better network.");
    
    // Partner Form
    handleFormSubmit('partnerForm', 'partnerMessage', "Thanks for your interest! Our team will reach out to you shortly.");
});
