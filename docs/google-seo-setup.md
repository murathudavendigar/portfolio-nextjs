# Google SEO API setup (claude-seo)

Needed for live PageSpeed / CrUX / Search Console checks via the seo-google skill.

## Minimum (Tier 0) — PSI + CrUX

1. Create or select a project in [Google Cloud Console](https://console.cloud.google.com).
2. Enable **PageSpeed Insights API** and **Chrome UX Report API**.
3. Create an API key (Credentials → Create credentials → API key). Restrict it to those APIs.
4. Write config:

```bash
mkdir -p ~/.config/claude-seo
cat > ~/.config/claude-seo/google-api.json <<'EOF'
{
  "api_key": "YOUR_API_KEY",
  "default_property": "sc-domain:muratoncu.com"
}
EOF
```

5. Verify:

```bash
CLAUDE_PLUGIN_ROOT="$HOME/.claude/plugins/cache/agricidaniel-seo/claude-seo/2.4.1"
"${CLAUDE_PLUGIN_ROOT}/scripts/claude-seo" run google_auth.py --check --json
```

## Full (Tier 1+) — GSC / Indexing / GA4

Add a service account JSON, grant it access in Search Console (and GA4 if used), then set `service_account_path` and optionally `ga4_property_id` in the same config file. See the plugin’s `skills/seo-google/references/auth-setup.md`.

## After setup

Ask the agent to re-run `/seo-google` against `https://www.muratoncu.com`.
