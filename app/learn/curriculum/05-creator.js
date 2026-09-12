/* Curriculum · Section 5 — Becoming a Creator */
"use strict";
window.PENSHI_CURRICULUM = window.PENSHI_CURRICULUM || [];

PENSHI_CURRICULUM.push({
  id: "s5", num: 5, title: "Becoming a Creator",
  tagline: "From reference to invention: anatomy, animals, machines, worlds — and recombining what you've studied into things that never existed. Nothing here is generated for you. Everything is yours.",
  chapters: [

  /* ============================================================ */
  { id: "s5-anatomy", title: "Anatomy Basics",
    summary: "Not medical anatomy — ARTISTIC anatomy: the bones you can see on the surface (landmarks), the major muscle masses between them, and how those masses change shape when a limb moves. Use a 3-D viewer (Zygote Body, Posemaniacs muscle mode) alongside these lessons and the mannequin from Section 3 as the armature.",
    lessons: [

    { id: "anat-1", title: "The skeleton you can see", minutes: 50,
      goal: "Locate the surface landmarks of the skeleton on a figure and draw the simplified skeleton inside the mannequin.",
      why: "You never draw the whole skeleton, but you draw its landmarks constantly: they're the fixed points the soft forms hang between and the proof a figure has structure. Every good figure drawing has the clavicles, the iliac crests, the kneecaps somewhere in it.",
      refs: ["bridgman", "proko-anatomy", "zygote", "posemaniacs", "a4s"],
      pages: [
        { title: "Landmarks", exemplar: "skeletonLandmarks",
          steps: [
            { h: "The torso landmarks", t: "On the guide mannequin, find and copy: the pit of the neck (where the clavicles meet), the clavicles themselves (S-curves to the shoulders), the sternum line, the bottom edge of the ribcage (the thoracic arch), the iliac crests (the top rim of the pelvis — they're wider and higher than beginners think). Open Zygote Body and rotate to see each.", tool: "pencil", layer: "Pencils" },
            { h: "Limb landmarks", t: "Elbow point (olecranon), the two wrist bones, the kneecap, the two ankle bones (inner higher), the greater trochanter (the bump at the hip where the leg's ball joint is). Mark them on the mannequin. These are joints — the mannequin's spheres.", tool: "pencil" },
            { h: "Skull and spine", t: "The cranium ball, the cheekbone arch, the jaw angle, the mastoid behind the ear. The spine: a double-S curve (neck forward, upper back backward, lower back forward) — never straight. Draw the spine curve from the side.", tool: "pencil" },
            { h: "Landmarks from reference", t: "Line of Action figure tool, 5-minute poses. Draw the gesture and mannequin, then mark every landmark you can identify from the photo. Six poses. The landmarks will shift with the pose but their DISTANCES from each other on the same bone never change.", tool: "pencil" },
          ] },
        { title: "The simplified skeleton",
          hints: ["Ribcage: an egg with the front cut flat. Pelvis: a butterfly/bucket. Spine: the S. Limbs: single bones (upper) and paired bones (lower — radius/ulna, tibia/fibula).", "Draw the simplified skeleton in three poses inside the mannequin."],
          steps: [
            { h: "The torso skeleton", t: "Draw the ribcage egg (open at the bottom-front where the thoracic arch is), the spine S connecting it to the pelvis bucket, the shoulder girdle (clavicles in front, shoulder blades behind) sitting ON the ribcage like a yoke — it moves independently, which is why shoulders shrug.", tool: "pencil", layer: "Pencils" },
            { h: "The limb bones", t: "Upper arm and thigh: one bone each. Forearm: two bones that cross when the palm turns down (this is why the forearm's shape twists). Lower leg: the shin bone in front with a sharp edge, the thin fibula outside. Draw an arm palm-up and palm-down showing the bones crossing.", tool: "pencil" },
            { h: "Three posed skeletons", t: "Inside three mannequins from timed reference, draw the simplified skeleton. Note where the skeleton's shape is visible on the skin (the shin, the elbow, the collarbones) — those are the places to draw a hard edge in the finished figure.", tool: "pencil" },
          ] },
      ],
      reflect: ["Point to the iliac crest on your own body. Is it where you were drawing it?"] },

    { id: "anat-2", title: "The muscle masses and how they move", minutes: 60,
      goal: "Draw the major muscle groups as simple shapes with an origin and an insertion, and show how each group changes shape as its joint moves.",
      why: "Muscles are just shapes that pull between two bones. Knowing which two bones tells you where the shape bulges when the joint bends — and that's what makes a flexed arm look flexed instead of inflated. Ten groups cover 90% of what shows on the surface.",
      refs: ["proko-anatomy", "bridgman", "zygote", "posemaniacs", "kenhub", "a4s", "bammes"],
      pages: [
        { title: "The ten masses", exemplar: "muscleGroups",
          steps: [
            { h: "Deltoid, pectorals, trapezius", t: "Deltoid: a cap over the shoulder joint, from clavicle/shoulder blade to halfway down the upper arm — it raises the arm. Pectorals: a fan from the sternum/clavicle INTO the upper arm (under the deltoid) — they pull the arm across. Trapezius: the kite on the back from skull to mid-back, reaching out to the shoulders. Draw each as a simple shape on the mannequin, front and back.", tool: "pencil", layer: "Pencils" },
            { h: "Biceps, triceps, forearm masses", t: "Biceps on the front of the upper arm (bulges when the elbow bends and the palm turns up); triceps on the back (bulges when the arm straightens). Forearm: two masses — the flexors (inside, palm side) and the extensors (outside, from the elbow's outer knob). Draw a bent arm and a straight arm with the correct mass bulging.", tool: "pencil" },
            { h: "Abdominals, obliques, back", t: "Abdominals: a block from the ribcage to the pelvis with horizontal divisions (they COMPRESS when bending forward, STRETCH when arching). Obliques: the masses on the sides of the waist that twist the torso. Back: the two long columns beside the spine (erectors) and the wide lats from the armpit sweeping down. Draw a torso twisting — one oblique compressed, one stretched.", tool: "pencil" },
            { h: "Glutes, quadriceps, hamstrings, calves", t: "Glutes: the big masses behind the pelvis — they straighten the hip (bulge when standing from a squat). Quadriceps: the teardrop on the front of the thigh, ending in the kneecap tendon — bulges when the knee straightens. Hamstrings behind. Calf: high inside, lower outside, ending in the Achilles tendon. Draw a leg standing and a leg crouching.", tool: "pencil" },
          ] },
        { title: "Movement studies",
          hints: ["Posemaniacs muscle mode: rotate a pose and watch which masses bulge.", "Six pairs: same limb, two positions. Draw the mass that's shortened bulging and the stretched one flattened."],
          steps: [
            { h: "Flex and extend", t: "Pick a joint. Draw it in both extreme positions from Posemaniacs' muscle view. The muscle that SHORTENED is bulged and rounder; the one that lengthened is flat and long. Six joints: elbow, knee, shoulder (arm up/down), hip, spine (arch/curl), neck.", tool: "pencil", layer: "Pencils" },
            { h: "The full figure, two poses", t: "Build two full mannequins from timed reference and add all ten masses to each as simple shapes, bulging or flattening per the pose. Don't draw every fiber — draw the volume. Ink one with line weight where a mass turns sharply into shadow.", tool: "ink", layer: "Inks" },
            { h: "Stylize it", t: "Redraw one figure with the masses exaggerated 50% — comics anatomy. Then with the masses almost hidden — a lean, realistic build. Anatomy knowledge lets you dial the body type; ignorance gives you one default body.", tool: "pencil" },
          ] },
      ],
      reflect: ["Which muscle group did you never notice before? Look for it on people this week."] },
    ] },

  /* ============================================================ */
  { id: "s5-chardesign", title: "Character Design",
    summary: "Design is recombination. You don't invent from nothing — you take structure from one place, proportion from another, surface and story from a third, and the combination is new. These lessons give you a method for mashing references together with intent. NOTHING here is generated for you: the ideas, the mashups, the characters are yours, built from what you've studied.",
    lessons: [

    { id: "cd-1", title: "Shape language and silhouette", minutes: 45,
      goal: "Design characters whose personality reads from their silhouette and dominant shapes alone.",
      why: "A reader sees a character's silhouette before anything else — before the face, before the costume. Round, square and triangular shape families carry meaning across every culture's cartooning; controlling them is the first design skill.",
      refs: ["aldoori", "sinix", "fzd", "loomis-fun"],
      pages: [
        { title: "Three families", exemplar: "shapeLanguage",
          steps: [
            { h: "Round, square, triangle", t: "Copy the three shapes and their associations: round = soft, friendly, safe (think sidekicks, babies, gentle giants); square = stable, strong, stubborn (soldiers, fathers, tanks); triangle = dynamic, sharp, dangerous (villains, tricksters, speedsters). Draw three quick mannequins, each built entirely from one family.", tool: "pencil", layer: "Pencils" },
            { h: "Mix with a dominant", t: "Real designs mix families with one dominant: a square-bodied hero with round eyes (strong but kind), a triangular villain with a round belly (dangerous but comic). Draw three mixed characters and write the personality each mix implies.", tool: "pencil" },
            { h: "The silhouette test", t: "Fill each of your six characters solid black with the Marker tool on a separate page area. Can you tell them apart and read their personality? If two look alike, change the dominant shape of one. Professional character designers do this test on every design.", tool: "marker" },
            { h: "Proportion as personality", t: "Take one character and redraw it at 8 heads, 5 heads and 3 heads (from Body-1's proportion systems). Same shapes, different age and tone. Choose the one that fits the story and ink it.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Describe a character from a comic you like in shape language. Was the artist using it on purpose?"] },

    { id: "cd-2", title: "The reference mash-up", minutes: 60,
      goal: "Build an original character by systematically combining three or more references — structure, surface, proportion, attitude — into something new.",
      why: "This is how designers actually work: a costume from a museum photo, a face from a stranger on the train, posture from an animal, colors from a landscape. The method is systematic so the result feels coherent instead of collaged. Your creativity is in the CHOICES and the SYNTHESIS.",
      refs: ["aldoori", "met-collection", "unsplash", "adobe-color", "fzd"],
      pages: [
        { title: "The grid", exemplar: "mashupGrid",
          hints: ["Open three references in browser tabs: a real garment (The Met collection, 'armor' or 'coat'), a real face type (Unsplash 'portrait'), and something non-human for posture or shape (an animal, a tool, a building).", "Thumbnail each reference in its box, then combine in the big box."],
          steps: [
            { h: "Choose with intent", t: "Decide the character's ROLE first (a wandering doctor, a bored royal guard, a child thief). Then pick references that argue for that role: what would this person wear, what does their posture say, what shape family fits? Sketch each reference small in its box. Write one word under each: what you're TAKING from it.", tool: "pencil", layer: "Pencils" },
            { h: "Structure from one", t: "Pick the body structure from one reference (the proportion system, the dominant shape family, the posture). Draw the mannequin. This is the skeleton the rest hangs on — it can even come from an animal (a heron's stillness, a bulldog's stance).", tool: "pencil" },
            { h: "Surface from another", t: "Dress the mannequin from the garment reference — using the Fabric chapter's pin logic so it hangs correctly on THIS body, not on the museum mannequin. Adapt, don't copy: change the era, the material, the fit.", tool: "pencil" },
            { h: "Attitude from a third", t: "The face, the expression, the hands, the props — from the third reference and from your own head. What does this person do with their hands when nervous? Give them one prop that tells their story (a doctor's worn satchel, a guard's untied boot).", tool: "pencil" },
            { h: "Synthesis pass", t: "Now draw the character clean, from scratch, without looking at any reference — only at your three boxes. This is where it becomes yours: the parts blend because your hand blends them. Ink it and run the silhouette test.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Model sheet and variations",
          hints: ["Turnaround: front, three-quarter, side, back — same proportions (Head-2 and Body-2 methods).", "Expression sheet: 4 expressions (Head-4).", "Color: one harmony from the Color chapters, one accent."],
          steps: [
            { h: "Turnaround", t: "Draw the character front, three-quarter, side and back on one page, heads aligned on the same ruler lines. This is the model sheet every studio makes so the character stays consistent across a hundred panels. Costume details must match across views — check them.", tool: "pencil", layer: "Pencils" },
            { h: "Expressions and hands", t: "Four expressions on the character's own head construction, and three hand poses that suit them. A character's hands are a personality trait — decide it.", tool: "pencil" },
            { h: "Color and finish", t: "Choose a harmony that argues for the role (Advanced Color psychology lesson), flat the turnaround, one accent. Ink and color the three-quarter view fully. This sheet is the Section 5 character deliverable — save it to your Portfolio and use this character in the Comics Craft section.", tool: "marker", layer: "Colors" },
          ] },
      ],
      reflect: ["Which reference contributed the most? Did the synthesis pass change the design, and how?", "Could a stranger guess the character's role from the drawing alone?"] },
    ] },

  /* ============================================================ */
  { id: "s5-animals", title: "Animal Drawing",
    summary: "Every vertebrate is built on the same plan as you — skull, spine, ribcage, pelvis, four limbs with the same joints in the same order. The differences are proportion, posture and what the animal stands on. This chapter goes deep: quadrupeds, the three leg types, birds, reptiles and fish, insects and invertebrates, and comparative skulls — always from reference, always by construction. Nothing is invented for you; every lesson breaks down REAL animals.",
    lessons: [

    { id: "anim-1", title: "The shared plan: a dog", minutes: 60,
      goal: "Construct a quadruped from the same volumes as the human mannequin and map every joint to its human equivalent.",
      why: "Once you see that a dog's 'backwards knee' is its ankle and its 'knee' is hidden up near the belly, the whole animal kingdom becomes one anatomy with variations. Starting with the dog is starting with the most familiar body that isn't yours.",
      refs: ["hultgren", "drawabox-l5", "loa-animals", "goldfinger-animal", "commons-zootomy", "sketchfab-skel"],
      pages: [
        { title: "The quadruped mannequin", exemplar: "quadruped",
          steps: [
            { h: "Ribcage, pelvis, spine", t: "Copy the guide: the ribcage is a big egg (bigger relative to the body than yours), the pelvis a smaller egg, the spine a flexible line joining them and continuing into the neck and the tail. Same three masses as the bean — rotated horizontal.", tool: "pencil", layer: "Pencils" },
            { h: "Front leg = your arm", t: "Shoulder blade lies flat on the ribcage's side (no collarbone — that's why dogs can't reach sideways). Then: shoulder joint → upper arm (short, tucked against the chest) → ELBOW (at the bottom of the ribcage) → forearm → WRIST (the bend halfway down that looks like a knee) → the long foot bones → toes. Draw it and label every joint with the human name.", tool: "pencil" },
            { h: "Hind leg = your leg", t: "Hip joint at the pelvis → thigh (tucked up, mostly hidden in the body outline) → KNEE (near the belly line, pointing forward) → shin → ANKLE (the 'backwards knee', the hock, pointing backward) → long foot bones → toes. The dog stands on its toes; the whole foot is up in the air. Label it.", tool: "pencil" },
            { h: "Skull and neck", t: "The skull: a cranium ball + a muzzle box, joined at the eyes. The neck is a tube from the skull to the top of the ribcage, with the throat line lower than the spine line. Draw the head from the side and three-quarter.", tool: "pencil" },
            { h: "Reference: six dogs", t: "Line of Action's animal tool (filter to dogs) or Unsplash 'dog standing side'. 3-minute constructions: three masses, spine, four legs with joints labeled. Different breeds change the proportions, never the joints. Ink one.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Skeleton check",
          hints: ["Open a dog skeleton on Sketchfab (search 'dog skeleton') or Wikimedia Zootomy.", "Rotate it. Find every joint you labeled. Draw the skeleton simplified over your mannequin."],
          steps: [
            { h: "Rotate a real skeleton", t: "Sketchfab has rotatable scans. Find the scapula lying on the ribs, the elbow, the tiny wrist, the long metacarpals, the knee up near the pelvis, the hock. Draw the simplified skeleton from the side.", tool: "pencil", layer: "Pencils" },
            { h: "Where it shows", t: "On the skin, the hock, the wrist, the elbow point, the shoulder blade's edge and the hip bones are visible. Draw a lean dog (a greyhound) with these landmarks explicit, then a heavy one (a mastiff) where they're buried. Same skeleton.", tool: "pencil" },
          ] },
      ],
      reflect: ["Say the joint order of a dog's hind leg from hip to toes. If you can, you've got every mammal's."] },

    { id: "anim-2", title: "Comparative anatomy: how mammals differ", minutes: 70,
      goal: "Construct a cat, a horse, a bear and a primate, and explain each body's differences as changes in proportion, posture and foot type.",
      why: "Comparative anatomy is the fastest route to drawing ANY animal: you learn the variables (leg length, foot type, spine flexibility, skull shape) rather than memorizing species. Four animals that differ maximally teach the variables.",
      refs: ["goldfinger-animal", "hultgren", "loa-animals", "commons-zootomy", "sketchfab-skel", "drawabox-l5"],
      pages: [
        { title: "Foot types", exemplar: "legCompare",
          steps: [
            { h: "Plantigrade, digitigrade, unguligrade", t: "Copy the three legs. Plantigrade (bears, humans, raccoons): the whole foot on the ground — flat-footed walkers, strong, slow. Digitigrade (dogs, cats): standing on the toes, heel raised — runners. Unguligrade (horses, deer, cattle): on the tips of one or two toes (hooves) — the fastest, with the longest foot bones. Label the heel on each.", tool: "pencil", layer: "Pencils" },
            { h: "The horse", t: "Build a horse: huge ribcage, short spine, long neck, and legs where the 'knee' in front is the WRIST and the hock behind is the ANKLE, with the cannon bone (a single long foot bone) below each. The hoof is a single toenail. Reference: Unsplash 'horse side'. Note how the leg segments are nearly equal in length — that's the running design.", tool: "pencil" },
            { h: "The cat", t: "A cat is a dog with a longer, more flexible spine, a rounder skull with a short muzzle, retractable claws, and a lower, longer stance. The flexibility is the point: draw a cat stretched out and curled up — the spine's range is the whole character of cats.", tool: "pencil" },
            { h: "The bear", t: "Plantigrade — the only big predator that stands like you. Massive shoulders (a hump of muscle), short legs, a heavy neck and small ears on a big skull. Draw it on all fours and standing: the standing bear's proportions are almost human, which is why it's unnerving.", tool: "pencil" },
          ] },
        { title: "Primates and the human bridge",
          hints: ["Unsplash 'chimpanzee' or 'gorilla', side and front.", "Long arms, short legs, a spine that can be upright or horizontal, hands AND feet that grip."],
          steps: [
            { h: "Ape proportions", t: "Build a gorilla: the same skeleton as you, but arms longer than legs, a ribcage that's a wider cone, a skull with a heavy brow and forward jaw, and a spine used at 45° (knuckle-walking). Draw it knuckle-walking and sitting.", tool: "pencil", layer: "Pencils" },
            { h: "Four species, one page", t: "Draw the horse, cat, bear and gorilla mannequins side by side at the same shoulder height. Underneath each write: foot type, leg length ratio, spine flexibility, skull type. That table IS comparative anatomy. Ink the page.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Given a photo of a mammal you've never drawn, which four variables would you check first?"] },

    { id: "anim-3", title: "Birds, reptiles, fish", minutes: 60,
      goal: "Construct a bird (perched and in flight), a lizard or crocodilian, a snake, and a fish — non-mammal plans built from the same volume approach.",
      why: "Birds are dinosaurs with the arm folded into a wing; reptiles are the sprawling ancestral plan; fish are a spine with fins in water. Each teaches something the mammals couldn't: the wing fold, the sprawl, the S-curve of a swimming body.",
      refs: ["loa-animals", "hultgren", "commons-zootomy", "sketchfab-skel", "unsplash"],
      pages: [
        { title: "Birds", exemplar: "birdMannequin",
          steps: [
            { h: "Egg, ball, wing", t: "Copy the guide: an egg body tilted, a ball head on an S-curved neck, a beak wedge. The wing is an ARM: upper arm (short, close to the body), forearm, and a long fused hand — folded in a Z when perched, extended when flying. Draw the wing folded and open; the bend you see mid-wing in flight is the WRIST.", tool: "pencil", layer: "Pencils" },
            { h: "Legs and feet", t: "The bird's visible 'leg' is mostly foot: thigh hidden in feathers, the 'backwards knee' is the ankle, then a long foot bone, then toes (three forward, one back for perching). Draw a perched bird's leg as this chain. Birds are digitigrade like dogs.", tool: "pencil" },
            { h: "Feathers as groups", t: "Never individual feathers first. The wing has rows: primaries (the long hand feathers), secondaries (forearm), coverts (small ones over the base). The body has masses: breast, back, tail fan. Draw a flying bird as feather GROUPS, then add a few individual feathers only at the wingtips and tail.", tool: "pencil" },
            { h: "Three birds, three shapes", t: "Unsplash: a sparrow (round, short), a heron (all neck and legs), a hawk (broad wings, hooked beak). Construct all three. The egg + ball + Z-wing plan holds for every one; only the proportions change. Ink the heron.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Reptiles and fish",
          hints: ["Lizard/crocodile: sprawling legs out to the sides, the body low, the tail a continuation of the spine.", "Snake: a spine and ribs and nothing else — a tube that bends in S-curves.", "Fish: a spindle, fins as planes, the tail a fan."],
          steps: [
            { h: "The sprawl", t: "A lizard: a long low ribcage, a spine that continues into a tail as long as the body, and legs that go OUT sideways from the body before bending down (the elbow and knee point outward). Draw it from above (the classic view — legs splayed, tail curving) and from the side. A crocodile is a lizard with a boxier skull and a taller tail.", tool: "pencil", layer: "Pencils" },
            { h: "The snake", t: "A tube with a head wedge. The whole drawing is the S-curves and the overlap where the body crosses itself — foreshortening on a tube (Figure chapter) is exactly what you need. Draw a coiled snake, contour lines wrapping the tube, and note where the tube passes in front of itself.", tool: "pencil" },
            { h: "The fish", t: "A spindle (a stretched egg) seen from the side, pointed at both ends; fins are flat planes attached at specific spots (dorsal on top, pectorals behind the gills, the tail fan). Draw a fish side-on, then turning toward you — the spindle foreshortens into an oval and the fins become edge-on lines. A shark is the same spindle, stiffer.", tool: "pencil" },
          ] },
      ],
      reflect: ["Where is a bird's knee? A bird's wrist? If you can point to both on a photo, the lesson took."] },

    { id: "anim-4", title: "Insects, invertebrates, and skulls", minutes: 55,
      goal: "Construct an insect (three body segments, six jointed legs, wings), an arachnid, and a mollusc — then compare skulls across five species.",
      why: "Invertebrates are the exoskeleton plan: hard shells with joints, which makes them pure geometry — ideal for construction drawing and the basis of countless comic creatures. Skulls are where you learn to see 'species' in bone: eye size, jaw length, tooth type tell you what an animal does.",
      refs: ["drawabox-l5", "commons-zootomy", "sketchfab-skel", "unsplash", "whitlatch"],
      pages: [
        { title: "Exoskeletons",
          hints: ["Beetle: head, thorax, abdomen — three volumes. Six legs from the thorax, each with a hip, a thigh, a shin, and a foot chain.", "Spider: two segments (cephalothorax + abdomen), eight legs.", "Snail/octopus: soft body, but the shell is a spiral cone; tentacles are tapered tubes with a rhythm."],
          steps: [
            { h: "The beetle", t: "Three volumes in a row: a small head (ball with mandibles), a thorax (box — all six legs attach HERE, never the abdomen), and a big abdomen (egg) under wing cases. Each leg: coxa (hip) → femur → tibia → tarsus (a chain of small segments). Draw from above and from the side, legs bent like a folding chair.", tool: "pencil", layer: "Pencils" },
            { h: "The spider", t: "Two volumes: a fused head-thorax (a shield) and a round abdomen. Eight legs from the shield, each seven segments, arranged like a cage around the body. Draw it from above — the leg rhythm (two pairs forward, two back) is the whole drawing.", tool: "pencil" },
            { h: "Spirals and tentacles", t: "A snail shell is a cone rolled into a spiral — draw the cone first, then coil it, contour lines wrapping. An octopus: a soft bag body and eight tapered tubes; draw the tubes with a rhythm (Gesture chapter) and suckers as contour ellipses. Both are pure form drawing.", tool: "pencil" },
          ] },
        { title: "Comparative skulls",
          hints: ["Wikimedia Zootomy or Sketchfab: skulls of a dog, a horse, a cat, a bird, a human.", "For each: cranium size vs jaw length, eye socket size and position (front = predator, side = prey), tooth type."],
          steps: [
            { h: "Five skulls, one method", t: "Each skull: a cranium ball + a jaw box, joined at the eye socket. Draw all five from the side. Note the ratio of ball to box: human (big ball, tiny box), dog (equal), horse (tiny ball, huge box), cat (round ball, short box), bird (ball with a beak cone).", tool: "pencil", layer: "Pencils" },
            { h: "Predator or prey", t: "Eyes facing forward (overlapping vision, depth perception) = predator: cat, owl, human. Eyes on the sides (wide field, watching for predators) = prey: horse, rabbit, deer. Mark the eye direction on each skull from the front. This one rule lets you design a creature's role in the Creature Design chapter.", tool: "pencil" },
            { h: "Teeth tell the diet", t: "Long canines = carnivore (cat). Flat molars and a gap = herbivore (horse). Mixed = omnivore (you, bear). Draw the tooth line on the dog and horse skulls. Ink the five-skull page — it's a reference you'll keep.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["From a skull alone, list three things you can now tell about an animal."] },

    { id: "anim-5", title: "Animals in motion and character", minutes: 55,
      goal: "Draw animals moving (gait cycles) and with expression — the bridge from anatomy to animal characters.",
      why: "A correct animal standing still is a diagram; an animal mid-stride, ears back, is a character. Ken Hultgren's Disney-era method — gesture first, construction second, then caricature — is how animated animals were designed, and it's the method for comics too.",
      refs: ["hultgren", "loa-animals", "force", "unsplash", "pexels"],
      pages: [
        { title: "Gaits",
          hints: ["Pexels video: search 'dog running slow motion' — pause frames.", "Walk: diagonal pairs move together. Trot: opposite diagonals. Gallop: front pair, then hind pair, with a suspended moment.", "Draw 4 frames of each, gesture only."],
          steps: [
            { h: "The walk", t: "Four-beat: each foot lands separately, always three on the ground. Draw four frames of a dog walking as gesture + mannequin, paying attention to the spine's slight wave and the head bob. Reference a paused video.", tool: "pencil", layer: "Pencils" },
            { h: "The gallop", t: "The horse's gallop has a moment when all four feet are off the ground with the legs gathered under the body — and a moment fully stretched. Draw both frames; the spine flexes and extends like a bow. This is the frame comics use for any running animal.", tool: "pencil" },
            { h: "Flight and swim", t: "A bird's wingbeat: down-stroke (wings forward and down, body rises) and up-stroke (wings folded partly, tips up). A fish's swim: the S-curve traveling down the body. Two frames each.", tool: "pencil" },
          ] },
        { title: "Animal expression and caricature",
          hints: ["Hultgren: push the dominant shape. A bulldog is all square jaw; a greyhound is all curve.", "Ears, tail and posture are the animal's face: ears back = fear/anger, tail up = alert, crouch = threat or play."],
          steps: [
            { h: "Body language", t: "Draw the same dog in five states: alert (ears up, tail up, weight forward), afraid (ears back, tail tucked, low), aggressive (crouched, forward, hackles), playful (front down, rear up), relaxed (sprawled). No faces needed — the body says it all.", tool: "pencil", layer: "Pencils" },
            { h: "Push the shape", t: "Take one breed and caricature it: find its dominant shape (square, round, long) and exaggerate 50%. Then draw its opposite breed the same way. This is Hultgren's whole book in one exercise.", tool: "pencil" },
            { h: "An animal character", t: "Combine: a caricatured animal with a body-language state and one prop or costume detail that implies a story. Ink it. This is the seed of an animal character for your comics — and the direct setup for the Creature Design chapter.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which animal did you find hardest? Go back to its skeleton on Sketchfab; the answer is always in the joints."] },

    { id: "anim-6", title: "Reptile and amphibian surfaces", minutes: 55,
      goal: "Draw four reptile and amphibian surface types (overlapping scales, beaded skin, plates, smooth wet skin) as patterns that follow the animal's form, and build a lizard, a snake and a frog from construction.",
      why: "Scales are the texture beginners draw as a flat net stamped on top of the animal, and it kills the drawing instantly. A scale pattern is a set of contour lines: it wraps the body, shrinks toward joints and the tail, and stretches at the belly. Learn the four surface families and you can render any reptile, and half of all dragons, without inventing a single scale.",
      refs: ["inaturalist", "amphibiaweb", "reptile-db", "commons-zootomy", "drawabox-l5", "whitlatch"],
      pages: [
        { title: "Four surfaces", exemplar: "scaleTypes",
          steps: [
            { h: "Overlapping scales", t: "Copy the guide's roof-tile rows: each scale is an arc, the next row offset by half a scale, every row following a contour line around the body. Now draw a curved tube (a snake's body) and wrap it in these rows so they bend with it and compress on the inside of the curve. Draw the scales smaller as the tube tapers.", tool: "pencil", layer: "Pencils" },
            { h: "Beaded skin", t: "Geckos and gila monsters wear pebbles: irregular, rounded, no overlap, different sizes mixed. The pattern still follows the form, but it's suggested, not counted: render a patch fully near the focal point and let it fade to a few dots elsewhere. Draw a bent lizard leg with beads dense at the elbow and sparse on the thigh.", tool: "pencil" },
            { h: "Plates and scutes", t: "Crocodile backs and turtle shells are big plates with a ridge (keel) down each, laid in rows that widen over the back and narrow toward the tail. They are boxes on a surface, so each plate gets a lit top and a shadow side. Draw a crocodile's back from above and from the side.", tool: "pencil" },
            { h: "Smooth and wet", t: "Frogs and salamanders have no texture at all. Their form is described by contour lines and ONE sharp specular highlight per form, because wet skin is a mirror. Draw the guide's frog body with four contour ellipses and a single small highlight where the light hits most directly. Adding more highlights makes it look like plastic.", tool: "pencil" },
          ] },
        { title: "Lizard, snake, frog",
          hints: ["iNaturalist: search 'bearded dragon', 'corn snake', 'tree frog'. Pick photos with the whole animal visible.", "Construction first: the sprawling limb plan for the lizard, one long tapered tube for the snake, a fat bean with folded Z-legs for the frog.", "Texture LAST and only where it earns its place."],
          steps: [
            { h: "Lizard: the sprawl", t: "A lizard's legs come out sideways and then bend down (a sprawl), unlike a mammal's legs under the body. Construct: head wedge, a long flattened ribcage tube, pelvis, tail tube tapering to nothing, and four legs that go OUT then DOWN with the elbow and knee pointing sideways. Draw it from above (the classic view) and from the side.", tool: "pencil", layer: "Pencils" },
            { h: "Snake: a tube with a plan", t: "One tapered tube from a wedge head, but it moves in S-curves that are wider in the middle of the body and tighten at the tail. Draw the line of action first, exactly as with a figure, then the tube, then contour ellipses every few body-widths that tilt with each curve. Only then the belly scales (wide, single row) and the back scales (small, many rows).", tool: "pencil" },
            { h: "Frog: springs folded under a bean", t: "A frog is a wide bean (ribcage and pelvis together) with a flat head, huge eyes on top, and hind legs folded into a Z that is longer than the body. Construct the bean, the eye domes, the Z-legs with big webbed feet. No texture: contour lines and one highlight per form.", tool: "pencil" },
            { h: "Ink with texture judgment", t: "Ink all three. Render scales fully only in one area of each animal (the head and neck, usually), and let the rest be suggested by a few contour rows. Heavy line where the belly meets the ground. Compare against the reference: the goal is that the texture reads as 'on the form', never 'on the paper'.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Where did your scales stay the same size along the whole body? That is the tell. Shrink them toward joints and the tail.", "Point to a reptile's elbow on a photo. Sideways, not under the body?"] },
    ] },

  /* ============================================================ */
  { id: "s5-creature", title: "Creature Design",
    summary: "Believable creatures are real anatomy recombined: a mammal's skeleton with a bird's feet, an insect's exoskeleton at a cat's scale, a predator's forward eyes on a herbivore's body — and every combination has to MOVE. This chapter is the animal chapter's method turned toward invention. The creatures are yours; the rules are nature's.",
    lessons: [

    { id: "cr-1", title: "Anatomy mash-ups that could exist", minutes: 60,
      goal: "Design a creature by combining structures from two or three real animals, and prove it works by drawing it walking.",
      why: "Terryl Whitlatch's rule: a creature is believable when its anatomy could function. A bird-cat hybrid has to have a shoulder that can both fly and pounce; if you don't decide where the wings attach relative to the front legs, readers feel the fake without knowing why.",
      refs: ["whitlatch", "goldfinger-animal", "sketchfab-skel", "commons-zootomy", "aldoori"],
      pages: [
        { title: "The creature grid", exemplar: "mashupGrid",
          hints: ["Three reference animals, three boxes: SKELETON donor, SURFACE donor (skin/fur/scale/shell), and ROLE donor (predator/prey/scavenger → eyes, teeth, feet).", "Decide the environment: it dictates feet and surface."],
          steps: [
            { h: "Pick a role and an environment first", t: "Ambush predator in a swamp? Grazer on cliffs? Scavenger in a desert? The role picks the eye placement (Animal-4), the diet picks the teeth, the environment picks the feet (webbed, hooved, clawed) and the surface (scales, fur, armor). Write these decisions in the margin BEFORE choosing animals.", tool: "pencil", layer: "Pencils" },
            { h: "Skeleton donor", t: "Choose the animal whose body plan fits the role — a big cat for an ambusher, a goat for a cliff grazer, a vulture for a scavenger. Draw its simplified skeleton (Animal chapters) in box one. This is your creature's chassis; everything must attach to it plausibly.", tool: "pencil" },
            { h: "Surface and features from others", t: "Box two: the surface donor (a pangolin's scales, an owl's feathers, a frog's skin). Box three: the feature donor (a chameleon's eyes, a mantis's forelimbs, a crab's claws). Sketch what you're taking, and WHERE on the chassis it attaches — a joint must exist for every moving part.", tool: "pencil" },
            { h: "Synthesis: build it", t: "Draw the creature on the chassis: skeleton first, then masses, then surface, then features. Every added part attaches at a real joint. If the wings are on the back, there must be a shoulder girdle for them — decide what the front legs gave up. Draw it standing.", tool: "pencil" },
            { h: "Prove it moves", t: "Draw the creature in two frames of its gait (Animal-5), and one frame doing its role (pouncing, grazing, scavenging). If a part can't move, redesign it. Ink the best frame.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which real joint did you have to invent a solution for? That's where creature design actually happens."] },

    { id: "cr-2", title: "Scale, silhouette and the creature sheet", minutes: 60,
      goal: "Resolve a creature design into a model sheet with scale reference, turnaround, silhouette test and a texture study.",
      why: "A creature in a comic needs to be drawn from any angle, at a consistent size against the characters, with a silhouette that's instantly recognizable in a dark panel. The creature sheet is the professional deliverable — and the discipline that turns a cool sketch into a usable design.",
      refs: ["whitlatch", "fzd", "aldoori", "hultgren"],
      pages: [
        { title: "Scale and silhouette",
          hints: ["Draw your Section 5 character next to the creature — same ground line, same horizon.", "Silhouette test in solid black (Character Design-1).", "Push the dominant shape: is the creature round, square or triangular? Commit."],
          steps: [
            { h: "Scale against a human", t: "Draw your character (from the Character Design chapter) standing beside the creature on the same ground line. Their eyes on the same horizon if standing. Is the creature the size you imagined? Adjust — scale is a design decision that changes the creature's threat, speed and diet.", tool: "pencil", layer: "Pencils" },
            { h: "Silhouette", t: "Fill the creature solid black. Is it readable? Does the dominant shape family match its role (triangular predator, round grazer)? Adjust the outline — add a crest, lengthen the tail, thicken the neck — until it reads at thumbnail size.", tool: "marker" },
            { h: "Head study", t: "The creature's head at three angles, built like a skull (ball + jaw box + eye sockets placed for its role). Include an expression — creatures need faces that act.", tool: "pencil" },
          ] },
        { title: "The creature sheet",
          hints: ["Turnaround (side, front, three-quarter), scale figure, a texture patch, a color harmony.", "Texture patch: a square showing the surface at full detail — scales, fur direction, plating."],
          steps: [
            { h: "Turnaround", t: "Side, front and three-quarter views, aligned on ground and horizon lines. Use the boxes-and-tubes construction from the Animal chapters; the creature must turn like a real object because it IS a real object in your world.", tool: "pencil", layer: "Pencils" },
            { h: "Texture and color", t: "One square of surface at full render (ink hatching for scales, feathered strokes for fur — Shading chapter). Then a color harmony chosen by role: predators often warm-dark or camouflaged, display animals saturated (Advanced Color). Flat the side view and add the one accent.", tool: "marker", layer: "Colors" },
            { h: "Ink the sheet", t: "Ink all views. Label the sheet with the creature's role, environment, diet and size. It's a Portfolio piece and a tool: you'll draw this creature in a panel later, and the sheet is what keeps it consistent.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Could someone else draw your creature correctly from this sheet alone? If not, what's missing?"] },
    ] },

  /* ============================================================ */
  { id: "s5-objects", title: "Complex Object Design",
    summary: "Machines, vehicles, weapons, and the everyday objects that fill a world — all of them primitives plus JOINTS, drawn in perspective from reference. This chapter gives the basics for each category and points at the deep resources (Scott Robertson, museum collections, 3-D model libraries), then turns to invention: combining real mechanisms into objects that never existed but clearly work.",
    lessons: [

    { id: "obj-1", title: "Machines: primitives plus joints", minutes: 55,
      goal: "Draw mechanical objects as primitives connected by four joint types, with housings that make them look functional.",
      why: "A machine looks real when every moving part has a visible joint and every joint has something holding it. That's the difference between a robot that looks like it could move and a robot that looks like a statue wearing plates.",
      refs: ["scott-robertson", "drawabox-l6", "sketchfab", "fzd"],
      pages: [
        { title: "The four joints", exemplar: "mechanicalJoints",
          steps: [
            { h: "Hinge, pivot, slider, ball", t: "Copy the four. Hinge: two boxes sharing an axle (a door, a knee brace). Pivot/axle: a cylinder through a cylinder (a wheel, a crank). Slider/piston: a box or tube moving inside another (a drawer, a hydraulic ram). Ball joint: a sphere in a socket (a camera mount, a hip). Draw each in two positions — open and closed, extended and retracted.", tool: "pencil", layer: "Pencils" },
            { h: "Housings", t: "Redraw each joint with the part that HOLDS it: the hinge needs plates and bolts, the axle needs a bearing block, the piston needs a cylinder with seals, the ball needs a cup with a clamp. Housings are where machines get their look.", tool: "pencil" },
            { h: "A simple mechanism", t: "Design a two-joint mechanism: a lamp arm (two hinges + a pivot base), a crane (a pivot + a slider), a claw (a slider driving two hinges). Draw it in perspective in two positions. Reference real ones on Sketchfab — rotate them to see the housings.", tool: "pencil" },
            { h: "Ink with material", t: "Ink the mechanism with the Shading chapter's material logic: hard highlights and dark reflections for metal, thick line where parts overlap, thin line on the lit side. Add three bolts — placed where forces actually go.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Pick any machine near you. Name its joints. Which joint type does it use most?"] },

    { id: "obj-2", title: "Vehicles", minutes: 60,
      goal: "Construct a car, a motorcycle and a larger vehicle in two-point perspective from the box-and-wheel method.",
      why: "Vehicles are the acid test of perspective: box construction, ellipses on axles, mirrored symmetry and mechanical detail all at once. Drawabox lesson 7 and Scott Robertson's book are entirely about this; these pages teach the core method so those resources make sense.",
      refs: ["drawabox-l7", "scott-robertson", "sketchfab", "unsplash"],
      pages: [
        { title: "The car", exemplar: "vehicleBoxes",
          steps: [
            { h: "Two boxes on an axle", t: "Grid on (2-point). A long low box (the chassis), a shorter box on top and toward the back (the cabin). Draw the two axles as lines aiming at the same VP, passing through the chassis box near its ends. Wheels are ellipses whose minor axes lie ON the axles (Advanced Perspective). Get this and you have a car.", guide: { persp: true, vps: 2 }, tool: "pencil", layer: "Pencils" },
            { h: "Cut the boxes", t: "Slice the cabin's corners for the windshield and rear window (planes at angles), round the chassis box's nose, cut wheel arches (a cylinder subtracted from the box — the arch is an ellipse concentric with the wheel). Reference: Unsplash 'car three-quarter view' and match the cuts to a real model.", tool: "pencil" },
            { h: "Mirror the details", t: "Headlights, mirrors and doors on the far side mirror the near side across the car's center plane (use the diagonal method from Advanced Perspective). Draw them smaller and foreshortened. This symmetry is what makes a car look manufactured.", tool: "pencil" },
            { h: "Ink and material", t: "Ink with a hard horizon reflection across the body (a car is a mirror), dark tires with a thin bright rim, and heavy line under the chassis where it shadows the ground.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Motorcycle and a big vehicle",
          hints: ["Motorcycle: two wheels on one line, an engine box between, a frame of tubes connecting them, a rider-shaped seat — the mechanism is exposed, so joints and housings show.", "Truck/bus/tank: a big box on more wheels; treads are a belt of small boxes around two wheels."],
          steps: [
            { h: "The motorcycle", t: "Two ellipses on the same ground line in perspective, a fork (two tubes) from the front wheel up to the handlebars, a triangle frame to the rear wheel, an engine box hung inside the triangle. It's a machine with nothing hidden — draw every joint from a Sketchfab model.", guide: { persp: true, vps: 2 }, tool: "pencil", layer: "Pencils" },
            { h: "The big vehicle", t: "A truck: a cab box + a cargo box on a long chassis with six or more wheels (equal spacing by the diagonal trick). Or a tank: a low hull box, a turret cylinder with a barrel cylinder, treads as a loop of small boxes. Add a figure for scale.", tool: "pencil" },
            { h: "Your own vehicle", t: "Combine: a real chassis type with a real mechanism from lesson Obj-1 and a purpose (a mobile clinic, a sand skiff, a rescue crawler). Draw it in perspective with a figure. Ink it. Invented, but built entirely from real parts.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Extend your car's edges — do the chassis, cabin and both axles converge to the same VPs?"] },

    { id: "obj-3", title: "Weapons and tools", minutes: 50,
      goal: "Draw blades, firearms, bows and tools with correct proportion to the hand and believable mechanism — from museum references.",
      why: "Weapons are objects designed around the human hand and body; drawn wrong they look like toys. Museum collections (The Met, Royal Armouries) have thousands of high-res references. Even fantasy weapons obey grip length, balance and physics.",
      refs: ["met-collection", "royal-armouries", "sketchfab", "scott-robertson"],
      pages: [
        { title: "Blades and ranged", exemplar: "weaponProportions",
          steps: [
            { h: "The grip first", t: "Copy the guide. A one-hand grip is about four finger-widths; a two-hand grip, eight. The guard sits at the grip's end, the pommel at the other. The blade is a long flat wedge (a diamond cross-section — draw the center ridge). Reference three swords from the Royal Armouries collection and draw each with its grip measured against a hand.", tool: "pencil", layer: "Pencils" },
            { h: "Axes, spears, hammers", t: "All are a haft (a long cylinder) with a head attached — the head's shape defines the weapon. The haft must be long enough for the grip style (one hand, two hands, a spear's reach). Draw one of each from The Met's collection, a hand holding it (Figure-3).", tool: "pencil" },
            { h: "Firearms as boxes and tubes", t: "A rifle: a box receiver, a tube barrel, a stock shaped to the shoulder, a grip angled for a hand, a trigger guard. A pistol: the same minus the stock. Draw both as primitives from a museum photo (The Met has historic firearms) and note the grip angle — around 110° to the barrel.", tool: "pencil" },
            { h: "The bow", t: "A curved spring (a bent cylinder) with a string; drawn, it's a triangle of tension with the arrow at the apex. Draw it relaxed and drawn, with the archer's hands placed correctly (bow hand pushed out, string hand at the cheek).", tool: "pencil" },
          ] },
        { title: "Tools, props and an invented weapon",
          hints: ["Everyday tools are weapons' cousins: hammer = haft + head, drill = grip + motor box + tube.", "Invent: combine a real grip, a real mechanism and a real material."],
          steps: [
            { h: "Five everyday tools", t: "Hammer, wrench, drill, kitchen knife, umbrella. Each as primitives with the grip measured to a hand, from photos (Unsplash). These are the props that fill a panel and make a world lived-in.", tool: "pencil", layer: "Pencils" },
            { h: "Invent one", t: "Combine a real grip (from a sword), a real mechanism (from Obj-1 — say a slider) and a purpose. Draw it in a hand, in perspective. If someone can tell how it's held and what it does, it's a good design.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Draw your character (Section 5) holding the invented weapon. Does the grip match the hand from Figure-3?"] },
    ] },

  /* ============================================================ */
  { id: "s5-env", title: "Environment Design",
    summary: "Worlds are compositions: a setting is chosen forms (from geology, water, plants, architecture), arranged for a story, lit for a mood, colored for a theme. Every environment lesson uses real references — satellite imagery, landform photos, real cities — because worlds that feel real are built from the real. Then you combine, as in every design chapter, into something that never existed.",
    lessons: [

    { id: "env-1", title: "Composition and the thumbnail", minutes: 45,
      goal: "Compose a scene at thumbnail size using focal point, value grouping, depth layers and the horizon's mood before drawing anything large.",
      why: "The scene is decided at postage-stamp size. Fixing a composition at full size is expensive; at thumbnail size it takes seconds. Marcos Mateu-Mestre's Framed Ink and Feng Zhu's lectures both begin here.",
      refs: ["framed-ink", "fzd", "loa-env", "gurney-book"],
      pages: [
        { title: "Thumbnails", exemplar: "thumbnailFrames",
          steps: [
            { h: "Three horizons", t: "Copy the three frames: low horizon (sky dominates — awe, scale, weather), middle (documentary, calm), high horizon (ground dominates — intimacy, the character's world). Same scene in each, three values only. Feel how the horizon alone sets the tone.", tool: "marker", layer: "Pencils" },
            { h: "Focal point", t: "Each thumbnail needs ONE place the eye goes: the highest contrast, a figure, a light source. Put it on a thirds intersection (Guides tab → rule of thirds). Everything else supports it: lines lead toward it, values darken away from it. Mark the focal point with a dot in each frame.", tool: "marker" },
            { h: "Depth in three layers", t: "Foreground (dark, framing, detailed), midground (the subject), background (light, atmospheric). Redo one thumbnail as three flat value layers and nothing else. That's a composition.", tool: "marker" },
            { h: "Nine more", t: "A grid of nine thumbnails for one setting (a harbor, a canyon, a market): vary horizon, focal point placement and the depth layers. Pick the best two. This is the habit of every concept artist — never one idea, always nine.", tool: "marker" },
          ] },
      ],
      reflect: ["Which of your nine would you actually draw? Why that one — what's the story in it?"] },

    { id: "env-2", title: "Reading the land: geology, water, plants", minutes: 60,
      goal: "Recognize and draw the structures of real landforms, water features and vegetation, and understand the forces that shape them.",
      why: "Land looks the way it does for reasons: mountains fold, rivers meander and cut the outer bend, glaciers carve U-valleys, wind piles dunes with a gentle windward slope and a steep lee. Know the cause and the drawing is right even when you invent the place.",
      refs: ["nasa-eo", "usgs", "loa-env", "unsplash", "gurney-blog"],
      pages: [
        { title: "Landforms", exemplar: "landforms",
          steps: [
            { h: "Mountains: young and old", t: "Young fold mountains (the Himalayas, the Alps) are jagged — sharp ridges, V-valleys. Old ones (the Appalachians) are rounded — eroded for hundreds of millions of years. Look at both on NASA Earth Observatory. Draw a young ridgeline and an old one, then the same mountain from the ground.", tool: "pencil", layer: "Pencils" },
            { h: "Rivers and valleys", t: "Rivers meander; the outer bend is cut steep, the inner bend deposits a gentle beach. A river valley is a V (water cuts down); a glacial valley is a U (ice scrapes wide). A delta fans where a river hits still water. Draw a meander from above and a V and a U valley in section.", tool: "pencil" },
            { h: "Deserts and coasts", t: "Dunes: a gentle windward slope, a steep lee slope, crest curved by the wind — the wind direction is readable from the shape. Coasts: cliffs where hard rock resists, beaches where sand collects in bays, arches and stacks where the sea cuts through. Draw a dune field and a headland with an arch, from photos.", tool: "pencil" },
            { h: "Rock and strata", t: "Sedimentary rock is layered (horizontal lines — or tilted if the land was folded); the layers show in every cliff. Draw a cliff face with strata, an overhang where a hard layer protects a soft one, and rubble at the base (rocks fall — always draw the debris).", tool: "pencil" },
          ] },
        { title: "Water and vegetation",
          hints: ["Water is a mirror (calm) or a texture (moving). Reflections are the scene upside-down, darker, broken by ripples.", "Trees: trunk (tapering cylinder), main branches (tapering, thinning by rule), foliage as MASSES, not leaves."],
          steps: [
            { h: "Still and moving water", t: "A lake: reflect the far shore upside-down, slightly darker, with horizontal ripple breaks. A river: perspective lines of flow, whitewater where it drops. A wave: a rolling cylinder that breaks — the curl is a tube. Draw one of each.", tool: "pencil", layer: "Pencils" },
            { h: "Trees as masses", t: "A trunk tapers; each branch is thinner than its parent (their cross-sections add up to the parent's). Foliage is clusters — draw them as overlapping blobs with a light side and a shadow side, like spheres, then texture only the edges. Three tree types from Unsplash: an oak (round masses), a pine (a cone of layers), a palm (a burst of planes).", tool: "pencil" },
            { h: "Ecological logic", t: "Plants follow water and light: dense along rivers, sparse on dry slopes, none above the treeline, different on the shaded side of a valley. Draw a valley section and place vegetation by these rules. That's ecology as composition — the world tells its own story.", tool: "pencil" },
          ] },
      ],
      reflect: ["Look at any landscape photo: what force made each shape? If you can answer, you can draw it from any angle."] },

    { id: "env-3", title: "Built environments and objects in settings", minutes: 55,
      goal: "Design architecture and streets in perspective, place objects and figures to tell a story, and use scale and detail to imply history.",
      why: "A setting with people in it is a stage; the objects in it are props that tell the audience what happened here before the panel started. A cracked wall, a chair knocked over, a market with one empty stall — environment design is storytelling by arrangement.",
      refs: ["fzd", "framed-ink", "loa-env", "scott-robertson", "unsplash"],
      pages: [
        { title: "Architecture in perspective",
          hints: ["Grid on, 2-point. Buildings are boxes with the Advanced Perspective methods: equal windows, mirrored details, a figure for scale.", "Style is proportion + material + ornament: draw the same box as a cabin, a temple and an office."],
          steps: [
            { h: "One box, three styles", t: "Draw a two-point box three times. Make it a log cabin (horizontal cylinders, a pitched roof wedge, one small window), a temple (columns as cylinders on a stepped base, a pediment triangle), an office (a glass grid — equal-spaced windows via the diagonal trick). Same box; style is what you attach.", guide: { persp: true, vps: 2 }, tool: "pencil", layer: "Pencils" },
            { h: "A street", t: "A row of buildings of different heights along one VP, a road with a curb, street furniture (lamps as tall cylinders, a bench, a sign) placed on a floor grid. A figure at the door of each building for scale. Reference a real street on Unsplash and steal its proportions.", tool: "pencil" },
            { h: "Age and history", t: "Add time: a crack that follows the brick courses, a repaired patch in a different material, plants in the gutters, a sign painted over another sign. Every detail is a sentence about the building's past.", tool: "pencil" },
          ] },
        { title: "Staging a scene",
          hints: ["Take the street. Place your character and one prop so that something HAPPENED here.", "The composition rules from Env-1: focal point on the story, values lead to it."],
          steps: [
            { h: "Props as story", t: "Choose an event (a chase just passed, a deal is being made, someone is waiting). Place three props that imply it: an overturned crate, a dropped bag, a lit window at night. No figures yet. Can a viewer guess the event?", tool: "pencil", layer: "Pencils" },
            { h: "Figures and eye lines", t: "Add your character and one other figure. Where they look, the reader looks. Compose so the eye lines and the perspective lines converge on the story's focal point.", tool: "pencil" },
            { h: "Light for mood", t: "Pick a lighting scenario (Shading-4): rim light for menace, warm window light for refuge. Spot the blacks with the Marker/Ink. Ink the scene. This is a finished environment panel.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Cover the figures. Does the scene still tell the story? It should."] },

    { id: "env-3b", title: "Lighting a scene", minutes: 60,
      goal: "Light one room and one exterior with a single key light, a fill and (optionally) a rim, placing every cast shadow from the key so the figures sit in the space, and re-light the same room for noon, dusk and night.",
      why: "Shading (Section 2) lit one object. A scene is many objects sharing ONE light, and that shared light is what makes them belong together: every cast shadow points the same way, every shadow side faces away from the same source, and the fill color is the room's own color bounced back. Comics pages are read by their lighting before their drawing. Learn to plan it like a film set: key, fill, rim, in that order of importance.",
      refs: ["gurney-book", "gurney-yt", "gurney-blog", "framed-ink", "ctrlpaint"],
      pages: [
        { title: "Key, fill, rim", exemplar: "sceneLight",
          steps: [
            { h: "Place the key", t: "Copy the guide room. Choose the key light: the window on the left. Draw the arrow from it. Everything now follows from that arrow: the floor near the window is brightest; the far wall is lit at an angle; the wall the window is IN is in its own shadow. Mark on each surface whether it faces the key (light), turns from it (halftone) or faces away (shadow), exactly like the cube in Shade-2.", tool: "pencil", layer: "Pencils" },
            { h: "Cast shadows from the key", t: "Every object throws a shadow AWAY from the key, along the arrow. The figure's shadow falls on the floor to the right and slightly toward the viewer, and it is what pins the feet to the floor. A table's shadow does the same. Construct each shadow by projecting the object's top corners along the key's rays until they hit the floor; the guide shows the figure's. Draw the room's furniture and cast every shadow.", tool: "pencil" },
            { h: "Fill: the bounce", t: "Shadows are not black. Light bouncing off the floor and walls fills them, dimmer and tinted the color of whatever it bounced off (warm wood floor: warm fill). On the Colors layer, paint the shadow side of the figure and furniture with a fill value two steps darker than the halftone and shifted toward the room's color. Keep every fill darker than every lit surface or the scene flattens.", tool: "marker", layer: "Colors" },
            { h: "Rim: the optional third light", t: "A second, weaker source from behind (a lamp in the back corner, a doorway) puts a bright edge on the figure's far side and separates it from the wall. Add one. Rule: a rim light must never be brighter than the key, or the reader stops knowing where the light comes from.", tool: "marker" },
          ] },
        { title: "The same room, three times of day",
          hints: ["Page tab ＋ twice, or divide the page into three panels.", "Noon: key from above, short shadows, cool skylight fill. Dusk: key from the side, long warm shadows, purple fill. Night: key from a lamp INSIDE the room, everything else drops into a deep cool fill.", "Chromatic greys (Acolor-4) for everything that isn't the key."],
          steps: [
            { h: "Noon", t: "Redraw the room with the key coming steeply through the window: short, hard-edged shadows directly under things, the floor a bright patch, the fill cool (sky bounce). Values are high-contrast and simple. This is the honest, flat, daytime look: nothing hidden.", tool: "marker", layer: "Colors" },
            { h: "Dusk", t: "Same room, the key low and warm through the window: long shadows across the floor and up the far wall, everything the light touches orange, everything it misses a cool violet fill. The contrast between warm light and cool shadow is the whole mood. Keep the saturation in the lit areas and let the shadows go grey-violet.", tool: "marker" },
            { h: "Night, lit from inside", t: "The window is now dark and the key is a lamp in the room: a warm pool that falls off fast with distance, shadows pointing AWAY from the lamp in all directions, the corners of the room dropping into a near-black cool fill. Objects far from the lamp are barely there. Ink the shadows as spotted blacks and let the lamp's pool be the only detail.", tool: "ink", layer: "Inks" },
            { h: "Exterior", t: "One outdoor scene from Env-2 or Env-3, lit by a sun (key) with a sky (fill). The sky fill is much stronger outdoors, so shadows are lighter and bluer than indoors. Cast shadows of trees and buildings run parallel to each other on flat ground and converge toward the sun's position on the horizon when the sun is low. Draw it, then save all four to the Portfolio.", tool: "marker", layer: "Colors" },
          ] },
      ],
      reflect: ["Point to the key light in each of your four scenes. Could a stranger find it from the shadows alone?", "Which time of day would you use for a scene where a character decides to leave home? Why that one?"] },

    { id: "env-4", title: "Worldbuilding: color, theme and invention", minutes: 70,
      goal: "Design an original setting by combining real landforms, real architecture and a color theme into a world that conveys meaning — then draw it from two angles.",
      why: "This is the capstone of design: every chapter converges. Geology gives the land, ecology gives the plants, perspective gives the space, color psychology gives the theme, and recombination gives you something new. The world you build here is the world your comic can live in.",
      refs: ["fzd", "gurney-book", "nasa-eo", "framed-ink", "adobe-color", "unsplash"],
      pages: [
        { title: "The world grid", exemplar: "mashupGrid",
          hints: ["Three references: a real landform (NASA EO / Unsplash), a real architectural tradition (Unsplash: 'village Morocco', 'temple Kyoto', 'stilt houses'), a real color environment (a photo whose palette carries the mood you want).", "Decide the theme in one sentence first: 'a city that grew too fast', 'a valley that forgot the war'."],
          steps: [
            { h: "Theme sentence", t: "Write it in the margin. Everything else argues for it. 'A monastery clinging to the last green ridge above a drying sea' — that sentence already picks the landform (an eroded ridge), the water (retreating shoreline), the architecture (stacked, defensive), the palette (dusty warm below, one green above).", tool: "pencil", layer: "Pencils" },
            { h: "Land first", t: "From the landform reference, draw the terrain in a wide thumbnail: the forces (Env-2) decide the shapes. Place water and vegetation by ecological logic. This is a map-as-drawing — low horizon or high, per the theme.", tool: "pencil" },
            { h: "Then the built world", t: "Architecture grows from the land: stone where there's cliff, wood where there's forest, stilts where there's water. Adapt the architectural reference to THIS terrain. Draw the settlement in perspective on the terrain with the Advanced Perspective methods; figures for scale.", tool: "pencil" },
            { h: "Color as theme", t: "From the color reference and the Advanced Color chapter: pick a harmony that IS the theme (drying sea = desaturated warm with one cool accent of remaining water). Flat the wide view. Chromatic greys for most of it; saturation only where the theme lives.", tool: "marker", layer: "Colors" },
          ] },
        { title: "Two angles and a story beat",
          hints: ["Same world: one establishing shot (wide, low horizon) and one intimate shot (close, high horizon, a figure).", "The intimate shot shows a story beat: something is happening in this world."],
          steps: [
            { h: "The establishing shot", t: "The wide view, resolved: three depth layers, atmospheric perspective, focal point on the settlement. Ink and color it. This is the panel that opens a chapter.", tool: "ink", layer: "Inks" },
            { h: "The intimate shot", t: "A new page: inside the settlement, a street or a room built from the same architecture, high horizon, your character doing something that the theme implies (carrying water up from the receding shore). Props with history. Light for mood. Ink and color.", tool: "ink", layer: "Inks" },
            { h: "Name it", t: "Title the two pages with the world's name and your theme sentence. Save to the Portfolio. You've designed a place that didn't exist this morning, out of nothing but studied reality and your own choices.", tool: "pencil", layer: "Pencils" },
          ] },
      ],
      reflect: ["Does the intimate shot feel like it's inside the establishing shot? Same materials, same light, same palette?", "What would a second theme sentence do to the same landform?"] },
    ] },
  ],
});
