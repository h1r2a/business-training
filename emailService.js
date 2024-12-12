// src/emailService.js
import nodemailer from 'nodemailer';

// Configuration du transporteur
const transporter = nodemailer.createTransport({
  service: 'gmail', // Utilisez votre service de messagerie, par exemple Gmail
  auth: {
    user: 'your-email@gmail.com', // Votre adresse e-mail
    pass: 'your-email-password' // Votre mot de passe ou un mot de passe d'application
  }
});

// Fonction pour envoyer un e-mail
export const sendConfirmationEmail = (recipientEmail, subject, message) => {
  const mailOptions = {
    from: 'your-email@gmail.com', // Votre adresse e-mail
    to: recipientEmail, // L'adresse e-mail du destinataire
    subject: subject, // Sujet de l'e-mail
    text: message // Corps du message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Erreur lors de l\'envoi de l\'e-mail:', error);
    } else {
      console.log('E-mail envoyé:', info.response);
    }
  });
};
