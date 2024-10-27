import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [taskId, setTaskId] = useState(null);

  return (
    <TaskContext.Provider value={{ taskId, setTaskId }}>
      {children}
    </TaskContext.Provider>
  );
};