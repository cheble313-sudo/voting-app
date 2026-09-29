"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MAX_OPTIONS, MIN_OPTIONS } from "@/lib/poll";

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [closesAt, setClosesAt] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        question,
        options,
        // datetime-local 값은 브라우저 시간대 기준이므로 ISO(UTC)로 바꿔 보낸다
        closesAt: closesAt ? new Date(closesAt).toISOString() : "",
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    router.push(`/polls/${data.id}`);
  }

  const input = "w-full rounded border p-2 dark:bg-zinc-900";

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">투표 만들기</h1>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="text-sm">운영자 비밀번호</span>
          <input type="password" className={input} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <label className="block">
          <span className="text-sm">질문</span>
          <input className={input} value={question} onChange={(e) => setQuestion(e.target.value)} />
        </label>

        <fieldset className="space-y-2">
          <legend className="text-sm">
            선택지 ({MIN_OPTIONS}~{MAX_OPTIONS}개)
          </legend>
          {options.map((value, i) => (
            <input
              key={i}
              className={input}
              placeholder={`선택지 ${i + 1}`}
              value={value}
              onChange={(e) => setOptions(options.map((o, j) => (j === i ? e.target.value : o)))}
            />
          ))}
          {options.length < MAX_OPTIONS && (
            <button type="button" className="text-sm text-blue-600 underline" onClick={() => setOptions([...options, ""])}>
              + 선택지 추가
            </button>
          )}
        </fieldset>

        <label className="block">
          <span className="text-sm">마감 시간 (비워 두면 마감 없음)</span>
          <input type="datetime-local" className={input} value={closesAt} onChange={(e) => setClosesAt(e.target.value)} />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
          만들기
        </button>
      </form>
    </main>
  );
}
