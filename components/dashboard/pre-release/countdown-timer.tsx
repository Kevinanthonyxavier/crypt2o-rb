'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust based on your structure

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isAnimating, setIsAnimating] = useState({
    days: false,
    hours: false,
    minutes: false,
    seconds: false
  });

  const [targetDate, setTargetDate] = useState<Date | null>(null);

  // ✅ Fetch target date from Firestore
  useEffect(() => {
    const fetchTargetDate = async () => {
      try {
        const docRef = doc(db, "adminsettings", "tokenstopwatch");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          let fetchedDate: Date | null = null;

          if (data.targetDate instanceof Timestamp) {
            fetchedDate = data.targetDate.toDate();
          } else if (typeof data.targetDate === "string") {
            fetchedDate = new Date(data.targetDate);
          }

          if (fetchedDate && !isNaN(fetchedDate.getTime())) {
            setTargetDate(fetchedDate);
          } else {
            console.error("Invalid or missing targetDate in Firestore.");
          }
        } else {
          console.error("Document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching target date:", error);
      }
    };

    fetchTargetDate();
  }, []);

  // ✅ Countdown timer calculation with animations
  useEffect(() => {
    if (!targetDate) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const newTimeLeft = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };

      setTimeLeft((prevTime) => {
        const updatedTime = { ...prevTime };

        // ✅ Trigger animation for changed values
        Object.keys(newTimeLeft).forEach((key) => {
          const typedKey = key as keyof typeof newTimeLeft;
          if (newTimeLeft[typedKey] !== prevTime[typedKey]) {
            setIsAnimating((prev) => ({ ...prev, [typedKey]: true }));
            setTimeout(() => {
              setIsAnimating((prev) => ({ ...prev, [typedKey]: false }));
            }, 300); // Adjust animation duration as needed
          }
          updatedTime[typedKey] = newTimeLeft[typedKey];
        });

        return updatedTime;
      });
    };

    updateCountdown(); // ✅ Initial update
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 blur-3xl -z-10" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {Object.entries(timeLeft).map(([key, value]) => (
          <Card key={key} className="relative overflow-hidden bg-gray-800/50 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="relative z-10">
                <div className={cn(
                  "text-4xl md:text-5xl font-bold text-center mb-2 tabular-nums",
                  "bg-gradient-to-br from-white to-purple-200 bg-clip-text text-transparent",
                  "transition-transform duration-300",
                  isAnimating[key as keyof typeof isAnimating] && "scale-125" // ✅ Animation on change
                )}>
                  {value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-center text-gray-400 capitalize">
                  {key}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
