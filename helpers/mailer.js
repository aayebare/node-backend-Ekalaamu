import sendGrid from "@sendgrid/mail";

// Method for sending emails
const sendMail = async (emailBody, linkType, res) => {
  sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

  await sendGrid
    .send(emailBody)
    .then(() => res.status(200).json({ message: `${linkType} link sent successfully. Please check your email` }))
    .catch(err => res.status(500).json({ error: "Email sending failed. Try again" }));
};

// Email content functions

const verificationEmail = (user, token) => ({
  to: user.email,
  from: process.env.AUTH_EMAIL,
  subject: "Ekalaamu email verification",
  text: "Verify your email to complete registration.",
  html: `
<h1 
style="
background-color:black; color:white;
padding: 5px; text-align:center;
">Ekalaamu</h1>
<hr />
<h2>Hello, ${user.firstname}</h2>
<h3>
Please verify your email by clicking the link below: <br />
<a href="${process.env.MAIL_RETURN_URL}/api/v1/?code=${token}">Verify your Email</a>
</h3>
`
});

export { sendMail, verificationEmail };
