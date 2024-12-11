import './login.css';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';

function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setusernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const patterns = {
    email: /\w+@\w+.com/i,
    name: /\w{5,}/i,
    password: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/
  };

  const validate = () => {
    if (!email || !name || !password) {
      alert("Ensure all fields are filled!");
      return;
    }

    setEmailError(patterns.email.test(email));
    setusernameError(patterns.name.test(name));
    setPasswordError(patterns.password.test(password));

    setSubmitted(true);

    if (emailError && usernameError && passwordError) {
      console.log("Testing");
      signUp();
    }
  };

  const signUp = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });

      await setDoc(doc(db, 'users', userCred.user.uid), {
        uid: userCred.user.uid,
        email: userCred.user.email,
        displayName: name,
        createdAt: new Date(),
        pomodorosCompleted: 0,
        background: "backgroundOne"
      });

      navigate('/home');
      console.log('User signed up:', userCred.user);
      console.log('Display Name:', userCred.user.displayName);
    } catch (err) {
      console.log("Couldn't create account", err);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-2/3 relative">
        <img
          src="https://static.vecteezy.com/system/resources/previews/002/779/389/original/student-woman-with-laptop-studying-on-online-course-online-education-concept-illustration-flat-vector.jpg"
          alt="Illustration"
          className="h-full w-full object-cover" />
      </div>

      {/* Registration Form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white">
        <div className="w-3/4 max-w-md">
          <div className="flex justify-center mb-6">
            <img
              src="https://th.bing.com/th/id/OIP.6sNdGNp6mbrkxV4c29qi1QHaGt?rs=1&pid=ImgDetMain"
              alt="Company Logo"
              className="h-16" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 pl-4">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Please enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 pl-4">
              Display Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              placeholder="Please enter display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 pl-4">
              Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              placeholder="Please enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  validate();
                }
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between items-center w-full mt-4 space-x-4 pl-7">
            {/* Sign Up Button */}
            <button
              onClick={validate}
              className="flex-1 py-2 px-4 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition">
              Sign Up
            </button>

            {/* Login Button */}
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-2 px-4 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition">
              Login
            </button>
          </div>
          {!emailError && submitted && (
            <p className="mt-4 text-sm text-red-500 text-center">
              Ensure that email follows this pattern: "email@domain.com"
            </p>
          )}
          {!usernameError && submitted && (
            <p className="mt-4 text-sm text-red-500 text-center">
              Username must contain atleast 5 characters!
            </p>
          )}
          {!passwordError && submitted && (
            <p className="mt-4 text-sm text-red-500 text-center">
              Password must be 6 characters long, contain one special character, capital letter, and 3 numbers
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
