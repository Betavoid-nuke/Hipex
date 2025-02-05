"use client"

import React, { useState, useEffect } from "react"
import { Minus, Plus, SquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {DateTimePickerForm} from "../calenderpicker/CalenderPicker"




const Slideshow = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("https://api.unsplash.com/photos/random?count=5&client_id=0TXCTXFveJ-nm2rwEo6Pbu4W6PI6JBqJM05XWbQzV2s");
        const data = await response.json();
        setImages(data.map(img => img.urls.regular));
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="flex w-full slideshow" style={{ backgroundColor: "black", marginLeft: "20px", marginRight: "5px", marginBottom: "20px", height:"500px", marginTop:"20px", overflow:'hidden' }}>
      {images.length > 0 && (
        <img src={images[currentIndex]} alt="Slideshow" style={{ width: "100%", height: "100%", borderRadius: "8px" }} />
      )}
    </div>
  );
};




export function MakeNewProject() {
  const [goal, setGoal] = useState(350)

  function onClick(adjustment) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <Drawer>

      {/* trigger/ button to open the drawer */}
      <DrawerTrigger asChild>
        <div
          style={{
            width: '-webkit-fill-available',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'lightgreen',
            borderRadius: '8px',
            transition: 'transform 0.2s ease, background-color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Create
            <SquarePlus />
          </Button>
        </div>
      </DrawerTrigger>

      {/* drawer logic */}
      <DrawerContent>
        <div className="flex flex=row">

          {/* <div className="flex w-full slideshow" style={{backgroundColor:'black', marginLeft:'20px', marginRight:'5px', marginBottom:'20px'}}></div> */}

          <Slideshow />

          <div className="mx-auto w-full">

            {/* Header of the drawer */}
            <DrawerHeader>
              <DrawerTitle style={{fontSize:'28px'}}>Create New Countdown</DrawerTitle>
            </DrawerHeader>

            <div className="p-4 pb-0" style={{marginBottom:'30px'}}>
              <div className="flex flex-col items-center justify-center space-x-2">
                <DateTimePickerForm />
              </div>
              <div className="mt-3 h-[120px]">
              </div>
            </div>

          </div>

        </div>
      </DrawerContent>
    </Drawer>
  )
}






