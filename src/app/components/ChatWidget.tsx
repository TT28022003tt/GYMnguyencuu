'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMetrics } from '@/contexts/MetricsContext';

const botAvatar =
  'https://app.cdn.chative.io/0778e439-c017-52e7-ba9d-24b347d497cb/file/1734431480729/AhaCOD%20(14)%20(1).png';

export default function ChatWidget() {
  const { selectedMetrics, isChatOpen, setIsChatOpen, setSelectedMetrics } = useMetrics();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [programToSave, setProgramToSave] = useState<any>(null);
  const [thucdonToSave, setThucdonToSave] = useState<any>(null);
  const [lichtapToSave, setLichTapToSave] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const formatMetrics = (metrics: any) => {
    if (metrics?.type === 'basic') {
      const { Height, Weight, BMI, Chest, Waist, hips, Arm, Thigh, Calf, Mota, Ten } = metrics.data;
      return `
        Chỉ số cơ bản của ${Ten || 'học viên'}:
        - Chiều cao: ${Height ? `${Height} cm` : 'N/A'}
        - Cân nặng: ${Weight ? `${Weight} kg` : 'N/A'}
        - BMI: ${BMI ? BMI.toFixed(2) : 'N/A'}
        - Vòng ngực: ${Chest ? `${Chest} cm` : 'N/A'}
        - Vòng eo: ${Waist ? `${Waist} cm` : 'N/A'}
        - Vòng mông: ${hips ? `${hips} cm` : 'N/A'}
        - Vòng bắp tay: ${Arm ? `${Arm} cm` : 'N/A'}
        - Vòng đùi: ${Thigh ? `${Thigh} cm` : 'N/A'}
        - Vòng bắp chân: ${Calf ? `${Calf} cm` : 'N/A'}
        - Mô tả: ${Mota || 'Không có mô tả'}
        Bạn muốn tư vấn gì? (VD: lịch tập giảm cân, thực đơn tăng cơ)
      `;
    } else if (metrics?.type === 'advanced') {
      const { BodyFatPercent, MuscleMass, VisceralFat, BasalMetabolicRate, BoneMass, WaterPercent, Mota, Ten } = metrics.data;
      return `
        Chỉ số nâng cao của ${Ten || 'học viên'}:
        - % Mỡ cơ thể: ${BodyFatPercent ? `${BodyFatPercent}%` : 'N/A'}
        - Khối cơ: ${MuscleMass ? `${MuscleMass} kg` : 'N/A'}
        - Mỡ nội tạng: ${VisceralFat ? VisceralFat : 'N/A'}
        - Tỷ lệ trao đổi chất: ${BasalMetabolicRate ? `${BasalMetabolicRate} kcal` : 'N/A'}
        - Khối lượng xương: ${BoneMass ? `${BoneMass} kg` : 'N/A'}
        - % Nước cơ thể: ${WaterPercent ? `${WaterPercent}%` : 'N/A'}
        - Mô tả: ${Mota || 'Không có mô tả'}
        Bạn muốn tư vấn gì? (VD: lịch tập tăng cơ, thực đơn giảm mỡ)
      `;
    }
    return 'Vui lòng chọn một bộ chỉ số để tư vấn.';
  };

  useEffect(() => {
    if (selectedMetrics && isChatOpen) {
      setMessages([
        {
          from: 'bot',
          text: formatMetrics(selectedMetrics),
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([
        {
          from: 'bot',
          text: 'Xin chào! Vui lòng chọn một bộ chỉ số cơ thể để tư vấn.',
          timestamp: new Date(),
        },
      ]);
    }
  }, [selectedMetrics, isChatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      from: 'user',
      text: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      if (programToSave || thucdonToSave || lichtapToSave) {
        if (input.trim().toLowerCase() === 'lưu') {
          let res;
          if (programToSave) {
            console.log('Dữ liệu gửi đến /api/TraniningPlans:', programToSave);
            res = await fetch('/api/TraniningPlans', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(programToSave),
            });
          } else if (thucdonToSave) {
            console.log('Dữ liệu gửi đến /api/healthconsultation:', thucdonToSave);
            res = await fetch('/api/healthconsultation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(thucdonToSave),
            });
          } else if (lichtapToSave) {
            console.log('Dữ liệu lichtapToSave:', JSON.stringify(lichtapToSave, null, 2));
            const scheduleData = Array.isArray(lichtapToSave) ? lichtapToSave[0] : lichtapToSave;
            if (!scheduleData?.NgayGioBatDau || !scheduleData?.NgayGioKetThuc || !scheduleData?.MaHV) {
              throw new Error(
                `Dữ liệu lịch tập không hợp lệ. Thiếu các trường: ${
                  !scheduleData?.NgayGioBatDau ? 'NgayGioBatDau ' : ''
                }${!scheduleData?.NgayGioKetThuc ? 'NgayGioKetThuc ' : ''}${
                  !scheduleData?.MaHV ? 'MaHV' : ''
                }`
              );
            }
            const formattedSchedule = {
              NgayGioBatDau: scheduleData.NgayGioBatDau,
              NgayGioKetThuc: scheduleData.NgayGioKetThuc,
              MaHV: scheduleData.MaHV,
              MaHLV: scheduleData.MaHLV,
              idMaLH: scheduleData.idMaLH,
              idMaCTT: scheduleData.idMaCTT,
              idMaGT: scheduleData.idMaGT,
              GhiChu: scheduleData.GhiChu,
              baitap: scheduleData.baitap?.map((bt: any) => ({
                name: bt.TenBaiTap,
                muscleGroup: bt.NhomCo,
                reps: bt.SoRep,
                sets: bt.SoSet,
                description: bt.MoTa,
              })) || [],
            };
            console.log('Dữ liệu gửi đến /api/schedule:', JSON.stringify(formattedSchedule, null, 2));
            res = await fetch('/api/schedule', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formattedSchedule),
            });
          }

          if (!res || !res.ok) {
            const errorData = await res?.json();
            throw new Error(errorData?.error || 'Không thể lưu dữ liệu');
          }
          setMessages((prev) => [
            ...prev,
            {
              from: 'bot',
              text: 'Lịch tập đã được lưu thành công! Bạn có thể xem trong danh sách lịch tập.',
              timestamp: new Date(),
            },
          ]);
          window.dispatchEvent(new Event('refreshTrainingPrograms'));
          setProgramToSave(null);
          setThucdonToSave(null);
          setLichTapToSave(null);
        } else if (input.trim().toLowerCase() === 'chỉnh sửa') {
          setMessages((prev) => [
            ...prev,
            {
              from: 'bot',
              text: 'Vui lòng cung cấp chi tiết cần chỉnh sửa (VD: thay đổi bài tập ngày 1 hoặc bữa sáng ngày 1).',
              timestamp: new Date(),
            },
          ]);
        } else {
          const dataToEdit = programToSave || thucdonToSave || lichtapToSave;
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              metrics: selectedMetrics,
              question: `Chỉnh sửa: ${input.trim()} cho dữ liệu hiện tại: ${JSON.stringify(dataToEdit)}`,
            }),
          });

          const data = await res.json();
          console.log('Dữ liệu từ /api/chat:', JSON.stringify(data, null, 2));

          if (data.program) {
            setProgramToSave(data.program);
            setMessages((prev) => [
              ...prev,
              {
                from: 'bot',
                text: `${data.reply}\nBạn có muốn lưu chương trình này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa.`,
                timestamp: new Date(),
              },
            ]);
          } else if (data.thucdon) {
            setThucdonToSave(data.thucdon);
            setMessages((prev) => [
              ...prev,
              {
                from: 'bot',
                text: `${data.reply}\nBạn có muốn lưu thực đơn này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa.`,
                timestamp: new Date(),
              },
            ]);
          } else if (data.lichtap) {
            setLichTapToSave(data.lichtap);
            setMessages((prev) => [
              ...prev,
              {
                from: 'bot',
                text: `${data.reply}\nBạn có muốn lưu lịch tập này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa.`,
                timestamp: new Date(),
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                from: 'bot',
                text: data.reply || 'Xin lỗi, có lỗi xảy ra!',
                timestamp: new Date(),
              },
            ]);
          }
        }
      } else {
        if (!selectedMetrics?.data?.idMaHV) {
          throw new Error('Vui lòng chọn học viên với ID hợp lệ trước khi tạo lịch tập.');
        }
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ metrics: selectedMetrics, question: input.trim() }),
        });

        const data = await res.json();
        console.log('Dữ liệu từ /api/chat:', JSON.stringify(data, null, 2));

        if (data.program) {
          setProgramToSave(data.program);
          setMessages((prev) => [
            ...prev,
            {
              from: 'bot',
              text: `${data.reply}\nBạn có muốn lưu chương trình này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa.`,
              timestamp: new Date(),
            },
          ]);
        } else if (data.thucdon) {
          setThucdonToSave(data.thucdon);
          setMessages((prev) => [
            ...prev,
            {
              from: 'bot',
              text: `${data.reply}\nBạn có muốn lưu thực đơn này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa.`,
              timestamp: new Date(),
            },
          ]);
        } else if (data.lichtap) {
          setLichTapToSave(data.lichtap);
          setMessages((prev) => [
            ...prev,
            {
              from: 'bot',
              text: `${data.reply}\nBạn có muốn lưu lịch tập này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa.`,
              timestamp: new Date(),
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              from: 'bot',
              text: data.reply || 'Xin lỗi, có lỗi xảy ra!',
              timestamp: new Date(),
            },
          ]);
        }
      }
    } catch (error) {
      const err = error as Error;
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text: `Xin lỗi, không thể xử lý yêu cầu: ${err.message}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClose = () => {
    setIsChatOpen(false);
    setSelectedMetrics(null);
    setMessages([]);
    setProgramToSave(null);
    setThucdonToSave(null);
    setLichTapToSave(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 50, scale: 0.8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 50, scale: 0.8, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-3xl w-80 h-[400px] mb-4 p-4 flex flex-col justify-between border border-gray-200/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full" />
              <h3 className="font-semibold text-lg text-gray-900 tracking-tight">Trợ lý Sức Khỏe</h3>
              <button onClick={handleClose} className="ml-auto text-gray-500 hover:text-gray-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 text-sm pr-1 custom-scrollbar">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.from === 'bot' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={msg.from === 'bot' ? 'flex items-start gap-2' : 'flex justify-end'}
                >
                  {msg.from === 'bot' ? (
                    <>
                      <motion.img
                        src={botAvatar}
                        alt="Bot"
                        className="w-8 h-8 rounded-full shrink-0 hover:scale-110 transition"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div className="bg-gradient-to-r from-gray-200/80 to-gray-300/80 p-3 rounded-xl max-w-[70%] shadow-sm backdrop-blur-sm">
                        <p className="text-gray-900 text-sm whitespace-pre-wrap">{msg.text}</p>
                        <span className="text-xs text-gray-500">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl max-w-[70%] shadow-md">
                      <p className="font-medium text-sm">{msg.text}</p>
                      <span className="text-xs text-blue-200">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-2"
                >
                  <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full shrink-0" />
                  <div className="bg-gray-200/80 p-3 rounded-xl max-w-[70%] shadow-sm">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.4 }}
                        className="w-2 h-2 bg-gray-500 rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-500 rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.4, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={programToSave || thucdonToSave || lichtapToSave ? 'Nhập "lưu" hoặc "chỉnh sửa"' : 'Nhập mục tiêu của bạn...'}
                className="border border-gray-300/50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/80 backdrop-blur-sm transition-all flex-1 placeholder:text-gray-400"
              />
              <motion.button
                onClick={handleSend}
                whileHover={{ scale: 1.05, background: 'linear-gradient(to_right, #2563EB, #7C3AED)' }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-1"
              >
                <Send className="w-4 h-4" />
                <span>Gửi</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-16 h-16 rounded-full shadow-2xl overflow-hidden relative"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(0, 0, 255, 0.3)' }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-1">
          <div className="w-full h-full rounded-full bg-white"></div>
        </div>
        <img
          src={botAvatar}
          alt="Bot Avatar"
          className="w-[80%] h-[80%] object-cover rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        />
      </motion.button>
    </div>
  );
}