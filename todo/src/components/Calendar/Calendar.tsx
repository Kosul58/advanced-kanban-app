import React, { useState, useEffect } from "react";
import "./calendar.css";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { Days, Day } from "../types"; // Import Days type

// Define types for the component props
interface CalendarProps {
  sendDataToParent: (date: string) => void; // Function to send data to parent component
}

const Calendar: React.FC<CalendarProps> = ({ sendDataToParent }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [currYear, setCurrYear] = useState<number>(date.getFullYear());
  const [currMonth, setCurrMonth] = useState<number>(date.getMonth());
  const [activeDay, setActiveDay] = useState<number>(date.getDate());
  const [days, setDays] = useState<Days>([]); // Days will now hold an array of Day objects

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    renderCalendar();
  }, [currYear, currMonth, activeDay]);

  const renderCalendar = () => {
    const firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
    const lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDayofMonth = new Date(
      currYear,
      currMonth,
      lastDateofMonth
    ).getDay();
    const lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

    const daysArray: Day[] = [];

    // Add days from the previous month
    for (let i = firstDayofMonth; i > 0; i--) {
      daysArray.push({
        date: lastDateofLastMonth - i + 1,
        isActive: false,
        isInactive: true,
      });
    }

    // Add current month days
    for (let i = 1; i <= lastDateofMonth; i++) {
      daysArray.push({
        date: i,
        isActive: i === activeDay,
        isInactive: false,
      });
    }

    // Add days from the next month
    for (let i = lastDayofMonth; i < 6; i++) {
      daysArray.push({
        date: i - lastDayofMonth + 1,
        isActive: false,
        isInactive: true,
      });
    }

    setDays(daysArray);
  };

  const handlePrevNext = (direction: "prev" | "next") => {
    const newMonth = direction === "prev" ? currMonth - 1 : currMonth + 1;

    if (newMonth < 0 || newMonth > 11) {
      const newDate = new Date(currYear, newMonth, new Date().getDate());
      setCurrYear(newDate.getFullYear());
      setCurrMonth(newDate.getMonth());
      setActiveDay(newDate.getDate());
    } else {
      setCurrMonth(newMonth);
      setActiveDay(1); // Reset active day when month changes
    }
  };

  const handleDayClick = (day: number) => {
    setActiveDay(day);
    console.log(`Selected Date: ${day} ${months[currMonth]} ${currYear}`);

    // Ensure month is always two digits
    let month = (currMonth + 1).toString().padStart(2, "0");

    // Ensure day is always two digits
    let formattedDay = day.toString().padStart(2, "0");

    // Send formatted date in "YYYY-MM-DD" format
    sendDataToParent(`${currYear}-${month}-${formattedDay}`);
  };

  return (
    <div className="wrapper">
      <header>
        <p className="current-date">{`${activeDay} ${months[currMonth]} ${currYear}`}</p>
        <div className="icons">
          <span
            id="prev"
            className="material_symbols"
            onClick={() => handlePrevNext("prev")}
          >
            <CiCircleChevLeft />
          </span>
          <span
            id="next"
            className="material_symbols"
            onClick={() => handlePrevNext("next")}
          >
            <CiCircleChevRight />
          </span>
        </div>
      </header>
      <div className="calendar">
        <ul className="weeks">
          <li>Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
        </ul>
        <ul className="days">
          {days.map((day, index) => (
            <li
              key={index}
              className={`${day.isActive ? "active" : ""} ${
                day.isInactive ? "inactive" : ""
              }`}
              onClick={() => (day.isInactive ? null : handleDayClick(day.date))}
            >
              {day.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;
