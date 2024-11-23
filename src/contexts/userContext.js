import { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Create a context for the user info
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Usestate for updating user variable that stores info
    // Also tracks loading state so we don't do premature navigation or have flashing with refreshing
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Track firebaseUser looking at authetntication state
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if(firebaseUser) {
                setUser(firebaseUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            { children }
        </UserContext.Provider>
    );
}

//Hook for easy access
export const useUser = () => useContext(UserContext);