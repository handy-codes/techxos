import React, { useState } from 'react';
import { UserRole } from '../types/roles';

const CreateClass: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(60); // minutes

  const handleCreateClass = async () => {
    try {
      const response = await fetch('/api/meetings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          start_time: startTime,
          duration,
          settings: {
            waiting_room: true,
            mute_upon_entry: true,
          }
        })
      });

      const data = await response.json();
      if (data.meetingId) {
        alert(`Class created! Meeting ID: ${data.meetingId}`);
      }
    } catch (error) {
      alert('Failed to create class');
    }
  };

  return (
    <div className="p-4">
      <h2>Create New Class</h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label>Topic:</label>
          <input 
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border p-2"
          />
        </div>
        <div>
          <label>Start Time:</label>
          <input 
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2"
          />
        </div>
        <div>
          <label>Duration (minutes):</label>
          <input 
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="border p-2"
          />
        </div>
        <button 
          onClick={handleCreateClass}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Class
        </button>
      </form>
    </div>
  );
}; 