
1. Chạy cmd
npm init -y
npm install express mssql
2. tạo người dùng mới bằng sql authentication để cho vào db.js: 
- Trong bảng Object Explorer ở bên trái chọn Security/Logins, chuột phải Logins chọn New Login...
- Chọn sql authentication, nhập tên nhập mật khẩu và bỏ tick ô Enforce password expiration
- Tại Select a page chọn User Mapping, tick vào ô NeighborhoodDB xong tick vào ô db_datareader và db_datawriter là ok
- Trong file db.js thay những cái cần thay bằng tk mk đã lập ở trên
- Thử ngay bằng http://localhost:3000/household lên trình duyệt xem nó ra data ko
3. lỗi 15000ms 
- mở sql server configuration manager 
- Kiểm tra SQL Server Browser trong phần SQL Server Services. Nó PHẢI đang ở trạng thái Running. Nếu ko chạy thì Win + R gõ services.msc và tìm cho ra SQL Server Browser -> vào properties và chỉnh startup type thành automatic
- Kiểm tra TCP/IP trong SQL Server Network Configuration > Protocols for SQLEXPRESS. Nó PHẢI đang ở trạng thái Enabled.
4. các api được copy paste và không có S ở cuối 
5. có thể test bằng file sql đi kèm
