const get_p = require("./check_products")

const schedule = require('node-schedule');

// Define a rule for scheduling every 3 minutes
async function startScheduler(){
    const rule = new schedule.RecurrenceRule();
    rule.minute = new schedule.Range(0, 59, 3); // This will execute every 3 minutes

    // Create a scheduled task
    const scheduledTask = schedule.scheduleJob(rule, function() {
        get_p()
        console.log('scheduler runned');
    });

    // Handle any errors that might occur
    scheduledTask.on('error', (err) => {
    console.error('Error:', err);
    });
    console.log('schedulart started')
}



