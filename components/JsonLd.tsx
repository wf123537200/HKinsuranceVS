// components/JsonLd.tsx
//
// Renders one or more Schema.org JSON-LD payloads as <script> tags.
//
// Pass a single object, an array of objects, or a `@graph` payload with
// `@context` set at the top level. JSON.stringify handles escaping so
// user-controllable strings cannot break out of the script tag.

interface Props {
  /** A single JSON-LD object, an array of them, or a @graph payload. */
  data: object | object[];
}

export default function JsonLd({ data }: Props) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((item, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
