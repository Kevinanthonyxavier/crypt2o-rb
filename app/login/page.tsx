"use client"
import React, {  useState } from 'react';
import LoginModal from '@/components/LoginModal';
import Home from '../page';

const HomePage: React.FC = () => {
 

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(true)
  
  return (
    <div>
     
      <Home/>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}  />
    </div>
  );
};

export default HomePage;