import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items, settings } from '@/lib/schema';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const daysMap: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

// Runs at midnight to reset counts
export async function GET() {
  try {
    // Get today's weekday (0 = Sunday, 1 = Monday, etc.)
    const now = new Date();
    const lasVegasTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
    );
    const today = lasVegasTime.getDay();

    await db
      .update(items)
      .set({
        in_day: 0,
        out_day: 0,
      })
      .execute();

    // Fetch all user settings to check their preferred week start
    const userSettings = await db.select().from(settings).execute();

    // Check if any user's preferred week start matches today
    const shouldResetWeekly = userSettings.some((setting) => {
      const userPreferredDay = daysMap[setting.week_start.toLowerCase()]; // Convert string to number
      return userPreferredDay === today;
    });

    if (shouldResetWeekly) {
      // Fetch weekly report data before resetting
      const weeklyReport = await db
        .select({
          name: items.name,
          in_week: items.in_week,
          out_week: items.out_week,
          week_total_out: items.week_total_out,
          week_start: items.week_start,
          monday_in: items.monday_in,
          monday_out: items.monday_out,
          tuesday_in: items.tuesday_in,
          tuesday_out: items.tuesday_out,
          wednesday_in: items.wednesday_in,
          wednesday_out: items.wednesday_out,
          thursday_in: items.thursday_in,
          thursday_out: items.thursday_out,
          friday_in: items.friday_in,
          friday_out: items.friday_out,
          saturday_in: items.saturday_in,
          saturday_out: items.saturday_out,
          sunday_in: items.sunday_in,
          sunday_out: items.sunday_out,
        })
        .from(items)
        .execute();

      // Format the report as HTML
      const reportHTML = `
      <h2>Weekly Inventory Report</h2>
      <table border="1" cellpadding="5">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>In This Week</th>
            <th>Out This Week</th>
            <th>Total Out</th>
            <th>Leftover Stock</th>
            <th>Monday In</th>
            <th>Monday Out</th>
            <th>Tuesday In</th>
            <th>Tuesday Out</th>
            <th>Wednesday In</th>
            <th>Wednesday Out</th>
            <th>Thursday In</th>
            <th>Thursday Out</th>
            <th>Friday In</th>
            <th>Friday Out</th>
            <th>Saturday In</th>
            <th>Saturday Out</th>
            <th>Sunday In</th>
            <th>Sunday Out</th>
          </tr>
        </thead>
        <tbody>
          ${weeklyReport
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.in_week}</td>
              <td>${item.out_week}</td>
              <td>${item.week_total_out}</td>
              <td>${item.week_start - item.week_total_out}</td>
              <td>${item.monday_in}</td>
              <td>${item.monday_out}</td>
              <td>${item.tuesday_in}</td>
              <td>${item.tuesday_out}</td>
              <td>${item.wednesday_in}</td>
              <td>${item.wednesday_out}</td>
              <td>${item.thursday_in}</td>
              <td>${item.thursday_out}</td>
              <td>${item.friday_in}</td>
              <td>${item.friday_out}</td>
              <td>${item.saturday_in}</td>
              <td>${item.saturday_out}</td>
              <td>${item.sunday_in}</td>
              <td>${item.sunday_out}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;

      // Send the email with Resend
      await resend.emails.send({
        from: 'CHARM INVENTORY <onboarding@resend.dev>',
        to: 'charmoffice999@gmail.com',
        subject: 'Charm Weekly Inventory Report',
        html: reportHTML,
      });

      await db
        .update(items)
        .set({
          week_start: items.week_end,
          in_week: 0,
          out_week: 0,
          week_total_out: 0,
          monday_in: 0,
          monday_out: 0,
          tuesday_in: 0,
          tuesday_out: 0,
          wednesday_in: 0,
          wednesday_out: 0,
          thursday_in: 0,
          thursday_out: 0,
          friday_in: 0,
          friday_out: 0,
          saturday_in: 0,
          saturday_out: 0,
          sunday_in: 0,
          sunday_out: 0,
        })
        .execute();

      return NextResponse.json(
        { message: 'Daily and weekly item counts reset to zero' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'Daily reset completed. No weekly reset today.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting daily item counts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
