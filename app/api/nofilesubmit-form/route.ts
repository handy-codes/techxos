// app/api/submit-form/route.ts
import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';

export const config = {
  api: {
    bodyParser: false,
  },
  runtime: 'nodejs',
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract form data
    const courseTitle = formData.get('courseTitle')?.toString() || '';
    const name = formData.get('name')?.toString() || '';
    const surname = formData.get('surname')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const subject = formData.get('subject')?.toString() || '';
    const message = formData.get('message')?.toString() || '';

    // Validate required fields
    if (!name || !surname || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Configure email transporter
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'paxymekventures@gmail.com',
      subject: `New Enquiry: ${subject}`,
      text: `
        Course Title: ${courseTitle}
        Name: ${name} ${surname}
        Email: ${email}
        Message: ${message}
      `.trim(),
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      message: 'Form submitted successfully!'
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again.' },
      { status: 500 }
    );
  }
}