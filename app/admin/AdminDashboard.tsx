'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import RichTextEditor from './RichTextEditor';

interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    cover_image_url?: string;
    category?: string;
    tags?: string[];
    status: string;
    author?: string;
    seo_title?: string;
    seo_description?: string;
    created_at: string;
    updated_at?: string;
}

function escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
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

export default function AdminDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
    const [editingPostId, setEditingPostId] = useState<string | null>(null);

    // Login fields
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Editor fields
    const [postTitle, setPostTitle] = useState('');
    const [postSlug, setPostSlug] = useState('');
    const [postExcerpt, setPostExcerpt] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postCategory, setPostCategory] = useState('');
    const [postTags, setPostTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [postStatus, setPostStatus] = useState(false);
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDesc, setSeoDesc] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-save states
    const [autoSaveStatus, setAutoSaveStatus] = useState<string | null>(null);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const isRestoringDraftRef = useRef(false);

    const getDraftKey = useCallback((id: string | null) => `nextcharge_draft_${id || 'new'}`, []);

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file', 'error');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image size must be under 5MB', 'error');
            return;
        }

        setUploadingImage(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(fileName, file, { cacheControl: '3600', upsert: true });

            if (uploadError) {
                console.error('Storage upload error:', uploadError);
                if (uploadError.message.includes('not found') || uploadError.message.includes('bucket')) {
                    showToast('Storage bucket "blog-images" not found. Run SQL schema in Supabase!', 'error');
                } else {
                    showToast('Upload failed: ' + uploadError.message, 'error');
                }
                setUploadingImage(false);
                return;
            }

            const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
            setCoverImageUrl(data.publicUrl);
            showToast('Image uploaded successfully!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Upload failed';
            showToast(msg, 'error');
        }
        setUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    // Auth state
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch posts when authenticated
    const fetchPosts = useCallback(async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
            showToast('Error loading posts.', 'error');
            return;
        }
        setAllPosts(data || []);
    }, []);

    useEffect(() => {
        if (user) fetchPosts();
    }, [user, fetchPosts]);

    // Auto restore draft on page load or refresh
    useEffect(() => {
        if (!user) return;
        const activeDraftKey = localStorage.getItem('nextcharge_active_draft_key');
        if (activeDraftKey) {
            const rawDraft = localStorage.getItem(activeDraftKey);
            if (rawDraft) {
                try {
                    const draft = JSON.parse(rawDraft);
                    if (draft && (draft.title || draft.content)) {
                        isRestoringDraftRef.current = true;
                        setEditingPostId(draft.editingPostId || null);
                        setPostTitle(draft.title || '');
                        setPostSlug(draft.slug || '');
                        setPostExcerpt(draft.excerpt || '');
                        setPostContent(draft.content || '');
                        setPostCategory(draft.category || '');
                        setPostTags(draft.tags || []);
                        setPostStatus(draft.status || false);
                        setCoverImageUrl(draft.coverImageUrl || '');
                        setSeoTitle(draft.seoTitle || '');
                        setSeoDesc(draft.seoDesc || '');
                        setView('editor');

                        const timeStr = draft.savedAt ? new Date(draft.savedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'recently';
                        setAutoSaveStatus(`Restored draft (${timeStr})`);
                        showToast('Auto-restored your unsaved blog draft!');

                        setTimeout(() => {
                            isRestoringDraftRef.current = false;
                        }, 300);
                    }
                } catch (e) {
                    console.error('Error parsing restored draft:', e);
                }
            }
        }
    }, [user]);

    // Auto-save draft to localStorage whenever fields change
    useEffect(() => {
        if (view !== 'editor' || isRestoringDraftRef.current) return;
        if (!postTitle.trim() && !postContent.trim() && !postExcerpt.trim()) return;

        setIsAutoSaving(true);
        const timer = setTimeout(() => {
            try {
                const draftData = {
                    editingPostId,
                    title: postTitle,
                    slug: postSlug,
                    excerpt: postExcerpt,
                    content: postContent,
                    category: postCategory,
                    tags: postTags,
                    status: postStatus,
                    coverImageUrl,
                    seoTitle,
                    seoDesc,
                    savedAt: new Date().toISOString(),
                };
                const key = getDraftKey(editingPostId);
                localStorage.setItem(key, JSON.stringify(draftData));
                localStorage.setItem('nextcharge_active_draft_key', key);

                const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                setAutoSaveStatus(`Auto-saved at ${timeStr}`);
            } catch (err) {
                console.error('Failed to auto-save draft:', err);
            } finally {
                setIsAutoSaving(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [view, editingPostId, postTitle, postSlug, postExcerpt, postContent, postCategory, postTags, postStatus, coverImageUrl, seoTitle, seoDesc, getDraftKey]);

    // Unsaved changes warning before tab close or refresh
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (view === 'editor' && (postTitle.trim() || postContent.trim())) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [view, postTitle, postContent]);

    // Login handler
    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');

        const { error } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password: loginPassword,
        });

        if (error) {
            setLoginError(error.message || 'Invalid email or password.');
        }
        setLoginLoading(false);
    }

    // Logout
    async function handleLogout() {
        await supabase.auth.signOut();
        setAllPosts([]);
    }

    // Open editor
    function openEditor(postId: string | null = null) {
        setEditingPostId(postId);
        setView('editor');

        if (postId) {
            const post = allPosts.find(p => p.id === postId);
            if (!post) return;
            setPostTitle(post.title || '');
            setPostSlug(post.slug || '');
            setPostExcerpt(post.excerpt || '');
            setPostContent(post.content || '');
            setPostCategory(post.category || '');
            setPostTags([...(post.tags || [])]);
            setPostStatus(post.status === 'published');
            setCoverImageUrl(post.cover_image_url || '');
            setSeoTitle(post.seo_title || '');
            setSeoDesc(post.seo_description || '');
        } else {
            resetEditor();
        }
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }

    function resetEditor() {
        setPostTitle('');
        setPostSlug('');
        setPostExcerpt('');
        setPostContent('');
        setPostCategory('');
        setPostTags([]);
        setPostStatus(false);
        setCoverImageUrl('');
        setSeoTitle('');
        setSeoDesc('');
        setTagInput('');
    }

    // Save post
    async function handleSave() {
        if (!postTitle.trim()) {
            showToast('Post title is required', 'error');
            return;
        }

        setSaving(true);
        const slug = postSlug.trim() || generateSlug(postTitle);
        const autoExcerpt = postExcerpt.trim() || postContent.replace(/<[^>]*>/g, '').substring(0, 160).trim();

        const postData = {
            title: postTitle.trim(),
            slug,
            content: postContent,
            excerpt: autoExcerpt,
            cover_image_url: coverImageUrl || null,
            category: postCategory || null,
            tags: postTags,
            status: postStatus ? 'published' : 'draft',
            author: user?.email || '',
            seo_title: seoTitle.trim() || postTitle.trim(),
            seo_description: seoDesc.trim() || autoExcerpt,
            updated_at: new Date().toISOString(),
        };

        try {
            if (editingPostId) {
                const { error } = await supabase
                    .from('posts')
                    .update(postData)
                    .eq('id', editingPostId);
                if (error) throw error;
                showToast('Post updated successfully!');
            } else {
                const { error } = await supabase
                    .from('posts')
                    .insert({ ...postData, created_at: new Date().toISOString() });
                if (error) throw error;
                showToast('Post created successfully!');
            }
            // Clear auto-saved local draft upon successful post save
            const key = getDraftKey(editingPostId);
            localStorage.removeItem(key);
            localStorage.removeItem('nextcharge_active_draft_key');
            setAutoSaveStatus(null);

            await fetchPosts();
            setView('dashboard');
            setEditingPostId(null);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : 'Unknown error';
            showToast('Failed to save: ' + errMsg, 'error');
        }
        setSaving(false);
    }

    // Delete post
    async function handleDelete(postId: string) {
        const post = allPosts.find(p => p.id === postId);
        if (!confirm(`Delete "${post?.title || 'this post'}"? This cannot be undone.`)) return;

        const { error } = await supabase.from('posts').delete().eq('id', postId);
        if (error) {
            showToast('Failed to delete post', 'error');
            return;
        }
        showToast('Post deleted');
        await fetchPosts();
    }

    // Tag management
    function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagInput.trim().replace(/,/g, '');
            if (tag && !postTags.includes(tag)) {
                setPostTags([...postTags, tag]);
            }
            setTagInput('');
        }
        if (e.key === 'Backspace' && tagInput === '' && postTags.length > 0) {
            setPostTags(postTags.slice(0, -1));
        }
    }

    if (loading) return null;

    // Stats
    const published = allPosts.filter(p => p.status === 'published').length;
    const drafts = allPosts.filter(p => p.status === 'draft').length;

    // ===== Login Screen =====
    if (!user) {
        return (
            <div className="admin-login">
                <div className="login-card">
                    <Image src="/nexq-logo.png" alt="NEXQ" className="login-logo" width={120} height={36} />
                    <h2>Blog Admin</h2>
                    <p className="login-subtitle">Sign in to manage your blog posts</p>

                    <form onSubmit={handleLogin}>
                        <input type="email" className="login-field" placeholder="Email address" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} autoComplete="email" />
                        <input type="password" className="login-field" placeholder="Password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} autoComplete="current-password" />
                        {loginError && <p className="login-error">{loginError}</p>}
                        <button type="submit" className="btn-primary full-width" disabled={loginLoading}>
                            <span>{loginLoading ? 'Signing in...' : 'Sign In'}</span>
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ===== Admin Panel =====
    return (
        <div className="admin-panel" style={{ display: 'block' }}>
            {/* Top Bar */}
            <div className="admin-topbar">
                <div className="admin-topbar-left">
                    <Link href="/" className="admin-logo-link">
                        <Image src="/nexq-logo.png" alt="NEXQ" width={80} height={22} />
                    </Link>
                    <h1>Blog Admin</h1>
                </div>
                <div className="admin-topbar-right">
                    <span className="admin-user">{user.email}</span>
                    <Link href="/blog" className="btn-view-blog" target="_blank">View Blog</Link>
                    <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="admin-main">
                {view === 'dashboard' ? (
                    <>
                        {/* Stats */}
                        <div className="stats-row">
                            <div className="stat-card"><div className="stat-number">{allPosts.length}</div><div className="stat-label">Total Posts</div></div>
                            <div className="stat-card"><div className="stat-number stat-published">{published}</div><div className="stat-label">Published</div></div>
                            <div className="stat-card"><div className="stat-number stat-drafts">{drafts}</div><div className="stat-label">Drafts</div></div>
                        </div>

                        {/* Dashboard Header */}
                        <div className="dashboard-header">
                            <h2>All Posts</h2>
                            <button className="btn-new-post" onClick={() => openEditor()}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
                                <span>New Post</span>
                            </button>
                        </div>

                        {/* Posts Table */}
                        <div className="posts-table-container">
                            <table className="posts-table">
                                <thead>
                                    <tr><th>Title</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {allPosts.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '48px 20px' }}>
                                                <div className="no-posts-icon">📝</div>
                                                <p style={{ color: 'var(--text-muted)' }}>No posts yet. Create your first blog post!</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        allPosts.map(post => (
                                            <tr key={post.id}>
                                                <td>
                                                    <strong>{post.title}</strong>
                                                    {post.category && <><br /><small>{post.category}</small></>}
                                                </td>
                                                <td><span className={`post-status-badge ${post.status || 'draft'}`}>{post.status || 'draft'}</span></td>
                                                <td>{new Date(post.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="btn-edit" onClick={() => openEditor(post.id)}>Edit</button>
                                                        <button className="btn-delete" onClick={() => handleDelete(post.id)}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    /* ===== Editor View ===== */
                    <div className="editor-view" style={{ display: 'block' }}>
                        <div className="editor-header">
                            <button className="btn-back" onClick={() => { setView('dashboard'); setEditingPostId(null); }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path></svg>
                                <span>{editingPostId ? 'Edit Post' : 'New Post'}</span>
                            </button>
                            <div className="editor-actions">
                                {autoSaveStatus && (
                                    <div className={`auto-save-indicator ${isAutoSaving ? 'saving' : ''}`}>
                                        <span className="auto-save-dot"></span>
                                        <span>{isAutoSaving ? 'Saving draft...' : autoSaveStatus}</span>
                                    </div>
                                )}
                                <button type="button" className="btn-preview" onClick={() => setShowPreviewModal(true)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    <span>Preview Post</span>
                                </button>
                                <button className="btn-save" onClick={handleSave} disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Post'}
                                </button>
                            </div>
                        </div>

                        <div className="editor-layout">
                            <div className="editor-main">
                                <input type="text" className="editor-field title-field" placeholder="Post Title" value={postTitle}
                                    onChange={e => {
                                        setPostTitle(e.target.value);
                                        if (!editingPostId) setPostSlug(generateSlug(e.target.value));
                                    }}
                                />
                                <div className="slug-row">
                                    <span className="slug-prefix">/blog/</span>
                                    <input type="text" className="editor-field slug-input" placeholder="post-url-slug" value={postSlug} onChange={e => setPostSlug(e.target.value)} />
                                </div>
                                <textarea className="editor-field excerpt-field" placeholder="Post excerpt — a brief summary shown on the blog listing..." rows={2} value={postExcerpt} onChange={e => setPostExcerpt(e.target.value)} />
                                <RichTextEditor
                                    value={postContent}
                                    onChange={setPostContent}
                                    placeholder="Write your blog post here with full rich text formatting..."
                                />
                            </div>

                            <div className="editor-sidebar">
                                 {/* Cover Image */}
                                <div className="sidebar-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                        <h3 style={{ margin: 0 }}>Cover Image</h3>
                                        <button
                                            type="button"
                                            onClick={() => setShowUrlInput(!showUrlInput)}
                                            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            {showUrlInput ? 'Upload file' : 'Paste URL'}
                                        </button>
                                    </div>

                                    {showUrlInput ? (
                                        <input
                                            type="url"
                                            className="seo-field"
                                            placeholder="Paste image URL..."
                                            value={coverImageUrl}
                                            onChange={e => setCoverImageUrl(e.target.value)}
                                            style={{ marginBottom: '12px' }}
                                        />
                                    ) : null}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />

                                    <div
                                        className={`cover-upload-zone${coverImageUrl ? ' has-image' : ''}`}
                                        onClick={() => !coverImageUrl && !uploadingImage && fileInputRef.current?.click()}
                                        style={{
                                            cursor: coverImageUrl ? 'default' : 'pointer',
                                            position: 'relative',
                                            minHeight: '140px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {uploadingImage ? (
                                            <div style={{ padding: '24px', textAlign: 'center' }}>
                                                <div className="loading-spinner" style={{ width: '28px', height: '28px', marginBottom: '8px' }}></div>
                                                <p className="upload-hint">Uploading image to Supabase...</p>
                                            </div>
                                        ) : coverImageUrl ? (
                                            <div style={{ position: 'relative', width: '100%' }}>
                                                <img src={coverImageUrl} alt="Cover preview" style={{ maxHeight: '160px', width: '100%', objectFit: 'cover', borderRadius: '10px', display: 'block' }} />
                                                <button
                                                    type="button"
                                                    className="btn-remove-cover"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCoverImageUrl('');
                                                    }}
                                                    title="Remove image"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                                <div className="upload-icon">📁</div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                                                    Click to upload image
                                                </p>
                                                <p className="upload-hint">PNG, JPG, WebP up to 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="sidebar-card">
                                    <h3>Category</h3>
                                    <select className="sidebar-select" value={postCategory} onChange={e => setPostCategory(e.target.value)}>
                                        <option value="">Select category</option>
                                        <option value="EV News">EV News</option>
                                        <option value="Charging Tips">Charging Tips</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Industry">Industry</option>
                                        <option value="Company Updates">Company Updates</option>
                                        <option value="Guides">Guides</option>
                                    </select>
                                </div>

                                {/* Tags */}
                                <div className="sidebar-card">
                                    <h3>Tags</h3>
                                    <div className="tags-input-wrapper" onClick={() => (document.getElementById('tagInputField') as HTMLInputElement)?.focus()}>
                                        {postTags.map((tag, i) => (
                                            <span key={i} className="tag-pill">
                                                {escapeHtml(tag)}
                                                <button type="button" onClick={() => setPostTags(postTags.filter((_, idx) => idx !== i))}>&times;</button>
                                            </span>
                                        ))}
                                        <input type="text" id="tagInputField" className="tags-input" placeholder="Type and press Enter" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} />
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="sidebar-card">
                                    <h3>Publish</h3>
                                    <div className="status-toggle">
                                        <span className="status-label">{postStatus ? 'Published' : 'Draft'}</span>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked={postStatus} onChange={e => setPostStatus(e.target.checked)} />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                {/* SEO */}
                                <div className="sidebar-card">
                                    <h3>SEO</h3>
                                    <input type="text" className="seo-field" placeholder="SEO Title (60 chars max)" maxLength={70} value={seoTitle} onChange={e => setSeoTitle(e.target.value)} />
                                    <div className="char-count" style={{ color: seoTitle.length > 60 ? '#ef4444' : '#64748B' }}>{seoTitle.length}/60</div>
                                    <textarea className="seo-field" placeholder="Meta Description (160 chars max)" maxLength={200} value={seoDesc} onChange={e => setSeoDesc(e.target.value)} />
                                    <div className="char-count" style={{ color: seoDesc.length > 160 ? '#ef4444' : '#64748B' }}>{seoDesc.length}/160</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Live Blog Post Preview Modal */}
            {showPreviewModal && (
                <div className="preview-modal-overlay" onClick={() => setShowPreviewModal(false)}>
                    <div className="preview-modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="preview-modal-bar">
                            <div className="preview-badge">
                                <span className="preview-pulse"></span>
                                <span>Live Post Preview</span>
                            </div>
                            <button
                                type="button"
                                className="btn-close-preview"
                                onClick={() => setShowPreviewModal(false)}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                <span>Close Preview</span>
                            </button>
                        </div>
                        <div className="preview-modal-body">
                            {coverImageUrl && (
                                <div className="preview-hero-wrapper">
                                    <img src={coverImageUrl} alt={postTitle || 'Cover Image'} />
                                </div>
                            )}
                            <div className="post-header" style={{ marginTop: 0, padding: 0 }}>
                                {postCategory && (
                                    <span className="post-category-badge" style={{ marginBottom: '16px', display: 'inline-block' }}>
                                        {postCategory}
                                    </span>
                                )}
                                <h1 className="post-title" style={{ color: 'var(--text-main)' }}>
                                    {postTitle || 'Untitled Post'}
                                </h1>
                                <div className="post-meta" style={{ marginBottom: '32px' }}>
                                    <span className="post-meta-item">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
                                        <span>{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </span>
                                    <span className="post-meta-item">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        <span>{Math.max(1, Math.ceil((postContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length) / 200))} min read</span>
                                    </span>
                                    <span className="post-meta-item">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        <span>NextCharge</span>
                                    </span>
                                </div>
                            </div>
                            <div
                                className="post-content"
                                style={{ padding: 0, maxWidth: '100%' }}
                                dangerouslySetInnerHTML={{ __html: postContent || '<p style="color: #64748B;">No content written yet.</p>' }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
