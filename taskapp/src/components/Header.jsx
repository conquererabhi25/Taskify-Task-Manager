import React, { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { GiPodiumWinner } from "react-icons/gi";
import HeaderImage from "../../public/headerbgimage.jpg"

const Header = () => {
  const [date, setDate] = useState(new Date());
  const [calenderStatus, setCalenderStatus] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();

    // Get day as string (e.g., Monday)
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateString = now.toLocaleDateString(undefined, options);

    setToday(dateString);
  }, []);

  const ToggleCalender = () => {
    setCalenderStatus(!calenderStatus);
  };

  return (
    <div className="flex flex-col border-b-1 border-red-500 shadow-lg border-gray-300" style={{
      backgroundImage:`url(${HeaderImage})`,
      backgroundSize:"cover",
      position:"end"
    }}>
      <div className="w-full flex justify-between items-center px-5 md:px-20 py-3 pt-8 ">
        {/* Logo */}
        <div className="flex flex-col items-start md:items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <GiPodiumWinner size={30} color="red"/>
            <h1 className="text-red-500 font-semibold text-[20px] md:text-[30px]">
            WINDAY
          </h1>
        </div>
          <p className="text-[10px] md:text-[12px] text-gray-500 italic">
            All in one app for task management
          </p>
        </div>
        {/* Search and calender for large and medium devices */}
        {/* <div className="flex items-center justify-between hidden md:flex w-[45vw] ">
         

          <div className="w-[40vw] flex items-center justify-center shadow-lg h-fit  rounded-md">
            <input
              type="search"
              placeholder="Search Your Task Here."
              className="outline-none w-[94%] text-gray-500 p-2"
            />
            <IoSearchOutline
              size={30}
              type="button"
              className="bg-red-400 p-1 text-white rounded-md text-center flex items-center justify-center"
            />
          </div>
          
        
        </div> */}
        {/* Todays Day and Date */}
        <div className="">
          <p className="text-[10px] md:text-[15px] font-semibold ">{today}</p>
        </div>
      </div>
      {/* search bar and calender for small devices */}
      {/* <div className="flex items-center justify-between md:hidden px-5 pb-5 gap-2">
     
        <div className="w-[80vw] flex items-center justify-center shadow-md h-fit  rounded-md">
          <input
            type="search"
            placeholder="Search Your Task Here."
            className="outline-none w-[94%] text-gray-500 p-1"
          />
          <IoSearchOutline
            size={30}
            type="button"
            className="bg-red-400 p-1 text-white rounded-md text-center flex items-center justify-center"
          />
        </div>
   
        <div className="relative flex flex-col gap-2  w-fit">
          <button
            type="button"
            onClick={ToggleCalender}
            className="bg-red-400 p-1 text-white rounded-md cursor-pointer flex items-center justify-center"
          >
            <SlCalender size={20} />
          </button>


          {calenderStatus ? (
            <div className="absolute top-15 mt-2 right-0  z-50 bg-white shadow-lg rounded-md m-2">
              <Calendar onChange={setDate} value={date} className="w-80" />
            </div>
          ) : null}
        </div>
      </div> */}
    </div>
  );
};

export default Header;
