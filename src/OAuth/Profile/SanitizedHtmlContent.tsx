import { sanitize } from "isomorphic-dompurify";

export type SanitizedHtmlContentProps = JSX.IntrinsicElements["p"] & {
  html: string;
};

export default function SanitizedHtmlContent({
  html = "",
  ...restProps
}: SanitizedHtmlContentProps) {
  return (
    <p dangerouslySetInnerHTML={{ __html: sanitize(html) }} {...restProps}></p>
  );
}
