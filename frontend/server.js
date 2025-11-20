const express = require('express');
const { getConnection } = require('./db'); 
const app = express();
const port = 3000;

app.use(express.json());

// -------- phần của household
//1.
app.get('/household', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .query('SELECT * FROM Household');

        res.status(200).json({
            message: 'Lấy danh sách hộ thành công từ SQL Server',
            data: result.recordset
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu SQL Server:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
});

//2.
app.post('/household', async (req, res) => {
    const {
        household_id, ho_ten_chu_ho, so_ho_khau, dia_chi, phuong_xa, tinh_thanhpho, loai_cu_tru, ngay_batdau, ghi_chu
    } = req.body;

    let pool;

    if (!household_id) {
        return res.status(400).json({ message: 'Thiếu household_id' });
    }

    try {
        pool = await getConnection();
        const request = pool.request();

        request.input('household_id', household_id);
        request.input('ho_ten_chu_ho', ho_ten_chu_ho);
        request.input('so_ho_khau', so_ho_khau || null);
        request.input('dia_chi', dia_chi || null);
        request.input('phuong_xa', phuong_xa || null);
        request.input('tinh_thanhpho', tinh_thanhpho || null);
        request.input('loai_cu_tru', loai_cu_tru || null);
        request.input('ngay_batdau', ngay_batdau || null);
        request.input('ghi_chu', ghi_chu || null);

        // 2. Sửa câu lệnh SQL để CHÈN person_id thủ công
        const sqlQuery = `
            INSERT INTO Household (
                household_id, ho_ten_chu_ho, so_ho_khau, dia_chi, phuong_xa, tinh_thanhpho, loai_cu_tru, ngay_batdau, ghi_chu
            ) VALUES (
                @household_id, @ho_ten_chu_ho, @so_ho_khau, @dia_chi, @phuong_xa, @tinh_thanhpho, @loai_cu_tru, @ngay_batdau, @ghi_chu
            ); 
        `;

        await request.query(sqlQuery);

        res.status(201).json({
            message: 'Hộ đã được thêm thành công.'
        });
    } catch (error) {
        console.error('Lỗi khi thêm hộ:', error);
        // Lỗi thường gặp: Primary Key Violation (ID đã tồn tại)
        res.status(500).json({ message: 'Lỗi server khi tạo hộ.' });
    } finally {
        if (pool) {
            pool.close();
        }
    }

});

//3.
app.put('/household/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            household_id, ho_ten_chu_ho, so_ho_khau, dia_chi, phuong_xa, tinh_thanhpho, loai_cu_tru, ngay_batdau, ghi_chu
        } = req.body;

        // Nếu không có trường nào để cập nhật
        if (!household_id && !ho_ten_chu_ho && !so_ho_khau && !dia_chi && !phuong_xa && !tinh_thanhpho && !loai_cu_tru && !ngay_batdau && !ghi_chu) {
            return res.status(400).json({ message: 'Cần ít nhất một trường để cập nhật.' });
        }

        const pool = await getConnection();

        // Xây dựng câu lệnh UPDATE động
        let updateQuery = 'UPDATE Household SET ';
        const updates = [];
        if (household_id) updates.push('household_id = @household_id');
        if (ho_ten_chu_ho) updates.push('ho_ten_chu_ho = @ho_ten_chu_ho');
        if (so_ho_khau) updates.push('so_ho_khau = @so_ho_khau');
        if (dia_chi) updates.push('dia_chi = @dia_chi');
        if (phuong_xa) updates.push('phuong_xa = @phuong_xa');
        if (tinh_thanhpho) updates.push('tinh_thanhpho = @tinh_thanhpho');
        if (loai_cu_tru) updates.push('loai_cu_tru = @loai_cu_tru');
        if (ngay_batdau) updates.push('ngay_batdau = @ngay_batdau');
        if (ghi_chu) updates.push('ghi_chu = @ghi_chu');
    
        updateQuery += updates.join(', ');
        updateQuery += ' WHERE household_id = @id';

        const request = pool.request().input('id', id);
  
        if (household_id) request.input('household_id', household_id);
        if (ho_ten_chu_ho) request.input('ho_ten_chu_ho', ho_ten_chu_ho);
        if (so_ho_khau) request.input('so_ho_khau', so_ho_khau);
        if (dia_chi) request.input('dia_chi', dia_chi);
        if (phuong_xa) request.input('phuong_xa', phuong_xa);
        if (tinh_thanhpho) request.input('tinh_thanhpho', tinh_thanhpho);
        if (loai_cu_tru) request.input('loai_cu_tru', loai_cu_tru);
        if (ngay_batdau) request.input('ngay_batdau', ngay_batdau);
        if (ghi_chu) request.input('ghi_chu', ghi_chu);

        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nhân khẩu để cập nhật.' });
        }

        res.status(200).json({ message: 'Cập nhật nhân khẩu thành công.' });
    } catch (error) {
        console.error('Lỗi khi cập nhật nhân khẩu:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
});

//4.
app.delete('/household/:id', async (req, res) => {
    let pool;
    try {
        const householdIdentifier = req.params.id; // Lấy ID từ URL

        pool = await getConnection();
        const request = pool.request();

        // 1. Thêm tham số ID
        request.input('HouseholdId', householdIdentifier);

        const sqlQuery = `
            DELETE FROM Household
            WHERE household_id = @HouseholdId;
        `;

        const result = await request.query(sqlQuery);

        // Kiểm tra xem có bản ghi nào bị xóa không
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy hộ để xóa.' });
        }

        res.status(200).json({
            message: `Hộ ID ${householdIdentifier} đã được xóa thành công.`,
            rowsAffected: result.rowsAffected[0]
        });
    } catch (error) {
        console.error(`Lỗi khi xóa hộ ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi xóa dữ liệu.' });
    } finally {
        if (pool) {
            pool.close();
        }
    }
});


// ----------------     phần của person
//5.
app.get('/person', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .query('SELECT * FROM Person');

        res.status(200).json({
            message: 'Lấy danh sách người thành công từ SQL Server',
            data: result.recordset
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu SQL Server:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
});

//6.
app.post('/person', async (req, res) => {
    const {
        so_cccd, household_id, ho_ten, bi_danh, ngay_sinh, noi_sinh, dan_toc, nghe_nghiep, ngay_dang_ky,
        quan_he_chu_ho, vai_tro, mat_khau
    } = req.body;

    let pool;

    if (!so_cccd) {
        return res.status(400).json({ message: 'Thiếu so_cccd' });
    }

    try {
        pool = await getConnection();
        const request = pool.request();

        request.input('so_cccd', so_cccd);
        request.input('household_id', household_id);
        request.input('ho_ten', ho_ten);
        request.input('bi_danh', bi_danh || null);
        request.input('ngay_sinh', ngay_sinh || null);
        request.input('noi_sinh', noi_sinh || null);
        request.input('dan_toc', dan_toc || null);
        request.input('nghe_nghiep', nghe_nghiep || null);
        request.input('ngay_dang_ky', ngay_dang_ky || null);
        request.input('quan_he_chu_ho', quan_he_chu_ho || null);
        request.input('vai_tro', vai_tro || null);
        request.input('mat_khau', mat_khau || null);
        // 2. Sửa câu lệnh SQL để CHÈN person_id thủ công
        const sqlQuery = `
            INSERT INTO Person (
                so_cccd, household_id, ho_ten, bi_danh, ngay_sinh, noi_sinh, dan_toc, nghe_nghiep, ngay_dang_ky,
        quan_he_chu_ho, vai_tro, mat_khau
            ) VALUES (
                @so_cccd, @household_id, @ho_ten, @bi_danh, @ngay_sinh, @noi_sinh, @dan_toc, @nghe_nghiep, @ngay_dang_ky,
        @quan_he_chu_ho, @vai_tro, @mat_khau
            ); 
        `;

        await request.query(sqlQuery);

        res.status(201).json({
            message: 'Người đã được thêm thành công.'
        });
    } catch (error) {
        console.error('Lỗi khi thêm người:', error);
        // Lỗi thường gặp: Primary Key Violation (ID đã tồn tại)
        res.status(500).json({ message: 'Lỗi server khi tạo nguowì.' });
    } finally {
        if (pool) {
            pool.close();
        }
    }

});

//7.
app.put('/person/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            so_cccd, household_id, ho_ten, bi_danh, ngay_sinh, noi_sinh, dan_toc, nghe_nghiep, ngay_dang_ky,
            quan_he_chu_ho, vai_tro, mat_khau
        } = req.body;

        // Nếu không có trường nào để cập nhật
        if (!so_cccd && !household_id && !ho_ten && !bi_danh && !ngay_sinh && !noi_sinh && !dan_toc && !nghe_nghiep
            && !ngay_dang_ky && !quan_he_chu_ho && !ghi_chu && !vai_tro && !mat_khau) {
            return res.status(400).json({ message: 'Cần ít nhất một trường để cập nhật.' });
        }

        const pool = await getConnection();

        // Xây dựng câu lệnh UPDATE động
        let updateQuery = 'UPDATE Person SET ';
        const updates = [];
        if (so_cccd) updates.push('so_cccd = @so_cccd');
        if (household_id) updates.push('household_id = @household_id');
        if (ho_ten) updates.push('ho_ten = @ho_ten');
        if (bi_danh) updates.push('bi_danh = @bi_danh');
        if (ngay_sinh) updates.push('ngay_sinh = @ngay_sinh');
        if (noi_sinh) updates.push('noi_sinh = @noi_sinh');
        if (dan_toc) updates.push('dan_toc = @dan_toc');
        if (nghe_nghiep) updates.push('nghe_nghiep = @nghe_nghiep');
        if (ngay_dang_ky) updates.push('ngay_dang_ky = @ngay_dang_ky');
        if (quan_he_chu_ho) updates.push('quan_he_chu_ho = @quan_he_chu_ho');
        if (vai_tro) updates.push('vai_tro = @vai_tro');
        if (mat_khau) updates.push('mat_khau = @mat_khau');

        updateQuery += updates.join(', ');
        updateQuery += ' WHERE so_cccd = @id';

        const request = pool.request().input('id', id);

        if (so_cccd) request.input('so_cccd', so_cccd);
        if (household_id) request.input('household_id', household_id);
        if (ho_ten) request.input('ho_ten', ho_ten);
        if (bi_danh) request.input('bi_danh', bi_danh);
        if (ngay_sinh) request.input('ngay_sinh', ngay_sinh);
        if (noi_sinh) request.input('noi_sinh', noi_sinh);
        if (dan_toc) request.input('dan_toc', dan_toc);
        if (nghe_nghiep) request.input('nghe_nghiep', nghe_nghiep);
        if (ngay_dang_ky) request.input('ngay_dang_ky', ngay_dang_ky);
        if (quan_he_chu_ho) request.input('quan_he_chu_ho', quan_he_chu_ho);
        if (vai_tro) request.input('vai_tro', vai_tro);
        if (mat_khau) request.input('mat_khau', mat_khau);

        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nhân khẩu để cập nhật.' });
        }

        res.status(200).json({ message: 'Cập nhật nhân khẩu thành công.' });
    } catch (error) {
        console.error('Lỗi khi cập nhật nhân khẩu:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
});

//8.
app.delete('/person/:id', async (req, res) => {
    let pool;
    try {
        const personIdentifier = req.params.id; // Lấy ID từ URL

        pool = await getConnection();
        const request = pool.request();

        // 1. Thêm tham số ID
        request.input('soCccd', personIdentifier);

        const sqlQuery = `
            DELETE FROM Person
            WHERE so_cccd = @soCccd;
        `;

        const result = await request.query(sqlQuery);

        // Kiểm tra xem có bản ghi nào bị xóa không
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nhân khẩu để xóa.' });
        }

        res.status(200).json({
            message: `Nhân khẩu ID ${personIdentifier} đã được xóa thành công.`,
            rowsAffected: result.rowsAffected[0]
        });
    } catch (error) {
        console.error(`Lỗi khi xóa hộ ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi xóa dữ liệu.' });
    } finally {
        if (pool) {
            pool.close();
        }
    }
});

//----------những phần còn lại 
//9.
app.get('/meeting', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .query('SELECT * FROM Meeting');

        res.status(200).json({
            message: 'Lấy danh sách cuộc họp thành công từ SQL Server',
            data: result.recordset
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu SQL Server:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
});

//10.
app.post('/meeting', async (req, res) => {
    const {
        meeting_id, chu_de, thoi_gian, dia_diem, ghi_chu
    } = req.body;

    let pool;

    if (!meeting_id) {
        return res.status(400).json({ message: 'Thiếu meeting_id' });
    }

    try {
        pool = await getConnection();
        const request = pool.request();

        request.input('meeting_id', meeting_id);
        request.input('chu_de', chu_de);
        request.input('thoi_gian', thoi_gian || null);
        request.input('dia_diem', dia_diem || null);
        request.input('ghi_chu', ghi_chu || null);

        // 2. Sửa câu lệnh SQL để CHÈN person_id thủ công
        const sqlQuery = `
            INSERT INTO Meeting (
                meeting_id, chu_de, thoi_gian, dia_diem, ghi_chu
            ) VALUES (
                @meeting_id, @chu_de, @thoi_gian, @dia_diem, @ghi_chu
            ); 
        `;

        await request.query(sqlQuery);

        res.status(201).json({
            message: 'Buổi họp đã được thêm thành công.'
        });
    } catch (error) {
        console.error('Lỗi khi thêm buổi họp:', error);
        // Lỗi thường gặp: Primary Key Violation (ID đã tồn tại)
        res.status(500).json({ message: 'Lỗi server khi tạo buổi họp.' });
    } finally {
        if (pool) {
            pool.close();
        }
    }

});

//11.
app.put('/meeting/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            meeting_id, chu_de, thoi_gian, dia_diem, ghi_chu
        } = req.body;

        // Nếu không có trường nào để cập nhật
        if (!meeting_id && !chu_de && !thoi_gian && !dia_diem && !ghi_chu) {
            return res.status(400).json({ message: 'Cần ít nhất một trường để cập nhật.' });
        }

        const pool = await getConnection();

        // Xây dựng câu lệnh UPDATE động
        let updateQuery = 'UPDATE Meeting SET ';
        const updates = [];
        if (meeting_id) updates.push('meeting_id = @meeting_id');
        if (chu_de) updates.push('chu_de = @chu_de');
        if (thoi_gian) updates.push('thoi_gian = @thoi_gian');
        if (dia_diem) updates.push('dia_diem = @dia_diem');
        if (ghi_chu) updates.push('ghi_chu = @ghi_chu');

        updateQuery += updates.join(', ');
        updateQuery += ' WHERE meeting_id = @id';

        const request = pool.request().input('id', id);

        if (meeting_id) request.input('meeting_id', meeting_id);
        if (chu_de) request.input('chu_de', chu_de);
        if (thoi_gian) request.input('thoi_gian', thoi_gian);
        if (dia_diem) request.input('dia_diem', dia_diem);
        if (ghi_chu) request.input('ghi_chu', ghi_chu);

        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Không tìm thấy cuộc họp để cập nhật.' });
        }

        res.status(200).json({ message: 'Cập nhật cuộc họp thành công.' });
    } catch (error) {
        console.error('Lỗi khi cập nhật cuộc họp:', error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
});

//12.
app.post('/attendance', async (req, res) => {
    const {
        attendance_id, meeting_id, household_id, da_tham_gia
    } = req.body;

    let pool;

    if (!attendance_id) {
        return res.status(400).json({ message: 'Thiếu household_id' });
    }

    try {
        pool = await getConnection();
        const request = pool.request();

        request.input('household_id', household_id);
        request.input('attendance_id', attendance_id);
        request.input('meeting_id', meeting_id);
        request.input('da_tham_gia', da_tham_gia);

        const sqlQuery = `
            INSERT INTO Attendance (
                attendance_id, meeting_id, household_id, da_tham_gia
            ) VALUES (
                @attendance_id, @meeting_id, @household_id, @da_tham_gia
            ); 
        `;

        await request.query(sqlQuery);

        res.status(201).json({
            message: 'Sự tham dự đã được thêm thành công.'
        });
    } catch (error) {
        console.error('Lỗi khi thêm sự tham dự:', error);
        // Lỗi thường gặp: Primary Key Violation (ID đã tồn tại)
        res.status(500).json({ message: 'Lỗi server khi tạo sự tham dự.' });
    } finally {
        if (pool) {
            pool.close();
        }
    }

});

app.listen(port, () => {
    console.log(`Server Express đang chạy tại http://localhost:${port}`);
});