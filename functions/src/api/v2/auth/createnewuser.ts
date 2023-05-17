import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import { HttpsError } from 'firebase-functions/v1/auth'
import { ApiError } from '../../../utils/ApiError'
import { checkNameExists, checkUserNameExists } from '../../../utils/checkExists'

export const createNewUser = functions.https.onCall(async (data, context) => {
    try {
      const { email, password, firstname, lastname, username } = data;
  
      if (!email || !password || !firstname || !lastname || !username) {
        throw new ApiError(
          400,
          'Insufficient params in request'
        );
      }
  
      await checkUserNameExists(username);
      await checkNameExists(firstname, lastname);
  
      const userRecord = await getAuth().createUser({
        email,
        emailVerified: false,
        password,
        displayName: `${firstname} ${lastname}`,
        photoURL:
          'https://d11b3pf7ulbs6a.cloudfront.net/static/img/panda.png',
        disabled: false,
      });
  
      const userProfile = {
        id: userRecord.uid,
        firstname,
        lastname,
        username,
        email,
        bio: '',
        avatar: '',
        travelPlans: [],
        type: 'user-profile',
      };
  
      await getFirestore()
        .collection('profiles')
        .doc(userRecord.uid)
        .set(userProfile);
  
      return userProfile;
    } catch (error) {
      throw new HttpsError('unknown', (error as Error).message);
    }
  });
  