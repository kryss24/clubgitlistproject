import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const emailService = process.env.EMAIL_SERVICE;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const supabase = createClient(supabaseUrl, supabaseKey);

const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

const sendReminderEmails = async () => {
  try {
    console.log('Fetching projects starting in less than 3 days...');
    // Fetch projects with realization_date in the next 3 days
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .lte('realization_date', threeDaysFromNow.toISOString().split('T')[0])
      .gte('realization_date', today.toISOString().split('T')[0]);

    if (projectsError) throw projectsError;

    console.log(`Found ${projects.length} projects starting in less than 3 days.`);

    for (const project of projects) {
      console.log(`Fetching collaborators for project ${project.name}...`);
      // Fetch collaborators for the project
      const { data: collaborators, error: collaboratorsError } = await supabase
        .from('collaborators')
        .select('email')
        .eq('project_id', project.id);

      if (collaboratorsError) throw collaboratorsError;

      console.log(`Found ${collaborators.length} collaborators for project ${project.name}.`);

      for (const collaborator of collaborators) {
        console.log(`Sending email to ${collaborator.email}...`);
        // Send email to each collaborator using Nodemailer
        const mailOptions = {
          from: emailUser,
          to: collaborator.email,
          subject: `Rappel : Début du projet ${project.name}`,
          text: `Bonjour,\n\nLe projet ${project.name} débutera le ${project.realization_date}.\n\nCordialement,\nL'équipe`,
        };

        await transporter.sendMail(mailOptions);
      }
    }
  } catch (error) {
    console.error('Error sending reminder emails:', error);
  }
};

// Schedule the task to run daily at midnight
cron.schedule('0 0 * * *', sendReminderEmails);

// Uncomment the following line to run the function immediately for testing
sendReminderEmails();