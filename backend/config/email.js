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
