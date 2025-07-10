import cron from 'node-cron'
import { reminderSendEmail, updateOverDueInvoice } from '../helpers/invoice.helper';

cron.schedule('0 0 * * * *',async () =>{
    console.log('[Cron] Running overdue invoice check...');
  await updateOverDueInvoice();
})

cron.schedule('0 * * * *',async () =>{
    console.log('cron sending reminder email invoice')
    await reminderSendEmail()
})