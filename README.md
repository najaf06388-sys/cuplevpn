# VPN - Android APK & Network App

This repository contains the source code for the **VPN** app.

## How to Build the APK on GitHub (Automated)

1. **Create a new GitHub Repository**:
   - Go to [github.com/new](https://github.com/new).
   - Name it `vpn-app` and create it.

2. **Upload this Project to GitHub**:
   - Unzip the downloaded `vpn-app-source.zip`.
   - In your terminal/command prompt:
     ```bash
     git init
     git add .
     git commit -m "Initial commit for VPN app"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/vpn-app.git
     git push -u origin main
     ```

3. **Download Your APK**:
   - Go to your repository on GitHub.
   - Click the **Actions** tab at the top.
   - The **Build Android APK (VPN)** workflow runs automatically!
   - Once it finishes (~3-4 minutes), click on the run and download the **VPN-debug.apk** artifact to install on your mobile device.
