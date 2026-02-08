# SustAInex | Layman's Tactical Deployment Guide

Follow these steps to move SustAInex from this editor to a live website.

## Phase 1: Local Preparation
1. **Create a Folder**: Create a folder named `sustainex` on your computer.
2. **Download Files**: Copy the files from this project into your local folder.
3. **Open Terminal**: In VS Code, go to `Terminal` -> `New Terminal`.
4. **Install Dependencies**: Type the following and press Enter:
   ```bash
   npm install
   ```
5. **Test Locally**: Type the following and press Enter:
   ```bash
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002) in your browser.

## Phase 2: GitHub Transmission
1. **Create Repository**: Go to [github.com/new](https://github.com/).
2. **Name it**: Enter `sustainex`. Click **Create repository**.
3. **Connect & Push**: In your VS Code terminal, type these one by one:
   ```bash
   git init
   git add .
   git commit -m "Initial SustAInex Tactical Deployment"
   git branch -M main
   git remote add origin https://github.com/Ramachandranram4/sustainex.git
   git push -u origin main
   ```

## Phase 3: Vercel Launch
1. **Login to Vercel**: Go to [vercel.com](https://vercel.com/) and login with GitHub.
2. **Import**: Click **"Add New"** -> **"Project"**.
3. **Select Repo**: Find `sustainex` and click **"Import"**.
4. **Deploy**: Click **Deploy**.

## Phase 4: Tactical Control (The Key Fix)
Once your site is live, use the **Settings Icon** (gear) in the header to enter your API keys. 
- These keys **instantly override** everything else.
- If your quota runs out, simply enter a new key in the UI and click **Synchronize Protocols**. 
- The app will work immediately without any code changes!
