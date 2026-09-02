---
name: create-pr
description: Create a GitHub pull request for the current branch against main, using the gh CLI. Pushes the branch if needed and writes the title/body from the commit history and diff. Use when the user asks to open/create a PR, or "manda el PR", "crea el pull request".
argument-hint: "[optional title or extra context]"
---

You are creating a GitHub pull request for the branch currently checked out in this repo. This repo's Next.js app lives under `my-app/`, but git/gh commands work the same regardless of the working directory inside the repo.

Extra context from the user, if any: $ARGUMENTS

Follow these steps in order, stopping and telling the user what's wrong if any check fails:

1. **Check auth.** Run `gh auth status`. If not logged in, tell the user to run `gh auth login` and stop.

2. **Check the branch - and self-heal if it's `main`.** Run `git branch --show-current`.
   - If it's **not** `main`/`master`, continue to step 3 as normal.
   - If it **is** `main`/`master`, don't just stop - check whether there's actually anything to branch out:
     - Run `git status --short` (uncommitted changes) and `git log origin/main..HEAD --oneline` (local commits made directly on main that were never pushed).
     - If both are empty, stop and tell the user main is clean and up to date - there's nothing to open a PR for.
     - Otherwise, look at what changed (`git status --short`, `git diff --stat`, and any commit subjects from the command above) and pick a short, descriptive kebab-case branch name for it (matching this repo's existing style, e.g. `test-page`, `new-page` - no `feat/`-style prefixes). Create it with `git checkout -b <name>`, which carries both the uncommitted changes and any local commits along with it - main's ref doesn't move yet.
     - If `git log origin/main..HEAD --oneline` showed commits (i.e. someone had committed directly to main), those are now duplicated on both the new branch and local `main`. Explain this clearly to the user, then run `git checkout main && git reset --hard origin/main` to bring local `main` back in sync with the remote - safe because those commits now live safely on the new branch, not lost. Then `git checkout <name>` again before continuing.
     - If it was only uncommitted changes (no stray commits on main), no reset is needed - just proceed on the new branch.

3. **Check for uncommitted changes.** Run `git status --short`. If there are still uncommitted changes at this point, stop and ask the user whether to commit them first - do not commit on their behalf without asking.

4. **Check for an existing PR.** Run `gh pr view --json url,state 2>/dev/null`. If an open PR already exists for this branch, just report its URL back to the user instead of creating a duplicate.

5. **Push the branch.** Run `git push -u origin HEAD` so the remote is up to date (safe to run even if already pushed - it's a fast-forward of the same branch, never force).

6. **Gather context for the PR description.** Run:
   - `git log main..HEAD --oneline` for the list of commits unique to this branch.
   - `git diff main...HEAD --stat` for a summary of what changed.

7. **Write the title and body.**
   - Title: concise, imperative mood (e.g. "Add Slack notification on build failure"), summarizing the overall change - not just the last commit message. Incorporate the user's extra context above if they gave any.
   - Body: a short "## Summary" section (1-4 bullet points on *why*, derived from the commits/diff - not a mechanical list of every file changed) and a "## Test plan" section if it's obvious how this was/should be verified (e.g. "npm run lint && npm run build", or manual steps if it's a UI change).

8. **Create the PR.** Run `gh pr create --base main --head <current-branch> --title "<title>" --body "<body>"`, passing the body via a heredoc or `--body-file` to avoid shell-escaping issues with multi-line text.

9. **Report back** the PR URL that `gh pr create` prints.

Never force-push, never rewrite history, and never target a base branch other than `main` unless the user explicitly asks for a different one.
