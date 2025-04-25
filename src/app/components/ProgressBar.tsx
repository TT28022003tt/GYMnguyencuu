import { motion } from "framer-motion";

interface ChiTietMucTieu {
  idChiTietMucTieu: number;
  ThoiGian: string;
  MoTa: string;
}

interface ChuongTrinhTap {
  idChuongTrinhTap: number;
  TenCTT: string;
  MucTieu: string;
  ThoiGian: string;
  MaHV: number;
  TrangThai: number;
  chitietmuctieu: ChiTietMucTieu[];
}

interface ProgressBarProps {
  plans: ChuongTrinhTap[];
}

const ProgressBar = ({ plans }: ProgressBarProps) => {
  const completedCount = plans.filter((plan) => plan.TrangThai === 2).length;
  const progressPercentage = plans.length > 0 ? (completedCount / plans.length) * 100 : 0;

  return (
    <div className="w-full max-w-4xl mb-12">
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-blue to-primary-purple"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>
      <div className="relative flex justify-between mt-2">
        {plans.map((plan, index) => {
          const isCompleted = plan.TrangThai === 2;
          const isInProgress = plan.TrangThai === 1;
          return (
            <div key={plan.idChuongTrinhTap} className="relative flex-1 text-center">
              <motion.div
                className={`absolute -top-8 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-md ${
                  isCompleted
                    ? "bg-primary-blue animate-pulse"
                    : isInProgress
                    ? "bg-primary-purple ring-2 ring-primary-purple/50"
                    : "bg-gray-300"
                }`}
                whileHover={{ scale: 1.1 }}
                title={plan.TenCTT}
              >
                {index + 1}
              </motion.div>
              <p className="text-sm text-gray-600 mt-8 truncate">{plan.TenCTT}</p>
            </div>
          );
        })}
      </div>
      <p className="text-center mt-4 text-gray-700 font-medium">
        Tiến trình: {progressPercentage.toFixed(0)}% ({completedCount}/{plans.length} chương trình hoàn thành)
      </p>
    </div>
  );
};

export default ProgressBar;