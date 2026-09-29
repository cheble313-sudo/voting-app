# Tickets: 투표 앱

`spec.md` 기준. 위에서부터 순서대로 구현한다.

1. **DB 스키마 + 연결** (ready-for-agent): `db/schema.sql`, `lib/db.ts`
2. **도메인 로직 (TDD)** (ready-for-agent): `isClosed`, 입력 검증, 결과 비율 계산 + 테스트
3. **투표 만들기** (ready-for-agent): `POST /api/polls` + `/admin` 폼 (마감 시간 입력 포함 — 기능 ①)
4. **투표하기** (ready-for-agent): `POST /api/polls/[id]/vote`, 마감 후 403 (기능 ①)
5. **목록 + 결과 그래프** (ready-for-agent): `/`, `/polls/[id]`, 가로 막대그래프 (기능 ②)
6. **헤더 이름** (ready-for-agent): 레이아웃 헤더 "제작: 조은빛" (기능 ③)
7. **DB 테이블 생성** (ready-for-human): Neon에 `db/schema.sql` 실행
8. **배포** (ready-for-human): GitHub Push → Vercel Import → `DATABASE_URL`, `ADMIN_PASSWORD` 설정
