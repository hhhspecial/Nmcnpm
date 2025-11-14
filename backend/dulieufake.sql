create database NeighborhoodDB
use NeighborhoodDB

CREATE TABLE Household (
    household_id CHAR(4) PRIMARY KEY,
    ho_ten_chu_ho NVARCHAR(100) NOT NULL,
    so_ho_khau CHAR(6) UNIQUE NOT NULL,
    dia_chi NVARCHAR(255),
    phuong_xa NVARCHAR(100),
    tinh_thanhpho NVARCHAR(100),
    ghi_chu NVARCHAR(255)
);

-- 2. Bảng Person (Nhân khẩu)
CREATE TABLE Person (
    person_id CHAR(4) PRIMARY KEY,
    household_id CHAR(4) NOT NULL,
    ho_ten NVARCHAR(100) NOT NULL,
    bi_danh NVARCHAR(50),
    ngay_sinh DATE,
    noi_sinh NVARCHAR(100),
    dan_toc NVARCHAR(50),
    nghe_nghiep NVARCHAR(100),
    so_cccd CHAR(12) UNIQUE,
    ngay_cap DATE,
    noi_cap NVARCHAR(100),
    ngay_dang_ky DATE,
    dia_chi_truoc NVARCHAR(255),
    quan_he_chu_ho NVARCHAR(50), -- Ví dụ: Chủ hộ, Vợ, Con trai, ...
    ghi_chu NVARCHAR(255),
    
    -- Khóa ngoại liên kết với Bảng Household
    FOREIGN KEY (household_id) REFERENCES Household(household_id)
);

-- 3. Bảng Meeting (Buổi họp tổ dân phố)
CREATE TABLE Meeting (
    meeting_id CHAR(4) PRIMARY KEY,
    chu_de NVARCHAR(255) NOT NULL,
    thoi_gian DATETIME,
    dia_diem NVARCHAR(100),
    ghi_chu NVARCHAR(255)
);

-- 4. Bảng Attendance (Tham gia họp)
CREATE TABLE Attendance (
    attendance_id CHAR(4) PRIMARY KEY,
    meeting_id CHAR(4) NOT NULL,
    household_id CHAR(4) NOT NULL,
    da_tham_gia BIT, -- BIT = boolean (0 hoặc 1)
    
    -- Khóa ngoại liên kết với Bảng Meeting
    FOREIGN KEY (meeting_id) REFERENCES Meeting(meeting_id),
    
    -- Khóa ngoại liên kết với Bảng Household
    FOREIGN KEY (household_id) REFERENCES Household(household_id),
    
    -- Đảm bảo mỗi hộ chỉ tham gia 1 lần trong 1 buổi họp
    UNIQUE (meeting_id, household_id)
);
GO

------------------------------------------------------
-- BƯỚC 4: NHẬP DỮ LIỆU MẪU (INSERT DATA)
------------------------------------------------------

-- 1. Nhập dữ liệu cho Bảng Household
INSERT INTO Household (household_id, ho_ten_chu_ho, so_ho_khau, dia_chi, phuong_xa, tinh_thanhpho, ghi_chu) VALUES
('H001', N'Nguyễn Văn A', '123456', N'Số 12, ngách 34', N'Phường Bách Khoa', N'Hà Nội', N'Hộ có 4 nhân khẩu'),
('H002', N'Trần Thị B', '789012', N'Số 56, ngõ 78', N'Phường Bách Khoa', N'Hà Nội', N'Hộ mới chuyển đến (2025)'),
('H003', N'Lê Văn C', '345678', N'Số 90, phố 12', N'Phường Bách Khoa', N'Hà Nội', N'Hộ có 1 nhân khẩu'),
('H004', N'Phạm Thị D', '901234', N'Số 1A, ngõ 45', N'Phường Bách Khoa', N'Hà Nội', N'Hộ gia đình chính sách');

-- 2. Nhập dữ liệu cho Bảng Person
INSERT INTO Person (
    person_id, household_id, ho_ten, bi_danh, ngay_sinh, noi_sinh, dan_toc, nghe_nghiep, so_cccd, ngay_cap, noi_cap, ngay_dang_ky, dia_chi_truoc, quan_he_chu_ho, ghi_chu
) VALUES
('P001', 'H001', N'Nguyễn Văn A', 'A', '1975-03-10', N'Hà Nội', N'Kinh', N'Kỹ sư', '001175000001', '2016-01-20', N'Cục CSQLHC', '2000-05-15', N'Không có', N'Chủ hộ', N'Đã tham gia nhiều hoạt động tổ dân phố'),
('P002', 'H001', N'Trần Thị E', 'E', '1978-07-20', N'Hải Phòng', N'Kinh', N'Nội trợ', '001178000002', '2016-01-20', N'Cục CSQLHC', '2000-05-15', N'Không có', N'Vợ', NULL),
('P003', 'H001', N'Nguyễn Văn F', 'F', '2005-11-25', N'Hà Nội', N'Kinh', N'Sinh viên', '001205000003', '2021-12-01', N'Công an TP Hà Nội', '2005-11-25', N'Không có', N'Con trai', N'Đang học Đại học Bách Khoa'),
('P004', 'H002', N'Trần Thị B', 'B', '1985-01-15', N'Thái Bình', N'Kinh', N'Giáo viên', '001185000004', '2018-05-10', N'Cục CSQLHC', '2025-02-01', N'Thái Bình', N'Chủ hộ', N'Chuyển đến từ Tỉnh Thái Bình'),
('P005', 'H002', N'Hoàng Văn G', 'G', '1983-09-05', N'Hà Tĩnh', N'Kinh', N'Công nhân', '001183000005', '2018-05-10', N'Cục CSQLHC', '2025-02-01', N'Hà Tĩnh', N'Chồng', NULL),
('P006', 'H003', N'Lê Văn C', 'C', '1960-04-01', N'Lạng Sơn', N'Tày', N'Hưu trí', '001160000006', '2010-03-05', N'Công an Lạng Sơn', '1995-08-01', N'Lạng Sơn', N'Chủ hộ', N'Đã nghỉ hưu'),
('P007', 'H004', N'Phạm Thị D', 'D', '1990-12-30', N'Hà Nội', N'Kinh', N'Nhân viên văn phòng', '001190000007', '2017-06-15', N'Cục CSQLHC', '2020-11-01', N'Quận Ba Đình, Hà Nội', N'Chủ hộ', N'Hộ gia đình chính sách');
-- 3. Nhập dữ liệu cho Bảng Meeting
INSERT INTO Meeting (meeting_id, chu_de, thoi_gian, dia_diem, ghi_chu) VALUES
('M001', N'Thảo luận về vệ sinh môi trường', '2025-11-05 19:30:00', N'Nhà văn hóa khu 1', N'Buổi họp quan trọng'),
('M002', N'Góp ý xây dựng tuyến đường', '2025-12-10 19:00:00', N'Sân chơi tổ dân phố', N'Họp định kỳ cuối năm'),
('M003', N'Kế hoạch Tết Nguyên Đán', '2026-01-15 20:00:00', N'Nhà văn hóa khu 1', N'Vắng mặt nhiều');

-- 4. Nhập dữ liệu cho Bảng Attendance
INSERT INTO Attendance (attendance_id, meeting_id, household_id, da_tham_gia) VALUES
('A001', 'M001', 'H001', 1), -- TRUE
('A002', 'M001', 'H002', 0), -- FALSE
('A003', 'M001', 'H003', 1), -- TRUE
('A004', 'M001', 'H004', 1), -- TRUE
('A005', 'M002', 'H001', 1),
('A006', 'M002', 'H002', 1),
('A007', 'M002', 'H003', 0),
('A008', 'M002', 'H004', 1),
('A009', 'M003', 'H001', 1),
('A010', 'M003', 'H002', 0),
('A011', 'M003', 'H003', 1),
('A012', 'M003', 'H004', 0);
GO