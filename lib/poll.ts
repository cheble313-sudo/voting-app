export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 5;

export function isClosed(closesAt: Date | null, now: Date = new Date()): boolean {
  return closesAt !== null && closesAt.getTime() <= now.getTime();
}

export type NewPoll = { question: string; options: string[]; closesAt: Date | null };

export function parseNewPoll(input: {
  question?: unknown;
  options?: unknown;
  closesAt?: unknown;
}): { ok: true; poll: NewPoll } | { ok: false; error: string } {
  const question = typeof input.question === "string" ? input.question.trim() : "";
  if (!question) return { ok: false, error: "질문을 입력하세요." };

  const options = Array.isArray(input.options)
    ? input.options
        .filter((o): o is string => typeof o === "string")
        .map((o) => o.trim())
        .filter(Boolean)
    : [];
  if (options.length < MIN_OPTIONS || options.length > MAX_OPTIONS) {
    return { ok: false, error: `선택지는 ${MIN_OPTIONS}~${MAX_OPTIONS}개여야 합니다.` };
  }

  let closesAt: Date | null = null;
  if (typeof input.closesAt === "string" && input.closesAt !== "") {
    closesAt = new Date(input.closesAt);
    if (Number.isNaN(closesAt.getTime())) {
      return { ok: false, error: "마감 시간 형식이 잘못되었습니다." };
    }
  }

  return { ok: true, poll: { question, options, closesAt } };
}

export type OptionCount = { id: number; label: string; votes: number };

export function computeResults(options: OptionCount[]) {
  const total = options.reduce((sum, o) => sum + o.votes, 0);
  return {
    total,
    rows: options.map((o) => ({
      ...o,
      percent: total === 0 ? 0 : Math.round((o.votes / total) * 100),
    })),
  };
}
