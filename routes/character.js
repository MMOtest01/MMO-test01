// ✅ Select a character to enter the game
router.post('/select', authMiddleware, async (req, res) => {
  const { characterId } = req.body;

  console.log('📥 /select hit');
  console.log('Authenticated User ID:', req.user?._id);
  console.log('➡️ Character ID received:', characterId);

  try {
    const character = await Character.findOne({ _id: characterId, userId: req.user._id });

    if (!character) {
      console.warn('❌ Character not found or does not belong to user');
      return res.status(404).json({ error: 'Character not found or does not belong to this user.' });
    }

    const session = await Session.findOneAndUpdate(
      { userId: req.user._id },
      { characterId, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    console.log('✅ Character selected and session created:', session);

    res.status(200).json({
      message: 'Character selected successfully!',
      session,
      character,
    });
  } catch (err) {
    console.error('❌ Error in /select route:', err.message);
    res.status(500).json({ error: err.message });
  }
});
