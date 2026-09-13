-- ==============================================================================
-- SAPA (Sarana Pendampingan dan Asistensi Siswa) Master Database Seed Data
-- 108 Siswa (36 X TKJ, 36 X TKP, 36 X TBKR), 10 Guru BK, 3 Wali Kelas, 3 Kelas Rombel
-- Bersih dari data aduan/konseling uji coba lama, siap pakai untuk produksi.
-- ==============================================================================

BEGIN;

-- 1. Kosongkan data sebelumnya secara berurutan
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE report_status_history CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE reports CASCADE;
TRUNCATE TABLE student_mood_checks CASCADE;
TRUNCATE TABLE announcements CASCADE;
TRUNCATE TABLE students CASCADE;
TRUNCATE TABLE teachers CASCADE;
TRUNCATE TABLE classes CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE system_settings CASCADE;

-- 2. KREDENSIAL PENGGUNA (users)
-- Admin Utama
INSERT INTO users (id, name, email, password, role, avatar, phone, password_changed, created_at) VALUES 
('usr-admin-1', 'Administrator SAPA', 'admin@smk.sch.id', '$sapa$v1$416bb110dc3f3e172adc67448b382fcc5e4ece99ca69df353c7dfd19ab398e2a', 'admin', NULL, '081234567800', TRUE, '2026-01-10T08:00:00Z'),
('usr-admin-2', 'Admin SAPA Sistem', 'admin@sapa.sch.id', '$sapa$v1$416bb110dc3f3e172adc67448b382fcc5e4ece99ca69df353c7dfd19ab398e2a', 'admin', NULL, '081234567801', TRUE, '2026-01-10T08:00:00Z');

-- 10 Guru BK
INSERT INTO users (id, name, email, password, role, avatar, phone, password_changed, created_at) VALUES
('usr-bk-1', 'Dra. Hj. Sri Wahyuni, M.Psi, Kons.', 'sri.wahyuni@smk.sch.id', '$sapa$v1$d5739bbeee4d9936101d1a015d97ec9f3b0c3f378af172b20058ae68c6a60f23', 'guru', NULL, '081234567811', FALSE, '2026-01-10T08:00:00Z'),
('usr-bk-2', 'Ahmad Fauzi, S.Pd., Kons.', 'ahmad.fauzi@smk.sch.id', '$sapa$v1$d5739bbeee4d9936101d1a015d97ec9f3b0c3f378af172b20058ae68c6a60f23', 'guru', NULL, '081234567812', FALSE, '2026-01-10T08:00:00Z'),
('usr-bk-3', 'Ratna Kusuma Dewi, S.Psi.', 'ratna.kusuma@smk.sch.id', '$sapa$v1$d5739bbeee4d9936101d1a015d97ec9f3b0c3f378af172b20058ae68c6a60f23', 'guru', NULL, '081234567813', FALSE, '2026-01-10T08:00:00Z'),
('usr-bk-4', 'Drs. Bambang Sudarmono, M.Pd.', 'bambang.sudarmono@smk.sch.id', '$sapa$v1$d5739bbeee4d9936101d1a015d97ec9f3b0c3f378af172b20058ae68c6a60f23', 'guru', NULL, '081234567814', FALSE, '2026-01-10T08:00:00Z'),
('usr-bk-5', 'Siti Nurhaliza, S.Pd., Kons.', 'siti.nurhaliza@smk.sch.id', '$sapa$v1$d5739bbeee4d9936101d1a015d97ec9f3b0c3f378af172b20058ae68c6a60f23', 'guru', NULL, '081234567815', FALSE, '2026-01-10T08:00:00Z'),
('usr-bk-6', 'Eko Prasetyo, S.Psi.', 'eko.prasetyo@smk.sch.id', '$sapa$v1$d5739bbeee4d9936101d1a015d97ec9f3b0c3f378af172b20058ae68c6a60f23', 'guru', NULL, '081234567816', FALSE, '2026-01-10T08:00:00Z'),
('usr-bk-7', 'Nurul Hidayati, S.Pd., M.Si.', 'nurul.hidayati@smk.sch.id', '$sapa$v1$d5739bbeee4d9936101d1a015d97ec9f3b0c3f378af172b20058ae68c6a60f23', 'guru', NULL, '081234567817', FALSE, '2026-01-10T08:00:00Z'),
('usr-bk-8', 'Dedi Kurniawan, S.Pd., Kons.', 'dedi.kurniawan@smk.sch.id', '$sapa$v1$d5739bbeee4d9936101d1a015d97ec9f3b0c3f378af172b20058ae68c6a60f23', 'guru', NULL, '081234567818', FALSE, '2026-01-10T08:00:00Z'),
('usr-bk-9', 'Tri Wahyuningsih, S.Psi.', 'tri.wahyuningsih@smk.sch.id', '$sapa$v1$d5739bbeee4d9936101d1a015d97ec9f3b0c3f378af172b20058ae68c6a60f23', 'guru', NULL, '081234567819', FALSE, '2026-01-10T08:00:00Z'),
('usr-bk-10', 'Agus Setiawan, S.Pd., Kons.', 'agus.setiawan@smk.sch.id', '$sapa$v1$d5739bbeee4d9936101d1a015d97ec9f3b0c3f378af172b20058ae68c6a60f23', 'guru', NULL, '081234567820', FALSE, '2026-01-10T08:00:00Z');

-- 3 Wali Kelas
INSERT INTO users (id, name, email, password, role, avatar, phone, password_changed, created_at) VALUES
('usr-wali-tkj', 'Budi Hartono, S.T., M.Kom.', 'budi.hartono@smk.sch.id', '$sapa$v1$d5739bbeee4d9936101d1a015d97ec9f3b0c3f378af172b20058ae68c6a60f23', 'guru', NULL, '081234567821', FALSE, '2026-01-10T08:00:00Z'),
('usr-wali-tkp', 'Ir. Hendra Saputra, S.Pd.', 'hendra.saputra@smk.sch.id', '$sapa$v1$d5739bbeee4d9936101d1a015d97ec9f3b0c3f378af172b20058ae68c6a60f23', 'guru', NULL, '081234567822', FALSE, '2026-01-10T08:00:00Z'),
('usr-wali-tbkr', 'Drs. H. Mulyadi, M.Pd.', 'mulyadi.walikelas@smk.sch.id', '$sapa$v1$d5739bbeee4d9936101d1a015d97ec9f3b0c3f378af172b20058ae68c6a60f23', 'guru', NULL, '081234567823', FALSE, '2026-01-10T08:00:00Z');

-- 108 Siswa (Password default: siswa[4 digit terakhir NIS])
INSERT INTO users (id, name, email, password, role, avatar, phone, password_changed, created_at) VALUES
('usr-std-tkj-01', 'Ahmad Rizky Pratama', 'ahmad.rizky.pratama@siswa.belajar.id', '$sapa$v1$7f75c4d9b77536b04ddc9751b08ede1b6acfb7e94065adf48bf29062e7095b5c', 'siswa', NULL, '081234560101', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-02', 'Aldiansyah Putra', 'aldiansyah.putra@siswa.belajar.id', '$sapa$v1$ec9c8e70b2e08c914cde109865232ecc23421a4b47d30e8e385851cfc14a313e', 'siswa', NULL, '081234560102', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-03', 'Amanda Putri Kirana', 'amanda.putri.kirana@siswa.belajar.id', '$sapa$v1$fca5f7c3439c53ab416b224c17e8c84804ccc85aa1a4eeca5bb69d22eea5f66b', 'siswa', NULL, '081234560103', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-04', 'Anisa Rahmawati', 'anisa.rahmawati@siswa.belajar.id', '$sapa$v1$8a0a515567f9ea41de9c14f7715cc277df1a211cc66317b3af0be61a2d2e4694', 'siswa', NULL, '081234560104', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-05', 'Bagas Arya Wicaksana', 'bagas.arya.wicaksana@siswa.belajar.id', '$sapa$v1$2414d1a9fd6686f973b0c1051db3bc07fbee26b474561f4b46c8c295285372f1', 'siswa', NULL, '081234560105', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-06', 'Bayu Nugroho', 'bayu.nugroho@siswa.belajar.id', '$sapa$v1$2c19c28f8f4e309277f2ec0aea2b396ba5ffc44b0addb8b1919b6baa6837ef0b', 'siswa', NULL, '081234560106', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-07', 'Cantika Dwi Safitri', 'cantika.dwi.safitri@siswa.belajar.id', '$sapa$v1$5f82fa341a8fd2052a0dc488f7f6e3bd537966b2b119b7b023da752cc2665aff', 'siswa', NULL, '081234560107', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-08', 'Danendra Rasyid', 'danendra.rasyid@siswa.belajar.id', '$sapa$v1$68c0ede752bdaee1542b52a62f4d1dfa357655dea68d9cd91b622cdeebb895cc', 'siswa', NULL, '081234560108', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-09', 'Desta Pratama', 'desta.pratama@siswa.belajar.id', '$sapa$v1$c8097c4edeee5ff631e00d71c92d1762304e4d9323e5f41c2f93bcd83b5698ec', 'siswa', NULL, '081234560109', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-10', 'Dimas Anggoro', 'dimas.anggoro@siswa.belajar.id', '$sapa$v1$b4eb73ed3d627e54d7cab45c1cdb56cb713e5e33db299f8dc62318d7a544a88f', 'siswa', NULL, '081234560110', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-11', 'Dinda Ayu Lestari', 'dinda.ayu.lestari@siswa.belajar.id', '$sapa$v1$e5c4ddc11c8bb2d19d50ef840c8d20e504fe291cac7bf827714c3fcdc2bc5d8d', 'siswa', NULL, '081234560111', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-12', 'Fadil Muhammad', 'fadil.muhammad@siswa.belajar.id', '$sapa$v1$d1b0c58b059fb89cdb54035fa14efb665b950956d92c55e32b74cec8111c5974', 'siswa', NULL, '081234560112', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-13', 'Farhan Alfarizi', 'farhan.alfarizi@siswa.belajar.id', '$sapa$v1$54da933582f83b7607bebf44186302e9deba6fed1cb8fc278c5071b2bd03a6a9', 'siswa', NULL, '081234560113', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-14', 'Fathir Rahman', 'fathir.rahman@siswa.belajar.id', '$sapa$v1$3caad5478c9bdad634be84a0aca44488a5e668b4f064b1661ad9a9fcbedbe98d', 'siswa', NULL, '081234560114', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-15', 'Galih Saputra', 'galih.saputra@siswa.belajar.id', '$sapa$v1$e0f706a63b90e425ff04cf0b4aaa8b21e4083cd1bd151c4ceeb7ec864d5e52b2', 'siswa', NULL, '081234560115', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-16', 'Gilang Ramadhan', 'gilang.ramadhan@siswa.belajar.id', '$sapa$v1$4f376e5b4a0f73cde28205a5a78c580654ee9fc87f753a6daf731e242696358c', 'siswa', NULL, '081234560116', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-17', 'Hafiz Syahputra', 'hafiz.syahputra@siswa.belajar.id', '$sapa$v1$f58aafb45409ade8367284f38b59fc0ba03095b1ddf7dff05686452cd114730e', 'siswa', NULL, '081234560117', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-18', 'Ilham Nur Cahyo', 'ilham.nur.cahyo@siswa.belajar.id', '$sapa$v1$2b27d507795c8912f0ce134968c68abcd4dff6d416b7537312b61493363fec5d', 'siswa', NULL, '081234560118', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-19', 'Indah Permatasari', 'indah.permatasari@siswa.belajar.id', '$sapa$v1$bf90bae642051ba3393f6dfaebd638c6494a8c5e797dd9d183f372b4b7bdd561', 'siswa', NULL, '081234560119', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-20', 'Irfan Hakim', 'irfan.hakim@siswa.belajar.id', '$sapa$v1$78e8ea04b1688317ab260d8679ae4a2706373cedb2c6a41b68cfd63053f5a0be', 'siswa', NULL, '081234560120', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-21', 'Kevin Julian', 'kevin.julian@siswa.belajar.id', '$sapa$v1$ec8d9e919a4f60bcff71ec9c8b0997514de55d998804b317d1c79238453d2827', 'siswa', NULL, '081234560121', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-22', 'Laila Safira', 'laila.safira@siswa.belajar.id', '$sapa$v1$6e75da2d98946ef1f5fa2cda92b198c2125f36d88325376ea054fd5ca91cbf5e', 'siswa', NULL, '081234560122', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-23', 'Lucky Wardhana', 'lucky.wardhana@siswa.belajar.id', '$sapa$v1$dcee699285101e2ea75e60152c1a7c25541be97c76979ebcbfb13b15c99a590a', 'siswa', NULL, '081234560123', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-24', 'M. Aditya Nugraha', 'm.aditya.nugraha@siswa.belajar.id', '$sapa$v1$c96b69d252748055496df5c210ee3899434a27e3bc53acf9fd17ad2487ce3672', 'siswa', NULL, '081234560124', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-25', 'M. Fikri Haikal', 'm.fikri.haikal@siswa.belajar.id', '$sapa$v1$10066f9ac51fe30d91497c488e5b7e2bfad305f949f61a8c5848cc6377ebedc4', 'siswa', NULL, '081234560125', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-26', 'M. Zidan Maulana', 'm.zidan.maulana@siswa.belajar.id', '$sapa$v1$65283cb5f0d860f0a419d18c5134d437e26742f3363240058f45ce23082452f8', 'siswa', NULL, '081234560126', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-27', 'Nabila Salsabila', 'nabila.salsabila@siswa.belajar.id', '$sapa$v1$20e1503381807c08fdd33a77adc1f7923a3b9e55ea8de663b1b4d2cf3a09baa5', 'siswa', NULL, '081234560127', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-28', 'Nadia Fitriani', 'nadia.fitriani@siswa.belajar.id', '$sapa$v1$b13f68b9ea28a44f2ff36a582d41af2e7474743230269d92fca70a91204c2e56', 'siswa', NULL, '081234560128', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-29', 'Noval Ardiansyah', 'noval.ardiansyah@siswa.belajar.id', '$sapa$v1$6e088cbc37e8a69841a2dd496ddac4104ca08ac715856454a02435c8bfc6528a', 'siswa', NULL, '081234560129', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-30', 'Panji Gumilang', 'panji.gumilang@siswa.belajar.id', '$sapa$v1$dadb1791f145c1ada0540cb7a2ae960633b89b9a89d32f09a358daada160b4a8', 'siswa', NULL, '081234560130', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-31', 'Raditya Pratama', 'raditya.pratama@siswa.belajar.id', '$sapa$v1$3abc31a50f73fe706f73a1fa16a3a64edb4f5e95c4c6b5440f75983ae5134886', 'siswa', NULL, '081234560131', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-32', 'Raihan Surya', 'raihan.surya@siswa.belajar.id', '$sapa$v1$77b3c1ab0327a53774391a627f588a8dcd47f4a3a2aea9e54eb48df3e623318c', 'siswa', NULL, '081234560132', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-33', 'Rendy Ardiansyah', 'rendy.ardiansyah@siswa.belajar.id', '$sapa$v1$85c55bae49e11130391c6c3053fd92c2d225438282924615c03757bb812b5941', 'siswa', NULL, '081234560133', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-34', 'Rian Hidayat', 'rian.hidayat@siswa.belajar.id', '$sapa$v1$d888311226c0f0fb5adf5d1f6a12e9ab20bc674f97648139b1037c82ea5422fb', 'siswa', NULL, '081234560134', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-35', 'Rizki Ramadhani', 'rizki.ramadhani@siswa.belajar.id', '$sapa$v1$f3a021ce6401bf2197b8123186dd3a5e88459d0ae837eb086b2c5f772b354519', 'siswa', NULL, '081234560135', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkj-36', 'Yoga Pangestu', 'yoga.pangestu@siswa.belajar.id', '$sapa$v1$fdbe36d261a58a36149ab0d37297a320fc49e73ad96bdc1727bc9182769b43a2', 'siswa', NULL, '081234560136', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-01', 'Adam Malik', 'adam.malik@siswa.belajar.id', '$sapa$v1$16e24a6d47e4611cd747e9a4723f1f37ec5d7b3b45d5966b17504513f84601b9', 'siswa', NULL, '081234560201', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-02', 'Agung Prasetyo', 'agung.prasetyo@siswa.belajar.id', '$sapa$v1$ca2ce713c8da6da6d179105f9af52b67e4545d00d131323b7c8d35ddbf7fc334', 'siswa', NULL, '081234560202', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-03', 'Aisyah Putri Handayani', 'aisyah.putri.handayani@siswa.belajar.id', '$sapa$v1$13c0ef63a5ab9ac7265749755443b70120d3f293d0f50b51d83f37d5ae6ce5f6', 'siswa', NULL, '081234560203', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-04', 'Alif Bahtiar', 'alif.bahtiar@siswa.belajar.id', '$sapa$v1$2a2a663307c4e6c789101a17fdf745f04038e1bec058986cfed3f264503cb1d9', 'siswa', NULL, '081234560204', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-05', 'Andika Firmansyah', 'andika.firmansyah@siswa.belajar.id', '$sapa$v1$643f918adaf5d694daa06d73184e367fc320bcd6bf2ea47fa0f9c457214d68d6', 'siswa', NULL, '081234560205', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-06', 'Angga Saputra', 'angga.saputra@siswa.belajar.id', '$sapa$v1$3aa2f82c15953b994096f05bfdccff5853df9ad2c7d4b8272a5ba2cf78a31b0a', 'siswa', NULL, '081234560206', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-07', 'Arya Bima Kusuma', 'arya.bima.kusuma@siswa.belajar.id', '$sapa$v1$6ad136ea113fc54ff4f0e812137e53d2c38b34cbb0578e22f08141eb5872a884', 'siswa', NULL, '081234560207', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-08', 'Bagus Santoso', 'bagus.santoso@siswa.belajar.id', '$sapa$v1$35c7767624de40798facc195e752c10761959aac16c065eb835a1587c41b2327', 'siswa', NULL, '081234560208', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-09', 'Bella Safira', 'bella.safira@siswa.belajar.id', '$sapa$v1$eef58c6f3f6d6467d550554a2a08990ddfd95e0d98e39b9d1dbad5214d549313', 'siswa', NULL, '081234560209', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-10', 'Bima Sakti', 'bima.sakti@siswa.belajar.id', '$sapa$v1$5d75dcaa6fe04c9be34363b229ee583ea7dc0907557038d7e51a28fa7262f3c5', 'siswa', NULL, '081234560210', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-11', 'Candra Gunawan', 'candra.gunawan@siswa.belajar.id', '$sapa$v1$92a561614df115654a7b6f4bf210e5ebed22269a23ba249732e4839093a76fc2', 'siswa', NULL, '081234560211', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-12', 'Dani Setiawan', 'dani.setiawan@siswa.belajar.id', '$sapa$v1$cef64c0bab2ad124bc4f75684148ad265c3ddccffab56f184bc6b520bc165ebb', 'siswa', NULL, '081234560212', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-13', 'Deden Kurnia', 'deden.kurnia@siswa.belajar.id', '$sapa$v1$bbeefd540f56d2a2cbe500b20d228ea1219b56662732e01e6f9cce4f6c7be743', 'siswa', NULL, '081234560213', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-14', 'Doni Irawan', 'doni.irawan@siswa.belajar.id', '$sapa$v1$ece7e6131c1fdd1d5c974f9e5e041d5ced5a0127885ec463fa9298999d7f4a28', 'siswa', NULL, '081234560214', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-15', 'Eka Wahyudi', 'eka.wahyudi@siswa.belajar.id', '$sapa$v1$c9cbbcdf06f210a0b6d07a184a31fa1485c399ef8ef4ee1a8dbc342476d404db', 'siswa', NULL, '081234560215', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-16', 'Fajar Sidik', 'fajar.sidik@siswa.belajar.id', '$sapa$v1$bc59c16d0b0b0e343f62cb7e130e58cc241db00adad58831753c9aa4570aea31', 'siswa', NULL, '081234560216', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-17', 'Fauzan Adhim', 'fauzan.adhim@siswa.belajar.id', '$sapa$v1$c4316a323e2834b202c5e7c5b8d724d2bafb2d7e96670d3e338029f25f235d43', 'siswa', NULL, '081234560217', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-18', 'Firman Utina', 'firman.utina@siswa.belajar.id', '$sapa$v1$e066ca92ab83b5656b84477dd5ec3a876db8547e65075e3c08cfef0b3798ca49', 'siswa', NULL, '081234560218', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-19', 'Guntur Triwibowo', 'guntur.triwibowo@siswa.belajar.id', '$sapa$v1$8096480cb53831ee18581cb6631354e28c2ead297356345814e009bef3e38433', 'siswa', NULL, '081234560219', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-20', 'Haryanto', 'haryanto@siswa.belajar.id', '$sapa$v1$55ab6c3db24f9a18a03764bcf9a91ee550c78fcea634490478706f3fc3b86abe', 'siswa', NULL, '081234560220', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-21', 'Hendri Gunawan', 'hendri.gunawan@siswa.belajar.id', '$sapa$v1$d49f339cb6ade36ce05c2f5d0389d352a71b4e576ad68af3549311f441932969', 'siswa', NULL, '081234560221', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-22', 'Ihsan Kamil', 'ihsan.kamil@siswa.belajar.id', '$sapa$v1$1b826e3b8a7d598cb9a563120c3639eea8ecb73d0afdee8d88aa9cd99567d1b2', 'siswa', NULL, '081234560222', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-23', 'Indra Lesmana', 'indra.lesmana@siswa.belajar.id', '$sapa$v1$65814673f96e583a1fa3a124a3dd17866ba9681b58f2c1630fc8c26a9e27dfa6', 'siswa', NULL, '081234560223', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-24', 'Joko Supriyanto', 'joko.supriyanto@siswa.belajar.id', '$sapa$v1$e2255844a5251fd59812d4f647e24cdb19d295f6f15a3446f5e39ad9cb110e87', 'siswa', NULL, '081234560224', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-25', 'Maulana Malik Ibrahim', 'maulana.malik.ibrahim@siswa.belajar.id', '$sapa$v1$dcfa8d4957dfce3aca469efc5c936e98537c93e2523365ec1e7cbd99063e0825', 'siswa', NULL, '081234560225', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-26', 'Muhammad Iqbal', 'muhammad.iqbal@siswa.belajar.id', '$sapa$v1$e69f2c3743c224fb985e6d409f7620b4a4a52b7393e85e4b39189389f79e94d0', 'siswa', NULL, '081234560226', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-27', 'Pandu Dewanata', 'pandu.dewanata@siswa.belajar.id', '$sapa$v1$986f727fe29178a6700ef482a73a087c301b8ad4e39ae6d8ba41b130f48f857c', 'siswa', NULL, '081234560227', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-28', 'Putra Pratama', 'putra.pratama@siswa.belajar.id', '$sapa$v1$b1265e1cfc61ef2bc3561161507c5a2e8cd46e42815434a61a5a6d6e4ec384dc', 'siswa', NULL, '081234560228', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-29', 'Rahmat Hidayat', 'rahmat.hidayat@siswa.belajar.id', '$sapa$v1$ec99dcd4aa590849e6054445ef91203fb40b06a1141888bf1671f2d143c730c6', 'siswa', NULL, '081234560229', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-30', 'Restu Fauzi', 'restu.fauzi@siswa.belajar.id', '$sapa$v1$35f89e3a2f55c8af41e67f4d025d27a69d1f4750d1f3d240c435bb1b0fd7bbae', 'siswa', NULL, '081234560230', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-31', 'Rio Febrian', 'rio.febrian@siswa.belajar.id', '$sapa$v1$aae92f6a9bf2e37cbe060ab933dcccdecda1d333edee1b082226951de3b3f802', 'siswa', NULL, '081234560231', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-32', 'Satria Yudha', 'satria.yudha@siswa.belajar.id', '$sapa$v1$13991ef5c5e686f41dc352ea9ee08c5c40d384f8071205beb9f7d56ba5c6109c', 'siswa', NULL, '081234560232', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-33', 'Tegar Prakoso', 'tegar.prakoso@siswa.belajar.id', '$sapa$v1$f4d188c8cdc6c52b423ca7c140f1b978c9c7b53963fbcbe1a0a51f555d314842', 'siswa', NULL, '081234560233', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-34', 'Wahyu Ramadhan', 'wahyu.ramadhan@siswa.belajar.id', '$sapa$v1$7140c85162339c844ecd172bb58badbbec0d618b91ac31deefd3b3e7f2a3ec6b', 'siswa', NULL, '081234560234', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-35', 'Wildan Hakim', 'wildan.hakim@siswa.belajar.id', '$sapa$v1$05a4dddf1e3f1478b3c85cc0ab71c77dfb424cfdefa541fb740da162920815a1', 'siswa', NULL, '081234560235', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tkp-36', 'Yusuf Maulana', 'yusuf.maulana@siswa.belajar.id', '$sapa$v1$55166de75a4539281475ba3ab3381e357ce597901d61296a15b0b9f05c31a7f2', 'siswa', NULL, '081234560236', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-01', 'Adi Nugroho', 'adi.nugroho@siswa.belajar.id', '$sapa$v1$d27e8d380d9f3855387c57d8e9e7b531f3b0d2d56b7a661e248470ee48397c06', 'siswa', NULL, '081234560301', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-02', 'Aditya Pratama', 'aditya.pratama@siswa.belajar.id', '$sapa$v1$2c7fe982c08cb0aa08de1af131fa90209a58c54aa6cac8d64d62c2d96095640e', 'siswa', NULL, '081234560302', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-03', 'Aldi Taherian', 'aldi.taherian@siswa.belajar.id', '$sapa$v1$bac119f5bacfb573346db3fc5b8603331dfb8a2b8919904399732ffc01b6a294', 'siswa', NULL, '081234560303', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-04', 'Andre Setiawan', 'andre.setiawan@siswa.belajar.id', '$sapa$v1$f10481cf9fef83ea57beafaa00d17bd770449ead709ad9d7d855f3113a56780b', 'siswa', NULL, '081234560304', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-05', 'Anton Wijaya', 'anton.wijaya@siswa.belajar.id', '$sapa$v1$2fd06f71caa9796787825c7525c3f4c55ae1a2b024b284ceb8f9dd4a69b32a16', 'siswa', NULL, '081234560305', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-06', 'Ari Wibowo', 'ari.wibowo@siswa.belajar.id', '$sapa$v1$178214bb81481553a604b4a559724dfceb6ec1ec24a728ef954ab328af495f57', 'siswa', NULL, '081234560306', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-07', 'Asep Saepudin', 'asep.saepudin@siswa.belajar.id', '$sapa$v1$6673359379a4559afb65bacd826c7e83656a2fb0af61d6020c0832191333cf6d', 'siswa', NULL, '081234560307', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-08', 'Bobby Kurniawan', 'bobby.kurniawan@siswa.belajar.id', '$sapa$v1$57b86790737752b91131f7fedeebc5f766eca5e2f221c391f8e2e15c9635d428', 'siswa', NULL, '081234560308', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-09', 'Chairul Anam', 'chairul.anam@siswa.belajar.id', '$sapa$v1$d35844478f4bc927c1d20af0648a58e0363f7f4b2927f90e20bf0dce165c3407', 'siswa', NULL, '081234560309', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-10', 'Danu Wijaya', 'danu.wijaya@siswa.belajar.id', '$sapa$v1$58348e5ca8c23f78f6c9c7ba4ce53ec5804c5c3b512fd1c3fc7486e2981d68f9', 'siswa', NULL, '081234560310', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-11', 'Dede Rusmana', 'dede.rusmana@siswa.belajar.id', '$sapa$v1$bb5930fd8631b9cdc2b38099b7c3bc2b7e3b1a2a49fd4e5fe84602bc39fae938', 'siswa', NULL, '081234560311', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-12', 'Deni Septian', 'deni.septian@siswa.belajar.id', '$sapa$v1$3f84782b09b9482553c270a51472a35ea373be4c063581bad65e748aaca9d3be', 'siswa', NULL, '081234560312', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-13', 'Edo Febriansyah', 'edo.febriansyah@siswa.belajar.id', '$sapa$v1$09d6887a16f936fea5b37e968599543c89f45166eda360cab39e52e22c2deaa1', 'siswa', NULL, '081234560313', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-14', 'Erik Estrada', 'erik.estrada@siswa.belajar.id', '$sapa$v1$d940051224fc6accb2960349e164ed76c3e1a7260fd3f11fd87d3826138dac76', 'siswa', NULL, '081234560314', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-15', 'Ferdiansyah', 'ferdiansyah@siswa.belajar.id', '$sapa$v1$7bebb0b7214723f29a11936041e968c27f881b653ed18a4485ebd21cea032778', 'siswa', NULL, '081234560315', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-16', 'Fikri Haikal', 'fikri.haikal@siswa.belajar.id', '$sapa$v1$2109d7bcf526fa89b74a5f25355c1b4fe4523a9cd891daa6133c84b5c417679f', 'siswa', NULL, '081234560316', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-17', 'Gani Muhammad', 'gani.muhammad@siswa.belajar.id', '$sapa$v1$f6bd3f988397584f932ccfb291a244816c55b9164e1d3dcdd75312cb669a5c0f', 'siswa', NULL, '081234560317', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-18', 'Hadi Prabowo', 'hadi.prabowo@siswa.belajar.id', '$sapa$v1$6106149aade2a538032d854dfd01f40ecff49b9e5de41c0bdecd600ac083ef29', 'siswa', NULL, '081234560318', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-19', 'Heru Susanto', 'heru.susanto@siswa.belajar.id', '$sapa$v1$162bfe751d256b6334b350bbb668425d95f74bb10348bede2b985415a90c9c32', 'siswa', NULL, '081234560319', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-20', 'Ian Kasela', 'ian.kasela@siswa.belajar.id', '$sapa$v1$63dbf2c315ea894c7e71c0b13ca93403f88dd2f827c6eb2e7211280d63b69283', 'siswa', NULL, '081234560320', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-21', 'Jafar Shiddiq', 'jafar.shiddiq@siswa.belajar.id', '$sapa$v1$19073ad3acbf44ca0d78b6b98da9a54bc64023f42d7344026c62d6449dad2916', 'siswa', NULL, '081234560321', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-22', 'Krisna Mukti', 'krisna.mukti@siswa.belajar.id', '$sapa$v1$968cd3cbcca4c768e6ce199c82c03e171d051faa1eef25df9e0ba0fc00e8a88b', 'siswa', NULL, '081234560322', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-23', 'Lukman Hakim', 'lukman.hakim@siswa.belajar.id', '$sapa$v1$caca43ba1ad29f46e07037f6bdb77ca81a74edefe46e8b363d12b3b8f3778770', 'siswa', NULL, '081234560323', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-24', 'M. Arifin', 'm.arifin@siswa.belajar.id', '$sapa$v1$2ff1e308e7d91e3f263f9636d6bd1a102462870addaf279c040fd35c6d48cd23', 'siswa', NULL, '081234560324', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-25', 'M. Ridwan', 'm.ridwan@siswa.belajar.id', '$sapa$v1$32c5b79369d19683d73311230ab79acbc96dafcbe2b8d39a5af34dc20929e98b', 'siswa', NULL, '081234560325', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-26', 'Nanda Saputra', 'nanda.saputra@siswa.belajar.id', '$sapa$v1$34fe7cb2a8846f9314b1e6911bc31c904f8f3ca3f95d59a16469ac802bf51f04', 'siswa', NULL, '081234560326', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-27', 'Oki Setiawan', 'oki.setiawan@siswa.belajar.id', '$sapa$v1$0c6f7623c8cb82c042e2a628320a1620897139daf7aba5699ea2dda6d5f0ff9b', 'siswa', NULL, '081234560327', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-28', 'Pratama Arhan', 'pratama.arhan@siswa.belajar.id', '$sapa$v1$ffa470677cd882d4f64a526ea38f4823e53444d6339d80aa5d38d08e87d63915', 'siswa', NULL, '081234560328', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-29', 'Rendi Juliansyah', 'rendi.juliansyah@siswa.belajar.id', '$sapa$v1$09acc71ee7de84cdc39d3187a5f910e1a51d0a8a9bef74aa1028fe679c16773b', 'siswa', NULL, '081234560329', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-30', 'Rizal Ramli', 'rizal.ramli@siswa.belajar.id', '$sapa$v1$8fc167e70df361bd959986d45d292ca0d130999599d35b3fee30af80384b6b28', 'siswa', NULL, '081234560330', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-31', 'Sandi Kurnia', 'sandi.kurnia@siswa.belajar.id', '$sapa$v1$dd74978885bfae68753a0b78a7c1dcc4d6850e3aee68440882aa050a9a70d42a', 'siswa', NULL, '081234560331', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-32', 'Surya Kencana', 'surya.kencana@siswa.belajar.id', '$sapa$v1$756bb0e9a36e2ca347e25e9e54e77579deecde78f3c5b89eaff3f09c90873154', 'siswa', NULL, '081234560332', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-33', 'Tommy Soeharto', 'tommy.soeharto@siswa.belajar.id', '$sapa$v1$81ce58def31a65c00534c0110e4e67422d2c1e8f96c17e7ed4b0a56e7278d0f0', 'siswa', NULL, '081234560333', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-34', 'Vicki Prasetyo', 'vicki.prasetyo@siswa.belajar.id', '$sapa$v1$76c7a24851c6d6f5518bb4b2be74e5b226a54c05a64f84f03b8b78a9f7508eb4', 'siswa', NULL, '081234560334', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-35', 'Wawan Hermawan', 'wawan.hermawan@siswa.belajar.id', '$sapa$v1$519c1df070e75248caa0290afebfad376d70e824ee942b89fee4aafcc9e112fe', 'siswa', NULL, '081234560335', FALSE, '2026-01-15T08:00:00Z'),
('usr-std-tbkr-36', 'Zulkifli Hasan', 'zulkifli.hasan@siswa.belajar.id', '$sapa$v1$1758231509f17da7c301409d2490623c3fecfe1537f1591eecb32abd20f1c74c', 'siswa', NULL, '081234560336', FALSE, '2026-01-15T08:00:00Z');

-- 3. KELAS ROMBEL (classes: X TKJ, X TKP, X TBKR)
INSERT INTO classes (id, name, grade, major, homeroom_teacher_id, bk_teacher_id) VALUES
('cls-tkj', 'X TKJ', '10', 'Teknik Komputer dan Jaringan (TKJ)', 'tch-wali-tkj', 'tch-bk-1'),
('cls-tkp', 'X TKP', '10', 'Teknik Konstruksi dan Perumahan (TKP)', 'tch-wali-tkp', 'tch-bk-2'),
('cls-tbkr', 'X TBKR', '10', 'Teknik Bodi Kendaraan Ringan (TBKR)', 'tch-wali-tbkr', 'tch-bk-3');

-- 4. PROFIL GURU (teachers: 10 Guru BK & 3 Wali Kelas)
-- NIP disimpan dalam format terenkripsi ($sapa$nip$v1$...) untuk keamanan data privasi guru
INSERT INTO teachers (id, user_id, nip, teacher_type, specialization, room, bio, available_hours, is_active, assigned_class_ids, created_at) VALUES
('tch-bk-1', 'usr-bk-1', '$sapa$nip$v1$425847546f5d58456e5a50495856406f5b54', 'guru_bk', 'Koordinator BK - Konseling Pribadi & Sosial', 'Ruang BK Utama (Lantai 2 Gedung A)', 'Koordinator Bimbingan Konseling Sekolah. Pendampingan kesehatan mental, trauma perundungan, dan resiliensi sosial siswa.', 'Senin - Jumat (07.30 - 15.00 WIB)', TRUE, '["cls-tkj"]'::jsonb, '2026-01-10T08:00:00Z'),
('tch-bk-2', 'usr-bk-2', '$sapa$nip$v1$425848516f5658426d5359455854436f5b51', 'guru_bk', 'Konseling Karir & Kesiapan Kerja Industri', 'Ruang Konseling Karir BK', 'Konselor bimbingan karir, magang industri, dan minat bakat kejuruan siswa SMK.', 'Senin - Jumat (07.30 - 15.00 WIB)', TRUE, '["cls-tkp"]'::jsonb, '2026-01-10T08:00:00Z'),
('tch-bk-3', 'usr-bk-3', '$sapa$nip$v1$425848556e5f5b406d5359485854406f5b53', 'guru_bk', 'Pendampingan Regulasi Emosi & Anti-Perundungan', 'Ruang Konseling Individual 1', 'Konselor pendampingan emosi, manajemen stress belajar, dan mediasi konflik antarsiswa.', 'Senin - Jumat (07.30 - 15.00 WIB)', TRUE, '["cls-tbkr"]'::jsonb, '2026-01-10T08:00:00Z'),
('tch-bk-4', 'usr-bk-4', '$sapa$nip$v1$425847506f5a5b456e5a50475856436f5b57', 'guru_bk', 'Konseling Kedisiplinan & Motivasi Berprestasi', 'Ruang Konseling 2', 'Pendampingan ketertiban belajar, pembiasaan positif, dan motivasi berprestasi siswa.', 'Senin - Jumat (07.30 - 15.00 WIB)', TRUE, '[]'::jsonb, '2026-01-10T08:00:00Z'),
('tch-bk-5', 'usr-bk-5', '$sapa$nip$v1$425848596f5958446d5358415854406f5b50', 'guru_bk', 'Konseling Komunikasi Interpersonal & Relasi Sosial', 'Ruang Konseling Individual 3', 'Konselor bimbingan kelompok dan interaksi sosial ramah anak di lingkungan sekolah.', 'Senin - Jumat (07.30 - 15.00 WIB)', TRUE, '[]'::jsonb, '2026-01-10T08:00:00Z'),
('tch-bk-6', 'usr-bk-6', '$sapa$nip$v1$425848576f5c5b486d5358405854436f5b5d', 'guru_bk', 'Konseling Krisis & Penanganan Masalah Perilaku', 'Ruang Konseling Khusus BK', 'Pendampingan psikologis siswa pada situasi darurat dan pemulihan trauma.', 'Senin - Jumat (07.30 - 15.00 WIB)', TRUE, '[]'::jsonb, '2026-01-10T08:00:00Z'),
('tch-bk-7', 'usr-bk-7', '$sapa$nip$v1$425848536f5759456d5359465851406f5b52', 'guru_bk', 'Konseling Keluarga & Hubungan Orang Tua-Siswa', 'Ruang Diskusi BK & Orang Tua', 'Pendampingan keterlibatan orang tua dan keharmonisan keluarga siswa.', 'Senin - Jumat (07.30 - 15.00 WIB)', TRUE, '[]'::jsonb, '2026-01-10T08:00:00Z'),
('tch-bk-8', 'usr-bk-8', '$sapa$nip$v1$425848566f5f58496d5358445857436f5b56', 'guru_bk', 'Pengembangan Minat, Bakat & Karakter Vokasi', 'Ruang Konseling 4', 'Eksplorasi potensi diri, kepercayaan diri, dan kepemimpinan siswa vokasi.', 'Senin - Jumat (07.30 - 15.00 WIB)', TRUE, '[]'::jsonb, '2026-01-10T08:00:00Z'),
('tch-bk-9', 'usr-bk-9', '$sapa$nip$v1$425849516f5d58406d5358455856406f5b57', 'guru_bk', 'Manajemen Kecemasan Akademik & Ujian', 'Ruang Konseling Individual 5', 'Konseling teknik relaksasi, mindfulness belajar, dan self-compassion siswa.', 'Senin - Jumat (07.30 - 15.00 WIB)', TRUE, '[]'::jsonb, '2026-01-10T08:00:00Z'),
('tch-bk-10', 'usr-bk-10', '$sapa$nip$v1$425849536f5b58426d5358495856436f5b53', 'guru_bk', 'Literasi Digital Sehat & Anti Cyber-Bullying', 'Ruang Konseling Digital BK', 'Edukasi etika siber, keamanan digital, dan pendampingan korban perundungan daring.', 'Senin - Jumat (07.30 - 15.00 WIB)', TRUE, '[]'::jsonb, '2026-01-10T08:00:00Z'),
('tch-wali-tkj', 'usr-wali-tkj', '$sapa$nip$v1$425848506f5c58446d5359465851436f5b57', 'wali_kelas', 'Wali Kelas X TKJ (Keahlian Jaringan Komputer & Siber)', 'Ruang Guru Lab Komputer TKJ', 'Wali Kelas X TKJ mendampingi presensi, akademik vokasi informatika, dan kedisiplinan siswa.', 'Senin - Jumat (07.30 - 15.30 WIB)', TRUE, '[]'::jsonb, '2026-01-10T08:00:00Z'),
('tch-wali-tkp', 'usr-wali-tkp', '$sapa$nip$v1$425847586f5858486d5359455854436f5b56', 'wali_kelas', 'Wali Kelas X TKP (Keahlian Gambar Teknik & Konstruksi)', 'Ruang Guru Gedung Bangunan TKP', 'Wali Kelas X TKP pendamping konsistensi belajar, keselamatan kerja bengkel, dan karakter siswa.', 'Senin - Jumat (07.30 - 15.30 WIB)', TRUE, '[]'::jsonb, '2026-01-10T08:00:00Z'),
('tch-wali-tbkr', 'usr-wali-tbkr', '$sapa$nip$v1$425847526f5b58406e5a50485857436f5b54', 'wali_kelas', 'Wali Kelas X TBKR (Keahlian Pengecatan & Bodi Otomotif)', 'Ruang Guru Otomotif TBKR', 'Wali Kelas X TBKR mendampingi keaktifan siswa di bengkel, etika kerja industri, dan capaian akademik.', 'Senin - Jumat (07.30 - 15.30 WIB)', TRUE, '[]'::jsonb, '2026-01-10T08:00:00Z');

-- 5. PROFIL SISWA (students: 108 Siswa)
INSERT INTO students (id, user_id, nis, class_id, created_at) VALUES
('std-tkj-01', 'usr-std-tkj-01', '24250101', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-02', 'usr-std-tkj-02', '24250102', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-03', 'usr-std-tkj-03', '24250103', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-04', 'usr-std-tkj-04', '24250104', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-05', 'usr-std-tkj-05', '24250105', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-06', 'usr-std-tkj-06', '24250106', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-07', 'usr-std-tkj-07', '24250107', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-08', 'usr-std-tkj-08', '24250108', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-09', 'usr-std-tkj-09', '24250109', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-10', 'usr-std-tkj-10', '24250110', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-11', 'usr-std-tkj-11', '24250111', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-12', 'usr-std-tkj-12', '24250112', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-13', 'usr-std-tkj-13', '24250113', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-14', 'usr-std-tkj-14', '24250114', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-15', 'usr-std-tkj-15', '24250115', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-16', 'usr-std-tkj-16', '24250116', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-17', 'usr-std-tkj-17', '24250117', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-18', 'usr-std-tkj-18', '24250118', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-19', 'usr-std-tkj-19', '24250119', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-20', 'usr-std-tkj-20', '24250120', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-21', 'usr-std-tkj-21', '24250121', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-22', 'usr-std-tkj-22', '24250122', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-23', 'usr-std-tkj-23', '24250123', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-24', 'usr-std-tkj-24', '24250124', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-25', 'usr-std-tkj-25', '24250125', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-26', 'usr-std-tkj-26', '24250126', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-27', 'usr-std-tkj-27', '24250127', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-28', 'usr-std-tkj-28', '24250128', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-29', 'usr-std-tkj-29', '24250129', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-30', 'usr-std-tkj-30', '24250130', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-31', 'usr-std-tkj-31', '24250131', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-32', 'usr-std-tkj-32', '24250132', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-33', 'usr-std-tkj-33', '24250133', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-34', 'usr-std-tkj-34', '24250134', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-35', 'usr-std-tkj-35', '24250135', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkj-36', 'usr-std-tkj-36', '24250136', 'cls-tkj', '2026-01-15T08:00:00Z'),
('std-tkp-01', 'usr-std-tkp-01', '24250201', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-02', 'usr-std-tkp-02', '24250202', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-03', 'usr-std-tkp-03', '24250203', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-04', 'usr-std-tkp-04', '24250204', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-05', 'usr-std-tkp-05', '24250205', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-06', 'usr-std-tkp-06', '24250206', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-07', 'usr-std-tkp-07', '24250207', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-08', 'usr-std-tkp-08', '24250208', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-09', 'usr-std-tkp-09', '24250209', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-10', 'usr-std-tkp-10', '24250210', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-11', 'usr-std-tkp-11', '24250211', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-12', 'usr-std-tkp-12', '24250212', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-13', 'usr-std-tkp-13', '24250213', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-14', 'usr-std-tkp-14', '24250214', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-15', 'usr-std-tkp-15', '24250215', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-16', 'usr-std-tkp-16', '24250216', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-17', 'usr-std-tkp-17', '24250217', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-18', 'usr-std-tkp-18', '24250218', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-19', 'usr-std-tkp-19', '24250219', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-20', 'usr-std-tkp-20', '24250220', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-21', 'usr-std-tkp-21', '24250221', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-22', 'usr-std-tkp-22', '24250222', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-23', 'usr-std-tkp-23', '24250223', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-24', 'usr-std-tkp-24', '24250224', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-25', 'usr-std-tkp-25', '24250225', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-26', 'usr-std-tkp-26', '24250226', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-27', 'usr-std-tkp-27', '24250227', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-28', 'usr-std-tkp-28', '24250228', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-29', 'usr-std-tkp-29', '24250229', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-30', 'usr-std-tkp-30', '24250230', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-31', 'usr-std-tkp-31', '24250231', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-32', 'usr-std-tkp-32', '24250232', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-33', 'usr-std-tkp-33', '24250233', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-34', 'usr-std-tkp-34', '24250234', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-35', 'usr-std-tkp-35', '24250235', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tkp-36', 'usr-std-tkp-36', '24250236', 'cls-tkp', '2026-01-15T08:00:00Z'),
('std-tbkr-01', 'usr-std-tbkr-01', '24250301', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-02', 'usr-std-tbkr-02', '24250302', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-03', 'usr-std-tbkr-03', '24250303', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-04', 'usr-std-tbkr-04', '24250304', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-05', 'usr-std-tbkr-05', '24250305', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-06', 'usr-std-tbkr-06', '24250306', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-07', 'usr-std-tbkr-07', '24250307', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-08', 'usr-std-tbkr-08', '24250308', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-09', 'usr-std-tbkr-09', '24250309', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-10', 'usr-std-tbkr-10', '24250310', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-11', 'usr-std-tbkr-11', '24250311', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-12', 'usr-std-tbkr-12', '24250312', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-13', 'usr-std-tbkr-13', '24250313', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-14', 'usr-std-tbkr-14', '24250314', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-15', 'usr-std-tbkr-15', '24250315', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-16', 'usr-std-tbkr-16', '24250316', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-17', 'usr-std-tbkr-17', '24250317', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-18', 'usr-std-tbkr-18', '24250318', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-19', 'usr-std-tbkr-19', '24250319', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-20', 'usr-std-tbkr-20', '24250320', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-21', 'usr-std-tbkr-21', '24250321', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-22', 'usr-std-tbkr-22', '24250322', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-23', 'usr-std-tbkr-23', '24250323', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-24', 'usr-std-tbkr-24', '24250324', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-25', 'usr-std-tbkr-25', '24250325', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-26', 'usr-std-tbkr-26', '24250326', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-27', 'usr-std-tbkr-27', '24250327', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-28', 'usr-std-tbkr-28', '24250328', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-29', 'usr-std-tbkr-29', '24250329', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-30', 'usr-std-tbkr-30', '24250330', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-31', 'usr-std-tbkr-31', '24250331', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-32', 'usr-std-tbkr-32', '24250332', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-33', 'usr-std-tbkr-33', '24250333', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-34', 'usr-std-tbkr-34', '24250334', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-35', 'usr-std-tbkr-35', '24250335', 'cls-tbkr', '2026-01-15T08:00:00Z'),
('std-tbkr-36', 'usr-std-tbkr-36', '24250336', 'cls-tbkr', '2026-01-15T08:00:00Z');

-- 6. KATEGORI ADUAN & BIMBINGAN
INSERT INTO categories (id, name, description, icon, color, active) VALUES
('cat-1', 'Kesulitan Belajar', 'Kendala materi pelajaran, pemahaman konsep, tugas, atau metode belajar guru', 'BookOpen', 'blue', TRUE),
('cat-2', 'Bullying / Perundungan', 'Tindakan intimidasi fisik, verbal, pengucilan, atau cyberbullying', 'AlertTriangle', 'rose', TRUE),
('cat-3', 'Masalah Pertemanan', 'Konflik antarteman, adaptasi sosial di kelas, rasa cemas dikucilkan', 'Users', 'amber', TRUE),
('cat-4', 'Masukan & Saran', 'Aspirasi fasilitas sekolah, kebersihan, kegiatan ekstrakurikuler, atau KBM', 'Lightbulb', 'emerald', TRUE),
('cat-5', 'Masalah Lainnya', 'Kendala personal, keluarga, motivasi diri, atau hal lain yang ingin diceritakan', 'MessageCircle', 'indigo', TRUE);

-- 7. PENGUMUMAN SELAMAT DATANG RESMI
INSERT INTO announcements (id, title, content, author_id, author_user_id, author_name, author_role, author_avatar, target_grade, attachments, read_by, created_at) VALUES
('anc-welcome', 'Selamat Datang di Portal SAPA (Sarana Pendampingan dan Asistensi Siswa)', 'Portal SAPA resmi beroperasi untuk layanan bimbingan konseling dan pendampingan siswa secara aman, transparan, dan terpercaya. Siswa dapat berkonsultasi dengan 10 Guru BK dan 3 Wali Kelas dengan jaminan kerahasiaan 100%.', 'tch-bk-1', 'usr-bk-1', 'Dra. Hj. Sri Wahyuni, M.Psi, Kons.', 'guru_bk', NULL, 'all', '[{"id":"att-welcome-1","type":"link","url":"https://kemdikbud.go.id","title":"Panduan Layanan Ramah Anak & Anti-Perundungan Sekolah"}]'::jsonb, '[]'::jsonb, '2026-09-01T08:00:00Z');

-- 8. PENGATURAN SISTEM
INSERT INTO system_settings (id, school_name, school_tagline, reset_password_email, contact_email, contact_phone, address, updated_at) VALUES
('sys-setting-1', 'SMK Negeri 1', 'Sarana Pendampingan dan Asistensi Siswa Terpercaya', 'admin@smk.sch.id', 'bimbingan.konseling@smk.sch.id', '081234567800', 'Jl. Pendidikan Vokasi No. 10', '2026-09-01T08:00:00Z');

COMMIT;
