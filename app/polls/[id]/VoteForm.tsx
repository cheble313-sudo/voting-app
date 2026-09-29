"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  pollId: number;
  options: { id: number; label: string }[];
  closed: boolean;
};

export default function VoteForm({ pollId, options, closed }: Props) {
  const router = useRouter();
  const [optionId, setOptionId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const res = await fetch(`/api/polls/${pollId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId }),
    });
    const data = await res.json();
    setPending(false);
    setMessage(res.ok ? "투표했습니다!" : data.error);
    router.refresh();
  }

  if (closed) {
    return <p className="rounded bg-zinc-100 p-4 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">마감된 투표입니다. 결과만 볼 수 있습니다.</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      {options.map((o) => (
        <label key={o.id} className="flex cursor-pointer items-center gap-2 rounded border p-3">
          <input type="radio" name="option" checked={optionId === o.id} onChange={() => setOptionId(o.id)} />
          {o.label}
        </label>
      ))}
      <button
        type="submit"
        disabled={optionId === null || pending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        투표하기
      </button>
      {message && <p className="text-sm">{message}</p>}
    </form>
  );
}
