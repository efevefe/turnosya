import firebase from 'firebase/app';

export const isEmailVerified = async () => {
  const { currentUser } = firebase.auth();

  await currentUser.reload();

  return currentUser.emailVerified;
};
