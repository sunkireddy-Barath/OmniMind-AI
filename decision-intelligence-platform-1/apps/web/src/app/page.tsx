import React from 'react';

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-center">Welcome to the Decision Intelligence Platform</h1>
            <p className="mt-4 text-lg text-center">
                This platform leverages multi-agent decision intelligence to enhance decision-making processes.
            </p>
        </div>
    );
};

export default HomePage;