# Spec: 투표 앱 (MVP + 추가 기능 3개)

용어는 `CONTEXT.md`를 따른다.

## 목표
- 운영자가 투표를 만들고, 누구나 익명으로 표를 던지고, 결과를 가로 막대그래프로 본다.
- 추가 기능: ① 마감 시간 ② 결과 그래프 ③ 모든 화면 헤더에 "제작: 조은빛"

## 결정
- 스택: Next.js 16 App Router + TypeScript + Route Handlers(API Routes) + Neon Postgres(`@neondatabase/serverless`)
- 운영자 인증: 요청마다 비밀번호를 보내고 서버가 `ADMIN_PASSWORD` 환경변수와 비교
- 표는 익명, 중복 제한 없음
- 선택지 2~5개, 단일 선택
- 마감 시간은 선택 입력. 마감 후에는 화면에서 버튼을 비활성화하고, 서버 API도 403으로 거부
- 결과는 언제나 공개. 선택지별 표 수, 퍼센트, 총 투표수. 그래프는 CSS 막대(라이브러리 없음)
- 운영자 기능은 투표 만들기뿐(삭제 없음)

## 데이터
- `polls(id, question, closes_at nullable, created_at)`
- `options(id, poll_id, label, position)`
- `votes(id, option_id, created_at)`

## API
- `POST /api/polls` `{password, question, options[], closesAt?}` → 201 `{id}` / 401 / 400
- `POST /api/polls/[id]/vote` `{optionId}` → 200 / 403(마감됨) / 400 / 404

## 화면
- `/` 투표 목록(마감됨 표시)
- `/polls/[id]` 투표하기 + 결과 그래프
- `/admin` 투표 만들기 폼

## 범위 밖
로그인, 중복 투표 방지, 투표 삭제·수정
