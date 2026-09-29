import Link from "next/link";
import { notFound } from "next/navigation";
import { getPoll } from "@/lib/db";
import { formatKst } from "@/lib/format";
import { computeResults, isClosed } from "@/lib/poll";
import VoteForm from "./VoteForm";

export const dynamic = "force-dynamic";

export default async function PollPage(props: PageProps<"/polls/[id]">) {
  const { id } = await props.params;
  const poll = await getPoll(Number(id));
  if (!poll) notFound();

  const closed = isClosed(poll.closesAt);
  const results = computeResults(poll.options);

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 p-6">
      <Link href="/" className="text-sm text-blue-600 underline">
        ← 목록으로
      </Link>

      <section>
        <h1 className="text-2xl font-bold">{poll.question}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {poll.closesAt ? `마감: ${formatKst(poll.closesAt)}` : "마감 시간 없음"}
          {closed && <span className="ml-2 font-semibold text-red-600">마감됨</span>}
        </p>
      </section>

      <VoteForm pollId={poll.id} options={poll.options} closed={closed} />

      <section>
        <h2 className="mb-3 text-lg font-semibold">결과 (총 {results.total}표)</h2>
        <ul className="space-y-3">
          {results.rows.map((row) => (
            <li key={row.id}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{row.label}</span>
                <span>
                  {row.votes}표 ({row.percent}%)
                </span>
              </div>
              <div className="h-6 w-full overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
                <div className="h-full rounded bg-blue-500" style={{ width: `${row.percent}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
