import { Metrics } from '../metrics/types';

export function validateChatInput(metrics: Metrics, question: string, requestType: 'program' | 'thucdon' | 'lichtap'): { isValid: boolean; error?: string } {
  if (!metrics || !question) {
    return { isValid: false, error: 'Vui lòng cung cấp chỉ số và câu hỏi' };
  }
  if (!['basic', 'advanced'].includes(metrics.type)) {
    return { isValid: false, error: 'Loại chỉ số không hợp lệ' };
  }
  if (!metrics.data.idMaHV) {
    return { isValid: false, error: 'Thiếu idMaHV' };
  }
  if (!['program', 'thucdon', 'lichtap'].includes(requestType)) {
    return { isValid: false, error: 'Loại yêu cầu không hợp lệ' };
  }
  return { isValid: true };
}