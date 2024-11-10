import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Directly import from Firebase
import { useEffect } from 'react';
//import { registerUser } from './firebase/auth'; // Import custom method from your `auth.js`
import app from './firebase/firebaseConfig';    // Ensure correct Firebase config import

function App() {
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

export default App;


// import logo from './logo.svg';
// import './App.css';


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
//
//export default App;
