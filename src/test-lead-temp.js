console.log('Running lead temperature update test...'); import { updateLeadTemperature } from './lib/supabase-helpers'; updateLeadTemperature('some-record-id', 'Hot').catch(console.error);
