const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true', // true para puerto 465, false para 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments || []
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  contactNotification: (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d5016;">Nuevo mensaje de contacto</h2>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
        <p><strong>Nombre:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.phone || 'No proporcionado'}</p>
        <p><strong>Mensaje:</strong></p>
        <p style="background: white; padding: 15px; border-radius: 4px;">${data.message}</p>
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        Este mensaje fue enviado desde el formulario de contacto de D&D Landscaping Pro
      </p>
    </div>
  `,

  quoteNotification: (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d5016;">Nueva solicitud de cotización</h2>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
        <p><strong>Nombre:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.phone}</p>
        <p><strong>Dirección:</strong> ${data.address || 'No proporcionada'}</p>
        <p><strong>Tipo de servicio:</strong> ${data.serviceType}</p>
        <p><strong>Presupuesto estimado:</strong> ${data.budget || 'No especificado'}</p>
        <p><strong>Descripción del proyecto:</strong></p>
        <p style="background: white; padding: 15px; border-radius: 4px;">${data.description}</p>
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        Solicitud recibida el ${new Date().toLocaleDateString('es-ES')}
      </p>
    </div>
  `,

  surveyInvitation: (data) => {
    const serviceLabels = {
      landscaping: 'Landscaping',
      garden_design: 'Garden Design',
      lawn_care: 'Lawn Care',
      irrigation: 'Irrigation Systems',
      hardscaping: 'Hardscaping',
      tree_service: 'Tree Service',
      maintenance: 'Maintenance',
      other: 'Other Services'
    };
    const serviceName = serviceLabels[data.serviceType] || data.serviceType;
    const expiresFormatted = new Date(data.expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: #2d5016; padding: 30px 40px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">D&D Landscaping Pro</h1>
        <p style="color: #a8c47a; margin: 8px 0 0 0; font-size: 14px;">Professional Landscaping Services</p>
      </div>
      <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="font-size: 18px; margin-top: 0;">Hi ${data.clientName},</p>
        <p>Thank you for choosing <strong>D&D Landscaping Pro</strong> for your <strong>${serviceName}</strong> project!</p>
        <p>We'd love to hear about your experience. Your feedback helps us continue delivering outstanding service to our community.</p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="${data.surveyUrl}"
             style="background: #2d5016; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
            Share Your Feedback
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This survey link will expire on <strong>${expiresFormatted}</strong>.</p>
        <p style="color: #6b7280; font-size: 14px;">If the button above doesn't work, copy and paste this link into your browser:<br>
          <a href="${data.surveyUrl}" style="color: #2d5016; word-break: break-all;">${data.surveyUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 13px; margin: 0;">
          D&D Landscaping Pro LLC &bull; Orlando, Florida<br>
          (407) 267-2978 &bull; <a href="mailto:infolandscaping@ddlandscapingpro.com" style="color: #2d5016;">infolandscaping@ddlandscapingpro.com</a>
        </p>
      </div>
    </div>
  `},

  quoteConfirmation: (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d5016;">Gracias por su solicitud</h2>
      <p>Estimado/a ${data.name},</p>
      <p>Hemos recibido su solicitud de cotización. Nuestro equipo la revisará y se pondrá en contacto con usted a la brevedad.</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Resumen de su solicitud:</strong></p>
        <p>Tipo de servicio: ${data.serviceType}</p>
        <p>Descripción: ${data.description}</p>
      </div>
      <p>Si tiene alguna pregunta, no dude en contactarnos.</p>
      <p style="margin-top: 30px;">
        Atentamente,<br>
        <strong>D&D Landscaping Pro</strong>
      </p>
    </div>
  `
};

module.exports = { sendEmail, emailTemplates };
