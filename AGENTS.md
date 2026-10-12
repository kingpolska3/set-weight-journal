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
