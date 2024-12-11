import { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Create a context for the user info
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Usestate for updating user variable that stores info
    // Also tracks loading state so we don't do premature navigation or have flashing with refreshing
    const [user, setUser] = useState(null);
    const [userDoc, setUserDoc] = useState(null);
    const [loading, setLoading] = useState(true);

    // Track firebaseUser looking at authetntication state
    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            const getUserInfo = async() => {
                if(firebaseUser) {
                    setUser(firebaseUser);
    
                    // Firestore document for user as well
                    const userRef = doc(db, 'users', firebaseUser.uid);
                    const userSnapshot = await getDoc(userRef);
                    
                    // If it exists update user info variable
                    if(userSnapshot.exists()) {
                        setUserDoc(userSnapshot.data());
                    } else {
                        setUserDoc(null);
                    }
                } else {
                    setUser(null);
                    setUserDoc(null);
                }
                setLoading(false);
            };

            getUserInfo().catch((e) => {
                console.log(e);
                setLoading(false);
            });
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, userDoc, loading }}>
            { children }
        </UserContext.Provider>
    );
}

//Hook for easy access
export const useUser = () => useContext(UserContext);