import firebase from 'firebase/app';

export const isEmailVerified = async () => {
  try {
    const { currentUser } = firebase.auth();
    await currentUser.reload();

    return currentUser.emailVerified;
  } catch (error) {
    console.error(error);
  }
};
