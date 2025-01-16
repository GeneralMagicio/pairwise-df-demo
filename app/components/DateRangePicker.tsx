import React, { useState } from 'react';

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);

  const applyDateRange = () => {
    console.log(`Start Date: ${startDate}, End Date: ${endDate}`);
  };

  const setLastWeek = () => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    setStartDate(lastWeek.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };

  const setLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    setStartDate(lastMonth.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };

  const setLastYear = () => {
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);
    setStartDate(lastYear.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };

  const isInRange = (date) => {
    return startDate && endDate && date > startDate && date < endDate;
  };

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    return (
      <div>
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="px-2 py-1 bg-gray-200 rounded-md">◀</button>
          <h4 className="text-lg font-medium">{currentMonth.toLocaleString('default', { month: 'long' })} {year}</h4>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="px-2 py-1 bg-gray-200 rounded-md">▶</button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {[...Array(firstDayOfMonth)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const formattedDay = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = formattedDay === startDate || formattedDay === endDate;
            const isBetween = isInRange(formattedDay);

            return (
              <button
                key={day}
                onClick={() => {
                  if (selectingStart) {
                    setStartDate(formattedDay);
                    setSelectingStart(false);
                  } else {
                    setEndDate(formattedDay);
                    setSelectingStart(true);
                  }
                }}
                className={`p-2 rounded-full ${
                  isSelected
                    ? 'bg-purple-600 text-white'
                    : isBetween
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-100 text-gray-800'} hover:bg-purple-200`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white border-2 border-purple-400 rounded-lg w-96 shadow-md">
      <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">Select Date Range</h3>
      <div className="flex items-center justify-center gap-2">
        <input
          type="text"
          value={startDate}
          onFocus={() => setSelectingStart(true)}
          placeholder="Start Date"
          readOnly
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-center cursor-pointer"
        />
        <span className="text-gray-600">-</span>
        <input
          type="text"
          value={endDate}
          onFocus={() => setSelectingStart(false)}
          placeholder="End Date"
          readOnly
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-center cursor-pointer"
        />
      </div>
      <div className="flex justify-around mt-4 text-sm text-purple-600">
        <button onClick={setLastWeek} className="hover:underline">Last week</button>
        <button onClick={setLastMonth} className="hover:underline">Last month</button>
        <button onClick={setLastYear} className="hover:underline">Last year</button>
      </div>
      <div className="mt-4">{generateCalendar()}</div>
      <div className="flex justify-between mt-6">
        <button
          onClick={() => {
            setStartDate('');
            setEndDate('');
            setSelectingStart(true);
          }}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={applyDateRange}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;
