---
name: commit
description: Create a git commit for the current changes in this repo, with a message that explains why (not just what changed). Use when the user asks to commit, "haz un commit", "commitea esto".
argument-hint: "[optional hint: what to focus on, or a message to use]"
---

You are creating a git commit for the changes currently in this repo. Only commit when explicitly invoked like this - never commit proactively on your own.

Extra context from the user, if any (a message they want used, or which changes to focus on): $ARGUMENTS

Follow these steps in order:

1. **Look at what's there.** Run, in parallel:
   - `git status` (untracked files - never use `-uall`, this repo isn't huge but it's still the right default)
   - `git diff` (unstaged changes) and `git diff --staged` (already-staged changes)
   - `git log -5 --oneline` (recent commits, to match this repo's message style - short, imperative, focused on why)

2. **Check for secrets before staging anything.** If `git status` shows files like `.env`, `.env.local`, `credentials.json`, or anything that looks like it could hold API keys/tokens, do not stage them - point them out to the user and ask first. This matters more here than in most repos, since `my-app/app/notes/page.tsx` already has a history of intentionally-planted hardcoded secrets used for testing the Claude PR review workflow - don't let a real one slip through the same way by habit.

3. **Draft the commit message.** Look at all changes that will be committed (previously staged + newly relevant untracked/modified files) and write 1-2 sentences focused on *why* the change was made, not a mechanical list of files. Match the tone of `git log -5` (this repo's recent commits read like "feat: ...", "fix: ..." - follow that convention when it fits). If the user gave a hint in $ARGUMENTS, incorporate it instead of guessing.

4. **Stage specific files by name** - never `git add -A` or `git add .`. List the files explicitly so nothing unintended (stray build output, an editor temp file, an untracked secret) gets swept in.

5. **Create the commit** with the message passed via a heredoc so multi-line text and quoting are preserved correctly:
   ```
   git commit -m "$(cat <<'EOF'
   <message>

   Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
   EOF
   )"
   ```

6. **Verify.** Run `git status` after the commit to confirm it succeeded and the tree is clean (or shows only what was intentionally left uncommitted).

7. **If a pre-commit hook fails:** fix the underlying issue, re-stage, and create a **new** commit - never `--amend` (the failed commit never happened, so amending would touch the previous real commit instead) and never `--no-verify` to skip the hook unless the user explicitly says to.

If there is nothing to commit (clean working tree, nothing staged), say so and stop - don't create an empty commit.

Never push after committing unless the user separately asks for that (use the `create-pr` skill for opening a pull request).
