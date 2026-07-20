// ============================================================
// Admin Panel — NextCharge Blog
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM References =====
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    const dashboardView = document.getElementById('dashboardView');
    const editorView = document.getElementById('editorView');

    // Login
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginBtn');

    // Dashboard
    const postsTableBody = document.getElementById('postsTableBody');
    const statTotal = document.getElementById('statTotal');
    const statPublished = document.getElementById('statPublished');
    const statDrafts = document.getElementById('statDrafts');

    // Editor
    const postTitleInput = document.getElementById('postTitleInput');
    const postSlugInput = document.getElementById('postSlugInput');
    const excerptInput = document.getElementById('excerptInput');
    const coverUploadZone = document.getElementById('coverUploadZone');
    const coverImageUrlInput = document.getElementById('coverImageUrlInput');
    const coverPreview = document.getElementById('coverPreview');
    const categorySelect = document.getElementById('categorySelect');
    const tagsInputField = document.getElementById('tagsInputField');
    const tagsContainer = document.getElementById('tagsContainer');
    const statusToggle = document.getElementById('statusToggle');
    const statusLabel = document.getElementById('statusLabel');
    const seoTitleInput = document.getElementById('seoTitleInput');
    const seoDescInput = document.getElementById('seoDescInput');

    let quillEditor = null;
    let allPosts = [];
    let editingPostId = null;
    let currentCoverUrl = '';
    let currentTags = [];

    // ===== Toast Notifications =====

    function showToast(message, type = 'success') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(16px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ===== Auth State =====

    auth.onAuthStateChanged(user => {
        if (user) {
            loginScreen.style.display = 'none';
            adminPanel.style.display = 'block';
            document.getElementById('adminUserEmail').textContent = user.email;
            initQuill();
            fetchAllPosts();
        } else {
            loginScreen.style.display = 'flex';
            adminPanel.style.display = 'none';
        }
    });

    // ===== Login =====

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        loginBtn.querySelector('span').textContent = 'Signing in...';
        loginBtn.disabled = true;
        loginError.textContent = '';

        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            let message = 'Sign in failed. Please try again.';
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    message = 'Invalid email or password.';
                    break;
                case 'auth/too-many-requests':
                    message = 'Too many attempts. Please try again later.';
                    break;
                case 'auth/invalid-email':
                    message = 'Please enter a valid email address.';
                    break;
            }
            loginError.textContent = message;
        }

        loginBtn.querySelector('span').textContent = 'Sign In';
        loginBtn.disabled = false;
    });

    // ===== Logout =====

    document.getElementById('logoutBtn').addEventListener('click', () => {
        auth.signOut();
    });

    // ===== Initialize Quill Rich Text Editor =====

    function initQuill() {
        if (quillEditor) return;

        quillEditor = new Quill('#quillEditor', {
            theme: 'snow',
            placeholder: 'Write your post content here...',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['blockquote', 'code-block'],
                    ['link', 'image'],
                    [{ 'align': [] }],
                    ['clean']
                ]
            }
        });
    }

    // ===== Fetch All Posts =====

    async function fetchAllPosts() {
        try {
            const snapshot = await db.collection('posts')
                .orderBy('createdAt', 'desc')
                .get();

            allPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            renderDashboard();

        } catch (error) {
            console.error('Error fetching posts:', error);
            showToast('Error loading posts. Check Firebase config.', 'error');
        }
    }

    // ===== Render Dashboard =====

    function renderDashboard() {
        const published = allPosts.filter(p => p.status === 'published').length;
        const drafts = allPosts.filter(p => p.status === 'draft').length;

        statTotal.textContent = allPosts.length;
        statPublished.textContent = published;
        statDrafts.textContent = drafts;

        postsTableBody.innerHTML = '';

        if (allPosts.length === 0) {
            postsTableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 48px 20px;">
                        <div class="no-posts-icon">📝</div>
                        <p style="color: var(--text-muted);">No posts yet. Create your first blog post!</p>
                    </td>
                </tr>
            `;
            return;
        }

        allPosts.forEach(post => {
            const date = post.createdAt
                ? (post.createdAt.toDate ? post.createdAt.toDate() : new Date(post.createdAt))
                    .toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
                : '—';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <strong>${escapeHtml(post.title)}</strong>
                    ${post.category ? `<br><small>${escapeHtml(post.category)}</small>` : ''}
                </td>
                <td>
                    <span class="post-status-badge ${post.status || 'draft'}">${post.status || 'draft'}</span>
                </td>
                <td>${date}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-edit" data-id="${post.id}">Edit</button>
                        <button class="btn-delete" data-id="${post.id}">Delete</button>
                    </div>
                </td>
            `;
            postsTableBody.appendChild(tr);
        });

        // Bind actions
        postsTableBody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => openEditor(btn.dataset.id));
        });

        postsTableBody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deletePost(btn.dataset.id));
        });
    }

    // ===== Slug Generation =====

    function generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    postTitleInput.addEventListener('input', () => {
        if (!editingPostId) {
            postSlugInput.value = generateSlug(postTitleInput.value);
        }
    });

    // ===== Tags Management =====

    function renderTags() {
        // Remove existing pills
        tagsContainer.querySelectorAll('.tag-pill').forEach(p => p.remove());

        currentTags.forEach((tag, index) => {
            const pill = document.createElement('span');
            pill.className = 'tag-pill';
            pill.innerHTML = `${escapeHtml(tag)} <button data-index="${index}" type="button">&times;</button>`;
            tagsContainer.insertBefore(pill, tagsInputField);
        });

        // Bind remove buttons
        tagsContainer.querySelectorAll('.tag-pill button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentTags.splice(parseInt(btn.dataset.index), 1);
                renderTags();
            });
        });
    }

    tagsInputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagsInputField.value.trim().replace(/,/g, '');
            if (tag && !currentTags.includes(tag)) {
                currentTags.push(tag);
                renderTags();
            }
            tagsInputField.value = '';
        }
        // Backspace to remove last tag
        if (e.key === 'Backspace' && tagsInputField.value === '' && currentTags.length > 0) {
            currentTags.pop();
            renderTags();
        }
    });

    // Click on tags wrapper focuses the input
    tagsContainer.addEventListener('click', () => tagsInputField.focus());

    // ===== Cover Image URL listener =====

    coverImageUrlInput.addEventListener('input', () => {
        const url = coverImageUrlInput.value.trim();
        currentCoverUrl = url;
        if (url) {
            coverPreview.src = url;
            coverPreview.style.display = 'block';
            coverUploadZone.classList.add('has-image');
            document.getElementById('uploadText').style.display = 'none';
        } else {
            resetCoverUI();
        }
    });

    function resetCoverUI() {
        coverPreview.style.display = 'none';
        coverPreview.src = '';
        coverUploadZone.classList.remove('has-image');
        document.getElementById('uploadText').style.display = 'block';
    }

    // ===== Status Toggle =====

    statusToggle.addEventListener('change', () => {
        statusLabel.textContent = statusToggle.checked ? 'Published' : 'Draft';
    });

    // ===== SEO Character Counts =====

    seoTitleInput.addEventListener('input', () => {
        const len = seoTitleInput.value.length;
        const counter = document.getElementById('seoTitleCount');
        counter.textContent = `${len}/60`;
        counter.style.color = len > 60 ? '#ef4444' : '#64748B';
    });

    seoDescInput.addEventListener('input', () => {
        const len = seoDescInput.value.length;
        const counter = document.getElementById('seoDescCount');
        counter.textContent = `${len}/160`;
        counter.style.color = len > 160 ? '#ef4444' : '#64748B';
    });

    // ===== Open Editor =====

    function openEditor(postId = null) {
        editingPostId = postId;
        dashboardView.style.display = 'none';
        editorView.style.display = 'block';

        if (postId) {
            // Edit existing post
            const post = allPosts.find(p => p.id === postId);
            if (!post) return;

            document.getElementById('editorTitle').textContent = 'Edit Post';
            postTitleInput.value = post.title || '';
            postSlugInput.value = post.slug || '';
            excerptInput.value = post.excerpt || '';
            quillEditor.root.innerHTML = post.content || '';
            categorySelect.value = post.category || '';
            currentTags = [...(post.tags || [])];
            statusToggle.checked = post.status === 'published';
            statusLabel.textContent = post.status === 'published' ? 'Published' : 'Draft';
            seoTitleInput.value = post.seoTitle || '';
            seoDescInput.value = post.seoDescription || '';

            // Update char counts
            document.getElementById('seoTitleCount').textContent = `${(post.seoTitle || '').length}/60`;
            document.getElementById('seoDescCount').textContent = `${(post.seoDescription || '').length}/160`;

            coverImageUrlInput.value = post.coverImageUrl || '';
            if (post.coverImageUrl) {
                currentCoverUrl = post.coverImageUrl;
                coverPreview.src = currentCoverUrl;
                coverPreview.style.display = 'block';
                coverUploadZone.classList.add('has-image');
                document.getElementById('uploadText').style.display = 'none';
            } else {
                currentCoverUrl = '';
                resetCoverUI();
            }

            renderTags();
        } else {
            // New post
            document.getElementById('editorTitle').textContent = 'New Post';
            resetEditor();
        }

        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    function resetEditor() {
        postTitleInput.value = '';
        postSlugInput.value = '';
        excerptInput.value = '';
        if (quillEditor) quillEditor.root.innerHTML = '';
        categorySelect.value = '';
        currentTags = [];
        statusToggle.checked = false;
        statusLabel.textContent = 'Draft';
        seoTitleInput.value = '';
        seoDescInput.value = '';
        coverImageUrlInput.value = '';
        currentCoverUrl = '';
        resetCoverUI();
        renderTags();
        document.getElementById('seoTitleCount').textContent = '0/60';
        document.getElementById('seoDescCount').textContent = '0/160';
    }

    // ===== Save Post =====

    document.getElementById('savePostBtn').addEventListener('click', async () => {
        const title = postTitleInput.value.trim();
        if (!title) {
            showToast('Post title is required', 'error');
            postTitleInput.focus();
            return;
        }

        const saveBtn = document.getElementById('savePostBtn');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        const slug = postSlugInput.value.trim() || generateSlug(title);
        const content = quillEditor.root.innerHTML;
        const excerpt = excerptInput.value.trim();

        // Auto-generate excerpt from content if not provided
        const autoExcerpt = excerpt || content.replace(/<[^>]*>/g, '').substring(0, 160).trim();

        const postData = {
            title,
            slug,
            content,
            excerpt: autoExcerpt,
            coverImageUrl: currentCoverUrl,
            category: categorySelect.value,
            tags: currentTags,
            status: statusToggle.checked ? 'published' : 'draft',
            author: auth.currentUser.email,
            seoTitle: seoTitleInput.value.trim() || title,
            seoDescription: seoDescInput.value.trim() || autoExcerpt,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            if (editingPostId) {
                await db.collection('posts').doc(editingPostId).update(postData);
                showToast('Post updated successfully!');
            } else {
                postData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                const docRef = await db.collection('posts').add(postData);
                editingPostId = docRef.id;
                showToast('Post created successfully!');
            }

            await fetchAllPosts();
            showDashboard();

        } catch (error) {
            console.error('Save error:', error);
            showToast('Failed to save: ' + error.message, 'error');
        }

        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Post';
    });

    // ===== Delete Post =====

    async function deletePost(postId) {
        const post = allPosts.find(p => p.id === postId);
        const postTitle = post ? post.title : 'this post';

        if (!confirm(`Delete "${postTitle}"? This cannot be undone.`)) return;

        try {
            await db.collection('posts').doc(postId).delete();
            showToast('Post deleted');
            await fetchAllPosts();
        } catch (error) {
            console.error('Delete error:', error);
            showToast('Failed to delete post', 'error');
        }
    }

    // ===== Navigation =====

    function showDashboard() {
        dashboardView.style.display = 'block';
        editorView.style.display = 'none';
        editingPostId = null;
    }

    document.getElementById('newPostBtn').addEventListener('click', () => openEditor());
    document.getElementById('backToDashboard').addEventListener('click', showDashboard);

    // ===== Utility =====

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str || '';
        return div.innerHTML;
    }
});
