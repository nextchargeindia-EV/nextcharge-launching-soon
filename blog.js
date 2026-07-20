// ============================================================
// Blog Page — NextCharge
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // DOM References
    const blogListingView = document.getElementById('blogListingView');
    const postView = document.getElementById('postView');
    const blogGrid = document.getElementById('blogGrid');
    const searchInput = document.getElementById('blogSearchInput');
    const categoryTabsContainer = document.getElementById('categoryTabs');
    const loadingEl = document.getElementById('blogLoading');
    const readingProgressBar = document.getElementById('readingProgress');

    let allPosts = [];
    let currentCategory = 'all';
    let scrollHandler = null;

    // ===== Utilities =====

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
        div.textContent = str;
        return div.innerHTML;
    }

    // ===== Post Card =====

    function createPostCard(post) {
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
            <div class="post-card-body">
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

        const navigate = () => { window.location.hash = `post/${post.slug}`; };
        card.addEventListener('click', navigate);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') navigate();
        });

        return card;
    }

    // ===== Render Posts =====

    function renderPosts(posts) {
        blogGrid.innerHTML = '';

        if (posts.length === 0) {
            blogGrid.innerHTML = `
                <div class="blog-empty">
                    <div class="blog-empty-icon">📭</div>
                    <h3>No posts found</h3>
                    <p>Check back later for new content!</p>
                </div>
            `;
            return;
        }

        // Stagger animation
        posts.forEach((post, index) => {
            const card = createPostCard(post);
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`;
            blogGrid.appendChild(card);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            });
        });
    }

    // ===== Filtering =====

    function filterPosts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let filtered = allPosts;

        if (currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === currentCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(searchTerm) ||
                (p.excerpt && p.excerpt.toLowerCase().includes(searchTerm)) ||
                (p.category && p.category.toLowerCase().includes(searchTerm)) ||
                (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm)))
            );
        }

        renderPosts(filtered);
    }

    // ===== Category Tabs =====

    function buildCategoryTabs(posts) {
        const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];
        categoryTabsContainer.innerHTML = '';

        const allTab = createCategoryTab('All Posts', 'all');
        categoryTabsContainer.appendChild(allTab);

        categories.forEach(cat => {
            categoryTabsContainer.appendChild(createCategoryTab(cat, cat));
        });
    }

    function createCategoryTab(label, value) {
        const btn = document.createElement('button');
        btn.className = `category-tab${value === currentCategory ? ' active' : ''}`;
        btn.textContent = label;
        btn.addEventListener('click', () => {
            currentCategory = value;
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            filterPosts();
        });
        return btn;
    }

    // ===== Individual Post View =====

    function showPost(slug) {
        const post = allPosts.find(p => p.slug === slug);
        if (!post) {
            window.location.hash = '';
            return;
        }

        const readingTime = calculateReadingTime(post.content);

        // Switch views
        blogListingView.style.display = 'none';
        postView.style.display = 'block';

        // Hero image
        const heroEl = document.getElementById('postHeroImage');
        if (post.coverImageUrl) {
            heroEl.innerHTML = `<img src="${post.coverImageUrl}" alt="${escapeHtml(post.title)}">`;
            heroEl.style.display = 'block';
        } else {
            heroEl.innerHTML = '';
            heroEl.style.height = '80px';
            heroEl.style.background = 'transparent';
        }

        // Category
        const catEl = document.getElementById('postCategory');
        if (post.category) {
            catEl.textContent = post.category;
            catEl.style.display = 'inline-block';
        } else {
            catEl.style.display = 'none';
        }

        // Content
        document.getElementById('postTitle').textContent = post.title;
        document.getElementById('postDate').textContent = formatDate(post.createdAt);
        document.getElementById('postReadingTime').textContent = `${readingTime} min read`;
        document.getElementById('postAuthor').textContent = 'NextCharge';
        document.getElementById('postBody').innerHTML = post.content || '';

        // Tags
        const tagsEl = document.getElementById('postTags');
        if (post.tags && post.tags.length > 0) {
            tagsEl.innerHTML = post.tags.map(t => `<span class="post-tag">#${escapeHtml(t)}</span>`).join('');
            tagsEl.style.display = 'flex';
        } else {
            tagsEl.style.display = 'none';
        }

        // SEO
        document.title = `${post.seoTitle || post.title} — NextCharge Blog`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = post.seoDescription || post.excerpt || '';
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Reading progress
        if (scrollHandler) {
            window.removeEventListener('scroll', scrollHandler);
        }
        scrollHandler = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                const progress = Math.min((window.scrollY / scrollHeight) * 100, 100);
                readingProgressBar.style.width = progress + '%';
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    // ===== Show Listing =====

    function showListing() {
        blogListingView.style.display = 'block';
        postView.style.display = 'none';
        readingProgressBar.style.width = '0%';

        document.title = 'Blog — NextCharge | EV Charging Insights & Updates';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = 'Stay updated with the latest news, tips, and insights about EV charging in India from NextCharge.';
        }

        if (scrollHandler) {
            window.removeEventListener('scroll', scrollHandler);
            scrollHandler = null;
        }
    }

    // ===== Hash Routing =====

    function handleRoute() {
        const hash = window.location.hash.slice(1);
        if (hash.startsWith('post/')) {
            showPost(hash.replace('post/', ''));
        } else {
            showListing();
        }
    }

    window.addEventListener('hashchange', handleRoute);

    // ===== Search =====

    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(filterPosts, 200);
    });

    // ===== Fetch Posts from Firestore =====

    async function fetchPosts() {
        try {
            const snapshot = await db.collection('posts')
                .where('status', '==', 'published')
                .orderBy('createdAt', 'desc')
                .get();

            allPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            loadingEl.style.display = 'none';
            buildCategoryTabs(allPosts);

            // Only render listing if we're not on a post route
            const hash = window.location.hash.slice(1);
            if (hash.startsWith('post/')) {
                renderPosts(allPosts);
                showPost(hash.replace('post/', ''));
            } else {
                renderPosts(allPosts);
            }

        } catch (error) {
            console.error('Error fetching posts:', error);
            loadingEl.style.display = 'none';

            blogGrid.innerHTML = `
                <div class="blog-empty">
                    <div class="blog-empty-icon">⚙️</div>
                    <h3>Firebase Setup Required</h3>
                    <p>Configure your Firebase project in <code>firebase-config.js</code> to get started.
                    If you've already configured it, make sure the Firestore database is created and the composite index for 
                    <code>status + createdAt</code> exists.</p>
                </div>
            `;
        }
    }

    fetchPosts();

    // ===== Mobile Menu =====

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenuWrapper = document.getElementById('navMenuWrapper');
    const navLinksList = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn && navMenuWrapper) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenuWrapper.classList.toggle('active');
        });

        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenuWrapper.classList.remove('active');
            });
        });
    }
});
