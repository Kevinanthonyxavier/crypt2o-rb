"use client"
import React, {  useState } from 'react';
import RegisterModal from '@/components/RegisterModal';
import Home from '../page';

const HomePage: React.FC = () => {
 

    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(true)
  
  return (
    <div>
     
      <Home/>
      <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)}  />
    </div>
  );
};

export default HomePage;