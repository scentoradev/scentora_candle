'use client';

import { useEffect, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  FiAlignCenter,
  FiAlignJustify,
  FiAlignLeft,
  FiAlignRight,
  FiBold,
  FiCornerDownLeft,
  FiCornerDownRight,
  FiItalic,
  FiLink,
  FiList,
  FiMinus,
  FiRefreshCw,
  FiRotateCcw,
  FiRotateCw,
  FiSlash,
  FiType,
  FiUnderline,
  FiX,
} from 'react-icons/fi';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
};

type ToolItem = {
  label: string;
  command: string;
  icon: IconType;
  value?: string;
};

const TOOL_GROUPS: ToolItem[][] = [
  [
    { label: 'Undo', command: 'undo', icon: FiRotateCcw },
    { label: 'Redo', command: 'redo', icon: FiRotateCw },
  ],
  [
    { label: 'Bold', command: 'bold', icon: FiBold },
    { label: 'Italic', command: 'italic', icon: FiItalic },
    { label: 'Underline', command: 'underline', icon: FiUnderline },
    { label: 'Strike', command: 'strikeThrough', icon: FiSlash },
    { label: 'Subscript', command: 'subscript', icon: FiCornerDownLeft },
    { label: 'Superscript', command: 'superscript', icon: FiCornerDownRight },
    { label: 'Clear format', command: 'removeFormat', icon: FiRefreshCw },
  ],
  [
    { label: 'Heading 1', command: 'formatBlock', value: 'H1', icon: FiType },
    { label: 'Heading 2', command: 'formatBlock', value: 'H2', icon: FiType },
    { label: 'Paragraph', command: 'formatBlock', value: 'P', icon: FiMinus },
    { label: 'Quote', command: 'formatBlock', value: 'BLOCKQUOTE', icon: FiAlignJustify },
  ],
  [
    { label: 'Bullet list', command: 'insertUnorderedList', icon: FiList },
    { label: 'Numbered list', command: 'insertOrderedList', icon: FiList },
    { label: 'Indent', command: 'indent', icon: FiCornerDownRight },
    { label: 'Outdent', command: 'outdent', icon: FiCornerDownLeft },
  ],
  [
    { label: 'Align left', command: 'justifyLeft', icon: FiAlignLeft },
    { label: 'Align center', command: 'justifyCenter', icon: FiAlignCenter },
    { label: 'Align right', command: 'justifyRight', icon: FiAlignRight },
    { label: 'Justify', command: 'justifyFull', icon: FiAlignJustify },
  ],
  [{ label: 'Remove link', command: 'unlink', icon: FiX }],
];

const headingBadge = (value?: string) => {
  if (value === 'H1') return 'H1';
  if (value === 'H2') return 'H2';
  if (value === 'P') return 'P';
  if (value === 'BLOCKQUOTE') return '"';
  return null;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung mô tả...',
  minHeight = 220,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [isLinkPanelOpen, setIsLinkPanelOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    savedRangeRef.current = selection.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !savedRangeRef.current) return;
    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);
  };

  const syncEditor = () => {
    const el = editorRef.current;
    if (!el) return;
    onChange(el.innerHTML);
  };

  const runCommand = (command: string, commandValue?: string) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    restoreSelection();
    const beforeHtml = el.innerHTML;
    document.execCommand(command, false, commandValue);
    const afterHtml = el.innerHTML;

    if (
      (command === 'insertUnorderedList' || command === 'insertOrderedList') &&
      beforeHtml === afterHtml
    ) {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim() || 'Mục mới';
      const listTag = command === 'insertOrderedList' ? 'ol' : 'ul';
      const itemHtml = selectedText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `<li>${line}</li>`)
        .join('');
      document.execCommand('insertHTML', false, `<${listTag}>${itemHtml || '<li>Mục mới</li>'}</${listTag}>`);
    }

    if (command === 'formatBlock') {
      document.execCommand('styleWithCSS', false, 'true');
    }
    saveSelection();
    syncEditor();
  };

  const applyLink = () => {
    const el = editorRef.current;
    if (!el) return;
    const normalized = linkUrl.trim();
    if (!normalized) return;
    el.focus();
    restoreSelection();
    document.execCommand('createLink', false, normalized);
    setIsLinkPanelOpen(false);
    saveSelection();
    syncEditor();
  };

  return (
    <div className="rounded-xl border border-[#d8cdb9] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e9dfcf] bg-[#f8f4ec] p-2">
        {TOOL_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className="flex items-center gap-1 rounded-lg border border-[#e4d8c6] bg-white/70 px-1.5 py-1">
            {group.map((tool) => {
              const Icon = tool.icon;
              const badge = headingBadge(tool.value);
              return (
                <button
                  key={`${tool.command}-${tool.label}-${tool.value ?? ''}`}
                  type="button"
                  title={tool.label}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => runCommand(tool.command, tool.value)}
                  className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-[#334155] transition hover:border-[#d8cdb9] hover:bg-[#f3ecdf]"
                >
                  <Icon size={15} />
                  {badge ? <span className="absolute -bottom-0.5 text-[9px] font-semibold">{badge}</span> : null}
                </button>
              );
            })}
          </div>
        ))}

        <div className="flex items-center gap-2 rounded-lg border border-[#e4d8c6] bg-white/70 px-1.5 py-1">
          <button
            type="button"
            title="Insert link"
            onMouseDown={(event) => {
              event.preventDefault();
              saveSelection();
            }}
            onClick={() => setIsLinkPanelOpen((prev) => !prev)}
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-[#334155] transition hover:border-[#d8cdb9] hover:bg-[#f3ecdf]"
          >
            <FiLink size={15} />
          </button>
          {isLinkPanelOpen ? (
            <div className="flex items-center gap-2">
              <input
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                onMouseDown={(event) => event.preventDefault()}
                placeholder="https://..."
                className="h-8 w-48 rounded-md border border-[#d8cdb9] px-2 text-xs"
              />
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={applyLink}
                className="h-8 rounded-md border border-[#d8cdb9] px-2 text-xs font-semibold text-[#334155] hover:bg-[#f3ecdf]"
              >
                Gắn link
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange((event.currentTarget as HTMLDivElement).innerHTML)}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        data-placeholder={placeholder}
        className="min-h-[220px] w-full break-words p-3 text-sm text-[#334155] outline-none empty:before:pointer-events-none empty:before:text-[#94a3b8] empty:before:content-[attr(data-placeholder)] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:my-1 [&_p]:my-1"
        style={{ minHeight }}
      />
    </div>
  );
}
