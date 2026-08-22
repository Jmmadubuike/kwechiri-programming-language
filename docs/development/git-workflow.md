# Git workflow

- Inspect `git status` before editing.
- Preserve unrelated user changes and untracked files.
- Avoid destructive resets or history rewrites.
- Keep changes focused on one approved milestone or stabilization objective.
- Review `git diff` and `git diff --check` before completion.
- Do not commit generated `dist/`, dependency directories, logs, or coverage.
- Do not publish, release, deploy, or create a license without explicit owner
  authorization.
- Create focused commits only after owner approval.

Text files use UTF-8, LF, a final newline, and the repository `.editorconfig`.
Do not mass-rewrite existing files solely to normalize line endings.
