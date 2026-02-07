import QRCode from 'qrcode';
import ApiError from '../utils/ApiError.js';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Generate QR code as data URL (base64)
export const generateQRDataUrl = async (data, options = {}) => {
    try {
        const defaultOptions = {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            width: 300,
            margin: 2,
            color: {
                dark: '#2d7d46',
                light: '#ffffff'
            }
        };

        const qrOptions = { ...defaultOptions, ...options };
        const dataUrl = await QRCode.toDataURL(data, qrOptions);
        return dataUrl;
    } catch (error) {
        throw new ApiError(500, `QR code generation failed: ${error.message}`);
    }
};

// Generate QR code as Buffer (for file saving)
export const generateQRBuffer = async (data, options = {}) => {
    try {
        const defaultOptions = {
            errorCorrectionLevel: 'M',
            type: 'png',
            width: 300,
            margin: 2,
            color: {
                dark: '#2d7d46',
                light: '#ffffff'
            }
        };

        const qrOptions = { ...defaultOptions, ...options };
        const buffer = await QRCode.toBuffer(data, qrOptions);
        return buffer;
    } catch (error) {
        throw new ApiError(500, `QR code generation failed: ${error.message}`);
    }
};

// Generate QR code as SVG string
export const generateQRSvg = async (data, options = {}) => {
    try {
        const defaultOptions = {
            errorCorrectionLevel: 'M',
            type: 'svg',
            width: 300,
            margin: 2,
            color: {
                dark: '#2d7d46',
                light: '#ffffff'
            }
        };

        const qrOptions = { ...defaultOptions, ...options };
        const svg = await QRCode.toString(data, qrOptions);
        return svg;
    } catch (error) {
        throw new ApiError(500, `QR code generation failed: ${error.message}`);
    }
};

// Generate batch verification QR code
export const generateBatchQR = async (batchId, format = 'dataUrl') => {
    const verificationUrl = `${CLIENT_URL}/verify/${batchId}`;

    const qrData = JSON.stringify({
        type: 'traceroot_batch',
        batchId,
        url: verificationUrl,
        timestamp: Date.now()
    });

    switch (format) {
        case 'buffer':
            return generateQRBuffer(verificationUrl);
        case 'svg':
            return generateQRSvg(verificationUrl);
        case 'dataUrl':
        default:
            return generateQRDataUrl(verificationUrl);
    }
};

// Generate NFC verification QR code (contains NFC tag ID)
export const generateNfcQR = async (nfcTagId, batchId, format = 'dataUrl') => {
    const qrData = JSON.stringify({
        type: 'traceroot_nfc',
        nfcTagId,
        batchId,
        verifyUrl: `${CLIENT_URL}/verify/nfc/${nfcTagId}`,
        timestamp: Date.now()
    });

    switch (format) {
        case 'buffer':
            return generateQRBuffer(qrData);
        case 'svg':
            return generateQRSvg(qrData);
        case 'dataUrl':
        default:
            return generateQRDataUrl(qrData);
    }
};

export default {
    generateQRDataUrl,
    generateQRBuffer,
    generateQRSvg,
    generateBatchQR,
    generateNfcQR
};
