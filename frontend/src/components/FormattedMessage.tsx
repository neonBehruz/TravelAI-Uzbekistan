import React from 'react';

interface FormattedMessageProps {
  content?: string;
  text?: string;
  isUser?: boolean;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content, text, isUser = false }) => {
  const actualContent = content || text || '';
  if (!actualContent) return null;

  // If it's a user message, render as clean text preserving line breaks
  if (isUser) {
    return <span style={{ whiteSpace: 'pre-wrap', color: '#FFFFFF', fontWeight: 500 }}>{actualContent}</span>;
  }

  // Parse inline styles: bold (**text**), italic (*text*), code (`text`)
  const parseInline = (rawText: string): React.ReactNode[] => {
    // Regex matches ***bold italic***, **bold**, *italic*, `code`, and plain text
    const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    const parts = rawText.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      if (part.startsWith('***') && part.endsWith('***')) {
        const inner = part.slice(3, -3);
        return (
          <strong key={index} style={{ fontWeight: 700, color: 'var(--text-gold, #F59E0B)', fontStyle: 'italic' }}>
            {inner}
          </strong>
        );
      }

      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        return (
          <strong key={index} style={{ fontWeight: 700, color: '#FFFFFF' }}>
            {inner}
          </strong>
        );
      }

      if (part.startsWith('*') && part.endsWith('*')) {
        const inner = part.slice(1, -1);
        return (
          <em key={index} style={{ fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.85)' }}>
            {inner}
          </em>
        );
      }

      if (part.startsWith('`') && part.endsWith('`')) {
        const inner = part.slice(1, -1);
        return (
          <code
            key={index}
            style={{
              background: 'rgba(0, 168, 150, 0.15)',
              border: '1px solid rgba(0, 168, 150, 0.3)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '0.9em',
              fontFamily: 'monospace',
              color: '#34D399'
            }}
          >
            {inner}
          </code>
        );
      }

      const cleanPart = part.replace(/\*\*/g, '');
      return <span key={index}>{cleanPart}</span>;
    });
  };

  // Split content into lines and group into structured blocks
  const lines = actualContent.split('\n');
  const elements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];

  const flushList = (keyPrefix: string) => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul
          key={`${keyPrefix}-list`}
          style={{
            margin: '6px 0 10px 0',
            paddingLeft: '0',
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (!line) {
      flushList(`line-${index}`);
      return;
    }

    // Heading level 1-4: #, ##, ###, ####
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushList(`heading-${index}`);
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].replace(/\*\*/g, ''); // strip any double asterisks

      if (level <= 2) {
        elements.push(
          <div
            key={`h-${index}`}
            style={{
              fontSize: '17px',
              fontWeight: 800,
              color: '#FFFFFF',
              marginTop: index === 0 ? '0' : '14px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '6px'
            }}
          >
            {parseInline(headingText)}
          </div>
        );
      } else if (level === 3) {
        elements.push(
          <div
            key={`h-${index}`}
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--accent-gold, #E5A93C)',
              marginTop: index === 0 ? '0' : '12px',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {parseInline(headingText)}
          </div>
        );
      } else {
        // level 4 or higher
        elements.push(
          <div
            key={`h-${index}`}
            style={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#38BDF8',
              marginTop: index === 0 ? '0' : '10px',
              marginBottom: '4px'
            }}
          >
            {parseInline(headingText)}
          </div>
        );
      }
      return;
    }

    // Bullet list items: •, -, * (when followed by space)
    const bulletMatch = line.match(/^([•\-\*]|\d+\.)\s+(.+)$/);
    if (bulletMatch) {
      const itemText = bulletMatch[2];
      currentListItems.push(
        <li
          key={`li-${index}`}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            lineHeight: 1.5,
            fontSize: '13.5px',
            color: 'rgba(255, 255, 255, 0.92)'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--accent-turquoise, #00A896)',
              marginTop: '7px',
              flexShrink: 0,
              boxShadow: '0 0 6px rgba(0, 168, 150, 0.6)'
            }}
          />
          <div style={{ flex: 1 }}>{parseInline(itemText)}</div>
        </li>
      );
      return;
    }

    // Regular paragraph line
    flushList(`para-${index}`);
    elements.push(
      <p
        key={`p-${index}`}
        style={{
          margin: '0 0 6px 0',
          lineHeight: 1.6,
          color: 'rgba(255, 255, 255, 0.92)',
          fontSize: '13.5px'
        }}
      >
        {parseInline(line)}
      </p>
    );
  });

  flushList('final');

  return <div className="formatted-ai-response">{elements}</div>;
};
