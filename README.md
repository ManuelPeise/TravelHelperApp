This is a new React Native project, bootstrapped using @react-native-community/cli.

TravelHelper
Explore. Plan. Enjoy.

A React Native travel companion app that helps you manage currencies, shopping lists, packing lists, and vocabulary — all stored locally on your device with no data sent to external servers.

Features
Feature	Description
Currency Converter	Convert between currencies using live exchange rates
Shopping List	Create and manage multiple shopping lists with products and categories
Packing List	Organize packing lists per trip, assign items to persons
Vocabulary	Learn travel vocabulary by category with a built-in quiz mode
Settings	Switch language, theme, and source/target currencies
Tech Stack
React Native 0.85.3
React 19.2.3
TypeScript 5.8.3
React Navigation 7.x (Bottom Tabs + Native Stack)
SQLite (react-native-sqlite-storage) — all data stored locally
i18next — English and German localizations
Ionicons — UI icons
Requirements
Platform	Requirement
Android	API 24+ (Android 7.0)
iOS	arm64 device (iPhone)
Node.js	18+
Java	17+
Getting Started
1. Install dependencies
npm install
2. Android
npx react-native run-android
3. iOS
cd ios && pod install && cd ..
npx react-native run-ios
Project Structure
src/
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── lib/
│   ├── constants.ts
│   ├── database/     # SQLite repositories
│   ├── enums/
│   ├── localizations/ # i18n translations (EN, DE)
│   └── types/
├── navigation/       # Root navigator
├── providers/        # Context providers
└── screens/
    ├── currencyConversion/
    ├── packingList/
    ├── shoppingList/
    ├── vocabularyScreen/
    ├── report/        # Bug report screen
    ├── impressum/
    └── SettingsScreen.tsx
Environment Variables
Copy .env.example to .env and fill in your values:

cp .env.example .env
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
Privacy
All data is stored exclusively on the user's device. No personal data is transmitted to or processed by external servers. Locally stored data can be deleted at any time via the app settings.

License
© 2026 Manuel Peise. All rights reserved.

Step 1: Start Metro
First, you will need to run Metro, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

# Using npm
npm start

# OR using Yarn
yarn start
Step 2: Build and run your app
With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

Android
# Using npm
npm run android

# OR using Yarn
yarn android
iOS
For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

bundle install
Then, and every time you update your native dependencies, run:

bundle exec pod install
For more information, please visit CocoaPods Getting Started guide.

# Using npm
npm run ios

# OR using Yarn
yarn ios
If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

Step 3: Modify your app
Now that you have successfully run the app, let's make changes!

Open App.tsx in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by Fast Refresh.

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

Android: Press the R key twice or select "Reload" from the Dev Menu, accessed via Ctrl + M (Windows/Linux) or Cmd ⌘ + M (macOS).
iOS: Press R in iOS Simulator.
Congratulations! 🎉
You've successfully run and modified your React Native App. 🥳

Now what?
If you want to add this new React Native code to an existing application, check out the Integration guide.
If you're curious to learn more about React Native, check out the docs.
Troubleshooting
If you're having issues getting the above steps to work, see the Troubleshooting page.

Learn More
To learn more about React Native, take a look at the following resources:

React Native Website - learn more about React Native.
Getting Started - an overview of React Native and how setup your environment.
Learn the Basics - a guided tour of the React Native basics.
Blog - read the latest official React Native Blog posts.
@facebook/react-native - the Open Source; GitHub repository for React Native.
