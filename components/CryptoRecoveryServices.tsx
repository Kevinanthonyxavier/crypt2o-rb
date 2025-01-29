'use client';

import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { Shield, Key, RefreshCw, ChevronDown, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import {  useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { showToast } from '@/utils/toast';



const services = [
  { icon: Shield, title: "Secure Process", description: "Our recovery process is designed with your security in mind." },
  { icon: Key, title: "Expert Team", description: "Our team of experts has years of experience in crypto recovery." },
  { icon: RefreshCw, title: "High Success Rate", description: "We've helped countless clients recover their lost crypto." },
];
interface ServiceCardProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    description: string;
  }
  
  function ServiceCard({ icon: Icon, title, description }: ServiceCardProps) {
  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div variants={iconVariants}>
        <Icon className="w-12 h-12 mb-4 text-purple-400" />
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

export default function CryptoRecoveryServices() {
  const [, setIsLoading] = useState(false);
  const [, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', details: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);


  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [3, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  // 
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setMessage(null);

    const name = (document.getElementById("name") as HTMLInputElement).value.trim();
    const email = (document.getElementById("email") as HTMLInputElement).value.trim();
    const details = (document.getElementById("details") as HTMLTextAreaElement).value.trim();

    if (!name || !email || !details) {
      setMessage({ type: "error", text: "All fields are required!" });
      setIsLoading(false);
      return;
    }

    const formData = { name, email, details };

    try {
      const response = await fetch('/api/send-recovery-email',{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

        // Check if the response is OK (status code 200)
  if (!response.ok) {
    const errorText = await response.text(); // Get the error message as text
    console.error("Error response:", errorText);
    alert("Failed to send the request. Please try again later.");
    return;
  }

      const result = await response.json();

      if (result.success) {
       // setMessage({ type: "success", text: "Recovery request sent successfully!" });
        setFormData({ name: '', email: '', details: '' });
        showToast({
                    title: 'Success',
                    description: 'Email was sent successfully',
                    variant: 'success',
                  });
      } else {
        showToast({
                    title: 'Error',
                    description: 'Could not send email',
                    variant: 'error',
                  });
       // setMessage({ type: "error", text: "Failed to send the request. Please try again later." });
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      //setMessage({ type: "error", text: "An error occurred. Please try again." });
    }

    setIsLoading(false);
    try {
      const response = await fetch('/api/send-recovery-email', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        //alert("Recovery request sent successfully!");
        // Clear form fields
        setFormData({ name: '', email: '', details: '' });
      } else {
        //alert("Failed to send the request. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  const isFormValid = formData.name && formData.email && formData.details; // Check if all fields are filled


 

  return (
    <section id="crypto recovery" ref={ref} className="">
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
        <motion.div
          ref={containerRef}
          className="container mx-auto px-4 py-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ opacity, scale }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            variants={itemVariants}
          >
            Crypto Recovery Services
          </motion.h1>

          <motion.p
            className="text-xl mb-12 text-center text-gray-300"
            variants={itemVariants}
          >
            Lost access to your cryptocurrency? We&apos;re here to help you recover your assets safely and securely.
          </motion.p>

          <motion.div className="grid md:grid-cols-3 gap-8 mb-16" variants={containerVariants}>
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </motion.div>

          <motion.div className="flex justify-center mb-16" variants={itemVariants}>
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="w-8 h-8 text-purple-400" />
            </motion.div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit} // Attach the handler here

            className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg"
            variants={formVariants}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Request Recovery Assistance</h2>
            <motion.div className="mb-4" variants={itemVariants}>
              <label htmlFor="name" className="block mb-2">Name</label>
              <Input id="name" placeholder="Your Name" 
              value={formData.name} 
              onChange={handleChange} 
              className="bg-gray-700 border-gray-600 text-white" />
            </motion.div>

            <motion.div className="mb-4" variants={itemVariants}>
              <label htmlFor="email" className="block mb-2">Email</label>
              <Input id="email" type="email" placeholder="Your Email" 
              value={formData.email} 
              onChange={handleChange} 
              className="bg-gray-700 border-gray-600 text-white" />
            </motion.div>

            <motion.div className="mb-4" variants={itemVariants}>
              <label htmlFor="details" className="block mb-2">Recovery Details</label>
              <Textarea id="details" placeholder="Please provide details about your lost crypto" 
               value={formData.details} 
               onChange={handleChange} 
               className="bg-gray-700 border-gray-600 text-white h-32" />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300" 
            disabled={!isFormValid || isSubmitting} // Disable the button if form is invalid or submitting
          >
            {isSubmitting ? 'Sending...' : 'Submit Request'} <ArrowRight className="ml-2" />
          </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}

// function AnimatedBackground() {
//   return (
//     <div className="absolute inset-0 z-0 opacity-30">
//       <motion.div
//         animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
//         transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
//         className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl"
//       ></motion.div>
//       <motion.div
//         animate={{ x: [0, -30, 0], y: [0, 50, 0], scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
//         transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
//         className="absolute top-40 right-10 w-20 h-20 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl"
//       ></motion.div>
//       <motion.div
//         animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1], rotate: [0, 180, 0] }}
//         transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse' }}
//         className="absolute bottom-10 left-1/2 w-20 h-20 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl"
//       ></motion.div>
//     </div>
//   );
// }

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 10,
    },
  },
};

const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};
