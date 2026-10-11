# Tiến độ phát triển client Social Network

> Cập nhật: 2026-10-11

## Trạng thái hiện tại

Client được xây dựng bằng **Next.js App Router**, React, TypeScript và
Tailwind CSS. Giao diện hiện đang tập trung vào shell của nền tảng, các trang
xác thực và bộ component UI dùng chung.

## Cấu trúc hiện tại

```text
Client/
├── app/
│   ├── page.tsx             # Trang chính
│   ├── layout.tsx           # Layout dùng chung
│   ├── login/page.tsx       # Trang đăng nhập
│   ├── register/page.tsx    # Trang đăng ký
│   └── globals.css          # CSS toàn cục
├── components/
│   ├── platform-shell.tsx   # Khung giao diện nền tảng
│   ├── auth-page.tsx        # Giao diện login/register dùng chung
│   └── ui/                  # Component UI tái sử dụng
├── lib/
│   └── utils.ts             # Tiện ích dùng chung
└── public/                  # Ảnh và tài nguyên tĩnh
```

## Đã hoàn thành

- [x] Khởi tạo ứng dụng Next.js với App Router.
- [x] Thiết lập React và React DOM.
- [x] Thiết lập TypeScript và các type definitions cần thiết.
- [x] Thiết lập Tailwind CSS, PostCSS và CSS toàn cục.
- [x] Thiết lập cấu hình `pnpm` và lockfile dependency.
- [x] Tạo layout dùng chung cho ứng dụng.
- [x] Tạo trang chính và platform shell.
- [x] Tạo màn hình đăng nhập.
- [x] Tạo màn hình đăng ký.
- [x] Tái sử dụng `AuthPage` cho hai chế độ login và register.
- [x] Kết nối form đăng ký với `POST /api/auth/register`.
- [x] Kết nối form đăng nhập với `POST /api/auth/login`.
- [x] Thêm các trường username, display name và xác nhận mật khẩu cho đăng ký.
- [x] Chỉ lưu access/refresh token sau khi đăng nhập thành công và chuyển về trang chính.
- [x] Sau đăng ký chuyển đến trang nhập mã OTP email, không tự động vào trang chính.
- [x] Tạo trang nhập mã xác nhận email và chuyển sang trang đăng nhập sau khi xác nhận thành công.
- [x] Hiển thị thông tin profile thật từ API `GET /api/profile`.
- [x] Thêm form cập nhật username, display name, bio, avatar URL, cover URL và ngày sinh.
- [x] Thêm chọn và upload file avatar trực tiếp từ trang profile.
- [x] Chuẩn hóa URL ảnh upload từ backend để frontend tải ảnh đúng cổng API, tránh lỗi 404 tại frontend.
- [x] Hiển thị nút `Edit profile` luôn sẵn, không cần hover mới xuất hiện.
- [x] Thêm đăng xuất, revoke refresh token và xóa token local trước khi về trang đăng nhập.
- [x] Hiển thị thông báo đăng nhập riêng cho email chưa đăng ký, mật khẩu sai, email chưa xác nhận và tài khoản bị vô hiệu hóa.
- [x] Kết nối feed và form bài viết với Posts API.
- [x] Hiển thị thông báo rõ ràng khi đăng bài thành công hoặc thất bại, gồm cả
      lỗi validation từ backend.
- [x] Kết nối giao diện comments/replies với Comments API.
- [x] Kết nối nút reaction của bài viết với Post Reactions API.
- [x] Kết nối reaction của comment với Comment Reactions API.
- [x] Kết nối chức năng lưu/bỏ lưu bài viết với Bookmarks API.
- [x] Kết nối upload và hiển thị media của bài viết với PostMedia API.
- [x] Kết nối danh sách community, tạo/sửa/xóa và join/leave với Community API.
- [x] Tạo trang đặt lại mật khẩu từ link Gmail.
- [x] Hiển thị trạng thái đang xử lý và lỗi API trên form xác thực.
- [x] Cấu hình API URL local trong `.env.local`.
- [x] Tạo các UI component cơ bản gồm avatar, badge, button, dropdown menu,
      input, separator và textarea.
- [x] Tích hợp icon thông qua `lucide-react`.
- [x] Tích hợp các tiện ích xử lý class với `clsx`, `cn`,
      `tailwind-merge` và `class-variance-authority`.
- [x] Có README hướng dẫn cài dependency, chạy development và build.

## Đang chờ thực hiện

- [ ] Bổ sung quản lý access token, phiên đăng nhập và đăng xuất.
- [ ] Lưu refresh token và tự động refresh access token trước khi hết hạn.
- [ ] Bổ sung UI xác minh email, quên mật khẩu, đặt lại mật khẩu và đăng xuất.
- [x] Tạo helper `apiFetch` dùng chung cho các request tới backend.
- [ ] Bổ sung xử lý loading, validation và lỗi từ API.
- [x] Hoàn thiện các màn hình social network: feed, bài viết, bình luận,
      reaction, bookmarks, media và cộng đồng.
- [x] Tích hợp upload ảnh/file bài viết với backend.
- [x] Cho phép tạo bài viết kèm nhiều ảnh/video; hiển thị rõ giới hạn 10 MB mỗi file.
- [x] Hiển thị feed thật có thể cuộn trên trang Home và hiển thị thông tin tác giả.
- [x] Hiển thị preview ảnh và video trước khi đăng bài; tự dọn dẹp URL preview
      tạm thời khi thay đổi file hoặc hoàn tất đăng bài.
- [x] Thêm dữ liệu mẫu backend để kiểm tra feed Home.
- [x] Ghi nhận giới hạn media: mỗi ảnh/video tối đa 10 MB; hỗ trợ JPG, PNG,
      WEBP, GIF, MP4 và WEBM.
- [ ] Tích hợp realtime qua SignalR.
- [ ] Bổ sung route protection cho các trang yêu cầu đăng nhập.
- [ ] Bổ sung test component và test luồng xác thực.
- [ ] Bổ sung kiểm tra lint/type-check trong scripts nếu cần.
- [ ] Kiểm tra responsive và accessibility trên các màn hình chính.

## Quy trình cập nhật tiến độ

Sau mỗi thay đổi client:

1. Cập nhật mục **Đã hoàn thành** hoặc **Đang chờ thực hiện**.
2. Ghi lại các màn hình, component hoặc integration đã thay đổi nếu có ảnh
   hưởng đáng kể đến cấu trúc.
3. Chạy từ thư mục `Client`:

   ```powershell
   pnpm install
   pnpm run build
   ```

4. Khi tích hợp backend, kiểm tra đồng thời API URL, CORS, authentication và
   trạng thái lỗi trên giao diện.
