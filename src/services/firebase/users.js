import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../../firebase";

export const getUserByEmail = async (email, password) => {
  const usersRef = collection(db, "Users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No user found with the provided email.");
  }

  const userData = querySnapshot.docs[0].data();

  if (userData.password !== password) {
    throw new Error("Invalid password");
  }

  if (!userData.phone) {
    throw new Error("Phone number not available for this user.");
  }

  return userData;
};
