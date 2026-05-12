'use client';

import { useEffect, useRef } from 'react';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
};

const TOOLBAR: Array<{ label: string; command: string; value?: string }> = [
  { label: 'B', command: 'bold' },
  { label: 'I', command: 'italic' },
  { label: 'U', command: 'underline' },
  { label: '• List', command: 'insertUnorderedList' },
  { label: '1. List', command: 'insertOrderedList' },
  { label: 'Hủy format', command: 'removeFormat' },
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung mô tả...',
  minHeight = 220,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value]);

  const runCommand = (command: string, commandValue?: string) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(command, false, commandValue);
    onChange(el.innerHTML);
  };

  return (
    <div className="rounded-xl border border-[#d8cdb9]">
      <div className="flex flex-wrap gap-2 border-b border-[#e9dfcf] bg-[#f8f4ec] p-2">
        {TOOLBAR.map((tool) => (
          <button
            key={tool.label}
            type="button"
            onClick={() => runCommand(tool.command, tool.value)}
            className="rounded-md border border-[#d8cdb9] bg-white px-2 py-1 text-xs font-semibold text-[#334155] hover:bg-[#f3ecdf]"
          >
            {tool.label}
          </button>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange((event.currentTarget as HTMLDivElement).innerHTML)}
        data-placeholder={placeholder}
        className="min-h-[220px] w-full break-words p-3 text-sm text-[#334155] outline-none empty:before:pointer-events-none empty:before:text-[#94a3b8] empty:before:content-[attr(data-placeholder)]"
        style={{ minHeight }}
      />
    </div>
  );
}
