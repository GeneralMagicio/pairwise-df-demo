import React, { useState } from 'react';
import { ArrowLeftIcon } from '@/public/assets/icon-components/ArrowLeft';
import { ArrowRightIcon } from '@/public/assets/icon-components/ArrowRightIcon';

interface DateProps {
  stDate: Date | null
  edDate: Date | null
  onApply: (startDate: Date | null, endDate: Date | null) => void;
  onCancel: ()=> void;
}
const DateRangePicker: React.FC<DateProps> = ({ stDate, edDate, onApply, onCancel }) => {
  const [startDate, setStartDate] = useState<Date | null>(stDate);
  const [endDate, setEndDate] = useState<Date | null>(edDate);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;

  const applyDateRange = () => {
    console.log(`Start Date: ${startDate}, End Date: ${endDate}`);
    if(startDate && endDate)
      onApply(startDate,endDate);
  };

  const setLastWeek = () => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    today.setHours(0, 0, 0, 0);
    lastWeek.setHours(0, 0, 0, 0);
    setStartDate(lastWeek);
    setEndDate(today);
  };

  const setLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    today.setHours(0, 0, 0, 0);
    lastMonth.setHours(0, 0, 0, 0);
    setStartDate(lastMonth);
    setEndDate(today);
  };

  const setLastYear = () => {
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);
    today.setHours(0, 0, 0, 0);
    lastYear.setHours(0, 0, 0, 0);
    setStartDate(lastYear);
    setEndDate(today);
  };

  const isInRange = (date: Date): boolean => {
    return startDate !== null && endDate !== null && date > startDate && date < endDate;
  };

  const formatDateString = (date: Date | null): string => {
    return date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    }
    else if (date < startDate) {
      setStartDate(date);
    }
    else {
      setEndDate(date);
    }
  };

  const generateCalendar = () => {
    return (
      <div>

        <div className="grid grid-cols-7 gap-2 text-center text-sm text-[#344054]">
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
          <div>Su</div>
          {[...Array(firstDayOfMonth)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const isSelected = startDate?.getTime() === date.getTime() || endDate?.getTime() === date.getTime();

            const isBetween = isInRange(date);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(date)}
                className={`size-full rounded-full p-2 ${
                  isSelected
                    ? 'bg-primary text-white'
                    : isBetween
                      ? 'bg-gray-300 text-gray-800'
                      : 'bg-white text-gray-800'
                } hover:bg-purple-200`}
              >
                <div className="p-1">{day}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-96 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="px-2 py-1 "><ArrowLeftIcon size={20} /></button>
        <h4 className="text-base font-semibold text-[#344054]">
          {currentMonth.toLocaleString('default', { month: 'long' })}
          {' '}
          {year}
        </h4>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="px-2 py-1"><ArrowRightIcon size={20} /></button>
      </div>
      <div className="flex items-center justify-center gap-2">
        <input
          type="text"
          value={formatDateString(startDate)}
          onFocus={() => {}}
          placeholder="Start Date"
          readOnly
          className="w-full cursor-pointer rounded-md border border-gray-300 p-2 text-center text-dark-600 focus:outline-none"
        />
        <span className="text-gray-600">-</span>
        <input
          type="text"
          value={formatDateString(endDate)}
          onFocus={() => {}}
          placeholder="End Date"
          readOnly
          className="w-full cursor-pointer rounded-md border border-gray-300 p-2 text-center text-dark-600 focus:outline-none"
        />
      </div>
      <div className="mt-4 flex justify-around text-sm text-main-title">
        <button onClick={setLastWeek} className="hover:underline">Last week</button>
        <button onClick={setLastMonth} className="hover:underline">Last month</button>
        <button onClick={setLastYear} className="hover:underline">Last year</button>
      </div>
      <div className="mt-4">{generateCalendar()}</div>
      <div className="mt-6 flex w-full justify-between gap-2">
        <button
          onClick={() => {
            setStartDate(null);
            setEndDate(null);
            onApply(null,null);
            onCancel();
          }}
          className="grow rounded-md border border-[#D0D5DD] bg-white px-4 py-2 text-[#344054] hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          disabled={!(startDate && endDate)}
          onClick={applyDateRange}
          className={`grow rounded-md border ${(startDate && endDate)?"border-[#D0D5DD] bg-primary text-white  hover:bg-purple-700":"text-[#344054] hover:bg-gray-300 border-[#D0D5DD] bg-white"} px-4 py-2`}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;
