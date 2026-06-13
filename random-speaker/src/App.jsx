import React, { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import ClawMachineScreen from './components/ClawMachineScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('setup');
  const [appSettings, setAppSettings] = useState({
    students: [],
    allowDuplicates: false,
    secretOrder: []
  });

  const handleStart = (settings) => {
    setAppSettings(settings);
    setCurrentScreen('claw');
  };

  const handleBackToSetup = () => {
    setCurrentScreen('setup');
  };

  return (
    <div className="app-container">
      {currentScreen === 'setup' ? (
        <SetupScreen onStart={handleStart} />
      ) : (
        <ClawMachineScreen 
          students={appSettings.students}
          allowDuplicates={appSettings.allowDuplicates}
          secretOrder={appSettings.secretOrder}
          onBack={handleBackToSetup}
        />
      )}
    </div>
  );
}

export default App;
