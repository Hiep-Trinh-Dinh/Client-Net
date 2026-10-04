# Client UI Project

Dự án giao diện client được xây dựng bằng Next.js, React, Tailwind CSS và các component UI hiện đại như shadcn/ui.

## 1. Yêu cầu hệ thống

- Node.js >= 20
- npm hoặc pnpm
- Trình duyệt Chrome / Edge / Firefox mới

## 2. Thư viện và dependency chính

| Loại | Thư viện | Mục đích |
|---|---|---|
| Framework | `next` | Framework web chính cho app |
| UI | `react`, `react-dom` | Render giao diện |
| CSS | `tailwindcss`, `@tailwindcss/postcss`, `postcss` | Styling và xử lý CSS |
| UI component | `@base-ui/react` | Component UI cơ bản |
| Icons | `lucide-react` | Icon hệ thống |
| Utilities | `clsx`, `tailwind-merge`, `class-variance-authority`, `cn`, `tw-animate-css` | Xử lý className và animation |
| Analytics | `@vercel/analytics` | Theo dõi analytics |
| TypeScript | `typescript`, `@types/node`, `@types/react`, `@types/react-dom` | Type checking |
| UI scaffold | `shadcn` | Tạo component UI theo chuẩn |

## 3. Cài đặt dependency

### Cách 1: Dùng npm (khuyến nghị trên Windows)

```bash
cd e:\workspace\Project\Client
npm install
```

### Cách 2: Dùng pnpm

```bash
cd e:\workspace\Project\Client
npx pnpm@12.3.4 install
```

> Nếu máy Windows báo lỗi về PowerShell policy khi chạy npm/pnpm, hãy chạy bằng lối tắt .cmd hoặc dùng `cmd /c`.
>
> Ví dụ:
>
> ```bash
> cmd /c "cd /d ""e:\workspace\Project\Client"" && ""C:\Program Files\nodejs\npm.cmd"" install"
> ```

## 4. Chạy dự án ở chế độ development

```bash
npm run dev
```

Sau đó mở địa chỉ sau trong trình duyệt:

```text
http://localhost:3000
```

## 5. Build production

```bash
npm run build
```

## 6. Chạy production build

```bash
npm run start
```

## 7. Ghi chú quan trọng

- Ứng dụng được kiểm tra chạy thành công trên port `3000`.
- Build Next.js cũng đã chạy thành công bằng lệnh `npm run build`.
- Nếu đang làm việc trên Windows và gặp lỗi `running scripts is disabled`, hãy dùng đường dẫn đầy đủ tới `npm.cmd` hoặc chạy qua `cmd /c`.

## 8. Cấu trúc thư mục chính

```text
Client/
├── app/
├── components/
├── lib/
├── public/
├── package.json
├── next.config.mjs
├── postcss.config.mjs
├── tsconfig.json
├── README.md
└── node_modules/
```

## 9. Lệnh nhanh

```bash
npm install
npm run dev
npm run build
npm run start
```

Nếu bạn muốn, tôi có thể tiếp tục tạo thêm các màn hình UI hoặc cấu hình tối ưu tiếp theo cho dự án này.
