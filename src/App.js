import React, {useState} from 'react'
import firebase from './firebase'
import './App.css';

function App() {
  const [mynumber, setnumber] = useState("");
  const [otp, setotp] = useState("");
 const handleChange = (e) =>{
   setnumber(e.target.value);
   setotp(e.target.value);
 }
  const configureCaptcha = () =>{
    window.recaptchaVerifier= new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onSignInSubmit();
        console.log("Recaptcha verified")
      },
      defaultCountry: "IN"
    });
  }
 const onSignInSubmit = (e) => {
    e.preventDefault()
    configureCaptcha()
    const phoneNumber = "+91" + mynumber
    console.log(phoneNumber)
    const appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          console.log("OTP has been sent")
          // ...
        }).catch((error) => {
          // Error; SMS not sent
          // ...
          console.log("SMS not sent")
        });
  }
  const onSubmitOTP = (e) =>{
    e.preventDefault()
    const code = otp
    console.log(code)
    window.confirmationResult.confirm(code).then((result) => {
      // User signed in successfully.
      const user = result.user;
      console.log(JSON.stringify(user))
      alert("User is verified")
      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      // ...
      alert("You have entered an incorrect OTP. Please submit correct OTP")
    });
  }
    return (
      <div className='h-screen flex bg-red border-2'>
      <div className='w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16'>
      <h2 className='font-medium text-primary mt-4 mb-12 text-center'>Login Form</h2>
      <form onSubmit={onSignInSubmit}>
        <div id="sign-in-button"></div>
        <input type="number" name={mynumber} placeholder="Mobile number" className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
         required onChange={handleChange}/>
         <button type="submit"  className={`bg-green py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}>Submit</button>
      </form>

      <h2>Enter OTP</h2>
      <form onSubmit={onSubmitOTP}>
        <input type="number" name={otp} placeholder="OTP Number" className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
         required onChange={handleChange}/>
        <button type="submit"  className={`bg-green py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}>Submit</button>
      </form>
      </div>
      </div>
    )
  }

export default App
