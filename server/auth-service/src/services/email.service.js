import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@traceroot.com';
const FROM_NAME = process.env.FROM_NAME || 'TraceRoot';

// Create transporter
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    }
});

// Load template with styles
const loadTemplate = (templateName, variables = {}) => {
    const templatesDir = path.join(__dirname, '../templates');

    // Load styles
    const stylesPath = path.join(templatesDir, 'style.css');
    const styles = fs.readFileSync(stylesPath, 'utf-8');

    // Load template
    const templatePath = path.join(templatesDir, `${templateName}.html`);
    let template = fs.readFileSync(templatePath, 'utf-8');

    // Inject styles
    template = template.replace('{{STYLES}}', styles);

    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, value);
    });

    return template;
};

// Send email
export const sendEmail = async ({ to, subject, template, variables }) => {
    try {
        const html = loadTemplate(template, variables);

        const mailOptions = {
            from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
    const loginUrl = process.env.CLIENT_URL || 'http://localhost:3000/login';

    return sendEmail({
        to: user.email,
        subject: 'Welcome to TraceRoot! 🌱',
        template: 'welcome',
        variables: {
            NAME: user.name,
            ROLE: user.role.charAt(0).toUpperCase() + user.role.slice(1),
            LOGIN_URL: loginUrl
        }
    });
};

// Send password reset email
export const sendPasswordResetEmail = async (user, resetCode, resetToken) => {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    return sendEmail({
        to: user.email,
        subject: 'Reset Your TraceRoot Password 🔐',
        template: 'reset-password',
        variables: {
            NAME: user.name,
            RESET_URL: resetUrl,
            RESET_CODE: resetCode,
            EXPIRY_TIME: '15'
        }
    });
};

// Send password changed confirmation
export const sendPasswordChangedEmail = async (user) => {
    const now = new Date();
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/forgot-password`;

    return sendEmail({
        to: user.email,
        subject: 'Your TraceRoot Password Was Changed ✅',
        template: 'password-changed',
        variables: {
            NAME: user.name,
            EMAIL: user.email,
            DATE: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            TIME: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }),
            RESET_URL: resetUrl
        }
    });
};

export default {
    sendEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendPasswordChangedEmail
};
