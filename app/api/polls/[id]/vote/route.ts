import { addVote, getPoll } from "@/lib/db";
import { isClosed } from "@/lib/poll";

export async function POST(request: Request, ctx: RouteContext<"/api/polls/[id]/vote">) {
  const { id } = await ctx.params;
  const poll = await getPoll(Number(id));
  if (!poll) return Response.json({ error: "투표가 없습니다." }, { status: 404 });

  if (isClosed(poll.closesAt)) {
    return Response.json({ error: "마감된 투표입니다." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const optionId = Number(body.optionId);
  if (!poll.options.some((o) => o.id === optionId)) {
    return Response.json({ error: "선택지를 고르세요." }, { status: 400 });
  }

  await addVote(optionId);
  return Response.json({ ok: true });
}
