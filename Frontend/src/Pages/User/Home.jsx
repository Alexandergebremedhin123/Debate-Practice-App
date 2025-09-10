import React from 'react';
import Hero from '../../Components/Hero';
import FindCoach from '../../Components/FindCoach';


const Home = () => {
  return (
    <div className="font-sans w-full max-w-full min-h-screen overflow-x-hidden">
      <Hero />
      <FindCoach />
    </div>
  );
};

export default Home;