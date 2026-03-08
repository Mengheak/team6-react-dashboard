import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

class AuthService {
  public static async login(credential: { email: string; password: string }) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credential.email, 
      credential.password,
    );
    const idToken = await userCredential.user.getIdToken();
    return idToken;
  }
}

export default AuthService;
