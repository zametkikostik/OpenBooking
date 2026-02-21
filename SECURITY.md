# 🔒 Security Guidelines

## DO NOT COMMIT SENSITIVE DATA

### Never commit these files:
- `.env.local`
- `.env.production.local`
- Any file containing:
  - API keys
  - Database passwords
  - Service role keys
  - Access tokens
  - Private keys

### Safe workflow:

```bash
# 1. Add to .gitignore FIRST
echo ".env.local" >> .gitignore

# 2. Create .env.example with placeholder values
cp .env.local .env.example
# Edit .env.example - remove all real credentials

# 3. Commit only .env.example and .gitignore
git add .gitignore .env.example
git commit -m "chore: add env example"
```

### Production credentials should ONLY be:
- Set via environment variables in hosting platform
- Stored in secure vault (AWS Secrets Manager, etc.)
- Passed via CI/CD secrets

---

**REMEMBER**: Once pushed to GitHub, credentials are compromised even if deleted later!
