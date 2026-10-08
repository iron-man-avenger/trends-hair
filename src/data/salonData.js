export const SALON_INFO = {
  name: "Trends Hair Studio",
  tagline: "Unisex Hair & Skin Sanctuary",
  taglineSecondary: "Haute Coiffure • Advanced Skin Therapy",
  address: "Sachin Tower, U/15 Akshardhara Complex, Opp. Sachin Tower, 100 Feet Anand Nagar Road, Satellite, Ahmedabad, Gujarat 380015",
  shortAddress: "100 Ft Anand Nagar Rd, Satellite, Ahmedabad",
  phone: "+91 75670 98929",
  cleanPhone: "917567098929",
  hoursText: "10:00 AM – 9:30 PM",
  openHour: 10, // 10:00 AM
  closeHour: 21.5, // 9:30 PM
  rating: 4.9,
  reviewsCount: 480,
  yearsExperience: "10+",
  googleMapsUrl: "https://maps.google.com/?q=Trends+Hair+Studio+Satellite+Ahmedabad",
};

export const STYLISTS = [
  {
    id: "any",
    name: "First Available Stylist",
    role: "Fastest Chair Allocation",
    experience: "Studio Default",
    rating: 4.9,
    avatar: "✂️"
  },
  {
    id: "jay",
    name: "Jay Vaghela",
    role: "Master Hair Artist & Keratin Specialist",
    experience: "10+ Yrs Exp",
    rating: 5.0,
    avatar: "💈"
  },
  {
    id: "riya",
    name: "Riya Patel",
    role: "Senior Colorist & Advanced Skin Therapist",
    experience: "8 Yrs Exp",
    rating: 4.9,
    avatar: "✨"
  }
];

export const SERVICE_CATEGORIES = [
  { id: "all", label: "All Curations" },
  { id: "hair", label: "Cuts & Styling" },
  { id: "chemical", label: "Keratin & Treatments" },
  { id: "skin", label: "Skin & Facials" },
  { id: "grooming", label: "Beard & Grooming" },
  { id: "combos", label: "Luxury Combos" },
];

export const SERVICES = [
  // Hair Cuts & Styling
  {
    id: "cut-men",
    category: "hair",
    name: "Signature Precision Haircut (Men)",
    gender: "Men",
    duration: 30, // mins
    price: 350,
    popular: true,
    description: "Consultation, custom face-profile scissor fade, shampoo wash, and high-hold matte finish styling.",
    badge: "Bestseller"
  },
  {
    id: "cut-women",
    category: "hair",
    name: "Senior Stylist Layer Cut & Blowdry (Women)",
    gender: "Women",
    duration: 50,
    price: 750,
    popular: true,
    description: "Bespoke face-framing feather or step layers tailored to face contours, luxury conditioning, and sleek blowout.",
    badge: "Most Requested"
  },
  {
    id: "cut-kids",
    category: "hair",
    name: "Chic Kids Haircut",
    gender: "Kids",
    duration: 25,
    price: 250,
    description: "Patient, gentle, stylish haircut in a friendly setting with light texturizing.",
  },
  {
    id: "hair-wash-blowdry",
    category: "hair",
    name: "Volume Hair Wash & Glam Blowdry",
    gender: "Women",
    duration: 35,
    price: 450,
    description: "Invigorating scalp cleansing, Kerastase conditioner, and dynamic bouncy volume blast.",
  },
  {
    id: "hair-spa",
    category: "hair",
    name: "Intense Argan Hair Spa & Steam",
    gender: "Unisex",
    duration: 45,
    price: 850,
    description: "Deep restorative hair mask massage, warm ozone steam, and follicle nourishment therapy.",
  },

  // Keratin & Treatments
  {
    id: "keratin-brazilian",
    category: "chemical",
    name: "Brazilian Keratin Ultra-Shine Infusion",
    gender: "Unisex",
    duration: 120, // 2 hours
    price: 3800,
    popular: true,
    description: "Salon signature! 100% frizz-free, mirror-gloss transformation lasting up to 4 months. Deep molecular sealing.",
    badge: "Signature Specialty"
  },
  {
    id: "hair-botox",
    category: "chemical",
    name: "Deep Hair Botox Fiber Regeneration",
    gender: "Unisex",
    duration: 90,
    price: 2900,
    description: "Anti-aging restorative therapy filling porous cuticles with collagen, keratin, and hyaluronic acid.",
  },
  {
    id: "cysteine-smoothing",
    category: "chemical",
    name: "Formaldehyde-Free Cysteine Complex",
    gender: "Unisex",
    duration: 120,
    price: 4200,
    description: "Natural protein smoothing for soft, natural curls management and manageable silkiness.",
  },
  {
    id: "root-touchup",
    category: "chemical",
    name: "Ammonia-Free Root Touch-Up",
    gender: "Unisex",
    duration: 45,
    price: 1100,
    description: "100% grey coverage with organic, low-chemical formula and conditioning seal.",
  },
  {
    id: "balayage-highlights",
    category: "chemical",
    name: "Hand-Painted Balayage / Global Highlights",
    gender: "Women",
    duration: 135,
    price: 3500,
    description: "Sun-kissed, dimensional gradient color customized to your complexion with bond protection.",
  },

  // Beard & Grooming
  {
    id: "beard-sculpt",
    category: "grooming",
    name: "Luxury Beard Sculpting & Razor Edge",
    gender: "Men",
    duration: 25,
    price: 250,
    popular: true,
    description: "Hot towel prep, razor cheek line definition, trimmer taper, and organic cedarwood beard oil massage.",
    badge: "Essential"
  },
  {
    id: "head-massage",
    category: "grooming",
    name: "Royal Acupressure Head & Neck Therapy",
    gender: "Unisex",
    duration: 30,
    price: 450,
    description: "Stress-relieving pressure point scalp massage with warm almond-hibiscus botanical oil infusion.",
  },

  // Skin & Facials
  {
    id: "charcoal-dtan",
    category: "skin",
    name: "O2 Activated Charcoal Detox & D-Tan",
    gender: "Unisex",
    duration: 30,
    price: 550,
    popular: true,
    description: "Instant sun-damage reversal, pollutant extraction, and luminous pore clearing.",
  },
  {
    id: "hydra-glow-facial",
    category: "skin",
    name: "Hydra-Glow Radiance Infusion Facial",
    gender: "Unisex",
    duration: 60,
    price: 1950,
    popular: true,
    description: "Deep ultrasonic pore extraction, hyaluronic acid peptide infusion, and chilled cryogenic globe massage.",
    badge: "Celebrity Glow"
  },
  {
    id: "diamond-cleanup",
    category: "skin",
    name: "Diamond Micro-Derm Clean-Up",
    gender: "Unisex",
    duration: 45,
    price: 1200,
    description: "Gentle dead skin exfoliation, blackhead clearance, and calming cucumber hydration pack.",
  },

  // Combos
  {
    id: "combo-executive",
    category: "combos",
    name: "The Executive Grooming Ritual (Men)",
    gender: "Men",
    duration: 75,
    price: 1350,
    popular: true,
    description: "Signature Precision Cut + Razor Beard Sculpting + Charcoal D-Tan Face + Relaxing Scalp Massage.",
    badge: "Save ₹250"
  },
  {
    id: "combo-glamour",
    category: "combos",
    name: "The Satellite Glamour Transformation (Women)",
    gender: "Women",
    duration: 110,
    price: 2450,
    popular: true,
    description: "Senior Stylist Layer Cut + Intense Hair Spa & Steam + Hydra Clean-Up + Sleek Blowdry.",
    badge: "Save ₹550"
  }
];

// Initial mock state for chair and today's schedule
export const INITIAL_CHAIR_STATUS = {
  isBusy: true,
  currentClient: "Amit Shah",
  currentService: "Signature Precision Cut & Beard Sculpt",
  stylistName: "Jay Vaghela",
  busyUntilMinutes: 22, // Free in 22 mins
  serviceEndTime: "11:45 AM",
};

export const INITIAL_UPCOMING_BOOKINGS = [
  {
    id: "THS-8491",
    customerName: "Pooja Trivedi",
    phone: "98251 77412",
    services: [
      { name: "Senior Stylist Layer Cut & Blowdry (Women)", duration: 50, price: 750 },
      { name: "O2 Activated Charcoal Detox & D-Tan", duration: 30, price: 550 }
    ],
    totalDuration: 80,
    totalPrice: 1300,
    date: "Today",
    time: "12:00 PM",
    stylist: "Riya Patel",
    status: "confirmed", // confirmed | in-chair | completed
    notes: "Special layer cut for family wedding"
  },
  {
    id: "THS-8492",
    customerName: "Harshil Mehta",
    phone: "99740 63820",
    services: [
      { name: "Brazilian Keratin Ultra-Shine Infusion", duration: 120, price: 3800 }
    ],
    totalDuration: 120,
    totalPrice: 3800,
    date: "Today",
    time: "02:00 PM",
    stylist: "Jay Vaghela",
    status: "confirmed",
    notes: "First time Keratin treatment"
  },
  {
    id: "THS-8493",
    customerName: "Neha Choksi",
    phone: "98795 12044",
    services: [
      { name: "Hydra-Glow Radiance Infusion Facial", duration: 60, price: 1950 }
    ],
    totalDuration: 60,
    totalPrice: 1950,
    date: "Today",
    time: "04:30 PM",
    stylist: "Riya Patel",
    status: "confirmed",
    notes: ""
  }
];
