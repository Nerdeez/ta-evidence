# Agent instructions

## Agent skills

### Code review

Use `.agents/skills/open-code-review/SKILL.md` ([open-code-review](https://github.com/alibaba/open-code-review)) and run reviews from the repo root with `pnpm exec dotenv -e .env -- ocr …` (or `pnpm code-review` for committed changes on the branch vs `main`; `pnpm code-review:workspace` for uncommitted files; loads repo `.env` for `OCR_LLM_*`) when the user asks for a code review.

### Issue tracker

Issues and specs live in GitHub Issues (`Nerdeez/ta-evidence`). See `docs/agents/issue-tracker.md`.
