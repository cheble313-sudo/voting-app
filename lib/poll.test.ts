import { describe, it } from "node:test";
import assert from "node:assert/strict";

const expect = (actual: unknown) => ({
  toBe: (expected: unknown) => assert.equal(actual, expected),
  toEqual: (expected: unknown) => assert.deepEqual(actual, expected),
});
import { computeResults, isClosed, parseNewPoll } from "./poll.ts";

describe("isClosed", () => {
  const now = new Date("2026-09-30T06:00:00Z");

  it("마감 시간이 없으면 마감되지 않는다", () => {
    expect(isClosed(null, now)).toBe(false);
  });

  it("마감 시간이 지나면 마감됨", () => {
    expect(isClosed(new Date("2026-09-30T05:59:59Z"), now)).toBe(true);
  });

  it("마감 시간 전이면 열려 있다", () => {
    expect(isClosed(new Date("2026-09-30T06:00:01Z"), now)).toBe(false);
  });
});

describe("parseNewPoll", () => {
  it("공백을 정리하고 빈 선택지를 버린다", () => {
    const result = parseNewPoll({
      question: "  점심 메뉴? ",
      options: [" 김밥 ", "", "라면"],
      closesAt: "",
    });
    expect(result).toEqual({
      ok: true,
      poll: { question: "점심 메뉴?", options: ["김밥", "라면"], closesAt: null },
    });
  });

  it("질문이 비어 있으면 거부", () => {
    expect(parseNewPoll({ question: " ", options: ["a", "b"] }).ok).toBe(false);
  });

  it("선택지가 2개 미만이면 거부", () => {
    expect(parseNewPoll({ question: "q", options: ["a"] }).ok).toBe(false);
  });

  it("선택지가 5개 초과면 거부", () => {
    expect(
      parseNewPoll({ question: "q", options: ["a", "b", "c", "d", "e", "f"] }).ok,
    ).toBe(false);
  });

  it("마감 시간을 Date로 바꾼다", () => {
    const result = parseNewPoll({
      question: "q",
      options: ["a", "b"],
      closesAt: "2026-10-01T00:00:00.000Z",
    });
    expect(result.ok && result.poll.closesAt?.toISOString()).toBe(
      "2026-10-01T00:00:00.000Z",
    );
  });

  it("잘못된 마감 시간은 거부", () => {
    expect(
      parseNewPoll({ question: "q", options: ["a", "b"], closesAt: "nope" }).ok,
    ).toBe(false);
  });
});

describe("computeResults", () => {
  it("표 수와 퍼센트, 총합을 계산한다", () => {
    const result = computeResults([
      { id: 1, label: "A", votes: 3 },
      { id: 2, label: "B", votes: 1 },
    ]);
    expect(result.total).toBe(4);
    expect(result.rows.map((r) => r.percent)).toEqual([75, 25]);
  });

  it("표가 0이면 모두 0%", () => {
    const result = computeResults([
      { id: 1, label: "A", votes: 0 },
      { id: 2, label: "B", votes: 0 },
    ]);
    expect(result.total).toBe(0);
    expect(result.rows.map((r) => r.percent)).toEqual([0, 0]);
  });
});
