# MathQuest public address — 8 October 2026

Owner renamed the existing repository to `williammcada/mathquest`. GitHub confirms the same repository ID 1369013008, retained history and Pages enabled. Source baseline e2be502 (includes False Haven v0.3, illustrated Ironbreak/Blackline and DEV homepage).

New entry: https://williammcada.github.io/mathquest/ . Canonical files remain public/ with relative root forwarding. Configuration, local-file connection-test fallback, current README links and hosting/UI tests now use the new path. Old historical release reports are not rewritten. Saved teacher/student links must use the new path; repository redirects do not establish Pages redirects.

This is the repository/Pages portion only of the older proposed migration. Keep https://vault7mathquest.netlify.app/api/, mathquest-prototype Worker, SESSIONS binding, QuestSession class and migration v1. Same Pages origin means no CORS change. No room deletion or new database. No new hosting provider or repository.

Verification: run hosting.test.mjs, migration-ui.test.mjs and v093.test.mjs against the new path; build syntax/assets. Check hosted root forwards to public/ and current hosting configuration contains the new Pages URL. Hosted classroom behavior is separate from address validation. Next: consolidate Ironbreak, Coastal Escape and Blackline classroom logic with current main and existing games, preserving latest artwork/performance work, then deploy one matching Worker/frontend.

Handbook consulted in this conversation: AI-START-HERE 6557a45, UNIVERSAL-RULES 6bde7c1, CONDITIONAL-STANDARDS 1a79498 (S-03/S-04), RELEASE-CHECKLIST 8aeb220. No handbook amendment.
