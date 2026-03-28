import dotenv from 'dotenv';
import path from 'path';

// Load .env.local from the root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { emailService } = require('../src/features/Booking/services/EmailService');
const { Booking } = require('../src/features/Booking/BookingModule/domain/Booking');

async function main() {
  console.log('--- Stackd Email Test Script ---');

  // Debug check
  const apiKey = process.env.RESEND_API_KEY;
  console.log('Environment Check:');
  console.log(' - Resend API Key loaded:', apiKey ? '✅' : '❌');
  
  if (!apiKey) {
    console.error('Error: RESEND_API_KEY is missing in .env');
    process.exit(1);
  }

  console.log('---------------------------------------');

  const mockBooking = new Booking(
    'Gerald Berongoy',
    'geraldberongoy04@gmail.com',
    new Date(), // startTime
    new Date(Date.now() + 3600000), // endTime (1 hour later)
    'America/New_York', // timezone
    'https://meet.google.com/test-link', // meetLink
    'https://calendar.google.com/event-link' // eventLink
  );

  console.log('Sending test admin notification...');
  
  try {
    await emailService.sendAdminNotification(mockBooking);
    console.log('Test completed. Check your console for any Resend errors or logs.');
    console.log('Note: If in DEVELOPMENT mode, check for "Admin notification sent to..." message.');
  } catch (error) {
    console.error('Failed to run test:', error);
  }
}

main().catch(console.error);
