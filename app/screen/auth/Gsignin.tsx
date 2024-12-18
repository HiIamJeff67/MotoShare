import { GoogleSignin, isErrorWithCode, statusCodes } from "@react-native-google-signin/google-signin";

export const signIn = async () => {
  GoogleSignin.configure({
    webClientId: "845286501383-anaskssv4t2mn71hddrdll74uamcgne2.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
    scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    forceCodeForRefreshToken: true, // [Android] if you want to show the authorization prompt at each login
  });

  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn().catch((error: Error) => {
      // By default these errors are completely silent :-/
      console.error(error);
    });

    console.warn(response);
  } catch (error: any) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.error("SIGN_IN_CANCELLED");
          break;
        case statusCodes.IN_PROGRESS:
          console.error("IN_PROGRESS");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.error("PLAY_SERVICES_NOT_AVAILABLE");
          break;
        default:
      }
    } else {
    }
  }
};
