import { normalizeNewLines } from "../../configFile.js";

export const mameDefaultConfig = normalizeNewLines(`#
# CORE INPUT OPTIONS
#
coin_lockout              1
mouse                     1
joystick                  1
lightgun                  1
multikeyboard             0
multimouse                1

#
# CORE INPUT AUTOMATIC ENABLE OPTIONS
#
paddle_device             keyboard
adstick_device            mouse
pedal_device              keyboard
dial_device               mouse
trackball_device          mouse
lightgun_device           mouse
positional_device         mouse
mouse_device              mouse`);
