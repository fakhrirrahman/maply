Saya sedang mengembangkan backend API bernama "Maply".

Tech stack:
- Bun
- TypeScript
- ElysiaJS
- PostgreSQL
- Prisma ORM
- JWT Authentication menggunakan @elysia/jwt
- Swagger/OpenAPI menggunakan @elysiajs/swagger

Project menggunakan Repository Pattern dengan struktur kurang lebih:

src/
├── config/
│   └── swagger.ts
├── controllers/
├── lib/
│   ├── prisma.ts
│   └── jwt.ts
├── middleware/
│   └── jwt.middleware.ts
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
│   └── response.ts
├── app.ts
└── server.ts

prisma/
└── schema.prisma

Jangan mengubah struktur project ini kecuali benar-benar diperlukan.


==================================================
PROJECT CONCEPT
==================================================

Maply adalah sistem berbasis QR Card.

Terdapat 4 role:

- SUPER_ADMIN
- ADMIN
- AGENT
- USER

Semua account disimpan dalam satu table `users`.

SUPER_ADMIN / ADMIN:
- Login ke admin panel
- Manage users
- Manage agents
- Manage cards
- Assign card ke agent
- Manage price
- Manage payment methods
- Melihat transaction/payment

AGENT:
- Login ke agent panel
- Melihat card yang diberikan oleh admin
- Card nantinya diberikan kepada customer/user

USER:
- Melakukan registrasi melalui QR/Card
- Melakukan pembayaran
- Setelah pembayaran berhasil card menjadi ACTIVE
- User dapat login
- User dapat membuat/mengelola map
- User memilih lokasi dari frontend map provider
- Frontend mengirim location information ke backend
- Backend menyimpan location tersebut

VISITOR:
- Tidak perlu login
- Scan QR pada card
- QR berisi token/public identifier
- Backend mencari card berdasarkan qrToken
- Jika card ACTIVE, backend mengambil owner card
- Mengambil map milik owner
- Mengambil locations dari map
- Mengembalikan data map secara public


==================================================
DATABASE
==================================================

Prisma schema sudah tersedia dan sudah menjadi source of truth.

Model utama:

User
AgentProfile
Card
CardAssignment
UserMap
UserMapLocation
Price
PaymentMethod
Transaction
Payment

Jangan membuat table baru tanpa alasan yang jelas.

Gunakan Prisma Client melalui:

src/lib/prisma.ts

Repository adalah satu-satunya layer yang seharusnya melakukan query Prisma secara langsung.

Controller tidak boleh query Prisma langsung.


==================================================
ARCHITECTURE
==================================================

Gunakan flow:

Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL

Responsibilities:

Route:
- HTTP method
- path
- validation schema
- Swagger/OpenAPI metadata
- middleware

Controller:
- menerima HTTP request
- memanggil service
- menentukan HTTP response/status

Service:
- business logic
- validation business rules
- orchestration

Repository:
- Prisma/database query

Model:
- Elysia validation schema menggunakan `t`
- request/response schema jika diperlukan

Middleware:
- authentication
- authorization

Utils:
- reusable helper seperti standardized response


==================================================
RESPONSE FORMAT
==================================================

Semua API harus menggunakan response yang konsisten.

Success:

{
  "success": true,
  "message": "Success",
  "data": {}
}

Error:

{
  "success": false,
  "message": "Error message",
  "errors": null
}

Pagination:

{
  "success": true,
  "message": "Success",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10
  }
}

Gunakan helper yang sudah tersedia di:

src/utils/response.ts


==================================================
AUTHENTICATION
==================================================

Gunakan JWT.

JWT plugin:

src/lib/jwt.ts

Authentication middleware:

src/middleware/jwt.middleware.ts

JWT minimal menyimpan:

{
  "sub": "USER_ID",
  "role": "USER_ROLE"
}

Role:
SUPER_ADMIN
ADMIN
AGENT
USER

Password tidak boleh disimpan plain text.

Gunakan Bun.password untuk hashing dan verification jika memungkinkan.

Contoh:

await Bun.password.hash(password)

dan:

await Bun.password.verify(password, passwordHash)

Jangan pernah mengembalikan passwordHash melalui API.


==================================================
SWAGGER / OPENAPI
==================================================

Global Swagger configuration berada di:

src/config/swagger.ts

Swagger global hanya berisi configuration seperti:

- API title
- API version
- description
- bearerAuth security scheme
- docs path

Dokumentasi masing-masing endpoint harus berada di route masing-masing menggunakan:

detail: {
  tags: [...],
  summary: "...",
  description: "...",
  security: [...]
}

Request body, params dan query harus menggunakan Elysia schema sehingga otomatis muncul di Swagger.

Private endpoint harus menggunakan bearerAuth.

Public QR endpoint tidak menggunakan bearerAuth.


==================================================
IMPLEMENTATION RULES
==================================================

Gunakan:
- async/await
- TypeScript typing
- Elysia validation
- Prisma
- Repository Pattern
- dependency separation yang jelas

Hindari:
- `any` kecuali benar-benar diperlukan
- query Prisma di controller
- business logic di route
- passwordHash di response
- duplicate logic
- hardcoded JWT secret
- hardcoded database credentials
- hardcoded price
- hardcoded payment method

Gunakan environment variables untuk konfigurasi sensitif.


==================================================
FIRST TASK
==================================================

Sekarang implementasikan AUTH MODULE secara lengkap.

Buat/implementasikan:

src/models/auth.model.ts
src/repositories/auth.repository.ts
src/services/auth.service.ts
src/controllers/auth.controller.ts
src/routes/auth.route.ts

Gunakan file existing jika sudah tersedia. Jangan membuat duplicate file.

Endpoint awal:

POST /auth/login

Request:

{
  "email": "admin@maply.com",
  "password": "password"
}

Login harus:

1. Validasi email/password.
2. Cari user berdasarkan email menggunakan repository.
3. Pastikan user ditemukan.
4. Pastikan status user ACTIVE.
5. Verify password menggunakan Bun.password.verify.
6. Generate JWT.
7. Update lastLoginAt.
8. Return user + accessToken.
9. Jangan return passwordHash.

Response:

{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "fullName": "...",
      "email": "...",
      "role": "ADMIN"
    },
    "accessToken": "..."
  }
}

Tambahkan Swagger/OpenAPI metadata untuk endpoint login.

Setelah implementasi, jelaskan:
1. File yang dibuat/diubah.
2. Fungsi masing-masing file.
3. Flow login dari Route -> Controller -> Service -> Repository.
4. Cara test endpoint menggunakan Swagger.
5. Command yang perlu dijalankan.

PENTING:
Sebelum menulis code, inspect terlebih dahulu file existing:
- package.json
- prisma/schema.prisma
- src/app.ts
- src/server.ts
- src/lib/prisma.ts
- src/lib/jwt.ts
- src/middleware/jwt.middleware.ts
- src/utils/response.ts

Jangan menebak API/library yang digunakan jika implementasinya sudah tersedia di project.

Jangan overwrite code existing yang masih diperlukan.

Pastikan hasil akhir compatible dengan versi package yang terinstall di package.json dan bisa dijalankan menggunakan Bun.