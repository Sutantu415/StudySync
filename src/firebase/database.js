import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Save user data (e.g., profile, preferences)
export const saveUserData = async (userId, data) => {
    try {
        await setDoc(doc(db, 'users', userId), data, { merge: true });
        console.log('User data saved');
    } catch (error) {
        console.error('Error saving user data:', error.message);
        throw error;
    }
};

// Fetch user data (e.g., profile, preferences)
export const fetchUserData = async (userId) => {
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log('No user data found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        throw error;
    }
};

// Add a new study room
export const createStudyRoom = async (roomData) => {
    try {
        const roomRef = await addDoc(collection(db, 'studyRooms'), roomData);
        console.log('Study room created with ID:', roomRef.id);
        return roomRef.id;
    } catch (error) {
        console.error('Error creating study room:', error.message);
        throw error;
    }
};
