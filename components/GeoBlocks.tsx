// components/GeoBlocks.tsx
//
// Renders the GEO/AEO blocks AI crawlers (ChatGPT, Perplexity, Google AI
// Overviews) prefer to cite. Each block is wrapped in <section className="sr-only">
// so it's invisible to sighted users but readable by crawlers and screen readers.
//
//   <GeoBlocks
//     quickAnswer={{ title: "What is X?", text: "..." }}
//     faqs={[{ question, answer }]}
//     sources={[{ label, url }]}
//     methodology={{ title: "Methodology", text: "..." }}
//   />
//
// The component is pure presentation; any JSON-LD companion is emitted
// separately by the page (typically via <JsonLd data={buildFaqPageJsonLd(...)} />).

interface SourceItem {
  /** Display label for the source. */
  label: string;
  /** Absolute URL (http/https). */
  url: string;
}

interface QuickAnswer {
  title: string;
  text: string;
}

interface Methodology {
  title: string;
  text: string;
}

interface Props {
  quickAnswer?: QuickAnswer;
  faqs?: Array<{ question: string; answer: string }>;
  sources?: SourceItem[];
  methodology?: Methodology;
}

export default function GeoBlocks({ quickAnswer, faqs, sources, methodology }: Props) {
  if (!quickAnswer && !faqs?.length && !sources?.length && !methodology) return null;
  return (
    <div className="sr-only" aria-hidden="false">
      {quickAnswer && (
        <section>
          <h2>{quickAnswer.title}</h2>
          <p>{quickAnswer.text}</p>
        </section>
      )}
      {faqs && faqs.length > 0 && (
        <section>
          <h2>FAQ</h2>
          <dl>
            {faqs.map((f, i) => (
              <div key={i}>
                <dt>{f.question}</dt>
                <dd>{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {sources && sources.length > 0 && (
        <section>
          <h2>Sources</h2>
          <ul>
            {sources.map((s, i) => (
              <li key={i}>
                <a href={s.url}>{s.label}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
      {methodology && (
        <section>
          <h2>{methodology.title}</h2>
          <p>{methodology.text}</p>
        </section>
      )}
    </div>
  );
}
