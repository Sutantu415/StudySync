import './login.css';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import app from '../../firebase/firebaseConfig';

//Add pattern to email
//Optional(Icons to email/pass)
//Setup firebase code so email and pass inputs create an account
//Change this shitty UI

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const signIn = async () => {
        const auth = getAuth(app);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home');
            setError(false);
        } catch (err) {
            setError(true);
        }
    }

    return (
        <div className="flex min-h-screen justify-center bg-gradient-to-b from-indigo-900 via-blue-800 to-cyan-500">
            <div className="flex w-2/3 justify-center">
                <div>
                    <h1 className="flex font-sans font-bold text-white text-5xl drop-shadow-lg mt-40 pb-5 justify-center">StudySync</h1>
                    <div className='bg-sky-400 py-5 flex-col rounded-[10px]'>
                        <input type='text' name='email' placeholder='Email' value={email} pattern='/\w+\@\w+.com/i' onChange={(event) => setEmail(event.target.value)}></input>
                        <input type='password' name='pass' placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)}></input>
                        <a href="_blank" className='hover:text-white underline'>Forgot Password?</a>
                        <div className ="flex justify-center space-x-4 mt-4" >
                        <button className='block bg-blue-600 hover:bg-blue-800 rounded-lg text-white font-semibold w-1/2 py-4 mt-4 m-auto' onClick={signIn}>Login</button>
                        <button className='block bg-blue-600 hover:bg-blue-800 rounded-lg text-white font-semibold w-1/2 py-4 mt-4 m-auto' onClick={() => navigate('/register')}>Register</button>
                        </div>   
                    </div>
                    {error && (<p className='my-2 text-red-500'>Invalid email or password.</p>)}
                </div>
            </div>
        </div>
        
    );
}

export default LoginPage;