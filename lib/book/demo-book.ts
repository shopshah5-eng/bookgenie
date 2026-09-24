import type { BookDocument } from '@/lib/book/types';

export function getStarExplorerDemoBook(): BookDocument {
  return {
    schemaVersion: 1,
    id: 'star-explorer',
    userId: 'public-demo-user',
    title: 'The Little Star Explorer',
    subtitle: 'A Bedtime Journey Through Starlit Nebulae & Distant Moons',
    bookType: 'children',
    language: 'English',
    style: 'Storybook Illustration',
    pageCount: 28,
    coverUrl: '/images/cover-star-explorer.jpg',
    versionNumber: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blueprint: {
      title: 'The Little Star Explorer',
      subtitle: 'A Bedtime Journey Through Starlit Nebulae & Distant Moons',
      bookType: 'children',
      audience: 'Young Explorers (Ages 4-8)',
      language: 'English',
      style: 'Vibrant Storybook Watercolor',
      pageTarget: 28,
      chapters: [
        { index: 1, title: 'The Starlight Pocket', summary: 'Leo finds a tiny luminous star sleeping inside his telescope.', allocatedPages: 7 },
        { index: 2, title: 'Sailing the Milky Stream', summary: 'Building a cardboard rocket powered by bedtime giggles.', allocatedPages: 7 },
        { index: 3, title: 'The Cloud of Whispering Comets', summary: 'Friendly comets playing hide-and-seek among Saturn rings.', allocatedPages: 7 },
        { index: 4, title: 'Safe Return to the Moonbeam Cradle', summary: 'Tucking the little star into bed beneath starry quilts.', allocatedPages: 7 },
      ],
      visualPlan: [
        { pageNumber: 1, visualType: 'cover', promptSpec: 'Little astronaut boy smiling among golden stars and swirl galaxy.', layout: 'full-bleed' },
        { pageNumber: 2, visualType: 'illustration', promptSpec: 'Leo gazing through a brass telescope on his bedroom balcony at dusk.', layout: 'image-right' },
        { pageNumber: 5, visualType: 'illustration', promptSpec: 'A glowing baby star illuminating Leo’s hands with warm golden light.', layout: 'image-top' },
      ],
      characterBible: {
        protagonist: 'Leo: A curious 6-year-old in a soft astronaut suit with a heart for cosmic bedtime adventures.',
      },
    },
    pages: [
      {
        pageNumber: 1,
        chapterIndex: 1,
        title: 'Title Page',
        pageType: 'cover',
        layout: 'full-bleed',
        blocks: [
          { id: 'se-1', type: 'heading', level: 1, text: 'The Little Star Explorer' },
          { id: 'se-2', type: 'paragraph', text: 'Written & Illustrated by Sarah J. Jenkins • BookGenie Edition' },
        ],
      },
      {
        pageNumber: 2,
        chapterIndex: 1,
        title: 'The Rooftop Telescope',
        pageType: 'chapter_header',
        layout: 'image-right',
        blocks: [
          { id: 'se-3', type: 'heading', level: 1, text: 'Chapter 1: The Starlight Pocket' },
          { id: 'se-4', type: 'paragraph', text: 'When the evening lamps turned violet across the valley, Leo climbed to the attic window with his silver helmet tucked under his arm.' },
          { id: 'se-5', type: 'paragraph', text: '“Tonight,” he whispered to his toy bear Astro, “the constellation of the Silver Bear is awake.”' },
        ],
      },
      {
        pageNumber: 3,
        chapterIndex: 1,
        title: 'A Sparkle in the Lens',
        pageType: 'content',
        layout: 'standard',
        blocks: [
          { id: 'se-6', type: 'paragraph', text: 'He peered into the glass lens. Far beyond the pine trees, something flickered—not like a distant star, but like a firefly trapped in spun sugar.' },
          { id: 'se-7', type: 'quote', text: '“Even the smallest spark can light up the deepest night.”' },
          { id: 'se-8', type: 'paragraph', text: 'Suddenly, with a soft chime like a silver bell, a pocket of stardust floated straight through the open window and settled in Leo’s palm.' },
        ],
      },
      {
        pageNumber: 4,
        chapterIndex: 2,
        title: 'The Cardboard Voyage',
        pageType: 'chapter_header',
        layout: 'standard',
        blocks: [
          { id: 'se-9', type: 'heading', level: 1, text: 'Chapter 2: Sailing the Milky Stream' },
          { id: 'se-10', type: 'paragraph', text: 'With wings cut from cereal boxes and thrusters powered by imagination, Leo’s bed began to levitate above the wooden floorboards, drifting softly out into the indigo expanse.' },
        ],
      },
    ],
  };
}

export function getMindfulMorningDemoBook(): BookDocument {
  return {
    schemaVersion: 1,
    id: 'mindful-morning',
    userId: 'public-demo-user',
    title: 'The Mindful Morning',
    subtitle: 'A Gentle Guide to Intentional Living & Daily Wellness',
    bookType: 'guide',
    language: 'English',
    style: 'Minimal Editorial',
    pageCount: 64,
    coverUrl: '/images/cover-mindful-morning.jpg',
    versionNumber: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blueprint: {
      title: 'The Mindful Morning',
      subtitle: 'A Gentle Guide to Intentional Living & Daily Wellness',
      bookType: 'guide',
      audience: 'Creative Professionals & Wellness Seekers',
      language: 'English',
      style: 'Minimal Swiss Editorial',
      pageTarget: 64,
      chapters: [
        { index: 1, title: 'The Architecture of Dawn', summary: 'Understanding cortisol waking rhythms and circadian alignment.', allocatedPages: 16 },
        { index: 2, title: 'The First 30 Minutes', summary: 'Digital sanctuary, tactile stillness, and hydration rituals.', allocatedPages: 16 },
        { index: 3, title: 'Clarity Before Noise', summary: 'Morning pages, three priorities rule, and focused breathing.', allocatedPages: 16 },
        { index: 4, title: 'Sustaining the Signal', summary: 'Transitioning calm focus into creative execution.', allocatedPages: 16 },
      ],
      visualPlan: [
        { pageNumber: 1, visualType: 'cover', promptSpec: 'Sunrise over misty mountain ridge, serene and minimal.', layout: 'full-bleed' },
      ],
    },
    pages: [
      {
        pageNumber: 1,
        chapterIndex: 1,
        title: 'Title Page',
        pageType: 'cover',
        layout: 'full-bleed',
        blocks: [
          { id: 'mm-1', type: 'heading', level: 1, text: 'The Mindful Morning' },
          { id: 'mm-2', type: 'paragraph', text: 'By Eliza Reed • 21 Days to Intentional Living' },
        ],
      },
      {
        pageNumber: 2,
        chapterIndex: 1,
        title: 'The Architecture of Dawn',
        pageType: 'chapter_header',
        layout: 'standard',
        blocks: [
          { id: 'mm-3', type: 'heading', level: 1, text: 'Part I: The Architecture of Dawn' },
          { id: 'mm-4', type: 'paragraph', text: 'How you meet the dawn determines how you inhabit the rest of the day. In the stillness before notifications arrive, your nervous system is open, malleable, and waiting for an anchor.' },
        ],
      },
      {
        pageNumber: 3,
        chapterIndex: 1,
        title: 'Three Principles of Gentle Awakening',
        pageType: 'content',
        layout: 'standard',
        blocks: [
          { id: 'mm-5', type: 'heading', level: 2, text: 'The Core Tenet' },
          { id: 'mm-6', type: 'quote', text: '“Do not consume someone else’s urgency before you have honored your own stillness.”' },
          {
            id: 'mm-7',
            type: 'list',
            items: [
              'Natural Light Priming: 5 to 10 minutes of direct morning sunlight to signal dopamine release.',
              'Cellular Hydration: Warm mineral water with sea salt and lemon before caffeine.',
              'Unmediated Thought: Keeping the phone in another room until your primary intention is set.',
            ],
          },
        ],
      },
    ],
  };
}

export function getFlavoursOfHomeDemoBook(): BookDocument {
  return {
    schemaVersion: 1,
    id: 'flavours-home',
    userId: 'public-demo-user',
    title: 'Flavours of Home',
    subtitle: 'Mediterranean Recipes for Comforting Meals',
    bookType: 'recipe',
    language: 'English',
    style: 'Artisanal Culinary',
    pageCount: 72,
    coverUrl: '/images/cover-flavours-home.jpg',
    versionNumber: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blueprint: {
      title: 'Flavours of Home',
      subtitle: 'Mediterranean Recipes for Comforting Meals',
      bookType: 'recipe',
      audience: 'Home Cooks & Food Lovers',
      language: 'English',
      style: 'Warm Linen & Ceramic Photography',
      pageTarget: 72,
      chapters: [
        { index: 1, title: 'The Olive Grove Pantry', summary: 'Extra virgin olive oils, wild oregano, flaky salt, and crusty sourdough.', allocatedPages: 18 },
        { index: 2, title: 'Sun-Drenched Garden Starters', summary: 'Roasted peppers, whipped feta, marinated olives, and warm focaccia.', allocatedPages: 18 },
        { index: 3, title: 'Slow-Simmered Hearth Mains', summary: 'Orecchiette with blistered cherry tomatoes, braised sea bass, and lemon chicken.', allocatedPages: 18 },
        { index: 4, title: 'Sweet Fig & Almond Evenings', summary: 'Honey cakes, roasted figs with thyme, and espresso.', allocatedPages: 18 },
      ],
      visualPlan: [],
    },
    pages: [
      {
        pageNumber: 1,
        chapterIndex: 1,
        title: 'Title Page',
        pageType: 'cover',
        layout: 'full-bleed',
        blocks: [
          { id: 'fh-1', type: 'heading', level: 1, text: 'Flavours of Home' },
          { id: 'fh-2', type: 'paragraph', text: 'By Elena Pappas • Heritage Recipes for the Modern Table' },
        ],
      },
      {
        pageNumber: 2,
        chapterIndex: 1,
        title: 'Blistered Tomato & Ricotta Orecchiette',
        pageType: 'content',
        layout: 'standard',
        blocks: [
          { id: 'fh-3', type: 'heading', level: 1, text: 'Orecchiette with Blistered Summer Tomatoes' },
          { id: 'fh-4', type: 'paragraph', text: 'Preparation Time: 15 mins • Cooking Time: 20 mins • Servings: 4' },
          {
            id: 'fh-5',
            type: 'list',
            items: [
              '400g Artisanal dried orecchiette pasta',
              '500g Sweet cherry tomatoes on the vine',
              '4 cloves Garlic, thinly shaved',
              '1/3 cup First cold-pressed extra virgin olive oil',
              '200g Fresh sheep’s milk ricotta or aged feta',
              'Handful fresh basil leaves, torn',
            ],
          },
          { id: 'fh-6', type: 'paragraph', text: 'Heat oil in a wide cast iron skillet until shimmering. Drop the garlic and tomatoes together, allowing the skins to blister and burst into fragrant sweet juices...' },
        ],
      },
    ],
  };
}

export function getSilentPathDemoBook(): BookDocument {
  return {
    schemaVersion: 1,
    id: 'silent-path',
    userId: 'public-demo-user',
    title: 'The Silent Path',
    subtitle: 'A Novel of Memory, Mist, and Mountain Solitude',
    bookType: 'novel',
    language: 'English',
    style: 'Classic Literary',
    pageCount: 320,
    coverUrl: '/images/cover-silent-path.jpg',
    versionNumber: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blueprint: {
      title: 'The Silent Path',
      subtitle: 'A Novel of Memory, Mist, and Mountain Solitude',
      bookType: 'novel',
      audience: 'Literary Fiction Readers',
      language: 'English',
      style: 'Atmospheric Northern Gothic',
      pageTarget: 320,
      chapters: [
        { index: 1, title: 'The Bell of St. Jude', summary: 'An old postman arrives at an abandoned alpine observatory.', allocatedPages: 80 },
        { index: 2, title: 'Frost on the Barometer', summary: 'Deciphering handwritten weather journals from the winter of 1924.', allocatedPages: 80 },
        { index: 3, title: 'The Echo Across the Pass', summary: 'A single lantern moving through the midnight blizzard.', allocatedPages: 80 },
        { index: 4, title: 'Return of the Thaw', summary: 'Discovering what was buried beneath sixty feet of silence.', allocatedPages: 80 },
      ],
      visualPlan: [],
    },
    pages: [
      {
        pageNumber: 1,
        chapterIndex: 1,
        title: 'Title Page',
        pageType: 'cover',
        layout: 'full-bleed',
        blocks: [
          { id: 'sp-1', type: 'heading', level: 1, text: 'The Silent Path' },
          { id: 'sp-2', type: 'paragraph', text: 'A Novel by Clara Vance • Harper Collins Edition' },
        ],
      },
      {
        pageNumber: 2,
        chapterIndex: 1,
        title: 'Chapter 1: The Bell of St. Jude',
        pageType: 'chapter_header',
        layout: 'standard',
        blocks: [
          { id: 'sp-3', type: 'heading', level: 1, text: 'Chapter 1: The Bell of St. Jude' },
          { id: 'sp-4', type: 'paragraph', text: 'The road ended where the pine trees turned grey with lichen. Beyond that lay only the scree slopes of Monte Corvo and the low, unrelenting hum of wind shearing against quartzite.' },
          { id: 'sp-5', type: 'paragraph', text: 'Julian pulled the collar of his wool greatcoat up against the salt mist. In his leather rucksack rested three letters that had taken forty years to arrive.' },
        ],
      },
    ],
  };
}

export function getDemoBook(slug: string): BookDocument | null {
  const normalized = slug.toLowerCase().replace(/^(demo-)/, '');
  if (normalized === 'ocean-wonders') return getOceanWondersDemoBook();
  if (normalized === 'star-explorer' || normalized === 'the-little-star-explorer') return getStarExplorerDemoBook();
  if (normalized === 'mindful-morning' || normalized === 'the-mindful-morning') return getMindfulMorningDemoBook();
  if (normalized === 'flavours-home' || normalized === 'flavours-of-home') return getFlavoursOfHomeDemoBook();
  if (normalized === 'silent-path' || normalized === 'the-silent-path') return getSilentPathDemoBook();
  return null;
}

export function getOceanWondersDemoBook(): BookDocument {
  return {
    schemaVersion: 1,
    id: 'demo-ocean-wonders',
    userId: 'public-demo-user',
    title: 'Ocean Wonders',
    subtitle: 'An Underwater Journey Through Coral Reefs & Deep Blue Mysteries',
    bookType: 'children',
    language: 'English',
    style: 'Storybook Illustration',
    pageCount: 16,
    coverUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    versionNumber: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blueprint: {
      title: 'Ocean Wonders',
      subtitle: 'An Underwater Journey Through Coral Reefs & Deep Blue Mysteries',
      bookType: 'children',
      audience: 'Children & Family Readers',
      language: 'English',
      style: 'Storybook Illustration',
      pageTarget: 16,
      chapters: [
        { index: 1, title: 'The Sunlit Shallows', summary: 'Meeting Barnaby the sea turtle in Sapphire Bay.', allocatedPages: 4 },
        { index: 2, title: 'The Coral Kingdom', summary: 'Exploring vibrant anemones, brain corals, and clownfish.', allocatedPages: 4 },
        { index: 3, title: 'Secrets of the Trench', summary: 'Bioluminescent wonders in the twilight zone.', allocatedPages: 4 },
        { index: 4, title: 'Journey Home with the Current', summary: 'Riding the warm Gulf Stream back to Sapphire Bay.', allocatedPages: 4 },
      ],
      visualPlan: [
        { pageNumber: 1, visualType: 'cover', promptSpec: 'Majestic sea turtle swimming over illuminated coral reef.', layout: 'full-bleed' },
        { pageNumber: 3, visualType: 'illustration', promptSpec: 'Barnaby gliding through sun-dappled turquoise water above the coral reef.', layout: 'image-right' },
        { pageNumber: 7, visualType: 'illustration', promptSpec: 'Neon clownfish dancing among golden anemone tentacles.', layout: 'image-top' },
        { pageNumber: 11, visualType: 'illustration', promptSpec: 'Glowing bioluminescent jellyfish illuminating the indigo deep.', layout: 'image-bottom' },
        { pageNumber: 15, visualType: 'illustration', promptSpec: 'Barnaby riding the warm golden current alongside dolphins at sunset.', layout: 'full-bleed' },
      ],
      characterBible: {
        protagonist: 'Barnaby: A wise, friendly green sea turtle with a moss-tinted shell and bright inquisitive eyes.',
      },
    },
    pages: [
      // -------------------------------------------------------------
      // CHAPTER 1: THE SUNLIT SHALLOWS (Pages 1 - 4)
      // -------------------------------------------------------------
      {
        pageNumber: 1,
        chapterIndex: 1,
        title: 'Title & Cover',
        pageType: 'cover',
        layout: 'full-bleed',
        blocks: [
          { id: 'p1-1', type: 'heading', level: 1, text: 'Ocean Wonders' },
          { id: 'p1-2', type: 'quote', text: '“The sea, once it casts its spell, holds one in its net of wonder forever.”' },
          { id: 'p1-3', type: 'paragraph', text: 'Created with BookGenie Editorial Studio — Complete 16-Page Showcase Book' },
        ],
      },
      {
        pageNumber: 2,
        chapterIndex: 1,
        title: 'Prologue: The Sunlit Shallows',
        pageType: 'chapter_header',
        layout: 'standard',
        blocks: [
          { id: 'p2-1', type: 'heading', level: 1, text: 'Chapter 1: The Sunlit Shallows' },
          {
            id: 'p2-2',
            type: 'paragraph',
            text: 'Just beneath the gentle waves of Sapphire Bay, the morning sun poured through the clear turquoise water like golden ribbons. Here lived Barnaby, a green sea turtle who had seen seventy summers pass over the reef.',
          },
          {
            id: 'p2-3',
            type: 'paragraph',
            text: 'Every sunrise, Barnaby would stretch his flippers, take a deep breath of crisp sea air at the surface, and prepare for another expedition into the secret gardens of the ocean.',
          },
        ],
      },
      {
        pageNumber: 3,
        chapterIndex: 1,
        title: 'The Great Barrier Reef Garden',
        pageType: 'illustrated_content',
        layout: 'image-right',
        blocks: [
          { id: 'p3-1', type: 'heading', level: 2, text: 'The Living City' },
          {
            id: 'p3-2',
            type: 'paragraph',
            text: 'A coral reef is not merely stone or plant—it is a bustling metropolis built by millions of tiny coral polyps over centuries. Brain corals carved winding highways, while purple sea fans swayed gently with the incoming tide.',
          },
          {
            id: 'p3-3',
            type: 'paragraph',
            text: '“Notice how every creature has its home,” Barnaby would say to the curious yellow tangs following in his wake. “From the tiny porcelain crab to the giant manta ray, the sea provides for all who respect its balance.”',
          },
          {
            id: 'p3-img',
            type: 'image',
            caption: 'Barnaby gliding through the sun-dappled turquoise water above the coral reef.',
          },
        ],
      },
      {
        pageNumber: 4,
        chapterIndex: 1,
        title: 'Whispers of the Current',
        pageType: 'content',
        layout: 'standard',
        blocks: [
          { id: 'p4-1', type: 'heading', level: 3, text: 'Ocean Secrets' },
          {
            id: 'p4-2',
            type: 'list',
            items: [
              'Sea turtles can navigate thousands of miles across oceans using Earth’s magnetic field.',
              'Over 25% of all marine life depends on healthy coral reefs for shelter and food.',
              'The oceans generate more than half of the world’s oxygen and absorb vast amounts of carbon.',
            ],
          },
          {
            id: 'p4-3',
            type: 'paragraph',
            text: 'Barnaby knew that tomorrow’s tide would carry him toward the mysterious Coral Kingdom, where creatures wore colours brighter than any rainbow.',
          },
        ],
      },

      // -------------------------------------------------------------
      // CHAPTER 2: THE CORAL KINGDOM (Pages 5 - 8)
      // -------------------------------------------------------------
      {
        pageNumber: 5,
        chapterIndex: 2,
        title: 'The Coral Kingdom Begins',
        pageType: 'chapter_header',
        layout: 'standard',
        blocks: [
          { id: 'p5-1', type: 'heading', level: 1, text: 'Chapter 2: The Coral Kingdom' },
          {
            id: 'p5-2',
            type: 'paragraph',
            text: 'As Barnaby swam past the outer reef wall, the ocean blossomed into an explosion of neon hues. Spagetti corals curled like spirals of pasta, while giant clams flashed emerald and violet mantles to catch the midday sunlight.',
          },
          {
            id: 'p5-3',
            type: 'paragraph',
            text: 'This was the heart of the Coral Kingdom—a sanctuary where baby turtles, seahorses, and reef squid gathered to learn the laws of the tide.',
          },
        ],
      },
      {
        pageNumber: 6,
        chapterIndex: 2,
        title: 'Meeting the Anemone Keepers',
        pageType: 'content',
        layout: 'standard',
        blocks: [
          { id: 'p6-1', type: 'heading', level: 2, text: 'Guardians of the Shallows' },
          {
            id: 'p6-2',
            type: 'paragraph',
            text: 'Pippin, a tiny orange clownfish with white racing stripes, darted out from between the stinging tentacles of a giant sea anemone. To others, the anemone was dangerous, but to Pippin, it was the safest bedroom in the world.',
          },
          {
            id: 'p6-3',
            type: 'quote',
            text: '“We protect the anemone by keeping it clean, and the anemone shields us from the big barracudas!” Pippin chattered cheerfully.',
          },
        ],
      },
      {
        pageNumber: 7,
        chapterIndex: 2,
        title: 'Harmony in the Lagoon',
        pageType: 'illustrated_content',
        layout: 'image-top',
        blocks: [
          { id: 'p7-img', type: 'image', caption: 'Pippin and his school playing among the glowing sea anemone garden.' },
          { id: 'p7-1', type: 'heading', level: 3, text: 'Mutual Friends' },
          {
            id: 'p7-2',
            type: 'paragraph',
            text: 'Barnaby smiled his ancient, mossy smile. In the ocean, cooperation was the greatest survival skill. Even the cleaner shrimp had their own station where mighty groupers waited patiently in line to have their scales polished.',
          },
        ],
      },
      {
        pageNumber: 8,
        chapterIndex: 2,
        title: 'The Great Drop-Off',
        pageType: 'content',
        layout: 'standard',
        blocks: [
          { id: 'p8-1', type: 'heading', level: 2, text: 'Edge of the Blue' },
          {
            id: 'p8-2',
            type: 'paragraph',
            text: 'Ahead lay the Great Drop-Off, where the sandy seabed suddenly vanished into a vertical cliff that plunged thousands of feet into midnight blue. Here, the warm shallows met the cool, whispering currents of the open sea.',
          },
          {
            id: 'p8-3',
            type: 'list',
            items: [
              'Reef walls act like ocean skyscrapers, hosting completely different species on every floor.',
              'Corals feed primarily at night by extending delicate stinging tentacles to capture plankton.',
              'Healthy coral polyps produce natural chemical sunscreens to protect themselves from UV rays.',
            ],
          },
        ],
      },

      // -------------------------------------------------------------
      // CHAPTER 3: SECRETS OF THE TRENCH (Pages 9 - 12)
      // -------------------------------------------------------------
      {
        pageNumber: 9,
        chapterIndex: 3,
        title: 'Descent into the Twilight Zone',
        pageType: 'chapter_header',
        layout: 'standard',
        blocks: [
          { id: 'p9-1', type: 'heading', level: 1, text: 'Chapter 3: Secrets of the Trench' },
          {
            id: 'p9-2',
            type: 'paragraph',
            text: 'Descending beneath two hundred meters, the sunlight faded from sky-blue to deep sapphire, and finally to a velvet twilight. Here the water turned crisp and calm, unaffected by the storms raging far above on the surface.',
          },
          {
            id: 'p9-3',
            type: 'paragraph',
            text: 'Barnaby adjusted his strokes, gliding effortlessly on the descending thermal layer as pinpricks of neon light began to flicker in the dark.',
          },
        ],
      },
      {
        pageNumber: 10,
        chapterIndex: 3,
        title: 'The Living Constellation',
        pageType: 'content',
        layout: 'standard',
        blocks: [
          { id: 'p10-1', type: 'heading', level: 2, text: 'Creatures of Living Light' },
          {
            id: 'p10-2',
            type: 'paragraph',
            text: 'In the deep trench, creatures did not need sunlight—they made their own. Comb jellies pulsed with rainbow neon halos, while lanternfish signaled to one another in secret glowing Morse code.',
          },
          {
            id: 'p10-3',
            type: 'quote',
            text: '“Look closely,” Barnaby murmured into the still water. “Even in the deepest shadows, the sea finds a way to shine.”'
          },
        ],
      },
      {
        pageNumber: 11,
        chapterIndex: 3,
        title: 'Dance of the Crystal Jellies',
        pageType: 'illustrated_content',
        layout: 'image-bottom',
        blocks: [
          { id: 'p11-1', type: 'heading', level: 3, text: 'Bioluminescent Wonder' },
          {
            id: 'p11-2',
            type: 'paragraph',
            text: 'A cluster of crystal siphonophores drifted past, resembling glass chandeliers woven from starlight. Over ninety percent of deep-sea creatures use bioluminescence to camouflage, hunt, or communicate.',
          },
          { id: 'p11-img', type: 'image', caption: 'Bioluminescent jellyfish drifting through the velvet indigo trench.' },
        ],
      },
      {
        pageNumber: 12,
        chapterIndex: 3,
        title: 'Echoes of the Giant Squid',
        pageType: 'content',
        layout: 'standard',
        blocks: [
          { id: 'p12-1', type: 'heading', level: 2, text: 'Wonders of the Deep' },
          {
            id: 'p12-2',
            type: 'list',
            items: [
              'Bioluminescence is created by a chemical reaction between luciferin and oxygen.',
              'The deep sea remains the largest and least explored living habitat on planet Earth.',
              'Creatures in the trench survive pressures exceeding one thousand times atmospheric pressure.',
            ],
          },
          {
            id: 'p12-3',
            type: 'paragraph',
            text: 'Far below, a great shadow moved in the darkness—a legendary colossal squid, sovereign of the trench. Barnaby dipped his head in respectful greeting before angling his flippers toward the rising thermal tide.',
          },
        ],
      },

      // -------------------------------------------------------------
      // CHAPTER 4: JOURNEY HOME WITH THE CURRENT (Pages 13 - 16)
      // -------------------------------------------------------------
      {
        pageNumber: 13,
        chapterIndex: 4,
        title: 'Catching the Great Gulf Stream',
        pageType: 'chapter_header',
        layout: 'standard',
        blocks: [
          { id: 'p13-1', type: 'heading', level: 1, text: 'Chapter 4: Journey Home' },
          {
            id: 'p13-2',
            type: 'paragraph',
            text: 'At the boundary where cold deep water met the warm equator, a great underwater river flowed: the East Oceanic Current. Barnaby knew the path well. By aligning his body with the pulse of the river, he could glide without spending a breath.',
          },
        ],
      },
      {
        pageNumber: 14,
        chapterIndex: 4,
        title: 'Travelers of the Highway',
        pageType: 'content',
        layout: 'standard',
        blocks: [
          { id: 'p14-1', type: 'heading', level: 2, text: 'Companions of the Current' },
          {
            id: 'p14-2',
            type: 'paragraph',
            text: 'He was not alone on the great highway. A pod of spinner dolphins raced alongside, leaping through the waves above and whistling songs that reverberated for miles through the blue corridor.',
          },
          {
            id: 'p14-3',
            type: 'quote',
            text: '“Keep steady with the flow, Barnaby!” whistled the lead dolphin, spiraling playfully into the light.'
          },
        ],
      },
      {
        pageNumber: 15,
        chapterIndex: 4,
        title: 'Sunset over Sapphire Bay',
        pageType: 'illustrated_content',
        layout: 'full-bleed',
        blocks: [
          { id: 'p15-img', type: 'image', caption: 'Barnaby gliding home across Sapphire Bay at golden hour.' },
          { id: 'p15-1', type: 'heading', level: 2, text: 'Return to the Haven' },
          {
            id: 'p15-2',
            type: 'paragraph',
            text: 'As the afternoon waned, the current eased Barnaby back into the sheltered waters of Sapphire Bay. The surface blazed in orange, magenta, and gold as the sun touched the horizon.',
          },
        ],
      },
      {
        pageNumber: 16,
        chapterIndex: 4,
        title: 'Epilogue & Field Notes',
        pageType: 'content',
        layout: 'standard',
        blocks: [
          { id: 'p16-1', type: 'heading', level: 1, text: 'The Living Ocean' },
          {
            id: 'p16-2',
            type: 'paragraph',
            text: 'Barnaby rested his shell on the familiar sandbar under the star-filled tropical sky. Every ripple told a story of the coral kingdom, the twilight trench, and the living current that bound them all together.',
          },
          {
            id: 'p16-3',
            type: 'list',
            items: [
              'Protect our oceans: Keep plastics out of waterways to safeguard sea turtles like Barnaby.',
              'Support reef conservation: Support Marine Protected Areas (MPAs) around the globe.',
              'Share the wonder: Every book published spreads respect for Earth’s living kingdoms.',
            ],
          },
          {
            id: 'p16-4',
            type: 'quote',
            text: 'End of BookGenie Showcase Edition • Generated with BookGenie AI Publishing Studio'
          },
        ],
      },
    ],
  };
}
