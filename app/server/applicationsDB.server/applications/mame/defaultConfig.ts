export const defaultConfig = {
  "?xml": { "@_version": "1.0" },
  mameconfig: {
    system: {
      input: {
        port: [
          {
            newseq: { "#text": "NONE", "@_type": "standard" },
            "@_type": "POWER_ON",
          },
          {
            newseq: { "#text": "NONE", "@_type": "standard" },
            "@_type": "POWER_OFF",
          },
          {
            newseq: { "#text": "NONE", "@_type": "standard" },
            "@_type": "SERVICE",
          },
          {
            newseq: { "#text": "NONE", "@_type": "standard" },
            "@_type": "MEMORY_RESET",
          },
          {
            newseq: { "#text": "KEYCODE_F2", "@_type": "standard" },
            "@_type": "UI_MENU",
          },
          {
            newseq: { "#text": "NONE", "@_type": "standard" },
            "@_type": "UI_HELP",
          },
          {
            newseq: { "#text": "KEYCODE_F1", "@_type": "standard" },
            "@_type": "UI_SAVE_STATE",
          },
          {
            newseq: { "#text": "KEYCODE_F3", "@_type": "standard" },
            "@_type": "UI_LOAD_STATE",
          },
          {
            newseq: { "#text": "NONE", "@_type": "standard" },
            "@_type": "UI_RESET_MACHINE",
          },
          {
            newseq: { "#text": "NONE", "@_type": "standard" },
            "@_type": "UI_SOFT_RESET",
          },
          {
            newseq: { "#text": "NONE", "@_type": "standard" },
            "@_type": "UI_TAPE_START",
          },
          {
            newseq: { "#text": "NONE", "@_type": "standard" },
            "@_type": "UI_TAPE_STOP",
          },
          {
            newseq: { "#text": "NONE", "@_type": "standard" },
            "@_type": "UI_AUDIT",
          },
        ],
      },
      mixer: {
        audio_effects: {
          effect: [
            { "@_step": "1", "@_type": "Filters" },
            { "@_step": "2", "@_type": "Compressor" },
            { "@_step": "3", "@_type": "Reverb" },
            { "@_step": "4", "@_type": "Equalizer" },
          ],
        },
      },
      "@_name": "default",
    },
    "@_version": "10",
  },
};
