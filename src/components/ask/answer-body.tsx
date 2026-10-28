import { type Leaf, parseAnswer } from '@/lib/answer-blocks';

// Renders readIQ's answer from parsed blocks: paragraphs, headings, definition
// cards, bullets, numbered steps, and inline **bold**.

/** A line's inline **bold** spans, leaving the rest as plain text. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const bold = part.length >= 4 && part.startsWith('**') && part.endsWith('**');
        return bold ? (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

/** One leaf: a paragraph, bullet list, or numbered list. */
function LeafBlock({ block }: { block: Leaf }) {
  if (block.kind === 'para') {
    return (
      <p className="text-[15px] leading-[23px] text-rq-on-surface">
        <Inline text={block.text} />
      </p>
    );
  }
  const List = block.kind === 'ordered' ? 'ol' : 'ul';
  return (
    <List className="flex flex-col gap-1.5">
      {block.items.map((item, j) => (
        <li key={j} className="flex gap-2">
          <span className="min-w-4 text-[15px] leading-[23px] font-semibold text-rq-primary" aria-hidden>
            {block.kind === 'ordered' ? `${j + 1}.` : '•'}
          </span>
          <span className="min-w-0 text-[15px] leading-[23px] text-rq-on-surface">
            <Inline text={item} />
          </span>
        </li>
      ))}
    </List>
  );
}

/** The formatted answer body inside the AI bubble. */
export function AnswerBody({ text }: { text: string }) {
  const blocks = parseAnswer(text);

  return (
    <div className="flex flex-col gap-2.5 break-words">
      {blocks.map((block, i) => {
        if (block.kind === 'label') {
          return (
            <h3 key={i} className="font-sans text-[15px] leading-[22px] font-bold text-rq-on-surface">
              <Inline text={block.text} />
            </h3>
          );
        }
        // A term + its definition → a highlighted card.
        if (block.kind === 'definition') {
          return (
            <div
              key={i}
              className="flex flex-col gap-1 rounded-inner border border-rq-outline-variant bg-rq-surface-container p-3"
            >
              <p className="text-[15px] leading-[21px] font-bold text-rq-primary">
                <Inline text={block.term} />
              </p>
              <LeafBlock block={block.body} />
            </div>
          );
        }
        return <LeafBlock key={i} block={block} />;
      })}
    </div>
  );
}
