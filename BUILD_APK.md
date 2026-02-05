# How to build KanakuBook as an Android APK

Since this is a web application (HTML/CSS/JS), you have two main options to convert it into an Android App (APK):

## Option 1: Trusted Web Activity (TWA) - Recommended
This method wraps your hosted website into an app.

1. **Host your app** on a service like Vercel, Netlify, or GitHub Pages.
2. Use **Bubblewrap** (a CLI tool by Google) to generate the APK.
   - Install Node.js
   - Run: `npm install -g @bubblewrap/cli`
   - Run: `bubblewrap init --manifest https://your-app-url.com/manifest.json`
   - Follow the prompts to build the APK.

## Option 2: Capacitor (Local Build)
This method bundles your code inside the app so it works offline.

1. **Initialize a Capacitor project**
   ```bash
   npm init capacitor
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Build your web app**
   Since this project uses ES modules directly, you might need a bundler like Vite for a production build.
   
   If you want to use the current files directly:
   - Create a `www` folder.
   - Copy `index.html` and all `.tsx` / `.ts` files into it (Note: Capacitor works best with bundled JS, raw TSX won't run natively in WebView without a bundler).

   **Recommendation:** Use **Vite** to scaffold a project and move these files into it.
   ```bash
   npm create vite@latest kanakubook -- --template react-ts
   cd kanakubook
   npm install
   # Copy the code from this project into src/
   npm run build
   npx cap add android
   npx cap sync
   npx cap open android
   ```
   This will open Android Studio where you can build the signed APK.

## Option 3: Website to APK Builder (Fastest / No Code)
There are online tools like **WebIntoApp** or **AppsGeyser**.
1. Zip your project files.
2. Upload to the service.
3. Download the APK.
*Note: These free services may include ads or have limitations.*
