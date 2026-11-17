/**
 * SignaBridge AI - Sign Language Knowledge Base
 * Detailed dataset for American Sign Language (ASL):
 * - Alphabets (A-Z)
 * - Numbers (0-9)
 * - Greetings & Politeness
 * - Daily Essentials & Emergency Phrases
 */

export const ASL_SIGNS = [
  // --- ALPHABETS (A - Z) ---
  {
    id: "sign_a",
    sign: "A",
    category: "alphabet",
    name: "Letter A",
    summary: "Fist with thumb resting upright along the index finger.",
    instructions: "Make a loose fist with all four fingers curled tightly into the palm. Keep your thumb straight and pressed alongside the index finger.",
    tips: "Ensure your thumb does not fold across the front of your fingers (which would be 'S').",
    svgType: "fist_thumb_side",
    difficulty: "Beginner"
  },
  {
    id: "sign_b",
    sign: "B",
    category: "alphabet",
    name: "Letter B",
    summary: "Flat open hand with four fingers straight up and thumb tucked across palm.",
    instructions: "Extend your index, middle, ring, and pinky fingers straight up and held closely together. Fold your thumb flat across the palm.",
    tips: "Keep your four fingers together without spreading them.",
    svgType: "four_up_thumb_tuck",
    difficulty: "Beginner"
  },
  {
    id: "sign_c",
    sign: "C",
    category: "alphabet",
    name: "Letter C",
    summary: "Hand curved to form the shape of the letter 'C'.",
    instructions: "Curve all four fingers and your thumb to form an arc resembling the capital letter C.",
    tips: "View from the side to make sure the open arc of the 'C' is clearly visible.",
    svgType: "curved_arc",
    difficulty: "Beginner"
  },
  {
    id: "sign_d",
    sign: "D",
    category: "alphabet",
    name: "Letter D",
    summary: "Index finger pointing straight up, thumb touching middle fingertip.",
    instructions: "Point your index finger straight up. Form an 'O' ring below it with your thumb, middle, ring, and pinky fingers touching tips.",
    tips: "Only the index finger points up; the other three fingers touch the thumb.",
    svgType: "index_up_circle",
    difficulty: "Intermediate"
  },
  {
    id: "sign_e",
    sign: "E",
    category: "alphabet",
    name: "Letter E",
    summary: "Curled claw with fingertips resting gently against the thumb tip.",
    instructions: "Curl all four fingers downward so the tips touch or rest right above the thumb folded across the bottom.",
    tips: "Do not form a closed fist; keep finger tips resting against the thumb edge.",
    svgType: "claw_e",
    difficulty: "Intermediate"
  },
  {
    id: "sign_f",
    sign: "F",
    category: "alphabet",
    name: "Letter F",
    summary: "Index finger and thumb touching tips (OK sign) with other three fingers spread straight up.",
    instructions: "Touch the tip of your index finger to the tip of your thumb. Keep your middle, ring, and pinky fingers extended straight and separated.",
    tips: "This is the mirror opposite of 'D' (where middle touches thumb and index is up).",
    svgType: "ok_three_up",
    difficulty: "Intermediate"
  },
  {
    id: "sign_g",
    sign: "G",
    category: "alphabet",
    name: "Letter G",
    summary: "Index finger and thumb pointing parallel horizontally.",
    instructions: "Make a fist, then extend your index finger and thumb horizontally forward, parallel to each other, like pinching a coin.",
    tips: "Keep the back of your hand facing toward the side.",
    svgType: "pinch_horizontal",
    difficulty: "Intermediate"
  },
  {
    id: "sign_h",
    sign: "H",
    category: "alphabet",
    name: "Letter H",
    summary: "Index and middle fingers extended together horizontally.",
    instructions: "Hold index and middle fingers straight out together horizontally. Tuck ring and pinky in, with thumb resting on ring finger.",
    tips: "Keep fingers pointing sideways across your body.",
    svgType: "two_horizontal",
    difficulty: "Intermediate"
  },
  {
    id: "sign_i",
    sign: "I",
    category: "alphabet",
    name: "Letter I",
    summary: "Pinky finger pointing straight up, all other fingers closed into a fist.",
    instructions: "Curl your index, middle, and ring fingers tightly with thumb folded over them. Extend only the pinky finger straight upward.",
    tips: "Keep pinky as straight and vertical as possible.",
    svgType: "pinky_up",
    difficulty: "Beginner"
  },
  {
    id: "sign_j",
    sign: "J",
    category: "alphabet",
    name: "Letter J",
    summary: "Pinky up, drawing the shape of a 'J' in the air.",
    instructions: "Start with the 'I' sign (pinky up) and curve your hand down and back up to trace the letter 'J'.",
    tips: "A motion gesture based on the 'I' handshape.",
    svgType: "pinky_j_curve",
    difficulty: "Intermediate"
  },
  {
    id: "sign_k",
    sign: "K",
    category: "alphabet",
    name: "Letter K",
    summary: "Index and middle fingers up in a 'V', thumb placed between them.",
    instructions: "Point index finger straight up, middle finger angled slightly forward, and place thumb tip resting between the two fingers.",
    tips: "Similar to 'V', but the thumb sits between the index and middle fingers.",
    svgType: "k_shape",
    difficulty: "Advanced"
  },
  {
    id: "sign_l",
    sign: "L",
    category: "alphabet",
    name: "Letter L",
    summary: "Thumb and index finger extended at 90 degrees forming an 'L'.",
    instructions: "Extend your index finger straight up and your thumb straight out sideways, forming a distinct 90-degree 'L' shape. Curl other fingers.",
    tips: "Make sure your palm is facing forward toward the viewer.",
    svgType: "l_shape",
    difficulty: "Beginner"
  },
  {
    id: "sign_m",
    sign: "M",
    category: "alphabet",
    name: "Letter M",
    summary: "Thumb tucked under first three fingers in a fist.",
    instructions: "Curl all four fingers over your thumb so the thumb pokes out between the ring finger and pinky finger.",
    tips: "Three fingers (index, middle, ring) rest over the thumb.",
    svgType: "three_over_thumb",
    difficulty: "Intermediate"
  },
  {
    id: "sign_n",
    sign: "N",
    category: "alphabet",
    name: "Letter N",
    summary: "Thumb tucked under first two fingers in a fist.",
    instructions: "Similar to M, but your thumb pokes out between the middle and ring fingers (two fingers over thumb).",
    tips: "Think '2 fingers' for 'N' and '3 fingers' for 'M'.",
    svgType: "two_over_thumb",
    difficulty: "Intermediate"
  },
  {
    id: "sign_o",
    sign: "O",
    category: "alphabet",
    name: "Letter O",
    summary: "All fingertips touching thumb tip to form an 'O' circle.",
    instructions: "Curve all four fingers and thumb so all fingertips touch to form a complete circular 'O'.",
    tips: "Maintain an open circular window through the middle of the hand.",
    svgType: "o_circle",
    difficulty: "Beginner"
  },
  {
    id: "sign_p",
    sign: "P",
    category: "alphabet",
    name: "Letter P",
    summary: "'K' handshape pointed downwards.",
    instructions: "Form the 'K' sign (index up, middle forward, thumb between) and tilt the wrist down so fingers point downward.",
    tips: "Keep the index finger horizontal and middle finger pointing down.",
    svgType: "p_downward",
    difficulty: "Advanced"
  },
  {
    id: "sign_q",
    sign: "Q",
    category: "alphabet",
    name: "Letter Q",
    summary: "'G' handshape pointed downwards.",
    instructions: "Form the 'G' pinch with index and thumb, then tilt your wrist down so the fingers point toward the ground.",
    tips: "Keep thumb and index parallel and separated.",
    svgType: "q_downward",
    difficulty: "Intermediate"
  },
  {
    id: "sign_r",
    sign: "R",
    category: "alphabet",
    name: "Letter R",
    summary: "Index and middle fingers crossed over each other.",
    instructions: "Extend your index and middle fingers straight up and cross the middle finger behind the index finger (fingers crossed).",
    tips: "Keep the crossed fingers pointing straight up.",
    svgType: "crossed_fingers",
    difficulty: "Intermediate"
  },
  {
    id: "sign_s",
    sign: "S",
    category: "alphabet",
    name: "Letter S",
    summary: "Tight fist with thumb folded horizontally across the fingers.",
    instructions: "Make a tight fist and wrap your thumb across the middle of your curled fingers.",
    tips: "Unlike 'A' (thumb on side), in 'S' the thumb crosses over the front of the fingers.",
    svgType: "thumb_over_fist",
    difficulty: "Beginner"
  },
  {
    id: "sign_t",
    sign: "T",
    category: "alphabet",
    name: "Letter T",
    summary: "Thumb tucked under index finger in a fist.",
    instructions: "Make a fist with your thumb poked between your index finger and middle finger.",
    tips: "Only one finger (index) sits over the thumb.",
    svgType: "one_over_thumb",
    difficulty: "Intermediate"
  },
  {
    id: "sign_u",
    sign: "U",
    category: "alphabet",
    name: "Letter U",
    summary: "Index and middle fingers held straight up and pressed together.",
    instructions: "Extend index and middle fingers straight up, touching each other. Curl ring and pinky into palm, thumb tucked.",
    tips: "Do not spread the fingers apart; that would be 'V'.",
    svgType: "two_together_up",
    difficulty: "Beginner"
  },
  {
    id: "sign_v",
    sign: "V",
    category: "alphabet",
    name: "Letter V",
    summary: "Index and middle fingers extended up in a 'V' peace sign.",
    instructions: "Extend index and middle fingers straight up and spread them apart into a 'V' shape. Curl other fingers with thumb over them.",
    tips: "Classic peace sign handshape facing forward.",
    svgType: "peace_v",
    difficulty: "Beginner"
  },
  {
    id: "sign_w",
    sign: "W",
    category: "alphabet",
    name: "Letter W",
    summary: "Index, middle, and ring fingers extended up and spread apart.",
    instructions: "Extend index, middle, and ring fingers straight up, spreading them to form a 'W'. Hold pinky down with your thumb.",
    tips: "Ensure all three fingers are clearly separated.",
    svgType: "three_spread_up",
    difficulty: "Beginner"
  },
  {
    id: "sign_x",
    sign: "X",
    category: "alphabet",
    name: "Letter X",
    summary: "Fist with index finger bent into a hook.",
    instructions: "Make a fist and extend your index finger, bending it at the middle joint like a pirate's hook.",
    tips: "Keep your other three fingers curled tightly in the palm.",
    svgType: "hook_index",
    difficulty: "Intermediate"
  },
  {
    id: "sign_y",
    sign: "Y",
    category: "alphabet",
    name: "Letter Y",
    summary: "Thumb and pinky finger extended out, three middle fingers curled.",
    instructions: "Extend your thumb and pinky finger fully outward. Curl your index, middle, and ring fingers into your palm (shaka/hang loose shape).",
    tips: "Palm should face forward toward the camera.",
    svgType: "shaka_y",
    difficulty: "Beginner"
  },
  {
    id: "sign_z",
    sign: "Z",
    category: "alphabet",
    name: "Letter Z",
    summary: "Index finger drawing a 'Z' in the air.",
    instructions: "Point your index finger forward and trace the letter 'Z' in the air (horizontal right, diagonal down-left, horizontal right).",
    tips: "Keep the movement smooth and clear.",
    svgType: "z_trace",
    difficulty: "Intermediate"
  },

  // --- NUMBERS (0 - 9) ---
  {
    id: "sign_0",
    sign: "0",
    category: "number",
    name: "Number 0",
    summary: "All fingers curved to form an 'O' zero shape.",
    instructions: "Fingertips touching the thumb tip, forming an open zero oval shape.",
    tips: "Same handshape as letter 'O'.",
    svgType: "o_circle",
    difficulty: "Beginner"
  },
  {
    id: "sign_1",
    sign: "1",
    category: "number",
    name: "Number 1",
    summary: "Index finger pointing straight up, palm facing inward/forward.",
    instructions: "Hold your index finger straight up. Keep other fingers and thumb curled into a fist.",
    tips: "In ASL, '1' uses only the index finger pointing up.",
    svgType: "index_up_circle",
    difficulty: "Beginner"
  },
  {
    id: "sign_2",
    sign: "2",
    category: "number",
    name: "Number 2",
    summary: "Index and middle fingers up in a 'V' shape.",
    instructions: "Extend your index and middle fingers up and separated. Curl the rest of the fingers with thumb over them.",
    tips: "Same as the letter 'V'.",
    svgType: "peace_v",
    difficulty: "Beginner"
  },
  {
    id: "sign_3",
    sign: "3",
    category: "number",
    name: "Number 3",
    summary: "Thumb, index, and middle fingers extended.",
    instructions: "Extend your thumb, index, and middle fingers. Curl your ring and pinky fingers.",
    tips: "Unlike British Sign or casual gesture, in ASL '3' uses thumb + index + middle!",
    svgType: "three_asl",
    difficulty: "Beginner"
  },
  {
    id: "sign_4",
    sign: "4",
    category: "number",
    name: "Number 4",
    summary: "Four fingers extended straight up, thumb tucked.",
    instructions: "Extend index, middle, ring, and pinky fingers upright. Tuck thumb across the palm.",
    tips: "Same handshape as letter 'B'.",
    svgType: "four_up_thumb_tuck",
    difficulty: "Beginner"
  },
  {
    id: "sign_5",
    sign: "5",
    category: "number",
    name: "Number 5",
    summary: "All five fingers open and spread wide.",
    instructions: "Open your hand with all five fingers and thumb extended and spread wide.",
    tips: "Palm facing forward.",
    svgType: "open_five",
    difficulty: "Beginner"
  },

  // --- GREETINGS & ESSENTIALS ---
  {
    id: "sign_hello",
    sign: "Hello",
    category: "greeting",
    name: "Hello / Hi",
    summary: "Open flat hand moved outward from near the temple or forehead.",
    instructions: "Hold an open hand near your forehead like a gentle salute, and move it outward and forward toward the other person.",
    tips: "A warm, natural wave or salute motion.",
    svgType: "open_five",
    difficulty: "Beginner"
  },
  {
    id: "sign_thank_you",
    sign: "Thank You",
    category: "greeting",
    name: "Thank You",
    summary: "Flat hand fingers touching chin, then moving forward toward the person.",
    instructions: "Touch your chin or lips with the tips of your flat open fingers, then move your hand outward and forward toward the recipient.",
    tips: "Smile and make gentle eye contact.",
    svgType: "open_five",
    difficulty: "Beginner"
  },
  {
    id: "sign_yes",
    sign: "Yes",
    category: "phrase",
    name: "Yes",
    summary: "Closed fist nodding up and down like a nodding head.",
    instructions: "Make an 'S' fist and tilt it forward and back at the wrist twice, mimicking a nodding head.",
    tips: "Think of your fist as your head saying 'yes'.",
    svgType: "thumb_over_fist",
    difficulty: "Beginner"
  },
  {
    id: "sign_no",
    sign: "No",
    category: "phrase",
    name: "No",
    summary: "Index and middle fingers snapping down onto the thumb.",
    instructions: "Extend index and middle fingers with thumb open, then snap the tips of the two fingers down against the thumb pad.",
    tips: "Resembles a mouth snapping shut saying 'No'.",
    svgType: "two_over_thumb",
    difficulty: "Beginner"
  },
  {
    id: "sign_i_love_you",
    sign: "I Love You",
    category: "phrase",
    name: "I Love You (ILY)",
    summary: "Thumb, index, and pinky fingers extended; middle and ring fingers folded.",
    instructions: "Extend your thumb, index finger, and pinky finger straight out. Fold your middle and ring fingers into the palm. Palm faces forward.",
    tips: "Combines the ASL letters 'I', 'L', and 'Y' into one universal sign.",
    svgType: "ily_sign",
    difficulty: "Beginner"
  },
  {
    id: "sign_help",
    sign: "Help",
    category: "phrase",
    name: "Help",
    summary: "A 'Thumbs Up' fist resting on the flat open palm of the other hand, lifted upward.",
    instructions: "Place a closed 'Thumbs Up' fist of your dominant hand onto the flat, upward-facing palm of your other hand, and raise both hands together.",
    tips: "In single-hand camera mode, hold an upright thumb fist with upward motion.",
    svgType: "help_lift",
    difficulty: "Intermediate"
  },
  {
    id: "sign_stop",
    sign: "Stop",
    category: "phrase",
    name: "Stop",
    summary: "Open flat hand pushed outward toward the viewer.",
    instructions: "Extend all five fingers upright and press your open palm flat toward the camera.",
    tips: "A firm, clear boundary gesture.",
    svgType: "open_five",
    difficulty: "Beginner"
  },
  {
    id: "sign_ok",
    sign: "OK",
    category: "phrase",
    name: "OK / Perfect",
    summary: "Index finger and thumb forming a circle with three outer fingers up.",
    instructions: "Touch the tip of your thumb and index finger to form a clean circle, while keeping middle, ring, and pinky extended upward.",
    tips: "Matches the 'F' handshape in ASL.",
    svgType: "ok_three_up",
    difficulty: "Beginner"
  },
  {
    id: "sign_please",
    sign: "Please",
    category: "greeting",
    name: "Please",
    summary: "Flat hand rubbing in a circular motion on the center of the chest.",
    instructions: "Place your flat dominant hand with fingers together over your chest, and rub in a gentle clockwise circle.",
    tips: "Shows politeness and care.",
    svgType: "open_five",
    difficulty: "Beginner"
  },
  {
    id: "sign_sorry",
    sign: "Sorry",
    category: "greeting",
    name: "Sorry",
    summary: "'A' fist rubbing in a circular motion over the chest.",
    instructions: "Make an 'A' fist and rub it in a circle over your chest.",
    tips: "Similar to 'Please', but uses a closed fist instead of a flat hand.",
    svgType: "fist_thumb_side",
    difficulty: "Beginner"
  }
];

export const CATEGORIES = [
  { id: "all", label: "All Signs" },
  { id: "alphabet", label: "Alphabet (A-Z)" },
  { id: "number", label: "Numbers (0-9)" },
  { id: "greeting", label: "Greetings" },
  { id: "phrase", label: "Phrases & Daily" }
];
