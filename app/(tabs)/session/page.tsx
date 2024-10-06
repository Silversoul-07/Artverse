'use client';
import React, { useEffect, useState } from 'react';

const SessionComponent = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch('/api/session');

                const data = await response.json();
                setSession(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ backgroundColor: 'white', padding: '20px' }}>
            <h1>Session Data</h1>
            {session ? (
                <pre>{JSON.stringify(session, null, 2)}</pre>
            ) : (
                <p>No session data available</p>
            )}
        </div>
    );
};

export default SessionComponent;