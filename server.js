const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

// HMAC SHA-512 Hashing Function
function generateHMAC(body, secret) {
    return crypto.createHmac('sha512', secret).update(JSON.stringify(body)).digest('hex');
}

// Endpoint untuk mengubah gambar ke WEBP
app.post('/convert', async (req, res) => {
    const { url_gambar, persentase_kompresi } = req.body;
    const secret = 'supersecretkey';

    // Verifikasi HMAC
    const receivedHMAC = req.headers['auth'];
    const expectedHMAC = generateHMAC(req.body, secret);

    // if (receivedHMAC !== expectedHMAC) {
    //     return res.status(403).json({ status: 'error', message: 'Unauthorized' });
    // }

    // Validasi input
    if (!url_gambar) {
        return res.status(400).json({ status: 'error', message: 'URL gambar tidak boleh kosong' });
    }

    try {
        // Mengambil gambar dari URL
        const response = await axios.get(url_gambar, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        // Check if the image is JPG, JPEG, GIF
        const imageTypes = ['jpg', 'jpeg', 'gif'];
        const ext = url_gambar.split('.').pop().toLowerCase();
        if (!imageTypes.includes(ext)) {
            return res.status(400).json({ status: 'error', message: 'Format gambar harus JPG, JPEG, atau GIF' });
        }

        // Mengonversi gambar ke format WEBP dengan kompresi
        const outputPath = path.join(__dirname, 'output.webp');
        await sharp(buffer)
            .webp({ quality: persentase_kompresi || 60 })
            .toFile(outputPath);

        // Mendapatkan ukuran file WEBP
        const stats = fs.statSync(outputPath);
        const ukuran_webp = stats.size;

        // Mengirimkan response
        res.json({
            url_webp: outputPath,
            ukuran_webp: ukuran_webp,
            status: 'success',
            message: 'Gambar berhasil dikonversi ke format WEBP'
        });
    } catch (error) {
        console.error(error);
        if (error.response) {
            return res.status(500).json({ status: 'error', message: 'Gagal mengambil gambar dari URL' });
        }
        return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan saat mengonversi gambar' });
    }
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

