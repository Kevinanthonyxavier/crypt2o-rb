'use client';

import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

interface CountProps {
  end?: number;
  start?: number;
  prefix?: string;
  suffix?: string;
}

function CountUp({ end = 0, prefix = '', suffix = '' }: CountProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < 2000) {
        setCount(Math.min(end, Math.floor((progress / 2000) * end)));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end]);

  return (
    <span aria-live="polite">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

function CountDown({ start = 0, end = 0, prefix = '', suffix = '' }: CountProps) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < 2000) {
        setCount(Math.max(end, start - Math.floor((progress / 2000) * (start - end))));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [start, end]);

  return (
    <span aria-live="polite">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default function AboutUs() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("visible");
    }
  }, [controls, inView]);

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

  const statVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <><section id="about" ref={ref} className="py-20 px-4 bg-gray-900 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <motion.div variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
          >
            About Crypt2o.com
          </motion.h2>
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-100 to-pink-300"
          >
            Crypt2o: Exclusive Crypto. Unmatched Growth. Unlimited Potential.

          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg mb-6 text-gray-300">
            Welcome to Crypt2o.com, where tomorrow&apos;s crypto opportunities are available today. While others wait for the next big thing, we give you early access to pre-release coins—crypto assets with massive growth potential that haven&apos;t hit the public market yet. That&apos;s right, exclusive coins for exclusive traders, only on Crypt2o!
          </motion.p>
          <motion.p variants={itemVariants} className="text-lg mb-6 text-gray-300">
            But we don&apos;t stop there. With our AI-powered trading system, you get more than just access—you get the smart growth your assets need. Our system analyzes the market, makes the best moves for you, and ensures your portfolio grows seamlessly, with minimal risk. It&apos;s like having a professional trader working for you 24/7.
          </motion.p>
          <motion.p variants={itemVariants} className="text-lg mb-6 text-gray-300">
            At Crypt2o, we&apos;re not just about crypto. We&apos;re about empowering you to take control of your financial future with the most exclusive tools and investment opportunities. Ready to start growing? Join the wave today!
          </motion.p>
          <motion.div variants={containerVariants} className="flex justify-center space-x-4">
            <motion.div variants={statVariants} className="bg-gray-800 p-6 rounded-lg">
              <motion.h3
                className=" text-3xl font-bold mb-2 text-purple-400"
                key={inView ? 'visible' : 'hidden'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {inView && <CountDown start={150} end={100} suffix="k+" />}
              </motion.h3>
              <p className="text-gray-400 text-lg">Active Users</p>
            </motion.div>
            <motion.div variants={statVariants} className="bg-gray-800 p-6 rounded-lg">
              <motion.h3
                className="text-3xl font-bold mb-2 text-purple-400"
                key={inView ? 'visible' : 'hidden'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {inView && <CountUp end={500} prefix="$" suffix="M+" />}
              </motion.h3>
              <p className="text-gray-400 text-lg">Assets Managed</p>
            </motion.div>
            <motion.div variants={statVariants} className="bg-gray-800 p-6 rounded-lg">
              <motion.h3
                className="text-3xl font-bold mb-2 text-purple-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                24/7
              </motion.h3>
              <p className="text-gray-400 text-lg">Support</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <AnimatedBackground />
    </section><section id="vision" className="py-20 px-4 bg-gray-900 relative overflow-hidden">
  <div className="container mx-auto text-center relative z-10">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="max-w-4xl mx-auto"
    >
      <motion.h2
        variants={itemVariants}
        className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        >
        Vision
      </motion.h2>
      <motion.p
        variants={itemVariants}
        className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-100 to-pink-300"
        >Shaping the Future of Crypto—One Exclusive Coin at a Time
            </motion.p>

      <motion.p
        variants={itemVariants}
        className="text-lg text-gray-300 mb-6"
      >Shaping the Future of Crypto—One Exclusive Coin at a Time
        At Crypt2o, we believe in pioneering the future of finance, and we’re making it happen. Our vision is to give you access to cutting-edge, pre-release coins that are set to transform the crypto landscape. These aren’t just any coins—they’re the next big thing, available only to our community of forward-thinking investors.
      </motion.p>
      <motion.p
        variants={itemVariants}
        className="text-lg text-gray-300 mb-6"
      >
        We’ve harnessed the power of AI to create a platform that not only helps you access these coins but also ensures your investments grow effortlessly, without the usual stress or risk. We’re not here to follow trends—we’re here to create them. Our mission is to help you secure the financial freedom you deserve, by putting the future of crypto right at your fingertips.
      </motion.p>
      <motion.p
        variants={itemVariants}
        className="text-lg text-gray-300 mb-6"
      >
        Join us and let’s make history, together.
      </motion.p>
    </motion.div>
  </div>
  <AnimatedBackground />
</section>
<section id="faqs" className="py-20 px-4 bg-gray-900 relative overflow-hidden">
  <div className="container mx-auto relative z-10">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="max-w-4xl mx-auto text-center"
    >
      <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
          >
            FAQs

          </motion.h2>

      <motion.h2
        variants={itemVariants}
        className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-100 to-pink-300"
        >
        Your Crypto Journey Starts Here—Everything You Need to Know
      </motion.h2>
    </motion.div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
      {/* FAQ 1 */}
      
      <motion.div
        variants={itemVariants}
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold text-purple-400 mb-2">
          What is Crypt2o.com?
        </h3>
        <p className="text-gray-300">
          Crypt2o is your exclusive gateway to the future of crypto. We offer
          pre-release coins—high-potential crypto assets that are still under
          the radar for most of the market. With our AI-powered trading system,
          you can grow your assets effortlessly, avoid market volatility, and
          maximize your investment potential.
        </p>
      </motion.div>
      {/* FAQ 2 */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold text-purple-400 mb-2">
          Why should I choose Crypt2o?
        </h3>
        <p className="text-gray-300">
          Because we offer exclusive access to coins that aren’t available
          anywhere else. We combine this with our AI-powered trading system,
          which ensures that your investments grow smoothly and intelligently.
          If you want to stay ahead of the curve in crypto, there’s no better
          place than Crypt2o.
        </p>
      </motion.div>
    </div>
  </div>
  <AnimatedBackground />
</section>

<section id="pre-release" className="py-20 px-4 bg-gray-800 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
              >
              Pre-Release
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg mb-6 text-gray-300">
            What makes pre-release coins so valuable?
Pre-release coins are the hidden gems of the crypto world. They’re early-stage assets with huge growth potential—coins that have not yet been exposed to the public market. By joining Crypt2o, you get in on the ground floor, where early investors stand to earn the most. These exclusive opportunities are only available here—don’t miss out!
          </motion.p>
          <motion.p variants={itemVariants} className="text-lg mb-6 text-gray-300">
          How do I access pre-release coins?
                    </motion.p>
                    <div className="container mx-auto relative z-10">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="max-w-4xl mx-auto text-center"
    >
      <motion.h2
        variants={itemVariants}
        className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
      >
        How Do I Access Pre-Release Coins?
      </motion.h2>
      <motion.p
        variants={itemVariants}
        className="text-lg mb-6 text-gray-300"
      >
        Getting in is easy and fast. Follow these simple steps to unlock exclusive access to high-potential, pre-release coins:
      </motion.p>
    </motion.div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {/* Step 1 */}
      <motion.div
        variants={itemVariants}
        className="pt-8 bg-gray-600 p-6 rounded-lg shadow-lg text-center"
      >
        <h3 className="text-xl font-semibold text-purple-400 mb-2">
          1. Sign Up
        </h3>
        <p className="text-gray-300">
          Create your Crypt2o account in seconds and join the exclusive community of forward-thinking traders.
        </p>
      </motion.div>
      {/* Step 2 */}
      <motion.div
        variants={itemVariants}
        className="pt-8 bg-gray-600 p-6 rounded-lg shadow-lg text-center"
      >
        <h3 className="text-xl font-semibold text-purple-400 mb-2">
          2. Fund Your Wallet
        </h3>
        <p className="text-gray-300">
          Start trading with as little as <span className="font-bold">$[minimum deposit]</span>. Secure your investment today!
        </p>
      </motion.div>
      {/* Step 3 */}
      <motion.div
        variants={itemVariants}
        className="pt-8 bg-gray-600 p-6 rounded-lg shadow-lg text-center"
      >
        <h3 className="text-xl font-semibold text-purple-400 mb-2">
          3. Unlock Exclusive Access
        </h3>
        <p className="text-gray-300">
          Gain early access to pre-release coins before they hit the market and get a head start on growing your portfolio.
        </p>
      </motion.div>
    </div>
  </div>
           
            <motion.p variants={itemVariants} className="pt-12 text-lg mb-6 text-gray-300">
            Is there a deadline for joining the pre-release?
Yes! The pre-release phase is limited and spots are filling up fast. Don’t wait until it’s too late—secure your spot now and start investing before the opportunity is gone.</motion.p>
          </motion.div>
        </div>
        <AnimatedBackground />
      </section>
      <section id="platform-security" className="py-20 px-4 bg-gray-900 relative overflow-hidden">
  <div className="container mx-auto relative z-10">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="max-w-4xl mx-auto text-center"
    >
      <motion.h2
        variants={itemVariants}
        className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
      >
        Platform & Security
      </motion.h2>
    </motion.div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
      {/* FAQ 1 */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold text-purple-400 mb-2">
          How secure is Crypt2o?
        </h3>
        <p className="text-gray-300">
          Your security is our top priority. Crypt2o is built with
          state-of-the-art encryption and advanced blockchain technology to
          keep your funds and data completely safe. Our AI-powered trading
          system ensures your assets grow securely, without the worry of market
          crashes or volatility.
        </p>
      </motion.div>
      {/* FAQ 2 */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold text-purple-400 mb-2">
          How does the AI-powered trading system work?
        </h3>
        <p className="text-gray-300">
          Our AI-powered system uses advanced algorithms to analyze market
          trends and make smarter trades for you. It’s like having a
          professional trader at your side, optimizing every move while keeping
          your investments safe and growing. Simply set it up, sit back, and
          watch your portfolio thrive.
        </p>
      </motion.div>
      </div>
      
      </div>
  
  <AnimatedBackground />
</section>
<section id="support-community" className="py-20 px-4 bg-gray-900 relative overflow-hidden">
  <div className="container mx-auto relative z-10">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="max-w-4xl mx-auto text-center"
    >
      <motion.h2
        variants={itemVariants}
        className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
      >
        Support & Community
      </motion.h2>
    </motion.div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
      {/* FAQ 1 */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold text-purple-400 mb-2">
          What if I need help or have questions?
        </h3>
        <p className="text-gray-300">
          Our team is available 24/7 to ensure you have the best experience possible. Whether you need help with your account or have a question about trading, we’ve got you covered. Reach out to us via live chat, email, or phone. Plus, connect with fellow traders on our active community channels on Telegram, Discord, and social media.
        </p>
      </motion.div>
      {/* FAQ 2 */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold text-purple-400 mb-2">
          Can I connect with other Crypt2o users?
        </h3>
        <p className="text-gray-300">
          Absolutely! Community is key to success in crypto. Join our vibrant community of traders to share tips, get updates, and collaborate with like-minded individuals who are all working toward the same goal—success in crypto. Stay informed, stay engaged, and watch your investments grow.
        </p>
      </motion.div>
    </div>
    <motion.div variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-3xl mx-auto text-center pt-12"
        >
     <motion.p variants={itemVariants} className="text-lg mb-6 text-gray-300">
          The Future of Crypto is Here: Exclusive Pre-Release Coins Only on Crypt2o.com!          </motion.p>
          <motion.p variants={itemVariants} className="text-lg mb-6 text-gray-300">
          No other platform lets you trade pre-release coins, but we do! With our AI-powered trading system, we ensure your assets grow seamlessly while minimizing risks. Don’t just trade—thrive with Crypt2o!          </motion.p>
          </motion.div>
  </div>
  <AnimatedBackground />
</section>


      </>
  );
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-30">
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute top-40 right-10 w-20 h-20 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl"
      />
    </div>
  );
}