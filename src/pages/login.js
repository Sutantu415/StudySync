import './login.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth } from '../firebase/firebaseConfig';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const signIn = async () => {
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            navigate('/home');
            console.log(userCred.user);
            setError(false);
        } catch (err) {
            setError(true);
            console.log(err);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Illustration */}
            <div className="w-2/3 relative">
                <img
                    src="https://static.vecteezy.com/system/resources/previews/002/779/389/original/student-woman-with-laptop-studying-on-online-course-online-education-concept-illustration-flat-vector.jpg"
                    alt="Illustration"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Login Form */}
            <div className="w-1/2 flex flex-col justify-center items-center bg-white">
                <div className="w-3/4 max-w-md">
                    <div className="flex justify-center mb-6">
                        <img
                            src="https://th.bing.com/th/id/OIP.6sNdGNp6mbrkxV4c29qi1QHaGt?rs=1&pid=ImgDetMain"
                            alt="Company Logo"
                            className="h-16"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

                    {/* Email Input */}
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700">
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

                    {/* Password Input */}
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700">
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
                                    signIn();
                                }
                            }}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="flex justify-between mt-1">
                            {/* Sign Up */}
                            <button
                                onClick={() => navigate('/register')}
                                className="text-sm text-blue-600 hover:underline">
                                Sign Up
                            </button>
                            <button
                                onClick={() => navigate('/forgot-password')}
                                className="text-sm text-blue-600 hover:underline">
                                Forgot password?
                            </button>
                        </div>
                    </div>
                    {/* Login Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={signIn}
                            className="w-full py-2 px-4 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition">
                            Login
                        </button>
                    </div>
                    {error && (
                        <p className="mt-4 text-sm text-red-500 text-center">
                            Invalid email or password.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
