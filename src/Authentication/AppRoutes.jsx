import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainDashboard from '../Component/MainDashboard/MainDashboard';
import UserManagement from '../pages/Users/UserManagement';
import CameraManagement from '../pages/Cameras/CameraManagement';
import PromptManagement from '../pages/Prompts/PromptManagement';
import CameraPromptManagement from '../pages/Prompts/CameraPromptManagement';
import UserCameraManagement from '../pages/Prompts/UserCameraManagement';
import SubscriptionManagement from '../pages/Subscription/SubscriptionManagement';
import ClientManagement from '../pages/Clients/ClientManagement';
 
 
 
const AppRoutes = () => {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/dashboard" element={<MainDashboard />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/cameras" element={<CameraManagement />} />
      <Route path="/prompts" element={<PromptManagement />} />
      <Route path="/camera-prompts" element={<CameraPromptManagement />} />
      <Route path="/user-cameras" element={<UserCameraManagement />} />
      <Route path="/plans" element={<SubscriptionManagement />} />
      <Route path="/clients" element={<ClientManagement />} />

      <Route path="*" element={<MainDashboard />} />
      
   
      
      {/* Default redirect */}
     
    </Routes>
  );
};

export default AppRoutes;
