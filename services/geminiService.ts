
import { GoogleGenAI } from "@google/genai";
import { MenuItem, Order } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getOrderInsights = async (orders: Order[], menu: MenuItem[]): Promise<string> => {
  const orderSummary = orders.map(o => {
    const itemDetails = o.items.map(item => {
      const food = menu.find(m => m.id === item.foodId);
      return `${item.quantity}x ${food?.name || 'Món đã xóa'}`;
    }).join(', ');
    
    return `- Khách: ${o.customerName} | Món: ${itemDetails} | Trạng thái: ${o.isDelivered ? 'Đã giao' : 'Chưa giao'}`;
  }).join('\n');

  const prompt = `
    Dựa trên danh sách đơn hàng sau đây (mỗi đơn có thể gồm nhiều món), hãy viết một báo cáo tóm tắt kinh doanh ngắn gọn (khoảng 150 từ) bằng tiếng Việt.
    Bao gồm:
    1. Tổng số đơn hàng và đánh giá hiệu suất (số đơn hoàn thành vs chờ).
    2. Các món ăn/xu hướng đang được ưa chuộng dựa trên số lượng.
    3. Một lời khuyên chiến lược để tăng giá trị trung bình trên mỗi đơn hàng.

    Danh sách chi tiết:
    ${orderSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Không thể tạo báo cáo lúc này.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Đã xảy ra lỗi khi kết nối với AI Assistant.";
  }
};
