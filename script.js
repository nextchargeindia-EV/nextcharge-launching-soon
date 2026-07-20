document.addEventListener('DOMContentLoaded', () => {
    // Helper function for simulated form submission
    function handleFormSubmit(formId, messageId, successMessage) {
        const form = document.getElementById(formId);
        const messageEl = document.getElementById(messageId);

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }
                
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

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenuWrapper = document.getElementById('navMenuWrapper');
    const navLinksList = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn && navMenuWrapper) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenuWrapper.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenuWrapper.classList.remove('active');
            });
        });
    }

    // ===== Home Page Blog Section =====
    const homeBlogGrid = document.getElementById('homeBlogGrid');
    if (homeBlogGrid && typeof db !== 'undefined') {
        db.collection('posts')
            .where('status', '==', 'published')
            .orderBy('createdAt', 'desc')
            .limit(3)
            .get()
            .then(snapshot => {
                homeBlogGrid.innerHTML = '';
                if (snapshot.empty) {
                    homeBlogGrid.innerHTML = `
                        <div class="blog-empty" style="grid-column: 1 / -1; text-align: center; padding: 40px 0;">
                            <div class="blog-empty-icon" style="font-size: 2.5rem; margin-bottom: 12px; opacity: 0.4;">📭</div>
                            <h3>No articles published yet</h3>
                            <p style="color: var(--text-muted); font-size: 0.9375rem; margin-top: 4px;">Check back soon for latest insights!</p>
                        </div>
                    `;
                    return;
                }
                
                snapshot.forEach(doc => {
                    const post = { id: doc.id, ...doc.data() };
                    const card = createHomePostCard(post);
                    homeBlogGrid.appendChild(card);
                });
            })
            .catch(error => {
                console.error("Error fetching home blog posts:", error);
                homeBlogGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px 0;">
                        <p>Unable to load latest articles at this moment.</p>
                    </div>
                `;
            });
    }

    function calculateReadingTime(html) {
        const text = (html || '').replace(/<[^>]*>/g, '');
        const words = text.split(/\s+/).filter(w => w.length > 0).length;
        return Math.max(1, Math.ceil(words / 200));
    }

    function formatDate(timestamp) {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str || '';
        return div.innerHTML;
    }

    function createHomePostCard(post) {
        const readingTime = calculateReadingTime(post.content);
        const card = document.createElement('article');
        card.className = 'post-card';
        card.setAttribute('role', 'link');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Read: ${post.title}`);
        
        const imageContent = post.coverImageUrl
            ? `<img src="${post.coverImageUrl}" alt="${escapeHtml(post.title)}" loading="lazy">`
            : `<div class="post-card-placeholder">⚡</div>`;

        const categoryBadge = post.category
            ? `<span class="post-card-category">${escapeHtml(post.category)}</span>`
            : '';

        card.innerHTML = `
            <div class="post-card-image">
                ${imageContent}
                ${categoryBadge}
            </div>
            <div class="post-card-body" style="text-align: left;">
                <h3 class="post-card-title">${escapeHtml(post.title)}</h3>
                <p class="post-card-excerpt">${escapeHtml(post.excerpt || '')}</p>
                <div class="post-card-meta">
                    <span class="post-card-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
                        ${formatDate(post.createdAt)}
                    </span>
                    <span class="post-card-reading-time">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        ${readingTime} min read
                    </span>
                </div>
            </div>
        `;

        const navigate = () => {
            window.location.href = `blog.html#post/${post.slug}`;
        };

        card.addEventListener('click', navigate);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') navigate();
        });

        return card;
    }
});
