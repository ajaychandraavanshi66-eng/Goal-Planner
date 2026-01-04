import { User } from '../models/User.js';

export const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.status(200).json({
      success: true,
      settings: user.settings
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body;
    const allowedFields = ['theme', 'accentColor', 'glassIntensity', 'timeFormat24h', 'startWeekOnMonday'];

    const user = await User.findById(req.user._id);

    // Validate theme if provided
    if (updates.theme && !['light', 'dark'].includes(updates.theme)) {
      return res.status(400).json({
        success: false,
        error: 'Theme must be either "light" or "dark"'
      });
    }

    // Update settings fields
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        user.settings[key] = updates[key];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      settings: user.settings
    });
  } catch (error) {
    next(error);
  }
};

