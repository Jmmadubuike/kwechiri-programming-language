# Publish the VS Code extension with GitHub trusted publishing

The publish workflow is `.github/workflows/publish-vscode.yml`. It runs only
through manual `workflow_dispatch`, requires the `main` branch, performs the
canonical compiler and extension checks, and publishes the versioned VSIX
through GitHub OpenID Connect.

The Kwechiri policy is active. Version `0.2.0` is public in the Visual Studio
Marketplace and was installed from a clean VS Code profile as deployment
verification.

## Marketplace policy

Create one **Trusted Publishing** policy in the Kwechiri publisher:

- Policy name: `Kwechiri VS Code Marketplace`
- Repository owner: `Jmmadubuike`
- Repository: `kwechiri-programming-language`
- Workflow: `publish-vscode.yml`
- Environment: leave blank

Do not create a Personal Access Token. The workflow requests the short-lived
`id-token: write` permission itself and uses `vsce publish --oidc`.

## Publishing

After saving the policy:

1. Open the repository's **Actions** tab.
2. Select **Publish VS Code extension**.
3. Choose **Run workflow** on `main`.
4. Confirm all validation steps pass.
5. Confirm the Marketplace lists the packaged version and its availability is
   `Public`.

For a private repository, the first token exchange must run within 48 hours of
creating the policy. That first successful exchange activates the policy.
