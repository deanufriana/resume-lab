# GitHub Pages Deployment Guide

This guide will help you deploy Resume Lab to GitHub Pages using GitHub Actions.

## Quick Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
4. Save the settings

### 2. Push to GitHub

Once you push your code to the `main` or `master` branch, the GitHub Action will automatically:
- Build your Vue application
- Deploy it to GitHub Pages
- Make it available at: `https://<username>.github.io/<repository-name>/`

## Repository Name Considerations

### If your repository is `username.github.io`
- The site will be available at `https://username.github.io/`
- **Action required:** Comment out the `VITE_BASE_PATH` line in `.github/workflows/deploy.yml`:
  ```yaml
  # VITE_BASE_PATH: '/${{ github.event.repository.name }}/'
  ```

### If your repository has a custom name (e.g., `resume-lab`)
- The site will be available at `https://username.github.io/resume-lab/`
- No changes needed - the workflow automatically uses the repository name as the base path

## Manual Deployment

You can manually trigger a deployment:
1. Go to the **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**

## Troubleshooting

### Build fails
- Check the Actions tab for error messages
- Ensure `package.json` has all dependencies
- Verify Node.js version compatibility

### Assets not loading
- Verify the `VITE_BASE_PATH` is correctly set in the workflow
- Check browser console for 404 errors
- Ensure the base path matches your repository name

### Page shows 404
- Wait a few minutes after deployment (GitHub Pages can take 1-2 minutes to update)
- Check GitHub Pages settings to ensure it's enabled
- Verify the deployment completed successfully in Actions tab

## Custom Domain

If you're using a custom domain:
1. Remove or comment out the `VITE_BASE_PATH` environment variable in the workflow
2. Set your custom domain in GitHub Pages settings
3. Configure your DNS records as instructed by GitHub

