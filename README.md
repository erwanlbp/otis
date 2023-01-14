# Keep track with Otis

## Setup

You just need to add the firebase config in `src/environments/firebase.config.ts`. It looks like :

```ts
export const firebaseConfig = {
  apiKey: 'xxx',
  authDomain: 'otis-count.firebaseapp.com',
  databaseURL: 'https://otis-count.firebaseio.com',
  projectId: 'otis-count',
  storageBucket: 'otis-count.appspot.com',
  messagingSenderId: 'xxx',
  appId: 'xxx',
  measurementId: 'xxx',
};

export const firebaseWebClientId = 'xxx.apps.googleusercontent.com';
```

Go to <https://console.firebase.google.com/u/1/project/otis-count/settings/general>

- Open the Web app configuration
- Copy the code block with the `firebaseConfig` variable

Go to <https://console.firebase.google.com/u/1/project/otis-count/authentication/providers>

- Open the Google authentication
- Expand Web SDK configuration
- Copy the Web Client ID in the `firebaseWebClientId` variable

## Run on android device

```bash
ionic cordova prepare android
adb devices # To detect connected device
ionic cordova run android --livereload --debug --device --consolelogs
```

## Deploy web app

The deploy is done by Github Action CD when PR is merged on master.

If the label `deploy_preview` is set on a PR, a preview will be deployed by Github Action to test before deploying to live website, that will output a URL like : <https://otis-count--pr33-elbp-add-cd-2slnz7xz.web.app/>
