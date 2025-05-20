import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoomList from './views/RoomList';
import JoinRoom from './views/JoinRoom';
import ChatRoom from './views/ChatRoom';

const App: React.FC = () => (
   <div>
    <Routes>
      <Route path="/" element={<RoomList />} />
      <Route path="/join" element={<JoinRoom />} />
      <Route path="/chat/:pin" element={<ChatRoom />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>
);

export default App;
