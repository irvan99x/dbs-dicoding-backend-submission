# Belajar Fundamental Aplikasi Back-End

Kelas ini ditujukan untuk Back-End Developer yang ingin mengetahui cara mengelola dan mengamankan dengan baik di server, dengan mengacu pada
standar industri yang divalidasi AWS. Di akhir kelas, siswa dapat membuat aplikasi back-end berupa RESTful API yang menerapkan Database, Authentication
dan Authorization, Message Broker, Storage, dan Caching sesuai studi kasus yang ada dalam dunia nyata.

Materi yang dipelajari:

- **Hapi Plugin dan Data Validation** : Menggunakan sistem Plugin pada Hapi untuk mengelola source code agar lebih mudah dipelihara. Selain itu, mengajarkan tentang menerapkan teknik Data Validation menggunakan Joi untuk memastikan data yang dikirim oleh client sesuai dengan yang
diharapkan.
- **Database menggunakan Amazon RDS** : Menggunakan database sebagai penyimpanan data yang persisten. Modul ini menggunakan PostgreSQL sebagai database yang dipasang baik secara lokal (development) maupun production (menggunakan Amazon RDS).
- **Authentication dan Authorization** : Menerapkan teknik authentication untuk memvalidasi pengguna yang mengonsumsi RESTful API. Serta menerapkan teknik authorization untuk memvalidasi resource yang merupakan hak pengguna. 
- **Normalisasi Database** : Menggunakan teknik normalisasi database untuk membangun fitur kompleks yang membutuhkan join dari beberapa tabel.
- **Message Broker dengan Amazon MQ** : Menggunakan teknologi Message Broker untuk menangani permintaan secara asynchronous. Modul ini menggunakan RabbitMQ sebagai Message Broker secara lokal maupun production (menggunakan Amazon MQ).
- **Storage dengan Amazon S3** : Membuat storage secara lokal menggunakan core modules fs dan memanfaatkan teknologi cloud dengan menggunakan Amazon S3.
- **Caching menggunakan Amazon ElastiCache** : Menggunakan teknologi memory caching untuk memberikan respons yang cepat dalam menampilkan resource. Modul ini menggunakan Redis sebagai memory caching secara lokal maupun production (menggunakan Amazon ElastiCache).
- **Submission:** : Proyek akhir membuat RESTful API dengan menerapkan teknologi database, storage message broker, dan caching, serta memiliki fitur authentication dan authorization.

## Environment Variables
Untuk menjalankan project ini, anda harus menambahkan beberapa environment variables didalam file .env.

`PGUSER`
`PGHOST`
`PGPASSWORD`
`PGDATABASE`
`PGPORT`
`ACCESS_TOKEN_KEY`
`REFRESH_TOKEN_KEY`
`ACCESS_TOKEN_AGE`
`RABBITMQ_SERVER`
`REDIS_SERVER`
