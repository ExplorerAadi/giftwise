"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export interface IPromptFormContext {
  data: {
    ocassion: string;
    preferences: string[];
    recipientRelationShip: string;
    recipientLocation: string;
  };
  setFormValues: (values: IPromptFormContext["data"]) => void;
}

const PromptFormContext = createContext<IPromptFormContext>(null!);
export const PromptFormProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState({
    ocassion: "",
    preferences: [""],
    recipientRelationShip: "",
    recipientLocation: "",
  });

  const setFormValues = (values: IPromptFormContext["data"]) => {
    setData({
      ...data,
      ...values,
    });
  };

  return (
    <PromptFormContext.Provider
      value={{
        data,
        setFormValues,
      }}
    >
      {children}
    </PromptFormContext.Provider>
  );
};

export const usePromptFormContext = () => {
  const context = useContext(PromptFormContext);
  if (!context) {
    throw new Error(
      "usePromptFormContext must be used within a PromptFormProvider"
    );
  }
  return context;
};
