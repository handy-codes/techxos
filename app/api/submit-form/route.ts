// app/api/submit-form/route.ts
import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Log the request headers for debugging
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));

    const formData = await request.formData();

    // Log the received form data for debugging
    console.log('Received form data:', {
      courseTitle: formData.get('courseTitle'),
      name: formData.get('name'),
      surname: formData.get('surname'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      wage: formData.get('wage'),
      currency: formData.get('currency'),
      hasResume: formData.has('resume')
    });

    // Extract form data with proper type checking
    const courseTitle = formData.get('courseTitle')?.toString() || '';
    const name = formData.get('name')?.toString() || '';
    const surname = formData.get('surname')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const subject = formData.get('subject')?.toString() || '';
    const message = formData.get('message')?.toString() || '';
    const wage = formData.get('wage')?.toString() || '0';
    const currency = formData.get('currency')?.toString() || 'NGN';
    const file = formData.get('resume') as File | null;

    // Validate required fields
    if (!name || !surname || !email || !subject || !message) {
      console.error('Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Validation failed: Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Configure email transporter with error handling
    let transporter;
    try {
      transporter = createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } catch (error) {
      console.error('Failed to create email transporter:', error);
      return NextResponse.json(
        { error: 'Failed to configure email service' },
        { status: 500 }
      );
    }

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'paxymekventures@gmail.com',
      subject: `Course: ${subject}`,
      text: `
        Course Title: ${courseTitle}
        Name: ${name} ${surname}
        Email: ${email}
        Subject: ${subject}
        Wage Rate: ${currency} ${wage}/hr
        Message: ${message}
      `.trim(),
      attachments: [] as { filename: string; content: Buffer }[],
    };

    // Add file attachment if present and valid
    if (file && file.size > 0 && file.name) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        mailOptions.attachments.push({
          filename: file.name,
          content: buffer,
        });
      } catch (error) {
        console.error('Failed to process file attachment:', error);
        return NextResponse.json(
          { error: 'Failed to process file attachment' },
          { status: 500 }
        );
      }
    }

    // Send email with error handling
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Form submitted successfully!',
      receivedResume: !!file 
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to submit form. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



// // app/api/submit-form/route.ts
// import { NextResponse } from 'next/server';
// import { createTransport } from 'nodemailer';

// export const runtime = 'nodejs';

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();

//     // Extract form data
//     const courseTitle = formData.get('courseTitle')?.toString() || '';
//     const name = formData.get('name')?.toString() || '';
//     const surname = formData.get('surname')?.toString() || '';
//     const email = formData.get('email')?.toString() || '';
//     const subject = formData.get('subject')?.toString() || '';
//     const message = formData.get('message')?.toString() || '';
//     const file = formData.get('resume') as File | null;

//     // Validate required fields
//     if (!name || !surname || !email || !subject || !message) {
//       return NextResponse.json(
//         { error: 'All required fields must be filled' },
//         { status: 400 }
//       );
//     }

//     // Configure email transporter
//     const transporter = createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Prepare email content
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: 'paxymekventures@gmail.com',
//       subject: `New Enquiry: ${subject}`,
//       text: `
//         Course Title: ${courseTitle}
//         Name: ${name} ${surname}
//         Email: ${email}
//         Message: ${message}
//       `.trim(),
//       attachments: [] as { filename: string; content: Buffer }[],
//     };

//     // Add file attachment if present and valid
//     if (file && file.size > 0 && file.name) {
//       // Optional: Add file validation here (size, type, etc.)
//       mailOptions.attachments.push({
//         filename: file.name,
//         content: Buffer.from(await file.arrayBuffer()),
//       });
//     }

//     // Send email
//     await transporter.sendMail(mailOptions);

//     return NextResponse.json({ 
//       message: 'Form submitted successfully!',
//       receivedResume: !!file 
//     });

//   } catch (error) {
//     console.error('Submission error:', error);
//     return NextResponse.json(
//       { error: 'Failed to submit form. Please try again.' },
//       { status: 500 }
//     );
//   }
// }