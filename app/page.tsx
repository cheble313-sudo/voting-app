import Link from "next/link";
import { listPolls } from "@/lib/db";
import { formatKst } from "@/lib/format";
import { isClosed } from "@/lib/poll";

export const dynamic = "force-dynamic";

export default async function Home() {
  const polls = await listPolls();

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">투표 목록</h1>
        <Link href="/admin" className="text-sm text-blue-600 underline">
          투표 만들기 (운영자)
        </Link>
      </div>

      {polls.length === 0 && <p className="text-zinc-500">아직 투표가 없습니다.</p>}

      <ul className="space-y-3">
        {polls.map((poll) => {
          const closed = isClosed(poll.closesAt);
          return (
            <li key={poll.id}>
              <Link
                href={`/polls/${poll.id}`}
                className="block rounded-lg border p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{poll.question}</span>
                  {closed ? (
                    <span className="rounded bg-zinc-200 px-2 py-0.5 text-xs text-zinc-700">마감됨</span>
                  ) : (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">진행 중</span>
                  )}
                </div>
                {poll.closesAt && (
                  <p className="mt-1 text-sm text-zinc-500">마감: {formatKst(poll.closesAt)}</p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
