create database NeighborhoodDB
use NeighborhoodDB

CREATE TABLE Household (
    household_id CHAR(4) PRIMARY KEY,
    ho_ten_chu_ho NVARCHAR(100) NOT NULL,
    so_ho_khau CHAR(6) UNIQUE NOT NULL,
    dia_chi NVARCHAR(255),
    phuong_xa NVARCHAR(100),
    tinh_thanhpho NVARCHAR(100),
    loai_cu_tru NVARCHAR(100),
    ngay_batdau DATE,
    ghi_chu NVARCHAR(255)
);

-- 2. Bảng Person (Nhân khẩu)
CREATE TABLE Person (
    so_cccd CHAR(12) PRIMARY KEY,
    household_id CHAR(4) NOT NULL,
    ho_ten NVARCHAR(100) NOT NULL,
    bi_danh NVARCHAR(50),
    ngay_sinh DATE,
    noi_sinh NVARCHAR(100),
    dan_toc NVARCHAR(50),
    nghe_nghiep NVARCHAR(100),
    ngay_dang_ky DATE,
    quan_he_chu_ho NVARCHAR(50),
    vai_tro NVARCHAR(100),
    mat_khau NVARCHAR(100),

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

