import { useState, createContext } from "react";
export const ThemeContext = createContext({});

export const ThemeContextProvider = ({children}) => {

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    
      <ThemeContext.Provider 
      value={
        {
          isDarkTheme,
          setIsDarkTheme
        }
      }
      >
        {children}  
      </ThemeContext.Provider>
   
  
  )
}