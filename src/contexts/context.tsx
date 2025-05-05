'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface MyContextType {
  user: any;
  setUser: (user: any) => void;
  refreshUser: () => void;
  publicData: any;
  maHV?: number;
}

export const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState({
    id: '',
    ten: '',
    vaitro: '',
  });
  const [publicData, setPublicData] = useState({
    goitap: [],
    chuongtrinhtap: [],
    thucdon: [],
    huanluyenvien: [],
    lophoc: [],
  });
  const [maHV, setMaHV] = useState<number | undefined>(undefined);

  const fetchPublicData = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/public-data');
      if (!res.ok) throw new Error('Không thể lấy dữ liệu công khai');
      const data = await res.json();
      setPublicData(data);
    } catch (error) {
      console.error('Error fetching public data:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/user');
      if (!res.ok) throw new Error('Không thể lấy dữ liệu người dùng');
      const data = await res.json();
      console.log('API /api/auth/user response:', data);
      const userData = {
        id: data.user?.idMaTK || data.user?.idUser || data.user?.user?.idUser || '',
        ten: data.user?.user?.Ten || '',
        vaitro: data.user?.VaiTro || '',
      };
      setUser(userData);

      // Nếu là học viên, lấy MaHV từ idUser
      if (userData.vaitro === 'hocvien' && userData.id) {
        const hocvien = await fetch(`/api/hocvien?idUser=${userData.id}`).then((res) => res.json());
        if (hocvien?.idMaHV) {
          setMaHV(hocvien.idMaHV);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser({ id: '', ten: '', vaitro: '' });
      setMaHV(undefined);
    }
  };

  useEffect(() => {
    fetchPublicData();
    fetchUser();
  }, []);

  return (
    <MyContext.Provider value={{ user, setUser, refreshUser: fetchUser, publicData, maHV }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};