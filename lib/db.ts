import { neon } from "@neondatabase/serverless";
import type { NewPoll, OptionCount } from "./poll.ts";

const sql = neon(process.env.DATABASE_URL!);

export type PollSummary = { id: number; question: string; closesAt: Date | null };
export type PollDetail = PollSummary & { options: OptionCount[] };

export async function listPolls(): Promise<PollSummary[]> {
  const rows = await sql`select id, question, closes_at from polls order by id desc`;
  return rows.map((r) => ({
    id: r.id,
    question: r.question,
    closesAt: r.closes_at ? new Date(r.closes_at) : null,
  }));
}

export async function getPoll(id: number): Promise<PollDetail | null> {
  const [poll] = await sql`select id, question, closes_at from polls where id = ${id}`;
  if (!poll) return null;
  const options = await sql`
    select o.id, o.label, count(v.id)::int as votes
    from options o left join votes v on v.option_id = o.id
    where o.poll_id = ${id}
    group by o.id order by o.position`;
  return {
    id: poll.id,
    question: poll.question,
    closesAt: poll.closes_at ? new Date(poll.closes_at) : null,
    options: options.map((o) => ({ id: o.id, label: o.label, votes: o.votes })),
  };
}

export async function createPoll(poll: NewPoll): Promise<number> {
  const [row] = await sql`
    insert into polls (question, closes_at)
    values (${poll.question}, ${poll.closesAt?.toISOString() ?? null})
    returning id`;
  await sql`
    insert into options (poll_id, label, position)
    select ${row.id}, label, ord from unnest(${poll.options}::text[]) with ordinality as t(label, ord)`;
  return row.id;
}

export async function addVote(optionId: number): Promise<void> {
  await sql`insert into votes (option_id) values (${optionId})`;
}
