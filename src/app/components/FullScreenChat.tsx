'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import { useMetrics } from '@/contexts/MetricsContext';
import { useMyContext } from '@/contexts/context';
import Image from 'next/image';

const botAvatar =
  'https://app.cdn.chative.io/0778e439-c017-52e7-ba9d-24b347d497cb/file/1734431480729/AhaCOD%20(14)%20(1).png';

interface FullScreenChatProps {
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  input: string;
  setInput: (input: string) => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  programToSave: any;
  setProgramToSave: (program: any) => void;
  thucdonToSave: any;
  setThucdonToSave: (thucdon: any) => void;
  lichtapToSave: any;
  setLichTapToSave: (lichtap: any) => void;
  requestedMaHV: string;
  setRequestedMaHV: (maHV: string) => void;
  onClose: () => void;
  onMinimize: () => void;
}

export default function FullScreenChat({
  messages,
  setMessages,
  input,
  setInput,
  isTyping,
  setIsTyping,
  programToSave,
  setProgramToSave,
  thucdonToSave,
  setThucdonToSave,
  lichtapToSave,
  setLichTapToSave,
  requestedMaHV,
  setRequestedMaHV,
  onClose,
  onMinimize,
}: FullScreenChatProps) {
  const { selectedMetrics, setSelectedMetrics } = useMetrics();
  const { user, publicData, maHV } = useMyContext();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [context, setContext] = useState<any>({});
  const currentDate = new Date().toISOString().split('T')[0];

  const quickReplies = [
    { text: 'Có HLV nữ không?', value: 'Có huấn luyện viên nữ nào không?' },
    { text: 'Lớp học đang mở', value: 'Có lớp học nào đang mở không?' },
    { text: 'Gói tập hiện có', value: 'Hiện có gói tập nào không?' },
    { text: 'Thẻ hội viên', value: 'Thông tin về thẻ hội viên?' },
    { text: 'Lịch tập ngày mai', value: 'Tạo lịch tập cho ngày mai' },
    { text: 'Thực đơn tuần sau', value: 'Tạo thực đơn cho tuần sau' },
    { text: 'Nhập chỉ số', value: 'Tôi muốn cung cấp chiều cao, cân nặng' },
  ];

  const formatMetrics = (metrics: any) => {
    if (metrics?.type === 'basic') {
      const { Height, Weight, BMI, Chest, Waist, hips, Arm, Thigh, Calf, Mota, Ten } = metrics.data;
      return `
**Chỉ số cơ bản của ${Ten || 'học viên'}:**
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
Bạn muốn tư vấn gì? (VD: lịch tập giảm cân cho ngày mai, thực đơn tăng cơ)
      `;
    } else if (metrics?.type === 'advanced') {
      const { BodyFatPercent, MuscleMass, VisceralFat, BasalMetabolicRate, BoneMass, WaterPercent, Mota, Ten } = metrics.data;
      return `
**Chỉ số nâng cao của ${Ten || 'học viên'}:**
- % Mỡ cơ thể: ${BodyFatPercent ? `${BodyFatPercent}%` : 'N/A'}
- Khối cơ: ${MuscleMass ? `${MuscleMass} kg` : 'N/A'}
- Mỡ nội tạng: ${VisceralFat ? VisceralFat : 'N/A'}
- Tỷ lệ trao đổi chất: ${BasalMetabolicRate ? `${BasalMetabolicRate} kcal` : 'N/A'}
- Khối lượng xương: ${BoneMass ? `${BoneMass} kg` : 'N/A'}
- % Nước cơ thể: ${WaterPercent ? `${WaterPercent}%` : 'N/A'}
- Mô tả: ${Mota || 'Không có mô tả'}
Bạn muốn tư vấn gì? (VD: lịch tập tăng cơ cho tuần sau, thực đơn giảm mỡ)
      `;
    }
    return 'Vui lòng cung cấp chỉ số cơ thể để tư vấn chi tiết hoặc hỏi về gói tập/PT!';
  };

  const getLatestMetricsIdMaHV = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.from === 'bot' && (msg.text.includes('Chỉ số cơ bản') || msg.text.includes('Chỉ số nâng cao'))) {
        return context.metrics?.data?.idMaHV || null;
      }
    }
    return null;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedMetrics && !context.metrics) {
      setContext((prev: any) => ({ ...prev, metrics: selectedMetrics }));
    }
  }, [selectedMetrics,context.metrics]);

  const saveMessage = async (message: { from: string; text: string; timestamp: Date }) => {
    if (!user.id) return;

    try {
      const res = await fetch('/api/chat-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUser: user.id,
          from: message.from,
          Text: message.text,
          Timestamp: message.timestamp.toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Không thể lưu tin nhắn');
    } catch (error) {
      console.error('Lỗi lưu tin nhắn:', error);
    }
  };

  const handleQuickReply = async (value: string) => {
    const userMessage = {
      from: 'user',
      text: value,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    if (user.id) await saveMessage(userMessage);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: context.metrics || null,
          question: value,
          publicData,
          currentDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi khi xử lý yêu cầu');

      let botMessage;
      if (data.program) {
        setProgramToSave(data.program);
        botMessage = {
          from: 'bot',
          text: `${data.reply}\nBạn có muốn lưu chương trình này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa. ${data.canSave ? '' : '(Đăng nhập để lưu)'}`,
          timestamp: new Date(),
        };
      } else if (data.thucdon) {
        setThucdonToSave(data.thucdon);
        botMessage = {
          from: 'bot',
          text: `${data.reply}\nBạn có muốn lưu thực đơn này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa. ${data.canSave ? '' : '(Đăng nhập để lưu)'}`,
          timestamp: new Date(),
        };
      } else if (data.lichtap) {
        setLichTapToSave(data.lichtap);
        botMessage = {
          from: 'bot',
          text: `${data.reply}\nBạn có muốn lưu lịch tập này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa. ${data.canSave ? '' : '(Đăng nhập để lưu)'}`,
          timestamp: new Date(),
        };
      } else {
        botMessage = {
          from: 'bot',
          text: data.reply || 'Xin lỗi, có lỗi xảy ra!',
          timestamp: new Date(),
        };
      }
      setMessages((prev) => [...prev, botMessage]);
      if (user.id) await saveMessage(botMessage);
    } catch (error) {
      const err = error as Error;
      const botMessage = {
        from: 'bot',
        text: `Xin lỗi, không thể xử lý yêu cầu: ${err.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      if (user.id) await saveMessage(botMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      from: 'user',
      text: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    if (user.id) await saveMessage(userMessage);

    if (input.toLowerCase().includes('chiều cao') || input.toLowerCase().includes('cân nặng')) {
      const heightMatch = input.match(/chiều cao.*?(\d+\.?\d*)\s*m/);
      const weightMatch = input.match(/cân nặng.*?(\d+\.?\d*)\s*kg/);
      setContext((prev: any) => ({
        ...prev,
        height: heightMatch ? parseFloat(heightMatch[1]) * 100 : prev.height,
        weight: weightMatch ? parseFloat(weightMatch[1]) : prev.weight,
      }));
    }

    setInput('');
    setIsTyping(true);

    try {
      if (programToSave || thucdonToSave || lichtapToSave) {
        if (input.trim().toLowerCase() === 'lưu') {
          if (!user.id) {
            throw new Error('Vui lòng đăng nhập để lưu dữ liệu.');
          }

          let saveMaHV: number | undefined;
          const latestMetricsIdMaHV = getLatestMetricsIdMaHV();
          if (latestMetricsIdMaHV) {
            saveMaHV = latestMetricsIdMaHV;
          } else if (user.vaitro === 'hocvien') {
            const hocvienRes = await fetch(`/api/hocvien?idUser=${user.id}`);
            if (!hocvienRes.ok) {
              throw new Error('Không thể lấy mã học viên từ tài khoản.');
            }
            const hocvien = await hocvienRes.json();
            saveMaHV = hocvien.idMaHV;
          } else if (user.vaitro === 'admin' || user.vaitro === 'trainer') {
            if (!requestedMaHV) {
              const botMessage = {
                from: 'bot',
                text: 'Vui lòng nhập mã học viên (MaHV) để lưu dữ liệu.',
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, botMessage]);
              if (user.id) await saveMessage(botMessage);
              setIsTyping(false);
              return;
            }
            saveMaHV = parseInt(requestedMaHV);
            if (isNaN(saveMaHV)) {
              throw new Error('Mã học viên phải là số hợp lệ.');
            }
            const hocvien = await fetch(`/api/hocvien?idMaHV=${saveMaHV}`).then((res) => res.json());
            if (!hocvien?.idMaHV) {
              throw new Error('Mã học viên nhập vào không tồn tại.');
            }
          } else {
            throw new Error('Không thể xác định mã học viên để lưu dữ liệu.');
          }

          let res;
          if (programToSave) {
            res = await fetch('/api/TraniningPlans', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...programToSave, idMaHV: saveMaHV }),
            });
          } else if (thucdonToSave) {
            res = await fetch('/api/healthconsultation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...thucdonToSave, idMaHV: saveMaHV }),
            });
          } else if (lichtapToSave) {
            const scheduleData = Array.isArray(lichtapToSave) ? lichtapToSave[0] : lichtapToSave;
            if (!scheduleData?.NgayGioBatDau || !scheduleData?.NgayGioKetThuc) {
              throw new Error('Dữ liệu lịch tập không hợp lệ.');
            }
            const startDate = new Date(scheduleData.NgayGioBatDau);
            const today = new Date(currentDate);
            if (startDate < today) {
              throw new Error(`Ngày bắt đầu lịch tập (${scheduleData.NgayGioBatDau}) không hợp lệ vì nằm trong quá khứ.`);
            }
            const formattedSchedule = {
              NgayGioBatDau: scheduleData.NgayGioBatDau,
              NgayGioKetThuc: scheduleData.NgayGioKetThuc,
              MaHV: saveMaHV,
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

          const botMessage = {
            from: 'bot',
            text: 'Dữ liệu đã được lưu thành công! Bạn có thể xem trong danh sách tương ứng.',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          if (user.id) await saveMessage(botMessage);
          window.dispatchEvent(new Event('refreshTrainingPrograms'));
          setProgramToSave(null);
          setThucdonToSave(null);
          setLichTapToSave(null);
          setRequestedMaHV('');
        } else if (input.trim().toLowerCase() === 'chỉnh sửa') {
          const botMessage = {
            from: 'bot',
            text: 'Vui lòng cung cấp chi tiết cần chỉnh sửa (VD: thay đổi bài tập ngày 1 hoặc bữa sáng ngày 1).',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          if (user.id) await saveMessage(botMessage);
        } else if (user.vaitro === 'admin' || user.vaitro === 'trainer') {
          if (!getLatestMetricsIdMaHV()) {
            setRequestedMaHV(input.trim());
            const botMessage = {
              from: 'bot',
              text: `Đã nhận mã học viên: ${input.trim()}. Bạn muốn lưu dữ liệu này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa.`,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
            if (user.id) await saveMessage(botMessage);
          } else {
            const dataToEdit = programToSave || thucdonToSave || lichtapToSave;
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                metrics: context.metrics || null,
                question: `Chỉnh sửa: ${input.trim()} cho dữ liệu hiện tại: ${JSON.stringify(dataToEdit)}`,
                publicData,
                currentDate,
              }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Lỗi khi chỉnh sửa dữ liệu');

            let botMessage;
            if (data.program) {
              setProgramToSave(data.program);
              botMessage = {
                from: 'bot',
                text: `${data.reply}\nBạn có muốn lưu chương trình này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa. ${data.canSave ? '' : '(Đăng nhập để lưu)'}`,
                timestamp: new Date(),
              };
            } else if (data.thucdon) {
              setThucdonToSave(data.thucdon);
              botMessage = {
                from: 'bot',
                text: `${data.reply}\nBạn có muốn lưu thực đơn này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa. ${data.canSave ? '' : '(Đăng nhập để lưu)'}`,
                timestamp: new Date(),
              };
            } else if (data.lichtap) {
              setLichTapToSave(data.lichtap);
              botMessage = {
                from: 'bot',
                text: `${data.reply}\nBạn có muốn lưu lịch tập này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa. ${data.canSave ? '' : '(Đăng nhập để lưu)'}`,
                timestamp: new Date(),
              };
            } else {
              botMessage = {
                from: 'bot',
                text: data.reply || 'Xin lỗi, có lỗi xảy ra!',
                timestamp: new Date(),
              };
            }
            setMessages((prev) => [...prev, botMessage]);
            if (user.id) await saveMessage(botMessage);
          }
        } else {
          const dataToEdit = programToSave || thucdonToSave || lichtapToSave;
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              metrics: context.metrics || null,
              question: `Chỉnh sửa: ${input.trim()} cho dữ liệu hiện tại: ${JSON.stringify(dataToEdit)}`,
              publicData,
              currentDate,
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Lỗi khi chỉnh sửa dữ liệu');

          let botMessage;
          if (data.program) {
            setProgramToSave(data.program);
            botMessage = {
              from: 'bot',
              text: `${data.reply}\nBạn có muốn lưu chương trình này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa. ${data.canSave ? '' : '(Đăng nhập để lưu)'}`,
              timestamp: new Date(),
            };
          } else if (data.thucdon) {
            setThucdonToSave(data.thucdon);
            botMessage = {
              from: 'bot',
              text: `${data.reply}\nBạn có muốn lưu thực đơn này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa. ${data.canSave ? '' : '(Đăng nhập để lưu)'}`,
              timestamp: new Date(),
            };
          } else if (data.lichtap) {
            setLichTapToSave(data.lichtap);
            botMessage = {
              from: 'bot',
              text: `${data.reply}\nBạn có muốn lưu lịch tập này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa. ${data.canSave ? '' : '(Đăng nhập để lưu)'}`,
              timestamp: new Date(),
            };
          } else {
            botMessage = {
              from: 'bot',
              text: data.reply || 'Xin lỗi, có lỗi xảy ra!',
              timestamp: new Date(),
            };
          }
          setMessages((prev) => [...prev, botMessage]);
          if (user.id) await saveMessage(botMessage);
        }
      } else {
        const questionWithTime = (
          input.toLowerCase().includes('lịch tập') ||
          input.toLowerCase().includes('thực đơn')
        ) && !(
          input.toLowerCase().includes('ngày mai') ||
          input.toLowerCase().includes('tuần sau') ||
          input.match(/\d{4}-\d{2}-\d{2}/)
        ) ? `${input.trim()} cho ngày mai` : input.trim();

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            metrics: context.metrics || null,
            question: questionWithTime,
            publicData,
            currentDate,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Lỗi khi xử lý yêu cầu');

        let botMessage;
        if (data.program) {
          setProgramToSave(data.program);
          botMessage = {
            from: 'bot',
            text: `${data.reply}\nBạn có muốn lưu chương trình này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa. ${data.canSave ? '' : '(Đăng nhập để lưu)'}`,
            timestamp: new Date(),
          };
        } else if (data.thucdon) {
          setThucdonToSave(data.thucdon);
          botMessage = {
            from: 'bot',
            text: `${data.reply}\nBạn có muốn lưu thực đơn này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa. ${data.canSave ? '' : '(Đăng nhập để lưu)'}`,
            timestamp: new Date(),
          };
        } else if (data.lichtap) {
          setLichTapToSave(data.lichtap);
          botMessage = {
            from: 'bot',
            text: `${data.reply}\nBạn có muốn lưu lịch tập này không? Nhập "lưu" để lưu hoặc "chỉnh sửa" để chỉnh sửa. ${data.canSave ? '' : '(Đăng nhập để lưu)'}`,
            timestamp: new Date(),
          };
        } else {
          botMessage = {
            from: 'bot',
            text: data.reply || 'Xin lỗi, có lỗi xảy ra!',
            timestamp: new Date(),
          };
        }
        setMessages((prev) => [...prev, botMessage]);
        if (user.id) await saveMessage(botMessage);
      }
    } catch (error) {
      const err = error as Error;
      const botMessage = {
        from: 'bot',
        text: `Xin lỗi, không thể xử lý yêu cầu: ${err.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      if (user.id) await saveMessage(botMessage);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col"
    >
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Image src={botAvatar} alt="Bot" className="w-10 h-10 rounded-full" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Trợ lý Sức Khỏe</h2>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMinimize}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            title="Thu nhỏ"
          >
            <Minimize2 className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex ${msg.from === 'bot' ? 'items-start' : 'justify-end'} gap-3`}
          >
            {msg.from === 'bot' ? (
              <>
                <Image src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full shrink-0 mt-1" />
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-4 rounded-2xl max-w-lg shadow-md">
                  <div className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-2xl max-w-lg shadow-md">
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs text-blue-200 mt-1 block">
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
            className="flex items-start gap-3"
          >
            <Image src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full shrink-0 mt-1" />
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl shadow-md">
              <div className="flex gap-1">
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.4 }}
                  className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"
                />
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }}
                  className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"
                />
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.4, delay: 0.4 }}
                  className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer: Quick Replies and Input */}
      <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
        {messages.length <= 1 && (
          <div className="flex overflow-x-auto gap-2 pb-4 custom-scrollbar">
            {quickReplies.map((reply, index) => (
              <motion.button
                key={index}
                onClick={() => handleQuickReply(reply.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
              >
                {reply.text}
              </motion.button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              programToSave || thucdonToSave || lichtapToSave
                ? user.vaitro === 'admin' || user.vaitro === 'trainer'
                  ? getLatestMetricsIdMaHV()
                    ? 'Nhập "lưu" hoặc "chỉnh sửa"'
                    : 'Nhập mã học viên hoặc "lưu"/"chỉnh sửa"'
                  : 'Nhập "lưu" hoặc "chỉnh sửa"'
                : 'Nhập mục tiêu hoặc câu hỏi của bạn...'
            }
            className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
          />
          <motion.button
            onClick={handleSend}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-1"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </motion.div>
  );
}