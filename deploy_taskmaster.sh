#!/usr/bin/env bash
# Deploys taskmaster on the server: pulls the latest code into the checkout in
# the deploy user's home, rebuilds and restarts the containers, then prunes
# superseded images and old build cache.
# Run over SSH by the Deploy job in .github/workflows/main.yml.
set -euo pipefail

REPO_DIR="$HOME/taskmaster"

# Wrapped in a function so bash parses the whole script before running it:
# the git pull below may rewrite this file mid-run.
main() {
  cd "$REPO_DIR"

  # Pull, then re-run the freshly pulled copy so changes to this script
  # take effect in the same deploy.
  if [[ "${1:-}" != "--pulled" ]]; then
    git pull --ff-only
    exec "$REPO_DIR/deploy_taskmaster.sh" --pulled
  fi

  local compose
  if docker compose version >/dev/null 2>&1; then
    compose=(docker compose)
  else
    compose=(docker-compose)
  fi

  "${compose[@]}" up -d --build --remove-orphans

  # Rebuilt images leave the previous ones untagged (dangling).
  docker image prune -f
  # Keep a week of build cache so routine deploys still build fast.
  docker builder prune -f --filter until=168h
}

main "$@"
