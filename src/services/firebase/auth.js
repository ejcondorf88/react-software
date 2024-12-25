import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";

export const initializeRecaptcha = () => {
  if (window.recaptchaVerifier) {
    return console.log("reCAPTCHA already initialized");
  }

  const recaptchaContainer = document.getElementById("recaptcha-container");
  if (!recaptchaContainer) {
    throw new Error("ReCAPTCHA container not found.");
  }

  window.recaptchaVerifier = new RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "invisible",
      callback: () => console.log("ReCAPTCHA verified"),
      "expired-callback": () =>
        console.log("ReCAPTCHA expired. Please try again."),
    },
    auth
  );
};

export const sendOTP = async (phoneNumber) => {
  try {
    initializeRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    );
    window.confirmationResult = confirmationResult;
    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};
