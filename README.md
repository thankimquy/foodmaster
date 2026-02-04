
# 🍱 FoodMaster Pro - Hướng dẫn cài đặt lên iPhone

Ứng dụng này được thiết kế như một **PWA (Progressive Web App)**, cho phép bạn cài đặt trực tiếp vào iPhone mà không cần qua App Store.

## 🚀 Cách cài đặt lên iPhone (Dùng Vercel - Nhanh nhất)

1. **Lên GitHub**: Tạo Repository mới và upload toàn bộ code này lên.
2. **Kết nối Vercel**: 
   - Truy cập [Vercel.com](https://vercel.com), đăng nhập bằng GitHub.
   - Nhập (Import) dự án này và nhấn **Deploy**.
   - Bạn sẽ nhận được 1 đường link `https://tên-của-bạn.vercel.app`.
3. **Mở trên iPhone**:
   - Dùng **Safari** mở đường link đó.
   - Nhấn nút **Chia sẻ** (biểu tượng hình vuông có mũi tên lên).
   - Chọn **Thêm vào màn hình chính (Add to Home Screen)**.
   - Nhấn **Thêm**.

## 📱 Tại sao nên dùng cách này?
- **Offline 100%**: Sau khi cài xong, bạn có thể tắt Wifi/4G mà vẫn dùng được.
- **Dữ liệu an toàn**: Mọi đơn hàng và menu lưu trực tiếp trên iPhone của bạn (LocalStorage).
- **Trải nghiệm Native**: Không có thanh địa chỉ trình duyệt, cảm giác như app thật.

## 🛠 Cấu trúc dự án
- `App.tsx`: Giao diện chính và xử lý logic.
- `sw.js`: Trình quản lý chế độ Offline.
- `manifest.json`: Khai báo thông tin App cho iPhone.
- `services/geminiService.ts`: Phân tích báo cáo bằng AI.
