import { createPoll } from "@/lib/db";
import { parseNewPoll } from "@/lib/poll";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  if (!process.env.ADMIN_PASSWORD || body.password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "운영자 비밀번호가 틀렸습니다." }, { status: 401 });
  }

  const parsed = parseNewPoll(body);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const id = await createPoll(parsed.poll);
  return Response.json({ id }, { status: 201 });
}
