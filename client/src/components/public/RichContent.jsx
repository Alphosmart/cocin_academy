import { useMemo } from "react";
import { enhanceRichText } from "../../utils/richText";

// Renders admin-authored rich text with every link — typed or pasted — clickable.
export default function RichContent({ html, className = "", as: Tag = "div", ...props }) {
  const enhanced = useMemo(() => enhanceRichText(html), [html]);
  if (!enhanced) return null;
  return <Tag className={`rich-content ${className}`.trim()} dangerouslySetInnerHTML={{ __html: enhanced }} {...props} />;
}
