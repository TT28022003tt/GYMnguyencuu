import { Metrics, BasicMetrics, AdvancedMetrics } from './types';

export function formatMetrics(metrics: Metrics): string {
  if (metrics.type === 'basic') {
    const { Height, Weight, BMI, Chest, Waist, hips, Arm, Thigh, Calf, Mota } = metrics.data as BasicMetrics;
    return `
      Chỉ số cơ bản:
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
      Bạn muốn tư vấn gì? (VD: thực đơn giảm cân, chương trình tăng cơ, lịch tập luyện phù hợp)
    `;
  } else if (metrics.type === 'advanced') {
    const { BodyFatPercent, MuscleMass, VisceralFat, BasalMetabolicRate, BoneMass, WaterPercent, Mota } = metrics.data as AdvancedMetrics;
    return `
      Chỉ số nâng cao:
      - % Mỡ cơ thể: ${BodyFatPercent ? `${BodyFatPercent}%` : 'N/A'}
      - Khối cơ: ${MuscleMass ? `${MuscleMass} kg` : 'N/A'}
      - Mỡ nội tạng: ${VisceralFat ? VisceralFat : 'N/A'}
      - Tỷ lệ trao đổi chất: ${BasalMetabolicRate ? `${BasalMetabolicRate} kcal` : 'N/A'}
      - Khối lượng xương: ${BoneMass ? `${BoneMass} kg` : 'N/A'}
      - % Nước cơ thể: ${WaterPercent ? `${WaterPercent}%` : 'N/A'}
      - Mô tả: ${Mota || 'Không có mô tả'}
      Bạn muốn tư vấn gì? (VD: thực đơn giảm mỡ, chương trình tăng cơ, lịch tập luyện phù hợp)
    `;
  }
  return '';
}