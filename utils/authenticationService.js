const FB_APP_ID = '2049634398613694';
const GOOGLE_APP_ID = '491794257921-coni26alolsdnloot54aocprea200qs6.apps.googleusercontent.com';
const GOOGLE_IOS_ID = '491794257921-edm66h82ukq4vth0qmh4csgrdnddmq4l.apps.googleusercontent.com';

// renamen naar facebook login
export const handleUserLogin = async () => {
  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(FB_APP_ID, {
    permissions: ['public_profile'],
    behavior: 'web',
  });

  if (type === 'success') {
    // Get the user's name using Facebook's Graph API
    const userFbInfoResponse = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`);
    return userFbInfoResponse.json();
  }
  return {};
};

export const handleGoogleLogin = async (accesToken) => {
  try {
    const result = await Expo.Google.logInAsync({
      behavoir: 'web',
      webClientId: GOOGLE_APP_ID,
      iosClientId: GOOGLE_IOS_ID,
      scopes: ['profile', 'email'],
    });
  
    if(result.type === 'success') {
      let userInfo = await fetch('https://www.googleapis.com/userinfo/v2/me', { headers: { Authorization: `Bearer ${accessToken}`}, })
      return userInfo;
      } else {
        return {cancelled: true};
    }
  } catch(e) {
    return {error: true};
  }
}