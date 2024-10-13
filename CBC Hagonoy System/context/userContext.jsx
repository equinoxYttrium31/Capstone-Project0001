import axios from "axios";
import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // New loading state
    const [error, setError] = useState(null); // New error state

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get('http://localhost:8000/profile', {
                    withCredentials: true
                });
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data'); // Set error message
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        if (!user) {
            fetchUserData();
        }

        // Cleanup function (optional, based on your application needs)
        return () => {
            setUser(null); // Reset user state on unmount if needed
            setLoading(false); // Reset loading on unmount
            setError(null); // Reset error state on unmount
        };
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, loading, error }}>
            {children}
        </UserContext.Provider>
    );
}

// Add prop types validation for 'children'
UserContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
