import { Metrics } from '../metrics/types';

export function validateChatInput(
  metrics: Metrics | null,
  question: string,
  requestType: 'program' | 'thucdon' | 'lichtap' | 'free' | 'hlv' | 'lophoc' | 'goitap' | 'thehoivien'
): { isValid: boolean; error?: string } {
  if (!question) {
    return { isValid: false, error: 'Vui lòng cung cấp câu hỏi' };
  }

  if (metrics) {
    if (!['basic', 'advanced'].includes(metrics.type)) {
      return { isValid: false, error: 'Loại chỉ số không hợp lệ' };
    }
  }

  if (!['program', 'thucdon', 'lichtap', 'free', 'hlv', 'lophoc', 'goitap', 'thehoivien'].includes(requestType)) {
    return { isValid: false, error: 'Loại yêu cầu không hợp lệ' };
  }

  return { isValid: true };
}