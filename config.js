/* =====================================================================
   WEDDING CONFIGURATION — edit ONLY this file to change the invitation
   ---------------------------------------------------------------------
   • Keep the quotes around every value.
   • Put new photos/video/music into the assets folders and update the
     file names below (paths are relative to index.html).
   • After editing, also update the 4 "SHARE PREVIEW" lines at the top of
     index.html (WhatsApp/Facebook previews can't read this file).
   ===================================================================== */

window.WEDDING = {

  /* ---------- COUPLE ---------- */
  groomName: "Vishnu",           // shown in CAPITALS automatically (first name, like the reference)
  groomFullName: "Vishnu Muralidharan",
  brideName: "Aiswarya",
  brideFullName: "Aiswarya Menon",

  /* ---------- DATE & TIME ---------- */
  // Exact start of the muhurtam, with India time zone (+05:30).
  // The countdown timer counts down to this moment.
  weddingDateTime: "2026-12-23T10:30:00+05:30",

  weddingDay:      "Wednesday, December 23, 2026", // ceremony card line
  shortDate:       "23 December 2026",          // opening screen + hero
  closingDate:     "23 · 12 · 2026",            // closing section
  muhurtam:        "10:30 AM",

  /* ---------- VENUE ---------- */
  venueName:    "Maruthi Hall",
  venueAddress: "Swagath Kalyana Mandapam",
  mapsUrl:      "https://www.google.com/maps/search/?api=1&query=Maruthi+Hall+Swagath+Kalyana+Mandapam",

  /* ---------- FAMILIES ---------- */
  brideFamily: {
    father:  "Mr. Satheesh Menon",
    mother:  "Mrs. Sasibha Menon",
    address: ""   // family address — add when available
  },
  groomFamily: {
    father:  "Mr. Kadengal Muralidharan",
    mother:  "Mrs. Kaithakode Jyothilakshmi Muralidharan",
    address: ""   // family address — add when available
  },

  /* ---------- MEDIA FILES ---------- */
  openingVideo:     "",  // the old video shows the previous couple's names; add the new one here (e.g. "assets/videos/opening-video.mp4")
  coverImage:       "assets/images/video-first-frame.jpg", // first frame of the video; also every section background
  ganeshaImage:     "assets/images/ganesh.jpg",            // square image, shown in a small circle
  backgroundMusic:  "assets/audio/wedding-music.mp3",      // loops; starts on "Open Invitation"

  /* ---------- GALLERY ----------
     Any number of photos. Portrait photos look best.
     "alt" is a short description (for screen readers).            */
  gallery: [
    // add the couple's photos, e.g. { src: "assets/images/gallery/gallery-1.jpg", alt: "Vishnu and Aiswarya" },
  ],

  /* ---------- WORDING (change only if you want different text) ---------- */
  text: {
    openingWelcome:   "Welcome",
    openingSub:       "To the Engagement of",
    openButton:       "Open Invitation",
    skipButton:       "Skip Intro",

    blessing:         "|| Shree Ganeshay Namah ||",
    heroEyebrow:      "Together with their families",
    heroSub:          "Engagement Invitation",
    scrollCue:        "Scroll to Explore",

    ceremonyEyebrow:  "The Auspicious Occasion",
    ceremonyTitle:    "The Engagement Ceremony",
    muhurtamLabel:    "Muhurtam",
    venueLabel:       "Venue",
    viewLocation:     "View Location",

    venueEyebrow:     "Find Your Way",
    venueTitle:       "Venue",

    familyEyebrow:    "With the Blessings of",
    familyTitle:      "Our Families",
    brideFamilyLabel: "Bride's Family",
    groomFamilyLabel: "Groom's Family",

    galleryEyebrow:   "Moments",
    galleryTitle:     "Gallery",
    galleryLede:      "A few frames from the days leading up to the engagement.",

    closingMessage:   "We look forward to celebrating this special occasion with you",

    // Footer credit line. Set to "" to hide it.
    creditText:       "Created by",
    creditLinkText:   "sahilmuhd.com",
    creditLinkUrl:    "https://sahilmuhd.com"
  },

  /* ---------- OPTIONAL SECTIONS ----------
     These exist in the reference design but are switched off there.
     Change false → true to show them.                               */
  showCoupleSection:  false,
  coupleEyebrow:      "With Joy and Gratitude",
  showMessageSection: false,
  messageText:        "Your gracious presence and blessings will make this joyous occasion truly memorable."
};
