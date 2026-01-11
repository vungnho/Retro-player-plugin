# Retro Player Plugin v5.2

Plugin hỗ trợ giả lập các hệ máy game cổ điển (NES, GBA, SNES...) trực tiếp trên trình duyệt, tích hợp lưu trữ đám mây và tối ưu hóa tốc độ tải file.

## Chức năng chính

* **Giả lập đa hệ máy**: Chạy các nhân FCEUmm (NES), mGBA (GBA), Snes9x (SNES) thông qua Nostalgist.js.
* **Đồng bộ Google Drive**: Tự động sao lưu và nạp file save từ Cloud, cho phép chơi tiếp tiến trình trên nhiều thiết bị khác nhau.
* **Lưu trữ cục bộ (IndexedDB)**: Tự động lưu file game (ROM) vào bộ nhớ trình duyệt sau lần tải đầu tiên để mở nhanh ở các lần sau.
* **Tối ưu CDN**: Tự động chuyển đổi link GitHub thành link jsDelivr để tăng tốc độ tải file nặng (lên đến 20MB).
* **Điều khiển**: Hỗ trợ đầy đủ bàn phím máy tính và phím ảo trên màn hình cảm ứng.

## Hướng dẫn sử dụng

### Quản lý danh sách game (listgame.js)
Để thêm game mới, bạn cập nhật vào mảng trong file listgame.js. Hệ thống sẽ tự xử lý link GitHub sang tốc độ cao.

Cấu trúc mẫu:
...
{ 
  name: "Tên Game", 
  url: "Link_GitHub_Thô", 
  core: "gba" 
}
...

### Các thao tác trong Plugin
* **Mở File**: Tải file ROM thủ công từ máy tính.
* **Lịch sử**: Xem danh sách các game đã chơi gần nhất.
* **Lưu/Nạp**: Quản lý file save thủ công (Manual Save/Load) đồng bộ với Cloud.
* **Auto Save**: Hệ thống tự động lưu trạng thái khi đóng tab hoặc tải lại trang.

## Thành phần kỹ thuật

* **Nostalgist.js**: Wrapper cho RetroArch WebAssembly.
* **Google Drive API v3**: Xử lý đồng bộ hóa dữ liệu người dùng.
* **IndexedDB**: Lưu trữ file ROM và Save State bền vững tại trình duyệt.
* **jsDelivr**: Hạ tầng CDN phân phối file ROM tốc độ cao.

---
Phiên bản hiện tại: 5.2
