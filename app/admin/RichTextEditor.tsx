'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Start writing your post...' }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [activeStyles, setActiveStyles] = useState<{ [key: string]: boolean }>({});
    const [selectedFont, setSelectedFont] = useState('Inter, sans-serif');
    const [selectedFontSize, setSelectedFontSize] = useState('3'); // 3 is 16px equivalent in execCommand
    const [selectedBlock, setSelectedBlock] = useState('p');
    const isUpdatingRef = useRef(false);

    // Sync external value to contentEditable div only when not actively editing locally
    useEffect(() => {
        if (editorRef.current && !isUpdatingRef.current && !isHtmlMode) {
            if (editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value || '';
            }
        }
    }, [value, isHtmlMode]);

    // Update active styles on selection change
    const updateActiveStyles = useCallback(() => {
        if (!editorRef.current || isHtmlMode) return;
        try {
            setActiveStyles({
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                strikeThrough: document.queryCommandState('strikeThrough'),
                insertUnorderedList: document.queryCommandState('insertUnorderedList'),
                insertOrderedList: document.queryCommandState('insertOrderedList'),
                justifyLeft: document.queryCommandState('justifyLeft'),
                justifyCenter: document.queryCommandState('justifyCenter'),
                justifyRight: document.queryCommandState('justifyRight'),
            });
        } catch {
            // Ignore if selection is outside
        }
    }, [isHtmlMode]);

    const handleInput = () => {
        if (!editorRef.current) return;
        isUpdatingRef.current = true;
        const html = editorRef.current.innerHTML;
        onChange(html);
        updateActiveStyles();
        setTimeout(() => {
            isUpdatingRef.current = false;
        }, 50);
    };

    const execCmd = (command: string, value: string | undefined = undefined) => {
        if (isHtmlMode) return;
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
            handleInput();
        }
    };

    // Format Block (H1, H2, H3, H4, P, Blockquote, Pre)
    const handleBlockChange = (tag: string) => {
        setSelectedBlock(tag);
        if (tag === 'blockquote' || tag === 'pre') {
            execCmd('formatBlock', `<${tag}>`);
        } else {
            execCmd('formatBlock', tag.toUpperCase());
        }
    };

    // Font Family Change
    const handleFontChange = (font: string) => {
        setSelectedFont(font);
        execCmd('fontName', font);
    };

    // Font Size Change (1: 10px, 2: 13px, 3: 16px, 4: 18px, 5: 24px, 6: 32px)
    const handleFontSizeChange = (size: string) => {
        setSelectedFontSize(size);
        execCmd('fontSize', size);
    };

    // Text Case Transformations (UPPERCASE, lowercase, Title Case)
    const transformSelectedText = (caseType: 'upper' | 'lower' | 'title') => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
            // If no selection, transform entire content in editor
            if (editorRef.current) {
                let text = editorRef.current.innerText;
                if (caseType === 'upper') text = text.toUpperCase();
                else if (caseType === 'lower') text = text.toLowerCase();
                else if (caseType === 'title') {
                    text = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                }
                editorRef.current.innerText = text;
                handleInput();
            }
            return;
        }

        const selectedText = selection.toString();
        let transformed = selectedText;
        if (caseType === 'upper') transformed = selectedText.toUpperCase();
        else if (caseType === 'lower') transformed = selectedText.toLowerCase();
        else if (caseType === 'title') {
            transformed = selectedText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        }

        execCmd('insertText', transformed);
    };

    // Insert Link
    const handleInsertLink = () => {
        const url = prompt('Enter URL link:', 'https://');
        if (url) {
            execCmd('createLink', url);
        }
    };

    // Insert Image URL
    const handleInsertImage = () => {
        const url = prompt('Enter Image URL:', 'https://');
        if (url) {
            execCmd('insertImage', url);
        }
    };

    return (
        <div className="rich-editor-wrapper">
            {/* Toolbar Header */}
            <div className="rich-editor-toolbar">
                {/* Mode Switcher */}
                <div className="toolbar-group mode-switcher">
                    <button
                        type="button"
                        className={`toolbar-btn ${!isHtmlMode ? 'active' : ''}`}
                        onClick={() => setIsHtmlMode(false)}
                        title="Visual WYSIWYG Editor"
                    >
                        🎨 Visual
                    </button>
                    <button
                        type="button"
                        className={`toolbar-btn ${isHtmlMode ? 'active' : ''}`}
                        onClick={() => setIsHtmlMode(true)}
                        title="HTML Source Code Editor"
                    >
                        &lt;/&gt; HTML Source
                    </button>
                </div>

                {!isHtmlMode && (
                    <>
                        <div className="toolbar-divider"></div>

                        {/* Undo / Redo */}
                        <div className="toolbar-group">
                            <button type="button" className="toolbar-btn" onClick={() => execCmd('undo')} title="Undo (Ctrl+Z)">↩</button>
                            <button type="button" className="toolbar-btn" onClick={() => execCmd('redo')} title="Redo (Ctrl+Y)">↪</button>
                        </div>

                        <div className="toolbar-divider"></div>

                        {/* Block Type (H1, H2, H3, H4, Paragraph, Quote) */}
                        <div className="toolbar-group">
                            <select
                                className="toolbar-select block-select"
                                value={selectedBlock}
                                onChange={(e) => handleBlockChange(e.target.value)}
                                title="Text Block Style"
                            >
                                <option value="p">Paragraph</option>
                                <option value="h1">Heading 1 (H1)</option>
                                <option value="h2">Heading 2 (H2)</option>
                                <option value="h3">Heading 3 (H3)</option>
                                <option value="h4">Heading 4 (H4)</option>
                                <option value="blockquote">Quote Block</option>
                                <option value="pre">Code Block</option>
                            </select>
                        </div>

                        {/* Font Selection */}
                        <div className="toolbar-group">
                            <select
                                className="toolbar-select font-select"
                                value={selectedFont}
                                onChange={(e) => handleFontChange(e.target.value)}
                                title="Font Family"
                            >
                                <option value="Inter, sans-serif">Inter (Default)</option>
                                <option value="Outfit, sans-serif">Outfit (Brand)</option>
                                <option value="Roboto, sans-serif">Roboto</option>
                                <option value="Georgia, serif">Georgia (Serif)</option>
                                <option value="Courier New, monospace">Monospace</option>
                            </select>

                            {/* Font Size */}
                            <select
                                className="toolbar-select size-select"
                                value={selectedFontSize}
                                onChange={(e) => handleFontSizeChange(e.target.value)}
                                title="Font Size"
                            >
                                <option value="2">Small (13px)</option>
                                <option value="3">Normal (16px)</option>
                                <option value="4">Medium (18px)</option>
                                <option value="5">Large (24px)</option>
                                <option value="6">Huge (32px)</option>
                            </select>
                        </div>

                        <div className="toolbar-divider"></div>

                        {/* Formatting Buttons (Bold, Italic, Underline, Strikethrough) */}
                        <div className="toolbar-group">
                            <button
                                type="button"
                                className={`toolbar-btn ${activeStyles.bold ? 'active' : ''}`}
                                onClick={() => execCmd('bold')}
                                title="Bold (Ctrl+B)"
                            >
                                <strong>B</strong>
                            </button>
                            <button
                                type="button"
                                className={`toolbar-btn ${activeStyles.italic ? 'active' : ''}`}
                                onClick={() => execCmd('italic')}
                                title="Italic (Ctrl+I)"
                            >
                                <em>I</em>
                            </button>
                            <button
                                type="button"
                                className={`toolbar-btn ${activeStyles.underline ? 'active' : ''}`}
                                onClick={() => execCmd('underline')}
                                title="Underline (Ctrl+U)"
                            >
                                <u>U</u>
                            </button>
                            <button
                                type="button"
                                className={`toolbar-btn ${activeStyles.strikeThrough ? 'active' : ''}`}
                                onClick={() => execCmd('strikeThrough')}
                                title="Strikethrough"
                            >
                                <s>S</s>
                            </button>
                        </div>

                        <div className="toolbar-divider"></div>

                        {/* Text Case Transformations (Uppercase, Lowercase, Titlecase) */}
                        <div className="toolbar-group text-case-group">
                            <span className="toolbar-label">Case:</span>
                            <button type="button" className="toolbar-btn text-case-btn" onClick={() => transformSelectedText('upper')} title="Convert Selection to UPPERCASE">AA</button>
                            <button type="button" className="toolbar-btn text-case-btn" onClick={() => transformSelectedText('lower')} title="Convert Selection to lowercase">aa</button>
                            <button type="button" className="toolbar-btn text-case-btn" onClick={() => transformSelectedText('title')} title="Convert Selection to Title Case">Aa</button>
                        </div>

                        <div className="toolbar-divider"></div>

                        {/* Text Alignment */}
                        <div className="toolbar-group">
                            <button
                                type="button"
                                className={`toolbar-btn ${activeStyles.justifyLeft ? 'active' : ''}`}
                                onClick={() => execCmd('justifyLeft')}
                                title="Align Left"
                            >
                                ≡
                            </button>
                            <button
                                type="button"
                                className={`toolbar-btn ${activeStyles.justifyCenter ? 'active' : ''}`}
                                onClick={() => execCmd('justifyCenter')}
                                title="Align Center"
                            >
                                equiv
                            </button>
                            <button
                                type="button"
                                className={`toolbar-btn ${activeStyles.justifyRight ? 'active' : ''}`}
                                onClick={() => execCmd('justifyRight')}
                                title="Align Right"
                            >
                                ≡
                            </button>
                        </div>

                        <div className="toolbar-divider"></div>

                        {/* Lists */}
                        <div className="toolbar-group">
                            <button
                                type="button"
                                className={`toolbar-btn ${activeStyles.insertUnorderedList ? 'active' : ''}`}
                                onClick={() => execCmd('insertUnorderedList')}
                                title="Bulleted List"
                            >
                                • Bullet List
                            </button>
                            <button
                                type="button"
                                className={`toolbar-btn ${activeStyles.insertOrderedList ? 'active' : ''}`}
                                onClick={() => execCmd('insertOrderedList')}
                                title="Numbered List"
                            >
                                1. Number List
                            </button>
                        </div>

                        <div className="toolbar-divider"></div>

                        {/* Links & Media & Extras */}
                        <div className="toolbar-group">
                            <button type="button" className="toolbar-btn" onClick={handleInsertLink} title="Insert Link">🔗 Link</button>
                            <button type="button" className="toolbar-btn" onClick={handleInsertImage} title="Insert Image">🖼️ Image</button>
                            <button type="button" className="toolbar-btn" onClick={() => execCmd('insertHorizontalRule')} title="Insert Horizontal Divider">— Line</button>
                            <button type="button" className="toolbar-btn btn-clear-format" onClick={() => execCmd('removeFormat')} title="Clear Formatting">🧹 Clear</button>
                        </div>
                    </>
                )}
            </div>

            {/* Editor Body */}
            {isHtmlMode ? (
                <textarea
                    className="rich-editor-html-textarea"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="<p>Write or paste your raw HTML content here...</p>"
                    rows={18}
                />
            ) : (
                <div
                    ref={editorRef}
                    className="rich-editor-content"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onKeyUp={updateActiveStyles}
                    onMouseUp={updateActiveStyles}
                    data-placeholder={placeholder}
                />
            )}
        </div>
    );
}
