import Reveal from "@/components/Reveal";
import { PROOF_SIGNALS } from "@/data/proof";

/**
 * Where to verify the work, as a plain table: alternating tone rows instead
 * of lines. No invented testimonials (see data/proof.ts).
 */
export default function ProofTable() {
  return (
    <section
      aria-labelledby="proof-title"
      className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2
          id="proof-title"
          className="max-w-3xl text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.05] tracking-tight text-white dark:text-gray-900">
          Check the work yourself
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-200 dark:text-gray-800">
          No invented testimonials. Every line below points to something
          public: a store listing, a package, a past role.
        </p>
      </Reveal>

      <Reveal className="mt-12">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Public places to verify the work</caption>
          <tbody>
            {PROOF_SIGNALS.map((signal, i) => (
              <tr
                key={signal.label}
                className={
                  i % 2 === 0 ? "bg-inkDeep dark:bg-paperDeep" : undefined
                }>
                <th
                  scope="row"
                  className="w-1/4 px-4 py-5 align-top text-lg font-semibold text-white md:px-6 dark:text-gray-900">
                  {signal.label}
                </th>
                <td className="px-4 py-5 align-top text-[17px] leading-relaxed text-gray-200 md:px-6 dark:text-gray-800">
                  {signal.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </section>
  );
}
