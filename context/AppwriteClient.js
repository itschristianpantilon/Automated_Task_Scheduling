// config/AppwriteClient.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client, Account, Databases } from 'react-native-appwrite';

const AppwriteContext = createContext();

export const useAppwrite = () => useContext(AppwriteContext);

const AppwriteClient = ({ children }) => {
  const client = new Client();
  const account = new Account(client);
  const database = new Databases(client);

  client
    .setEndpoint('https://cloud.appwrite.io/v1') // Replace with Appwrite endpoint
    .setProject('670e0976002111dc44a6'); // Replace with Appwrite project ID

  return (
    <AppwriteContext.Provider value={{ client, account, database }}>
      {children}
    </AppwriteContext.Provider>
  );
};

export default AppwriteClient;
