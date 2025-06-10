import { useRef } from 'react';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Enter text here...',
  minHeight = '300px',
  maxHeight = '600px'
}: RichTextEditorProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleFormatText = (format: string, value?: string) => {
    if (!contentRef.current) return;
    
    const selection = window.getSelection();
    if (!selection) return;

    // Focus the contentEditable div to ensure commands work
    contentRef.current.focus();

    // Toggle formatting based on current state
    switch (format) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'strikeThrough':
        document.execCommand('strikeThrough', false);
        break;
      case 'insertUnorderedList':
        const isInList = document.queryCommandState('insertUnorderedList');
        if (isInList) {
          document.execCommand('outdent', false);
        } else {
          document.execCommand('insertUnorderedList', false);
        }
        break;
      case 'insertOrderedList':
        const isInOrderedList = document.queryCommandState('insertOrderedList');
        if (isInOrderedList) {
          document.execCommand('outdent', false);
        } else {
          document.execCommand('insertOrderedList', false);
        }
        break;
      case 'justifyLeft':
        document.execCommand('justifyLeft', false);
        break;
      case 'justifyCenter':
        document.execCommand('justifyCenter', false);
        break;
      case 'justifyRight':
        document.execCommand('justifyRight', false);
        break;
      case 'createLink':
        const url = prompt('Enter the URL:');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        break;
      case 'foreColor':
        if (value) {
          document.execCommand('foreColor', false, value);
        }
        break;
      case 'hiliteColor':
        if (value) {
          document.execCommand('hiliteColor', false, value);
        }
        break;
      case 'formatBlock':
        if (value) {
          document.execCommand('formatBlock', false, value);
        }
        break;
      case 'removeFormat':
        document.execCommand('removeFormat', false);
        break;
    }

    // Update the content after formatting
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
  };

  const handleContentChange = () => {
    if (!contentRef.current) return;
    onChange(contentRef.current.innerHTML);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => handleFormatText('bold')}
            className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-[#800000]"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormatText('italic')}
            className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-[#800000]"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormatText('underline')}
            className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-[#800000]"
            title="Underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </button>
          <button
            onClick={() => handleFormatText('strikeThrough')}
            className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-[#800000]"
            title="Strikethrough"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => handleFormatText('insertUnorderedList')}
            className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-[#800000]"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormatText('insertOrderedList')}
            className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-[#800000]"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => handleFormatText('justifyLeft')}
            className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-[#800000]"
            title="Align Left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h12" />
            </svg>
          </button>
          <button
            onClick={() => handleFormatText('justifyCenter')}
            className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-[#800000]"
            title="Align Center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M6 12h12M8 18h8" />
            </svg>
          </button>
          <button
            onClick={() => handleFormatText('justifyRight')}
            className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-[#800000]"
            title="Align Right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M12 18h8" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <select
            onChange={(e) => handleFormatText('formatBlock', e.target.value)}
            className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-[#800000] bg-transparent border-none focus:outline-none"
            title="Text Style"
          >
            <option value="p">Normal Text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
          </select>
        </div>
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <input
            type="color"
            onChange={(e) => handleFormatText('foreColor', e.target.value)}
            className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
            title="Text Color"
          />
          <input
            type="color"
            onChange={(e) => handleFormatText('hiliteColor', e.target.value)}
            className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
            title="Background Color"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleFormatText('createLink')}
            className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-[#800000]"
            title="Insert Link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
          <button
            onClick={() => handleFormatText('removeFormat')}
            className="p-2 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-[#800000]"
            title="Clear Formatting"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={contentRef}
        contentEditable
        onBlur={handleContentChange}
        suppressContentEditableWarning
        className={`w-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] text-gray-800 overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 whitespace-pre-wrap prose prose-sm max-w-none`}
        style={{ minHeight, maxHeight }}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
} 