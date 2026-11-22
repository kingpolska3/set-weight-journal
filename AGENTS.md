<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Store trainee intake in the owner-only trainer_client_private table; trainer_plans.data contains only the shared prescription so recipients cannot fetch health or coach data.
- Generate training drafts through an owner-authorized server function using Lovable AI, with structured output and explicit trainer approval before replacing prescriptions.
- Count account streaks across scheduled training dates, ignoring planned rest and the unfinished current day, so legitimate rest does not reset consistency.
- Enforce trainer capabilities with protected user_roles and database policies, never a shared browser PIN; UI role checks are presentation only.
- Track direct versus token-derived plan grants and validate the current token/access on every read and write, so revocation and downgrades apply immediately.
- Treat trainer_bookings as the only booking authority and validate participants and trainer-only status changes in a database trigger; settings copies are not trusted.
- Persist existing bookings with UPDATE without changing owner_id, and new requests with INSERT; check errors and read the accepted record so insert-time approval guards do not block legitimate updates.
- Redirect the legacy /index URL to / and keep other unknown paths as not-found, so older entry links still open the diary.
- Keep security dependency overrides at patched compatible major versions until upstream packages adopt them, to prevent transitive vulnerability regressions.
