---
name: resolve-pr-comments
description: Fetch unresolved review comments/threads on a pull request, fix the code locally, push the fix, and resolve the threads on GitHub. Use when the user asks to address, fix, or resolve PR review feedback/comments, or "resuelve los comentarios del PR", "corrige los comentarios del review".
argument-hint: "[PR number, optional - defaults to the PR for the current branch]"
---

You are addressing open review-comment threads on a GitHub pull request in this repo: reading each unresolved comment, fixing the underlying code, pushing the fix, and resolving the thread. This repo's Next.js app lives under `my-app/`.

Target PR (if given): $ARGUMENTS

Follow these steps in order, stopping and telling the user what's wrong if any check fails. Never force-push, never rewrite history, and never resolve a thread you did not actually address.

1. **Check auth.** Run `gh auth status`. If not logged in, tell the user to run `gh auth login` and stop.

2. **Resolve the target PR.**
   - If a PR number was given in the arguments, use it.
   - Otherwise, infer it from the current branch: `gh pr view --json number,headRefName,url,baseRefName`. If that fails (no PR for this branch), ask the user which PR number to use and stop.
   - Get `owner` and `repo` via `gh repo view --json owner,name -q '.owner.login + "/" + .name'` (or split into two calls) - you'll need both for the GraphQL/REST calls below.

3. **Make sure you're on the right branch.** Run `git branch --show-current` and compare against the PR's `headRefName`.
   - If it doesn't match, run `git fetch origin` then `git checkout <headRefName>` (create a local tracking branch if it doesn't exist yet: `git checkout -b <headRefName> origin/<headRefName>`).
   - Run `git status --short`. If there are uncommitted changes that look unrelated to this task, stop and ask the user how to proceed - do not stash or discard their work silently.
   - Run `git pull --ff-only` to make sure the local branch matches the remote before you start editing.

4. **Fetch unresolved review threads.** Use the GraphQL API (REST doesn't expose thread-resolution state):
   ```
   gh api graphql -f query='
     query($owner:String!, $repo:String!, $pr:Int!) {
       repository(owner:$owner, name:$repo) {
         pullRequest(number:$pr) {
           reviewThreads(first:100) {
             nodes {
               id
               isResolved
               path
               line
               comments(first:50) {
                 nodes { id databaseId body author { login } url }
               }
             }
           }
         }
       }
     }' -F owner="<owner>" -F repo="<repo>" -F pr=<pr-number>
   ```
   Filter to `isResolved: false` threads. Each thread's first comment is the one to reply to (its `databaseId`).

   Also check for general (non-inline) feedback that isn't part of a resolvable thread: `gh pr view <pr-number> --json comments`.

5. **Triage each unresolved thread before touching code.** For every unresolved thread, read the comment body plus the referenced file/line (`path`/`line`) and decide:
   - **Fixable now** - a concrete code change addresses it.
   - **Needs discussion / not actionable as a code change** - e.g. a question, a disagreement, or feedback that depends on a decision only the user can make. Do not guess at these - leave them unresolved and flag them in your final report instead of resolving or replying with a guess.

6. **Apply the fixes** for everything triaged as fixable. Make the smallest correct change per comment - don't use this pass as an excuse to refactor unrelated code. If two comments touch the same code, reconcile them in one coherent edit rather than applying both mechanically.

7. **Check for secrets before staging anything**, same as the `commit` skill: don't stage `.env`, credentials, or anything that looks like a real token - ask the user first if you see one.

8. **Verify the fix.** If `my-app/package.json` has `lint`/`typecheck`/`build` scripts and the changed files are under `my-app/`, run the relevant one(s) (e.g. `npm --prefix my-app run lint`) before committing. Fix anything that breaks as a direct result of your change.

9. **Commit** the fixes with a message describing *why* (what feedback it addresses), staging specific files by name (never `git add -A`/`.`):
   ```
   git commit -m "$(cat <<'EOF'
   <message>

   Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
   EOF
   )"
   ```
   If nothing was fixable, skip committing and go straight to reporting back (step 12).

10. **Push.** Run `git push` (the branch already tracks its remote from being checked out in step 3 - never force-push).

11. **Reply and resolve, per thread you actually fixed:**
    - Reply on the thread referencing the fix, using the first comment's `databaseId`:
      ```
      gh api repos/<owner>/<repo>/pulls/<pr-number>/comments -X POST \
        -f body="Fixed in <short-sha>: <one-line description>." \
        -F in_reply_to=<databaseId>
      ```
    - Then resolve the thread via GraphQL:
      ```
      gh api graphql -f query='
        mutation($threadId:ID!) {
          resolveReviewThread(input:{threadId:$threadId}) { thread { id isResolved } }
        }' -F threadId="<thread-id>"
      ```
    - For threads triaged as "needs discussion" in step 5, optionally reply explaining why you're leaving it open (e.g. "Leaving this open - needs a decision on X before I can fix it"), but do **not** resolve them.

12. **Report back:** how many threads were resolved, how many were left open and why, the commit SHA (if any), and the PR URL.
