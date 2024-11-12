// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Directly import from Firebase
// import { useEffect } from 'react';
// import { registerUser } from './firebase/auth'; // Import custom method from your `auth.js`
// import app from './firebase/firebaseConfig';    // Ensure correct Firebase config import

/*function App() {
  useEffect(() => {
    const testRegister = async () => {
      const auth = getAuth(app); // Initialize Firebase Auth
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          'testuser@example.com', // Test email
          'password123'          // Test password
        );
        console.log('User registered:', userCredential.user);
      } catch (error) {
        console.error('Error registering user:', error.message);
      }
    };

    testRegister(); // Call the test function
  }, []); // Empty dependency array ensures it runs only once

  return (
    <div className="App">
      <header className="App-header">
        <h1>Firebase Test</h1>
        <p>Check the console for Firebase Authentication test results.</p>
      </header>
    </div>
  );
}

export default App;*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/authentication/login';
import HomePage from './components/home'



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />}/>
        <Route path="/home" element={<HomePage />}/>
      </Routes>
    </Router>
  );
}

export default App;
