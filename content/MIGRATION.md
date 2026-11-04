# Content migration report

Phase 1 inventory of the legacy CRA site (`main`, commit `f1d2743`). Exact strings were copied; nothing was paraphrased. Unknown or unverified values are marked `[[TODO: …]]`.

## Source → destination

| Legacy source | Destination | Notes |
|---|---|---|
| `src/components/sections/LandingSection.jsx` | `profile.json` | Name and roles exact. Legacy tagline kept as `legacyTagline`. New headline is a TODO. |
| `src/components/sections/AboutSection.jsx` (the rendered `AboutSection` export) | `profile.json.summary` | Three paragraphs exact. `AboutSectionAlt` / `AboutSectionInteractive` were phantom imports and are not migrated. |
| `src/components/sections/ExpertiseSection.jsx` | `expertise.json` | Six cards exact; no proficiency values existed. |
| `src/components/sections/ExperienceSection.jsx` + resume PDF | `experience.json` | Site summary and skill tags exact. Resume bullets stored as `highlights` with `source: "resume"`. Quantified bullets are `verified: false` with a TODO note. |
| `src/components/sections/ProjectSection.jsx` | `projects.json` | Three projects exact, including features, impact, tech, and repo URLs. The unused `demoLink` values pointed to nonexistent routes and are omitted (`demo: null`). |
| `src/components/sections/CertificationSection.jsx` | `certifications.json` | Name, issuer, year, logo exact. No credential URL or ID existed; both are TODOs. |
| `src/components/sections/InspirationSection.jsx` | `vision.json` | Four cards exact, flagged `status: "legacy"` for rewrite. This was never a books/quotes list. |
| `src/components/sections/ContactSection.jsx` | `profile.json` | Email, LinkedIn, GitHub exact. Contact intro is a TODO; stale legacy copy kept as `legacyContactIntro`. |
| Resume PDF (`src/utilities/AADHITHYA_VIJAYAKUMAR_Resume.pdf`) | `content/assets/resume.pdf` | Copied unchanged. |
| `src/utilities/*` images | `content/assets/` | Profile resized 4534×6801 → 933×1400 (5.1 MB → 172 KB). Project images capped at 1600 px. Small logos kept at original size to avoid upscaling. Total: 716 KB. |

## Facts preserved exactly

- Name: `Aadhithya Vijayakumar`
- Email: `aadhithya.vijayakumar01@gmail.com`
- LinkedIn: `https://linkedin.com/in/aadhithya-vijayakumar-av`
- GitHub: `https://github.com/Aadhiv01`
- Employers and dates: Goldman Sachs (Aug 2024 – Present), University of Utah (Aug 2023 – Aug 2024), Grid Elevated (Jan 2023 – Aug 2023), JPMorgan Chase & Co (Oct 2021 – Jul 2022), John Wiley & Sons, Inc. (May 2021 – Oct 2021)
- Certifications: AWS Certified Solutions Architect Associate (2023), Oracle Certified Java Associate (2021)
- Degrees: MS Information Systems, University of Utah, Dec 2023; BE Electronics and Communication, Anna University, Apr 2021
- Repos: `Aadhiv01/NeighborNexus`, `Aadhiv01/StudentTracker`, `Aadhiv01/QuizMaker`
- Domain: `aadhithyavijayakumar.com`

## Explicitly excluded — never migrated

- `src/components/sections/ResumeSection.jsx`: unrendered and fabricated ("Innovative Solutions Inc.", "Tech Pioneers Ltd.", "Tech University", 40%/30% metrics). It contradicts the real resume.
- `src/components/futurecomponents/*`: none of the nine files is imported. Several are broken (`SectionAnimation` uses TSX syntax in `.jsx`, `IlluminatedArea` imports a missing CSS file, `VoiceControlledNavigations` calls the constructor instead of an instance, `TimelineObserver` is empty).
- `src/components/futurecomponents/aiUtils.jsx:6`: contains a hardcoded Google AI Studio API key. **The value was not copied anywhere.** Treat it as compromised and rotate it.
- `src/components/futurecomponents/AIChatbot.jsx`: conflicting bio dataset (UofU "Present", no Goldman) and hardcoded PII; not a source of truth.
- EmailJS integration in `ContactSection.jsx`: service ID, template ID, and public key were client-side. Not migrated. The legacy form also logged name/email/message to the console.
- `src/components/AnalyticsTracker.jsx`: orphaned (never mounted), loops indefinitely if mounted, sends visitor IPs to third-party APIs. Not migrated.
- Legacy CSS (~1,078 lines), PrimeReact theme imports, Bootstrap 4/5, jQuery, Tether, Font Awesome CDNs, and the CRA manifest/favicon references.
- Google Analytics `G-LLJC91N9QP` was hardcoded in `public/index.html`. Not wired into v2; decide analytics separately.
- Legacy `ResumeSection` PDF link pointed to a nonexistent `/AADHITHYA_VIJAYAKUMAR_Resume.pdf`; the working download was a dynamic import. v2 uses `content/assets/resume.pdf`.

## Open placeholders

| Field | File | What is needed |
|---|---|---|
| `headline` | `profile.json` | One-line positioning; not written |
| `location` | `profile.json` | City/state, and whether to publish it |
| `contactIntro` | `profile.json` | New copy; legacy text is stale |
| `summary` rewrite | `profile.json` | Remove banned words, problem-first rewrite |
| voice samples | `voice.md` | 3–5 real sentences |
| phone display | `profile.json` | Phone exists only in the resume PDF; confirm whether to show |
| Goldman title | `experience.json` | Site says "Java Software Developer"; resume says "(Contract)" |
| UofU metrics | `experience.json` | 40% workload reduction; 60% retrieval speed |
| Grid Elevated metrics | `experience.json` | Zero breaches over 6 months; 40% engagement |
| JPMorgan metrics | `experience.json` | 30% transaction accuracy; "zero-downtime releases" |
| Wiley metrics | `experience.json` | 40% retrieval efficiency; 18 test scenarios at 90% |
| Certification URLs | `certifications.json` | Credly/Oracle verification URLs and credential IDs |
| Vision copy | `vision.json` | Four cards need rewrite or removal |
| Education display | `education.json` | Decide whether to surface education on the site |
| Project demos | `projects.json` | No live demo URLs exist; do not invent |

## Security notes for cutover

1. Rotate the Google API key committed at `src/components/futurecomponents/aiUtils.jsx:6` (present in Git history).
2. Do not reuse the EmailJS credentials.
3. Confirm the legacy `openai` dependency was never used (verified: no imports in `src/`).
4. The old site remains live on `main` until cutover; do not delete the repository history that the old deploy depends on.
