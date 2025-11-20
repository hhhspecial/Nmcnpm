const sql = require('mssql');

const config = {
    
    server: 'NERO52\\SQLEXPRESS', //<-- thay bằng tên server máy đang dùng
    database: 'NeighborhoodDB',

    //Tạo SQL Authentication
    user: 'testpj',           // <--- Tên Login
    password: 'testpj', // <--- Mật khẩu

    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};

async function getConnection() {
    try {
        const pool = new sql.ConnectionPool(config);
        const connection = await pool.connect();
        return connection;
    } catch (err) {
        console.error('Lỗi kết nối SQL Server:', err);
        throw err;
    }
}

module.exports = { getConnection };