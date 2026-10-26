/**
 * Page enter animation in CSS, so content is visible even before (or
 * without) JavaScript. Skipped for reduced motion in styles/globals.css.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
