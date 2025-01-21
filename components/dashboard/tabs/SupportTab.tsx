import React, { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { 
  Send, 
  ArrowRight, 
  MessageSquare, 
  Phone, 
  Mail,
} from 'lucide-react';
//import { useToast } from "@/components/ui/use-Toast";
import  {ToastContainer}  from '@/components/ui/toastcontainer'; // Update the path to the correct file
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { db } from '@/lib/firebase' // Adjust the path as necessary
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import { showToast } from '@/utils/toast';


// Types
type SupportTicketForm = {
  subject: string;
  message: string;
  email: string;
  name: string;
}



type FAQItem = {
  question: string;
  answer: string;
  category: string;
};


// Support Channels Component
const SupportChannels: React.FC<{ onLiveChat: () => void; className?: string; contactInfo: { phone: string; email: string } | null }> = ({ onLiveChat, className, contactInfo }) => (
<div className={`mt-8 grid gap-8 md:grid-cols-3 ${className }`}>
    {[
      {
        title: "Live Chat",
        description: "Chat with a support agent",
        icon: MessageSquare,
        action: onLiveChat
      }, 
      {
        title: "Phone Support",
        description: "Call our support team",
        icon: Phone,
        detail: contactInfo?.phone || "Loading",
        subDetail: "Mon-Fri: 9AM - 5PM EST"
      },
      {
        title: "Email Support",
        description: "Send us an email",
        icon: Mail,
        detail: contactInfo?.email || "Loading",
        subDetail: "24/7 Support"
      }
    ].map(({ title, description, icon: Icon, action, detail, subDetail }, index) => (
      <motion.div  key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}  >
 
      
      <Card 
        key={index} 
        
        style={{ height: '200px', borderRadius: '2rem'  }} className="bg-white bg-opacity-80 backdrop-blur-lg border-purple-600 border-2"
      >
        
        <CardHeader>
          <CardTitle className='text-2xl font-bold bg-clip-text text-black'>{title}</CardTitle>
          <CardDescription className="text-lg text-gray-800">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {action ? (
            <Button className="w-full hover:bg-purple-600 text-white" onClick={action}>
              <Icon className="mr-2 h-4 w-4 " /> Start Chat
            </Button>
          ) : (
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2 ">
                <Icon className ="h-5 w-5 text-black" />
                <p className="text-lg font-semibold text-black ">{detail}</p>
              </div>
              <p className="text-base  text-black text-opacity-80">{subDetail}</p>
            </div>
          )}
        </CardContent>
      </Card>
      </motion.div>
    ))}
  </div>
  
);

// Main Support Center Component
const SupportCenter: React.FC = () => {

  const [contactInfo, setContactInfo] = useState<{ phone: string; email: string; } | null>(null);
  

 
  
  //const { toast } = useToast();
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission
  // const [supportTicketForm, setSupportTicketForm] = useState<SupportTicketForm>({
  //   subject: '',
  //   message: '',
  //   email: '',
  // });

  const [supportTicketForm, setSupportTicketForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  

  
    const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);


    //
    useEffect(() => {
      const fetchContactInfo = async () => {
        try {
          const contactCollection = collection(db, "adminsettings"); // Change to your collection name
          const contactSnapshot = await getDocs(contactCollection);
          const contactData = contactSnapshot.docs.map(doc => doc.data());
          
          // Assuming you have a single document for contact info
          if (contactData.length > 0) {
            setContactInfo({
              phone: contactData[0].phone,
              email: contactData[0].email,
              
            });
          }
        } catch (error) {
          console.error("Error fetching contact information:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchContactInfo();
    }, []);
    //
  
    useEffect(() => {
      const fetchFAQs = async () => {
        try {
          const faqCollection = collection(db, "faqs");
          const faqSnapshot = await getDocs(faqCollection);
          const fetchedFAQs = faqSnapshot.docs.map((doc) => ({
            question: doc.data().question,
            answer: doc.data().answer,
            category: doc.data().category,
          }));
          setFaqItems(fetchedFAQs);
        } catch (error) {
          console.error("Error fetching FAQs:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchFAQs();
    }, []);
  

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser ;
    if (user) {
      setSupportTicketForm((prev) => ({
        ...prev,
        email: user.email || '', // Set the email from the current user
        name: user.displayName  || '',
      }));
    }
  }, []);

  


  // Support Ticket Form State
  // const [supportTicketForm, setSupportTicketForm] = useState<SupportTicketForm>({
  //   subject: '',
  //   message: '',
  //   email: '',
  // });

  const [isEmailVisible, ] = useState(false); // Default to true to show the email field
  const [isNameVisible, ] = useState(false); // Default to true to show the email field


  // Form Validation Errors
  const [formErrors, setFormErrors] = useState<Partial<SupportTicketForm>>({});

  // Validate Support Ticket Form
  const validateForm = (): boolean => {
    const errors: Partial<SupportTicketForm> = {};

    if (!supportTicketForm.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!supportTicketForm.message.trim()) {
      errors.message = 'Message is required';
    }

    if (!supportTicketForm.email.trim() || 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportTicketForm.email)) {
      errors.email = 'Valid email is required';
    }
    if (!supportTicketForm.name.trim()) {
      errors.name = 'Name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Support Ticket Submission
  const handleSupportTicketSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateForm()) return; // Validate the form first
  
    setIsSubmitting(true); // Set loading state to true
  
    try {
      // Add a new ticket to the "tickets" collection
      await addDoc(collection(db, 'tickets'), {
        ...supportTicketForm,
        createdAt: serverTimestamp(),
      });
  
      showToast({ title: 'Success', description: 'Support Ticket Submitted! Our team will respond within 24-48 hours.', variant: 'success' });

  
      // Reset form after successful submission
      setSupportTicketForm((prev) => ({
        ...prev,
        subject: '',
        message: '',
      }));
     // setFormErrors({});
    } catch (error) {
      console.error("Error adding document: ", error);
      showToast({ title: 'Error', description: 'Failed to submit ticket', variant: 'error' });
    } finally {
      setIsSubmitting(false); // Ensure the loading state is reset
    }
  };
  

  // Filter FAQs by Category
  const filteredFAQs = selectedCategory
  ? faqItems.filter(item => item.category === selectedCategory)
  : faqItems;

  // const showToast = (message: string) => {
  //   toast.success(message); // Or toast.error(), toast.info() based on use case
  // };

  // const showToast = (message: string) => {
  //   showToast(message); // Show the toast notification
  // };

  return (
    <TabsContent value="support" className="p-8 pb-32">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        {/* Support Title */}
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Support Center
        </motion.h1>

        {/* Category Filters */} 
        <div className="text-lg flex flex-wrap justify-center space-x-4 mb-8">
  {['General', 'Account', 'Transactions', 'Security'].map(category => (
    <Button
      key={category}
      role="tab"
      aria-selected={selectedCategory === category}
      aria-label={`Filter by ${category} category`}
      style={{ borderRadius: '2rem' }}
      className={`text-base transition duration-200 ease-in-out ${
        selectedCategory === category
          ? 'bg-purple-600 text-white hover:bg-purple-600  '
          : 'bg-purple-300 text-black hover:bg-purple-700 hover:text-white'
      }`}
      onClick={() => setSelectedCategory(
        selectedCategory === category ? null : category
      )}
    >
      {category}
    </Button>
  ))}
</div>


<div className="grid gap-8 md:grid-cols-2">
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    style={{ height: '200px' }}
  >
    <Card className="bg-gray-100 bg-gray-800 border-2-gray-700 mb-4" style={{ height: '450px', borderRadius: '2rem' }}>
      <CardHeader>
        <CardTitle className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>Quick Help</CardTitle>
        <CardDescription className="text-base text-gray-400">Find answers to common questions</CardDescription>
      </CardHeader>
      <CardContent className="max-h-64 overflow-y-auto">
        {loading ? (
          <div className='text-white text-lg'>Loading FAQs...</div>
        ) : faqItems.length === 0 ? (
          <div className='text-white text-lg'>No FAQs available.</div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((item) => (
              <Button
                key={item.question}
                variant="ghost"
                className="text-white text-lg w-full justify-between"
                onClick={() => {
                  console.log('Button clicked:', item.question); // Debugging line
                 
                  showToast({ title: 'Answer',  description: ` ${item.answer}`,
                     variant: 'default' });
                }}
              >
                {item.question}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
  {/* <ToastContainer
    // toastOptions={{
    //   position: 'top-center', // Centralize notifications
    //   style: {
    //     zIndex: 9999, // Ensure notifications appear above UI elements
    //     background: '#111827', // Match the app theme
    //     color: '#FFFFFF', // Ensure text visibility
    //   },
    // }}
  /> */}


<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>

          {/* Contact Support Card */}
          <Card className="bg-gray-100 bg-gray-800 border-2-gray-700 mb-4" style={{ height: '450px', borderRadius: '2rem' }}> 
            <CardHeader>
              <CardTitle className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>Contact Support</CardTitle>
              <CardDescription className="text-base text-gray-400">Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent className="max-h-100 overflow-y-auto">
              <form onSubmit={handleSupportTicketSubmit} className="space-y-4 ">
              {isNameVisible && (
                  <div className="space-y-2 ">
                    <Label htmlFor="support-name">Name</Label>
                    <Input
                      id="support-name"
                      placeholder="Your name"
                      value={supportTicketForm.name}
                      onChange={(e) => setSupportTicketForm({
                        ...supportTicketForm, 
                        name: e.target.value
                      })}
                      className={`
                         text-base text-white 
                        bg-white bg-opacity-10 
                        border-white border-opacity-20 py-2
                        ${formErrors.name ? 'border-red-500' : ''}
                      `}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm">{formErrors.name}</p>
                    )}
                  </div>
                )}

                {isEmailVisible && (
                  <div className="space-y-2 ">
                    <Label htmlFor="support-email">Email</Label>
                    <Input
                      id="support-email"
                      placeholder="Your email address"
                      value={supportTicketForm.email}
                      onChange={(e) => setSupportTicketForm({
                        ...supportTicketForm, 
                        email: e.target.value
                      })}
                      className={`
                         text-base text-white 
                        bg-white bg-opacity-10 
                        border-white border-opacity-20 py-2
                        ${formErrors.email ? 'border-red-500' : ''}
                      `}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm">{formErrors.email}</p>
                    )}
                  </div>
                )}
                <div className="space-y-2 flex flex-col">
  <Label className="text-lg text-white" htmlFor="support-subject">
    Subject
  </Label>
  <select
    id="support-subject"
    value={supportTicketForm.subject}
    onChange={(e) =>
      setSupportTicketForm({
        ...supportTicketForm,
        subject: e.target.value,
      })
    }
    className={`
      text-base text-white 
            bg-gray-800 
         border border-purple-300  // Light purple border by default

      border-gray-400   
      placeholder-gray-400 
       py-2 px-3 rounded 
        focus:ring-2 focus:ring-purple-500
        focus:outline-purple-500
      ${formErrors.subject ? 'border-red-500' : ''}
    `}
  >
   <option value="" disabled style={{ color: '#a855f7' }}>
      Select the Type of inquiry
    </option>
    <option value="Account Issue" >Account Issue</option>
    <option value="Withdraw Issue">Withdraw Issue</option>
    <option value="Verification Issue">Verification Issue</option>
    <option value="Others">Others</option>
  </select>
  {formErrors.subject && (
    <p className="text-red-500 text-sm">{formErrors.subject}</p>
  )}
</div>

                <div className="space-y-2">
                  <Label className="text-lg text-white " htmlFor="support-message">Message</Label>
                  <Textarea
                    id="support-message"
                    placeholder="Describe your issue or question in detail"
                    value={supportTicketForm.message}
                    onChange={(e) => setSupportTicketForm({
                      ...supportTicketForm, 
                      message: e.target.value
                    })}
                    
                    className={`
                       text-base text-white 
                      bg-white bg-opacity-10 
                      border-white border-opacity-20
                      placeholder:red-600 
                       focus:placeholder-purple-300 
                      ${formErrors.message ? 'border-red-500' : ''}
                    `}
                    
                  />
                  {formErrors.message && (
                    <p className="text-red-500 text-sm">{formErrors.message}</p>
                  )}
                </div>
                <Button type="submit" className="text-lg w-full bg-purple-500 hover:bg-purple-600 text-white" disabled={isSubmitting}>
  <Send className="mr-2 h-4 w-4" /> {isSubmitting ? 'Submitting...' : 'Submit Ticket'}

</Button>
              </form>
            </CardContent>
          </Card>
          </motion.div>

        </div>


        {/* Support Channels */}
        <SupportChannels onLiveChat={() => setLiveChatOpen(true)} className="mb-8" contactInfo={contactInfo} /> 

        {/* FAQs Section */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>

        <Card style={{ borderRadius: '2rem' }} className="bg-gray-100 bg-gray-800 border-gray-700  mb-8"> 
          <CardHeader>
            <CardTitle className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>FAQs</CardTitle>
            <CardDescription className="text-lg text-gray-400">Frequently asked questions</CardDescription>
          </CardHeader>
          <CardContent>
          {loading ? (
          <p className="text-purple600 text-lg">Loading FAQs...</p>
        ) : faqItems.length === 0 ? (
          <p className="text-white">No FAQs available at the moment. Please check back later.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-xl text-blue-200">{item.question}</AccordionTrigger>
                <AccordionContent className=" text-lg text-white">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
          </CardContent>
        </Card>
        </motion.div>
      

      {/* Live Chat Dialog */}
      <Dialog open={liveChatOpen} onOpenChange={setLiveChatOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Live Support Chat</DialogTitle>
              <DialogDescription>Connect with our support team in real-time.</DialogDescription>
            </DialogHeader>
            <TawkMessengerReact propertyId="64b66b5d94cf5d49dc644d65" widgetId="1h5k96q8t" />
          </DialogContent>
        </Dialog>

       {/* Toast Notifications */}
       <ToastContainer />
      </motion.div>
    </TabsContent>

    
  );
}

export default SupportCenter;