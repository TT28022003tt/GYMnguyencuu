'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMetrics } from '@/contexts/MetricsContext';
import { useMyContext } from '@/contexts/context';
import FullScreenChat from './FullScreenChat';
import Markdown from 'react-markdown';
import isEqual from 'lodash.isequal';
import Image from 'next/image';

const botAvatar =
  'https://app.cdn.chative.io/0778e439-c017-52e7-ba9d-24b347d497cb/file/1734431480729/AhaCOD%20(14)%20(1).png';

export default function ChatWidget() {
  const { selectedMetrics, isChatOpen, setIsChatOpen, setSelectedMetrics } = useMetrics();
  const { user, publicData, maHV } = useMyContext();

  const [messages, setMessages] = useState<any[]>([]);
  const lastMetricsRef = useRef<any>(null);

  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [programToSave, setProgramToSave] = useState<any>(null);
  const [thucdonToSave, setThucdonToSave] = useState<any>(null);
  const [lichtapToSave, setLichTapToSave] = useState<any>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [requestedMaHV, setRequestedMaHV] = useState<string>('');
  const [context, setContext] = useState<any>({});


  const currentDate = new Date().toISOString().split('T')[0];

  const quickReplies = [
    { text: 'Có HLV nữ không?', value: 'Có huấn luyện viên nữ nào không?' },
    { text: 'Lớp học đang mở', value: 'Có lớp học nào đang mở không?' },
    { text: 'Gói tập hiện có', value: 'Hiện có gói tập nào không?' },
    { text: 'Thẻ hội viên', value: 'Thông tin về thẻ hội viên?' },
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

  // Hàm tìm idMaHV từ metrics mới nhất trong messages
  const getLatestMetricsIdMaHV = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.from === 'bot' && msg.text.includes('Chỉ số cơ bản') || msg.text.includes('Chỉ số nâng cao')) {
        return context.metrics?.data?.idMaHV || null;
      }
    }
    return null;
  };
  const loadChatHistory = useCallback(async () => {
    if (!user.id) return;

    try {
      const res = await fetch(`/api/chat-messages?idUser=${user.id}`);
      if (!res.ok) throw new Error('Không thể tải lịch sử chat');
      const data = await res.json();
      setMessages((prev) => {
        const newMessages = [
          ...prev,
          ...data.map((msg: any) => ({
            from: msg.from,
            text: msg.Text,
            timestamp: new Date(msg.Timestamp),
          })),
        ];
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
        return newMessages;
      });
      setHistoryLoaded(true);
    } catch (error) {
      console.error('Lỗi tải lịch sử chat:', error);
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text: 'Xin lỗi, không thể tải lịch sử chat. Hãy thử lại!',
          timestamp: new Date(),
        },
      ]);
    }
  }, [user.id, setMessages]);

  const saveMessage = useCallback(
    async (message: { from: string; text: string; timestamp: Date }) => {
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
    },
    [user.id]
  );
  useEffect(() => {
    if (isChatOpen && !isFullScreen) {
      if (!messages.length) {
        setMessages([
          {
            from: 'bot',
            text: `Xin chào! Bạn có thể hỏi về gói tập, chương trình tập, thực đơn, thông tin PT, lớp học, hoặc thẻ hội viên. ${user.id ? 'Bạn có thể lưu dữ liệu.' : 'Đăng nhập để lưu dữ liệu!'}`,
            timestamp: new Date(),
          },
        ]);
      }

      if (user.id && !historyLoaded) {
        loadChatHistory();
      }
    }
  }, [isChatOpen, user.id, isFullScreen, historyLoaded, loadChatHistory, messages.length]);

  useEffect(() => {

    if (isChatOpen && selectedMetrics && !isEqual(selectedMetrics, lastMetricsRef.current)) {
      const metricsMessage = {
        from: 'bot',
        text: formatMetrics(selectedMetrics),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, metricsMessage]);
      saveMessage(metricsMessage);
      setContext((prev: any) => ({ ...prev, metrics: selectedMetrics }));
      lastMetricsRef.current = selectedMetrics;
    }
  }, [isChatOpen, selectedMetrics, saveMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);





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
          // Ưu tiên idMaHV từ metrics mới nhất trong hội thoại
          const latestMetricsIdMaHV = getLatestMetricsIdMaHV();
          if (latestMetricsIdMaHV) {
            saveMaHV = latestMetricsIdMaHV;
          } else if (user.vaitro === 'hocvien') {
            // Lấy idMaHV từ tài khoản đăng nhập
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
              MaHLV: scheduleData.MaHLV || null,
              idMaLH: scheduleData.idMaLH || null,
              idMaCTT: scheduleData.idMaCTT || null,
              idMaGT: scheduleData.idMaGT || null,
              GhiChu: scheduleData.GhiChu,
              baitap: scheduleData.baitap?.map((bt: any) => ({
                name: bt.TenBaiTap,
                muscleGroup: bt.NhomCo,
                reps: bt.SoRep,
                sets: bt.SoSet,
                description: bt.MoTa,
              })) || [],
            };
            console.log('Saving lichtap:', formattedSchedule);
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

  const handleClose = () => {
    setIsChatOpen(false);
    setSelectedMetrics(null);
    setMessages([]);
    setProgramToSave(null);
    setThucdonToSave(null);
    setLichTapToSave(null);
    setIsFullScreen(false);
    setRequestedMaHV('');
    setHistoryLoaded(false);
    setContext({});
    lastMetricsRef.current = null;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isChatOpen && !isFullScreen && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 50, scale: 0.8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 50, scale: 0.8, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-3xl w-80 h-[400px] mb-4 p-4 flex flex-col justify-between border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <Image src={botAvatar} alt="Bot" width={200} height={200} className="w-8 h-8 rounded-full" />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 tracking-tight">Trợ lý Sức Khỏe</h3>
              <button
                onClick={() => setIsFullScreen(true)}
                className="ml-auto text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition mr-2"
                title="Phóng to"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button onClick={handleClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">
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
                      <div className="bg-gradient-to-r from-gray-200/80 to-gray-300/80 dark:from-gray-700/80 dark:to-gray-800/80 p-3 rounded-xl max-w-[70%] shadow-sm backdrop-blur-sm break-words">
                        <div className="text-gray-900 dark:text-gray-100 text-sm prose prose-sm max-w-full">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl max-w-[70%] shadow-md break-words">
                      <p className="font-medium text-sm">{msg.text}</p>
                      <span className="text-xs text-blue-200 block mt-1">
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
                  className="flex items-center justify-center gap-2"
                >
                  <div className="relative w-8 h-8 shrink-0">
                    <Image
                      src={botAvatar}
                      alt="Bot"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>

                  <div className="bg-gray-200/80 dark:bg-gray-700/80 p-3 rounded-xl max-w-[70%] shadow-sm">
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
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickReplies.map((reply, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleQuickReply(reply.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {reply.text}
                    </motion.button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="mt-3 flex gap-2">
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
                className="text-white border border-gray-300/50 dark:border-gray-600/50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all flex-1 placeholder:text-gray-400 dark:placeholder:text-gray-500"
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
      {isFullScreen && (
        <FullScreenChat
          messages={messages}
          setMessages={setMessages}
          input={input}
          setInput={setInput}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
          programToSave={programToSave}
          setProgramToSave={setProgramToSave}
          thucdonToSave={thucdonToSave}
          setThucdonToSave={setThucdonToSave}
          lichtapToSave={lichtapToSave}
          setLichTapToSave={setLichTapToSave}
          requestedMaHV={requestedMaHV}
          setRequestedMaHV={setRequestedMaHV}
          onClose={handleClose}
          onMinimize={() => setIsFullScreen(false)}
        />
      )}
      <motion.button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-16 h-16 rounded-full shadow-2xl overflow-hidden relative z-40"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(0, 0, 255, 0.3)' }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-1 ">
          <div className="w-full h-full rounded-full bg-white dark:bg-gray-800"></div>
        </div>
        <Image
          src={botAvatar}
          alt="Bot Avatar"
          fill
          sizes="100vw"
          className="w-[80%] h-[80%] object-cover rounded-full absolute z-10"
        />
      </motion.button>
    </div>
  );
}