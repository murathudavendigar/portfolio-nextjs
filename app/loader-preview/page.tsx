import Loading from "@/app/loading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loader Preview",
  robots: { index: false, follow: false },
};

export default function LoaderPreviewPage() {
  return <Loading />;
}
