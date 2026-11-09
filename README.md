# Tri Ân Thầy Cô 20/11

Trang thiệp tương tác chào mừng Ngày Nhà giáo Việt Nam 20/11. Trang có hiệu ứng hoa và cây tri ân, danh sách thầy cô, cùng form gửi lời chúc.

## Lưu ý

- Bản có form gửi lời chúc là `20-11-tri-an-thay-co 3.html`.
- Lời chúc gửi từ form được lưu vào Google Sheets thông qua Google Apps Script trong `Code.gs`. Cần triển khai Apps Script dạng Web App và cấu hình URL trong file HTML.
- Lời chúc gửi thành công được lưu và tải từ Google Sheets để hiển thị đồng bộ trên các thiết bị. Trình duyệt cũng giữ một bản cache `localStorage`.
- Web App nhận dữ liệu công khai có thể bị gửi nội dung rác. Hãy kiểm tra Google Sheet định kỳ.
- Hai file HTML còn lại là các phiên bản trước, trong đó nút gửi lời chúc chọn nội dung ngẫu nhiên.

## Credit

Cre: Zeus và Lê Minh
