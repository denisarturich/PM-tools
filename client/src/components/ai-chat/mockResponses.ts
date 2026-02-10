export const MOCK_RESPONSES = {
  generate: {
    initial: "Great! Tell me about your project:\n• What are you building?\n• What's your timeline?\n• Any specific concerns?",
    withContext: "Perfect! I found 12 typical risks for food delivery apps:\n\n🔴 High Priority (4):\n• App Store rejection\n• Payment gateway failure\n• Courier availability\n• Restaurant onboarding\n\n🟡 Medium Priority (5):\n• Push notification issues\n• GPS tracking accuracy\n...",
  },
  analyze: {
    summary: "Analyzing your 15 risks... ✅\n\nHere's what I found:\n\n🔴 Critical Issues (2):\n• 'Payment API failure' is High/High without mitigation\n• 'App Store rejection' affects timeline significantly\n\n⚠️ Concerns (3):\n• 5 risks have no ROAM status\n• 40% risks involve external APIs\n• No backup plans for critical dependencies\n\n✅ Good practices (2):\n• Clear impact descriptions\n• Realistic probability estimates\n\n🤖 My recommendation:\nFocus on 'Payment API failure' first—it's your biggest risk.",
  },
  mitigate: {
    selection: "Which risk needs mitigation?\n\nSelect from your table:\n🔴 Payment API failure (High/High)\n🔴 App Store rejection (High/Med)\n🟡 Courier availability (Med/Med)\n🟢 UI feedback issues (Low/Low)\n\nOr type risk name:",
    plan: "💡 For risk: 'Payment API failure'\n\n🛡️ Prevention:\n• Use reliable provider (Stripe/PayPal)\n• Test integration thoroughly\n\n🔄 Backup Plans:\n• Implement retry logic (3 attempts)\n• Add fallback payment method\n• Queue failed transactions\n\n📊 Monitoring:\n• Real-time health checks\n• Alert on 3 consecutive failures\n\n👤 Ownership:\n• Assign to: Backend Lead\n• Review: Weekly",
  },
};
