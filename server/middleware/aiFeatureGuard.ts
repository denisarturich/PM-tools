import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if AI feature is enabled
 * This checks a global feature flag or per-user settings
 */
export function aiFeatureGuard(req: Request, res: Response, next: NextFunction) {
  // Check global feature flag
  const globalEnabled = process.env.AI_FEATURE_ENABLED !== 'false';
  
  console.log('🔍 AI_FEATURE_ENABLED:', process.env.AI_FEATURE_ENABLED);
  console.log('🔍 globalEnabled:', globalEnabled);

  if (!globalEnabled) {
    return res.status(403).json({
      error: 'AI feature is disabled',
      message: 'The AI assistant feature is currently disabled on this server',
    });
  }

  // TODO: Add per-user check here if you implement user accounts
  // const userId = req.user?.id;
  // const userSettings = await getUserSettings(userId);
  // if (!userSettings.aiEnabled) { return 403; }

  next();
}
