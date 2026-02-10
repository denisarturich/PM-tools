import { getClaudeService } from '../services/claudeService';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testAI() {
  try {
    console.log('🤖 Testing Claude API connection...\n');

    const service = getClaudeService();

    const response = await service.sendMessage(
      'Hello! Please respond with "AI is working!" if you can read this.'
    );

    console.log('✅ Success! Claude responded:');
    console.log(response);
    console.log('\n🎉 AI integration is working correctly!');
  } catch (error: any) {
    console.error('❌ Error testing AI:');
    console.error(error.message);
    
    if (error.message.includes('ANTHROPIC_API_KEY')) {
      console.error('\n💡 Make sure to set ANTHROPIC_API_KEY in your .env file');
    }
    
    process.exit(1);
  }
}

testAI();
