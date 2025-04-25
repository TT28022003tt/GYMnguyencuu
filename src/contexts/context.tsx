"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";


  
interface MyContextType {
	user: any;
	setUser: (user: any) => void;
	refreshUser: () => void;
  }
  export const MyContext = createContext<MyContextType | undefined>(undefined);

  export const MyProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState({
		ten:"",
		admin:""

	});
  
	const fetchUser = async () => {
		try {
		  const res = await fetch("http://localhost:3000/api/auth/user");
		  const data = await res.json();
		  setUser({ ten: data.user?.user.Ten || "", admin: data.user?.VaiTro || "" });
		} catch (error) {
		  console.error("Error fetching user:", error);
		  setUser({ ten: "", admin: "" });
		}
	  };
	  
	  useEffect(() => {
		fetchUser()
	  }, []);
	  return (
		<MyContext.Provider value={{ user, setUser, refreshUser: fetchUser }}>
		  {children}
		</MyContext.Provider>
	);
  };