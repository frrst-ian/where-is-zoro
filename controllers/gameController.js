const gameModel = require("../models/gameModel");

async function validateClick(req, res, next) {
  try {
    const { clickX, clickY, characterId } = req.body;
    const x = Number(clickX);
    const y = Number(clickY);
    const charId = Number(characterId);

    if (!clickX || !clickY || !characterId) {
      return res
        .status(400)
        .json({ error: "Missing coordinates or character" });
    }
    if (isNaN(x) || isNaN(y) || isNaN(charId)) {
      return res.status(400).json({ error: "Invalid data types" });
    }

    const characterData = await gameModel.findCharacter(charId);

    if (!characterData) {
      return res.status(404).json({ error: "Character not found" });
    }

    const tolerance = characterData.radius;

    if (
      x >= characterData.x - tolerance &&
      x <= characterData.x + tolerance &&
      y >= characterData.y - tolerance &&
      y <= characterData.y + tolerance
    ) {
      return res.status(200).json({
        success: true,
        character: characterData.character,
      });
    } else {
      return res.status(200).json({
        success: false,
      });
    }
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ error: "Internal Database Error" });
  }
}
module.exports = { validateClick };
