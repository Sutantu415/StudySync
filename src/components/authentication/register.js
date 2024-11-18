import './login.css';
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import app from '../../firebase/firebaseConfig';

//Optional(Icons to email/pass)

function RegistrationPage() {
    //Variables
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    //Regex patterns that must be followed for each input
    const patterns = {
        email: /\w+@\w+.com/i,
        name: /\w{5,}/i,
        password: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/
    }

    const validate = () => {
        //Check for empty fields (if they are empty then trigger the error message and exit)
        if(!email || !name || !password) {
            setError(true);
            return;
        }

        //Check for valid inputs
        if(patterns.email.test(email) && patterns.name.test(name) && patterns.password.test(password)) {
            setError(false);
            signUp();
        } else {
            setError(true);
        }
    }

    const signUp = async () => {
        const auth = getAuth(app);

        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCred.user, {
                displayName: name
            });
            navigate('/home');
            console.log('User signed up":', userCred.user);
            console.log('Display Name:', userCred.user.displayName)
        } catch (err) {
            console.log("Couldn't create account");
        }
    }

    return (
        <div className="flex min-h-screen justify-center bg-gradient-to-b from-indigo-900 via-blue-800 to-cyan-500">
            <div className="flex w-2/3 justify-center">
                <div>
                    <h1 className="flex font-sans font-bold text-white text-5xl drop-shadow-lg mt-40 pb-5 justify-center">StudySync</h1>
                    <div className='bg-sky-400 p-5 flex-col rounded-[10px]'>
                        <input type='text' name='email' placeholder='Email' onChange={(event) => setEmail(event.target.value)}></input>
                        <input type='text' name='name' placeholder='Display Name' onChange={(event) => setName(event.target.value)}></input>
                        <input type='password' name='pass' placeholder='Password' onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => {if(event.key === 'Enter') {validate()}}}></input>
                        <div className ="flex justify-center space-x-4 mt-4">
                            <button className='block bg-blue-600 hover:bg-blue-800 rounded-lg text-white font-semibold w-1/2 py-4 mt-4' onClick={validate}>Sign Up</button>
                        </div>
                    </div>
                    {error && (<p className='my-2 text-red-500 text-center'>Invalidate Submission - Edit Message Later</p>)}
                </div>
            </div>
        </div>
        
    );
}

export default RegistrationPage;