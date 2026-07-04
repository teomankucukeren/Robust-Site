// works-vitrin.jsx — Selected works as a scroll-driven rotating funnel
const { useState, useEffect, useRef } = React;

// Canonical project list — single source of truth, shared with the Works archive page.
// Order matches the studio's upload order. Details pulled from each film's Vimeo description.
const FEATURED_WORKS = [
{
  id: 1, title: '23 Nisan Bayram Filmi', client: 'T-ONE BY KALE', type: 'Commercial Film', year: '2026',
  cat: 'PRODUCTION', production: 'Robust', agency: 'WeRabbit', director: 'Sinan Akpınar',
  desc: 'A 23 Nisan holiday film for T-One by Kale — produced by Robust Film with agency WeRabbit and directed by Sinan Akpınar.',
  color: '#110500', vimeoId: '1193081066',
  cover: 'https://i.vimeocdn.com/video/2158687619-6f4c57bff1109d32095d1d573de5e0f3222c6ac3baae42bdf7a4477309bf21ed-d_1280x720?region=us'
},
{
  id: 2, title: 'Patterns of Possibilities', client: 'CANDAŞ ŞİŞMAN', type: 'Installation Film', year: '2022',
  cat: 'PRODUCTION', production: 'Robust', role: 'Video Documentation',
  desc: 'Video documentation of a generative installation — LED display, construction, sound and light woven into a 224 × 224 cm living surface.',
  color: '#0d0010', vimeoId: '1193074497',
  cover: 'https://i.vimeocdn.com/video/2158688479-c77e089faa045cc11e104d983468efa89337dea6b9af3f4cce0ef1a29ee842fd-d_1280x720?region=us'
},
{
  id: 3, title: 'Liberating Choices', client: 'CANSUXI', type: 'Fashion Film', year: '2021',
  cat: 'PRODUCTION', production: 'Robust', director: 'Teoman Küçükeren', dop: 'Sinan Akpınar',
  desc: 'A fashion film built around freedom, movement and the quiet strength of personal choice — soft elegance against a raw coastal landscape.',
  color: '#00060f', vimeoId: '1193076670',
  cover: 'https://i.vimeocdn.com/video/2158471237-9936aeea51272a3c847e2cf7c8145461af035e5e62c51e3ffc6b64b7f80111b1-d_1280x720?region=us'
},
{
  id: 4, title: 'Stone Horizons Vegas', client: 'KALE', type: '3D Product Film', year: '2026',
  cat: 'ANIMATION', agency: 'WeRabbit', director: 'Sinan Akpınar',
  desc: 'A 3D product film for Kale’s Vegas exhibition — ceramic and porcelain slabs through monumental forms and architectural compositions.',
  color: '#00100a', vimeoId: '1193087002',
  cover: 'https://i.vimeocdn.com/video/2158483530-857cc8b8cee39a6b8ef2a847dc1820d4e60377a9ed8ee2ba7c201bb3efc70a63-d_1280x720?region=us'
},
{
  id: 5, title: 'Designed for Every Space', client: 'İNZERA', type: '3D Animation', year: '2026',
  cat: 'ANIMATION', agency: 'Nova Creative', director: 'Sinan Akpınar',
  desc: 'A 3D animation showing how the product adapts to living and hospitality spaces — architectural visualization, motion design, voiceover and sound design.',
  color: '#0f0800', vimeoId: '1193087798',
  cover: 'https://i.vimeocdn.com/video/2163491163-d6893fc950bb78fd2b1d5e54e839ad05eb8d86b4b8af4e0ec51cb0447cce7e09-d_1280x720?region=us'
},
{
  id: 6, title: 'EVERYTHING Teaser', client: 'NOHLAB', type: 'Teaser Edit', year: '2021',
  cat: 'POST-PRODUCTION', role: 'Video Edit — Teoman Küçükeren',
  desc: 'Teaser edit for Nohlab’s immersive experience EVERYTHING — observing everything as it is and suggesting new possibilities in three parts.',
  color: '#020a10', vimeoId: '1195419528',
  cover: 'https://i.vimeocdn.com/video/2162856955-57c5679f7c3384518d98e1c84b304e0d4e167158cdf659980fd0e0c401cdab60-d_1280x720?region=us'
},
{
  id: 7, title: 'Surface of Taste', client: 'T-ONE BY KALE', type: 'Motion Design', year: '2025',
  cat: 'ANIMATION', agency: 'WeRabbit', director: 'Teoman Küçükeren & Sinan Akpınar', role: 'Animation',
  desc: 'Direction and motion design for T-One by Kale — animation by Robust Film, edit by Caner Demir, sound design by Mert Eren.',
  color: '#100002', vimeoId: '1193295771',
  cover: 'https://i.vimeocdn.com/video/2158732539-752b6a5cc6cc8c165dd829a54cdd9a44d8b27728bb60d385f7b9b5cac623a781-d_1280x720?region=us'
},
{
  id: 8, title: 'Digital Journey', client: 'İGA PASS', type: 'Brand Film', year: '2023',
  cat: 'ANIMATION', production: 'Tridea Creative', director: 'Recep Akar', role: 'VFX & Post Production — Teoman Küçükeren',
  desc: 'A brand film for İGA Pass visualizing a seamless airport journey — live action, UI animation, 3D character integration and VFX-driven digital interactions.',
  color: '#050505', vimeoId: '1193312374',
  cover: 'https://i.vimeocdn.com/video/2158755241-35cbe1f822fc4e5c0b3e06d9d993b413f0f8841c74487e8940f2b31116e30107-d_1280x720?region=us'
},
{
  id: 9, title: 'Dandini', client: '40GECE', type: 'Music Video', year: '2020',
  cat: 'PRODUCTION', production: 'Robust', director: 'Sinan Akpınar & Anıl Basat',
  desc: 'Official music video for 40gece’s Dandini — a dark, atmospheric visual language and a cinematic performance-driven mood.',
  color: '#0c0010', vimeoId: '1196690838',
  cover: 'https://i.vimeocdn.com/video/2162891273-451066eca7b88087b53c442a6b937eabf9ea91ba70f294817d347c557c61cb17-d_1280x720?region=us'
},
{
  id: 10, title: 'Wastetopia', client: 'PINAR AKKURT', type: 'Exhibition Video', year: '2023',
  cat: 'PRODUCTION', production: 'Robust', director: 'Sinan Akpınar & Teoman Küçükeren',
  desc: 'Exhibition video for Wastetopia / Atıklar Diyarı, part of Pınar Akkurt’s solo show “Şeyler / Things” at Vision Art Platform.',
  color: '#000a0f', vimeoId: '1197203918',
  cover: 'https://i.vimeocdn.com/video/2163488829-6e183c95bef951aad5aa9a7146f3b0d0bccfafe683b67761ff5d10d12e093a58-d_1280x720?region=us'
},
{
  id: 11, title: 'Stone Horizons Orlando', client: 'KALE', type: '3D Product Film', year: '2026',
  cat: 'ANIMATION', agency: 'WeRabbit', director: 'Sinan Akpınar', role: '3D Animation & Assets',
  desc: 'A 3D product film for Kale’s Orlando exhibition — ceramic and porcelain slabs explored through monumental forms, architectural compositions and refined, material-focused visuals.',
  color: '#00100a', vimeoId: '1193084329',
  cover: 'https://i.vimeocdn.com/video/2158482335-43ecc2e9131dc12b765f7a99c622dccd9d0f3f8e3fb63a4ff7284a16961e9000-d_1280x720?region=us'
},
{
  id: 12, title: 'Altın Yaka', client: 'BRISA', type: 'Corporate Film', year: '2025',
  cat: 'PRODUCTION', production: 'Robust', agency: 'theWerabbit', director: 'Sinan Akpınar', role: 'DoP: Teoman Küçükeren',
  desc: 'A short corporate film for Brisa centred on Cluster AI, an internal initiative shaped by its employees — team members sharing ideas and a collaborative vision around AI, told with a warm, human-centred documentary approach.',
  color: '#110500', vimeoId: '1195418367',
  cover: 'https://i.vimeocdn.com/video/2161287396-07dd18b6bc73f754c4b2b7f880b0f9c2453338d23138e87b0c6288e3a8077233-d_1280x720?region=us'
},
{
  id: 15, title: 'Doğanay Kvass', client: 'DOĞANAY', type: 'Digital Billboard Film', year: '2026',
  cat: 'ANIMATION', agency: 'Koop', role: 'Animation & Post-Production — Teoman Küçükeren',
  desc: 'A playful product animation for Doğanay Kvass — built around the drink’s bold visual identity, beetroot flavour and energetic campaign language, made for digital billboard format.',
  color: '#100400', vimeoId: '1193325072',
  cover: 'https://i.vimeocdn.com/video/2158768315-06335238bcc43855949c3d8d12e6c9aeca6cc150a76acb6ee328def8adef0410-d_1280x720?region=us'
},
{
  id: 16, title: 'Çağdaş Sanata Yeni Bakış Açıları', client: 'EMBASSY OF ITALY', type: 'Panel Film', year: '2024',
  cat: 'PRODUCTION', production: 'Robust',
  desc: 'A panel film for the Embassy of Italy documenting a contemporary-art event at Venedik Sarayı, Istanbul — the conversation between Devrim Erbil and Alessandro Busci, told with clean visuals, elegant titling and a warm documentary approach.',
  color: '#0d0010', vimeoId: '1193292941',
  cover: 'https://i.vimeocdn.com/video/2158755501-d59eb1bde1dc06260ca97a04920931abdbd6f5118b4de714d8e7b7beb6230ff7-d_1280x720?region=us'
},
{
  id: 17, title: 'Kalesinterflex: Back in Bologna', client: 'KALE', type: 'VFX & Product Film', year: '2024',
  cat: 'ANIMATION', agency: 'WeRabbit', role: 'VFX & Animation — Sinan Akpınar',
  desc: 'A VFX and product film for Kale / Kalesinterflex, placing the brand’s large-format porcelain slabs into the historic cityscape of Bologna — architectural footage, CGI product integration and motion graphics.',
  color: '#0a0d00', vimeoId: '1193273184',
  cover: 'https://i.vimeocdn.com/video/2158705692-5ee02cf60e40264c84b754a7fa81564773af68aaf79865828e0e6b3d254e41d7-d_1280x720?region=us'
},
{
  id: 13, title: 'Van Gogh: An Immersive Journey', client: 'NOHLAB', type: 'Teaser Edit', year: '2023',
  cat: 'POST-PRODUCTION', director: 'Nohlab — Candaş Şişman & Deniz Kader', role: 'Video Edit — Teoman Küçükeren',
  desc: 'Teaser edit for Nohlab’s immersive experience Van Gogh: An Immersive Journey — the artist’s life and work transformed into audiovisual storytelling across four parts, from his subconscious to the confinement window at Saint Rémy.',
  color: '#020a10', vimeoId: '1195419527',
  cover: 'https://i.vimeocdn.com/video/2162859475-b13a35a14af3a34c7632d4c0076d2eb2491e2ae4f879b77602ff6be471fe89a4-d_1280x720?region=us'
},
{
  id: 14, title: 'Karaköy V2', client: 'PINAR AKKURT', type: 'Exhibition Video', year: '2023',
  cat: 'PRODUCTION', director: 'Sinan Akpınar & Teoman Küçükeren', role: 'Video & Documentation',
  desc: 'A video created for Karaköy V2, part of Pınar Akkurt’s solo exhibition “Şeyler / Things” at Vision Art Platform.',
  color: '#000a0f', vimeoId: '1197203919',
  cover: 'https://i.vimeocdn.com/video/2163489643-68f49c17137c95714199ece85b72d3e499020c566165cfeaa303b37da03202f5-d_1280x720?region=us'
},
{
  id: 18, title: 'Bang & Olufsen: Competition Film', client: 'BANG & OLUFSEN', type: '3D Product Animation', year: '2022',
  cat: 'ANIMATION', role: 'Animation: Sinan Akpınar · Post: Robust Film',
  desc: 'A cinematic 3D product animation for a brand competition film — Bang & Olufsen headphones set in a surreal world of floating rocks, dust and soft backlight, framing the product as an object of design, sound and presence.',
  color: '#00060f', vimeoId: '1197215629',
  cover: 'https://i.vimeocdn.com/video/2163903886-43e36db8ea9f7c4bea94ca68a45ffdf331d5b2345d133b20662599e30199c32b-d_1280x720?region=us'
},
{
  id: 19, title: 'Maurer: 1915 Çanakkale Bridge', client: 'MAURER', type: 'Corporate Film', year: '2021',
  cat: 'POST-PRODUCTION', production: 'Tridea Creative', director: 'Recep Akar', role: 'Editing, Motion Graphics & Sound Design — Teoman Küçükeren',
  desc: 'A corporate film for Maurer focused on its MSM Roadway Expansion Joints used on the 1915 Çanakkale Bridge — produced with Tridea Creative Media, with editing, motion graphics and sound design by Robust Film.',
  color: '#0a0600', vimeoId: '1193286757',
  cover: 'https://i.vimeocdn.com/video/2158726941-8a4fc0cb955e365a88738508bfb314abf442f6dfbb863053b406516732c28234-d_1280x720?region=us'
},
{
  id: 20, title: 'Delux Tiny House', client: 'DELUX TINY HOUSE', type: 'CGI Brand Film', year: '2021',
  cat: 'ANIMATION', role: 'CGI, Concept & Creative Direction — Sinan Akpınar',
  desc: 'A fully CGI brand film for Delux Tiny House built around the assembly of a tiny house from start to finish — the modular structure coming together piece by piece in a clean, cinematic, design-focused visual language.',
  color: '#0f0800', vimeoId: '1193327426',
  cover: 'https://i.vimeocdn.com/video/2158777275-35280ec4c728c44985a31576e0a659f761ded9bc4e8aa6ca1af21046623e87e5-d_1280x720?region=us'
},
{
  id: 21, title: 'Sigma DAF', client: 'SIGMA DAF CLARIFIERS', type: 'Corporate Film', year: '2021',
  cat: 'POST-PRODUCTION', production: 'Tridea Creative', director: 'Recep Akar', role: 'Post-Production · Visual Animations & Sound Design — Teoman Küçükeren',
  desc: 'A corporate image film for Sigma DAF Clarifiers presenting industrial wastewater-treatment solutions through live-action footage, aerial shots, 3D technical visuals and motion graphics — produced with Tridea Creative Media, post by Robust Film.',
  color: '#06000a', vimeoId: '1193297807',
  cover: 'https://i.vimeocdn.com/video/2158736675-4d0b9586b2632375cb912e36c8109dac2cadfdf87cd983a7a966bd6dbcc295cb-d_1280x720?region=us'
},
{
  id: 22, title: 'AFC Nuts', client: 'AFC NUTS', type: 'Product Animation', year: '2022',
  cat: 'ANIMATION', role: 'Animation & Post-Production — Sinan Akpınar',
  desc: 'A product animation film for AFC Nuts, presenting the brand’s packaged nuts through a dark, cinematic visual setup.',
  color: '#100002', vimeoId: '1193261756',
  cover: 'https://i.vimeocdn.com/video/2158690679-f5ff612a7c67a5e909237234fa8b74e41a6c86fc04e48b6f93cba0719fb6ce79-d_1280x720?region=us'
},
{
  id: 23, title: 'Uzungöl Metal: Form in Motion', client: 'UZUNGÖL METAL', type: 'CGI Product Film', year: '2022',
  cat: 'ANIMATION', role: 'CGI & Animation — Sinan Akpınar',
  desc: 'A CGI product film for Uzungöl Metal visualising the structure, material detail and transformation logic of a metal sofa mechanism through a polished studio animation.',
  color: '#00100a', vimeoId: '1197212062',
  cover: 'https://i.vimeocdn.com/video/2163906003-6bae890041d851adc3880a18de9eaa63f14fe5ee8c442fd64c432f39f352acd3-d_1280x720?region=us'
},
{
  id: 24, title: 'Çankaya Healthy Streets', client: 'ARUP', type: 'Architectural Film', year: '2021',
  cat: 'POST-PRODUCTION', role: 'Editing & Motion Graphics · 3D: Allza',
  desc: 'An architectural presentation film for the Çankaya Healthy Streets Project (Çankaya Municipality) — a pedestrian-friendly urban design approach told through 3D renders, animated information graphics and editorial storytelling.',
  color: '#020a10', vimeoId: '1193276129',
  cover: 'https://i.vimeocdn.com/video/2158714642-f6b45411db00f38fb668fd43f206d78de898f4a22fd7cbc8bab820893e61c30c-d_1280x720?region=us'
},
{
  id: 25, title: 'Optimus: Smart Living Systems', client: 'OPTIMUS', type: 'Product Film', year: '2025',
  cat: 'ANIMATION', role: 'Animation — Sinan Akpınar',
  desc: 'A product film for Optimus’ modular line of smart control units and their integration into contemporary interiors — clean cinematic close-ups, textured architectural surfaces and a premium visual language.',
  color: '#0f0800', vimeoId: '1197211264',
  cover: 'https://i.vimeocdn.com/video/2163492252-246af1077401859a6c7d873645fb99070564bd8b70fd2ba193d41e21ea30f19b-d_1280x720?region=us'
},
{
  id: 26, title: 'Haf Stone: Surfaces of Luxury', client: 'HAF STONE', type: '3D Animation', year: '2023',
  cat: 'ANIMATION', production: 'Robust', role: '3D Animation · Motion Design · Sound Design — Teoman Küçükeren & Sinan Akpınar',
  desc: 'A 3D animation film for Haf Stone showcasing marble and natural-stone surfaces across luxury interiors, offices, hotels and super yachts.',
  color: '#00100a', vimeoId: '1193079763',
  cover: 'https://i.vimeocdn.com/video/2158475613-b052e2fc26a0b54b8e46601fdbe34f8f7439ad7f9a8d8c8cc303a0b1d235c96d-d_1280x720?region=us'
},
{
  id: 27, title: 'Teknopark İstanbul', client: 'ARUP', type: 'Masterplan Animation', year: '—',
  cat: 'POST-PRODUCTION', role: 'Editing & Motion Graphics · 3D: Allza',
  desc: 'An architectural masterplan animation for Teknopark İstanbul — the campus development roadmap, future growth phases and sustainability-driven planning presented through 3D visualisations, animated infographics and editorial storytelling.',
  color: '#06000a', vimeoId: '1193282741',
  cover: 'https://i.vimeocdn.com/video/2158718330-757be5e245c6d9c19bade12739b54a8d4028cb93a263996d33c2557df732cd3d-d_1280x720?region=us'
},
{
  id: 28, title: 'SGIA: New Terminal Competition', client: 'ARUP', type: 'Competition Film', year: '2019',
  cat: 'POST-PRODUCTION', role: 'Editing & Motion Graphics · Viz: Allza',
  desc: 'A presentation film for the Sabiha Gökçen International Airport new-terminal competition in Istanbul — architectural renders, site-plan animations and route graphics presenting the proposed terminal and its place in the masterplan.',
  color: '#020a10', vimeoId: '374188204',
  cover: 'https://i.vimeocdn.com/video/2158697201-a76ca04e772751098742ec4733bbd310aaaffe7704f7557f6c02a5fb67d77936-d_1280x720?region=us'
},
{
  id: 29, title: 'Paradiso Palms', client: 'Paradiso Palms', type: 'Visual Identity', year: '2023',
  cat: 'DESIGN', kind: 'design', role: 'Brand & Art Direction',
  designer: 'Elif Güney',
  desc: 'Visual identity and art direction for Paradiso Palms — a sun-soaked brand world of flavours, sound and moments, built around an oasis-in-paradise mood.',
  about: 'The visual identity developed for Paradiso Palms brings cocktail culture, good food, and the feeling of social gathering together within a warm and inviting atmosphere. The logo design transforms the palm reference emerging from the glass form into a simple yet memorable mark, reflecting the brand\u2019s playful and relaxed character. The color palette, illustrative details, and graphic system carry the venue\u2019s energy from day to night with a friendly, vibrant, and distinctive visual language. Through a holistic design approach extending across menus, coasters, social media, and printed materials, Paradiso Palms is positioned as a unique experience space where friendships, conversations, cocktails, and flavorful food come together.',
  color: '#0d0d00',
  caseBg: '#efd9c2',
  caseFg: '#221208',
  stacked: true,
  behance: 'https://www.behance.net/gallery/173005037/Paradiso-Palms',
  cover: 'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS1.jpg',
  thumbPos: 'center top',
  gallery: [
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS1.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS2.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS3.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS4.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS5.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS6.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS7.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS8.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS9.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS10.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS11.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS12.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS13.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS14.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/PALMS15.jpg'
  ]
},
{
  id: 30, title: 'İtalyan Kültür Merkezi', client: 'İtalyan Kültür', type: 'Social Media Design', year: '2023',
  cat: 'DESIGN', kind: 'design', role: 'Social Media & Art Direction',
  designer: 'Elif Güney',
  desc: 'Social media design and art direction for the Italian Cultural Centre (İtalyan Kültür Merkezi) — a content system built around cultural events, exhibitions and programming.',
  color: '#0d0d00',
  caseBg: '#ece7dd',
  caseFg: '#141414',
  stacked: true,
  behance: 'https://www.behance.net/gallery/169186759/talyan-Kueltuer-Merkezi-Social-Media',
  cover: 'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/01-IT.jpg',
  thumb: 'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/03-IT.jpg',
  thumbPos: 'center -200px',
  gallery: [
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/01-IT.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/02-IT.jpg',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/03-IT.jpg'
  ]
},
{
  id: 31, title: 'Işık 1885 Lokali', client: 'IŞIK 1885', type: 'Corporate Identity', year: '2022',
  cat: 'DESIGN', kind: 'design', role: 'Identity & Art Direction',
  designer: 'Elif Güney',
  desc: 'Brand identity and art direction for Işık 1885 Lokali — a visual world drawn from the heritage and social spirit of the venue.',
  about: 'Işık 1885 Lokali is a student project for the social facilities of the Işık University. The facility has a meeting room on the upper floor, a restaurant on the entrance floor, and a semi-Olympic swimming pool on the lower floor. I use the grids on the roof and the stairs when designing the logotype. I created a corporate identity by combining 3 different fields in this way.',
  color: '#0d0d00',
  caseBg: '#29288b',
  caseFg: '#ffffff',
  behance: 'https://www.behance.net/gallery/63914625/Isk-1885-Lokali',
  cover: 'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/ISIK2.png',
  gallery: [
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/ISIK1.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/ISIK2.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/ISIK3.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/ISIK4.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/ISIK5.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/ISIK6.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/ISIK7.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/ISIK8.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/ISIK9.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/ISIK10.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/ISIK11.png'
  ]
},
{
  id: 32, title: 'Pepsi × Tokyo 2020', client: 'PEPSI × TOKYO 2020', type: 'Key Visual · Collectible Series', year: '2021',
  cat: 'DESIGN', kind: 'design', role: 'Key Visual & Art Direction',
  designer: 'Elif Güney',
  location: 'Tokyo, Japan',
  discipline: 'Key Visual / Art Direction',
  status: 'Delivered',
  caseBg: 'var(--orange)',
  caseFg: '#050505',
  desc: 'A limited-edition Pepsi × Tokyo 2020 series uniting the spirit of the Olympic Games with the visual heritage of Japanese culture.',
  about: 'Created for Pepsi x Tokyo 2020, this limited-edition series brings the spirit of the Olympic Games together with the rich visual heritage of Japanese culture. Inspired by dragon legends, mythical storytelling, and the contemporary energy of Tokyo, the design language positions each athlete as a hero unlocking their inner strength. The dragon becomes more than a symbol; it acts as an invisible force of focus, courage, speed, and grace, guiding each discipline through its own visual narrative. Combined with Pepsi\u2019s vibrant color palette, dynamic brush strokes, and details rooted in Japanese aesthetics, the series transforms the brand\u2019s \u201cFor the Love of It\u201d spirit into a powerful, collectible, and contemporary Olympic story.',
  color: '#0d0d00',
  behance: 'https://www.behance.net/gallery/139668585/Tokyo-2020-Key-Visual',
  cover: 'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/01.png',
  thumbPos: 'center top',
  gallery: [
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/01.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/02.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/03.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/04.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/05.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/06.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/07.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/08.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/09.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/010.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/011.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/012.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/013.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/014.png',
    'https://cdn.jsdelivr.net/gh/teomankucukeren/Robust-Design-G-rseller@main/015.png'
  ]
}];


// The homepage funnel highlights a curated set — the "Selected Works" — chosen
// explicitly by id (order preserved). The full catalogue (FEATURED_WORKS) is
// reserved for the Works archive.
const SELECTED_IDS = [1, 32, 3, 4, 5, 6, 7, 8, 29, 2];
const SELECTED_WORKS = SELECTED_IDS
  .map((id) => FEATURED_WORKS.find((w) => w.id === id))
  .filter(Boolean);

// Match the mobile breakpoint used across the CSS. On phones the scroll-driven
// 3D ring collapses into a cramped, scroll-hijacking sliver — so below this
// width we render a plain, freely-scrollable vertical stack instead.
function useIsMobile(bp = 760) {
  const q = `(max-width:${bp}px)`;
  const [m, setM] = useState(
    typeof window !== 'undefined' && window.matchMedia(q).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

function WorksVitrin({ setView }) {
  const [overlay, setOverlay] = useState(null);
  const isMobile = useIsMobile(760);
  // Tablet band (761–960px): flat horizontal carousel instead of the 3D funnel.
  const isTablet = useIsTablet();

  let scene;
  if (isMobile) scene = <MobileWorks works={SELECTED_WORKS} onOpen={setOverlay} setView={setView} />;
  else if (isTablet) scene = <TabletWorks works={SELECTED_WORKS} onOpen={setOverlay} setView={setView} />;
  else scene = <WorksFunnel works={SELECTED_WORKS} onOpen={setOverlay} setView={setView} />;

  return (
    <section id="works-vitrin">
      {/* Desktop: rotating 3D funnel. Tablet: horizontal carousel. Mobile: vertical stack. */}
      {scene}

      {overlay && <WorkOverlay work={overlay} onClose={() => setOverlay(null)} onChange={setOverlay} />}
    </section>);

}

// Tablet band: between the phone breakpoint and the desktop funnel.
function useIsTablet() {
  const q = '(min-width:761px) and (max-width:960px)';
  const [m, setM] = useState(
    typeof window !== 'undefined' && window.matchMedia(q).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

/* ── Mobile Selected Works — plain vertical stack, native scroll ────────
   No sticky pin, no scroll hijack: each film is a full-width tappable card
   that opens the same video overlay as the desktop funnel. */
function MobileWorks({ works, onOpen, setView }) {
  const listRef = useRef(null);

  // Gentle scroll parallax on the covers so the stack feels alive while scrolling.
  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const covers = [...root.querySelectorAll('.mwork-cover')];
    if (!covers.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      for (const c of covers) {
        const r = c.parentElement.getBoundingClientRect();
        if (r.bottom < -40 || r.top > vh + 40) continue;
        const t = ((r.top + r.height / 2) - vh / 2) / (vh / 2); // -1 (top) .. 1 (bottom)
        const par = Math.max(-1, Math.min(1, t)) * -14;
        c.style.setProperty('--par', par.toFixed(1) + 'px');
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [works]);

  return (
    <div className="mworks gutter shell">
      <div className="mworks-head">
        <div>
          <Reveal variant="fade">
            <span className="eyebrow">02</span>
          </Reveal>
          <Reveal variant="mask" delay={0.1} style={{ marginTop: '12px' }}>
            <h2 className="display-l"><KineticText text="Selected Works" /></h2>
          </Reveal>
        </div>
        <Reveal variant="fade" delay={0.2}>
          <ViewAllBtn onClick={() => setView('works')} />
        </Reveal>
      </div>

      <div className="mworks-list" ref={listRef}>
        {works.map((w, i) =>
          <Reveal key={w.id} variant="fade" delay={Math.min(i * 0.04, 0.28)}>
            <button className="mwork" onClick={() => onOpen(w)}>
              <div className="mwork-media">
                <div
                  className={`mwork-cover${w.cover ? '' : ' mwork-cover--empty'}`}
                  style={w.cover ? { backgroundImage: `url(${w.cover})` } : undefined}></div>
              </div>
              <div className="mwork-info">
                <span className="mwork-cat">{w.cat}</span>
                <h3 className="mwork-title">{w.title}</h3>
                <p className="mwork-client">{w.client} — {w.type}</p>
              </div>
            </button>
          </Reveal>
        )}
      </div>
    </div>);

}

/* ── Tablet Selected Works — flat horizontal carousel ───────────────────
   Cards sit on one plane and slide left/right on swipe (no 3D depth). The
   active card is centred and full-size; neighbours peek on either side,
   scaled down and dimmed. Tapping the front card opens the video overlay;
   tapping a side card brings it to the front. */
function TabletWorks({ works, onOpen, setView }) {
  const N = works.length;
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef(null);
  const wheelLock = useRef(0);

  const CARD_W = 510;
  const GAP = 24;
  const STEP = CARD_W + GAP;

  // `active` is unbounded so the carousel loops freely in both directions;
  // `am` is its wrapped position into the works array (10th sits left of 1st).
  const am = ((active % N) + N) % N;

  const onDown = (e) => {
    const cardEl = e.target.closest('.tw-card');
    const pd = cardEl ? parseInt(cardEl.dataset.d, 10) : null;
    startRef.current = { x: e.clientX, moved: false, d: pd };
    setDragging(true);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
  };
  const onMove = (e) => {
    const s = startRef.current; if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 5) s.moved = true;
    setDrag(dx);
  };
  const onUp = () => {
    const s = startRef.current; if (!s) return;
    const dx = drag;
    if (!s.moved) {
      // a tap, not a swipe: open the front card, or bring a side card forward
      if (s.d === 0) onOpen(works[am]);
      else if (s.d != null) setActive(active + s.d);
      setDrag(0);
      setDragging(false);
      startRef.current = null;
      return;
    }
    let na = active;
    if (dx < -STEP * 0.22) na = active + 1;
    else if (dx > STEP * 0.22) na = active - 1;
    setActive(na);
    setDrag(0);
    setDragging(false);
    startRef.current = null;
  };
  const onWheel = (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // let vertical scroll pass
    e.preventDefault();
    const now = Date.now();
    if (now < wheelLock.current) return;
    if (e.deltaX > 8) { setActive((a) => a + 1); wheelLock.current = now + 380; }
    else if (e.deltaX < -8) { setActive((a) => a - 1); wheelLock.current = now + 380; }
  };

  const cardClick = (i, d) => {
    if (startRef.current && startRef.current.moved) return; // was a swipe, not a tap
    if (d === 0) onOpen(works[i]);
    else setActive(active + d);
  };

  const w = works[am] || works[0];

  return (
    <div className="fn-track" style={{ height: '100vh' }}>
      <div className="fn-sticky">

        <div className="gutter shell vitrin-head fn-head">
          <div>
            <Reveal variant="fade">
              <span className="eyebrow">02</span>
            </Reveal>
            <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
              <h2 className="display-l"><KineticText text="Selected Works" /></h2>
            </Reveal>
          </div>
          <Reveal variant="fade" delay={0.25}>
            <ViewAllBtn onClick={() => setView('works')} />
          </Reveal>
        </div>

        <div className="fn-stage gutter">

          <div className="fn-text">
            <div className="fn-text-inner">
              <span style={{
                fontFamily: "'Space Mono', monospace", color: 'var(--orange)',
                fontSize: '11px', letterSpacing: '0.26em', textTransform: 'uppercase'
              }}>{w.cat}</span>
              <h3 className="display-m" style={{ marginTop: '16px' }}>{w.title}</h3>
              <p className="wc-client" style={{ marginTop: '12px' }}>{w.client} — {w.type}</p>
              <p className="body-text" style={{ marginTop: '22px', maxWidth: '400px', lineHeight: 1.7 }}>{w.desc}</p>
            </div>
            <div className="fn-meter">
              <span className="mono-note" style={{ color: 'var(--orange)' }}>{String(am + 1).padStart(2, '0')}</span>
              <div className="fn-bar"><div className="fn-bar-fill" style={{ transform: `scaleX(${N > 1 ? am / (N - 1) : 0})` }}></div></div>
              <span className="mono-note">{String(N).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="fn-scene">
            <div
              className="tw-viewport"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onWheel={onWheel}>
              {works.map((wk, i) => {
                let d = i - am;
                if (d > N / 2) d -= N;       // wrap to the shortest way round
                if (d < -N / 2) d += N;
                if (Math.abs(d) > 2) return null; // cull off-screen cards
                const x = d * STEP + drag;
                const front = d === 0;
                return (
                  <div
                    key={wk.id}
                    data-d={d}
                    className={`tw-card${front ? ' is-front rb-playable' : ''}`}
                    style={{
                      width: CARD_W + 'px',
                      transform: `translate(calc(-50% + ${x}px), -50%) scale(${front ? 1 : 0.82})`,
                      opacity: front ? 1 : 0.4,
                      zIndex: 10 - Math.abs(d),
                      transition: dragging ? 'none' : 'transform 0.5s var(--ease), opacity 0.5s ease'
                    }}>
                    {wk.cover &&
                      <div className="tw-cover" style={{ backgroundImage: `url(${wk.cover})` }}></div>}
                  </div>);
              })}
            </div>
          </div>

        </div>
      </div>
    </div>);

}

/* ── Scroll-driven 3D funnel ─────────────────────────────── */

function WorksFunnel({ works, onOpen, setView }) {
  const N = works.length;
  const trackRef = useRef(null);
  const sceneRef = useRef(null);
  const cardRefs = useRef([]);
  const barRef = useRef(null);
  const hovRef = useRef(-1);
  // Wheel/touch-driven rotation progress (0..1). Replaces the old tall-track
  // native-scroll model so the user can leave the frame and scroll on.
  const tarRef = useRef(0);
  const hovAmts = useRef(works.map(() => 0));
  const activeRef = useRef(0);
  // Horizontal squeeze of the ring — calibrated so the rightmost card corner
  // lands exactly on the right alignment column (mirror of --align-x).
  const sqRef = useRef(1);
  const [active, setActive] = useState(0);
  const [hovIdx, setHovIdx] = useState(-1);

  // Text crossfade: fade out current, then swap to active and fade back in
  const [shown, setShown] = useState(0);
  const [textVis, setTextVis] = useState(true);
  useEffect(() => {
    if (active === shown) return;
    setTextVis(false);
    const t = setTimeout(() => {setShown(active);setTextVis(true);}, 260);
    return () => clearTimeout(t);
  }, [active, shown]);

  useEffect(() => {hovRef.current = hovIdx;}, [hovIdx]);

  useEffect(() => {
    let raf,pAnim = 0;
    const loop = () => {
      const track = trackRef.current;
      if (track) {
        const target = tarRef.current;
        // During a nav-driven instant jump, snap straight to target so the
        // funnel doesn't visibly rotate through every card to catch up.
        if (window.__rbFunnelSnapUntil && performance.now() < window.__rbFunnelSnapUntil) {
          pAnim = target;
        } else {
          pAnim += (target - pAnim) * 0.085;
        }

        const af = pAnim * (N - 1);
        const idx = Math.max(0, Math.min(N - 1, Math.round(af)));
        if (idx !== activeRef.current) {activeRef.current = idx;setActive(idx);}

        const cw = cardRefs.current[0] && cardRefs.current[0].offsetWidth || 600;
        const R = cw * 0.98; // wider ring — more breathing room between cards

        works.forEach((w, i) => {
          const el = cardRefs.current[i];if (!el) return;
          const rad = (i - af) * (Math.PI * 2) / N;
          const cos = Math.cos(rad),sin = Math.sin(rad);
          const depth = (cos + 1) / 2; // 1 = front, 0 = back
          const ha = hovAmts.current[i] +=
          ((hovRef.current === i ? 1 : 0) - hovAmts.current[i]) * 0.1;

          const x = sin * R * sqRef.current;
          const z = (cos - 1) * R; // deeper recession — real perspective depth
          const y = (1 - cos) * -R * 0.17; // funnel rises toward the back
          const ry = -sin * 36;
          // Relative growth: a tight focus curve around the front slot —
          // only the centered card is full-size; neighbours drop to ~40%
          // and far cards rest near ~28%. Use the WRAPPED angle (−π..π) so the
          // Gaussian is symmetric: card 9 at −36° must get the same boost as
          // card 1 at +36° (its raw `rad` is ~5.65, which the Gaussian would
          // otherwise read as "far" and shrink — splaying the right side
          // forward while the left collapsed).
          const radW = Math.atan2(sin, cos);
          const sc = 0.28 + 0.72 * Math.exp(-Math.pow(radW / 0.5, 2)) + ha * 0.04 * depth;

          el.style.transform =
          `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) ` +
          `rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
          el.style.opacity = (0.08 + 0.92 * Math.pow(depth, 1.7)).toFixed(3);
          el.style.zIndex = String(100 + Math.round(depth * 1000));
          // Depth of field: cards soften and dim as they recede, snap into
          // focus as they rotate to the front (hover clears both)
          const dim = 0.4 + 0.6 * depth;
          const br = dim + ha * (1 - dim);
          const bl = Math.pow(1 - depth, 1.4) * 10 * (1 - ha);
          el.style.filter = `brightness(${br.toFixed(3)}) blur(${bl.toFixed(2)}px)`;
          // Color focus: thumbnails regain their true colors as they approach
          // the center (and instantly on hover); tinted orange while far out
          const focus = Math.max(ha, Math.pow(Math.max(0, (depth - 0.55) / 0.45), 2));
          el.style.setProperty('--tint', (1 - focus).toFixed(3));
        });

        if (barRef.current) barRef.current.style.transform = `scaleX(${pAnim.toFixed(4)})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Calibrate the horizontal squeeze so the ring's furthest-right reach lands
  // on the right alignment edge. The right edge of a card is found by replaying
  // the same transform math (perspective + scale + rotateY) the render loop uses,
  // so it stays correct under perspective foreshortening at any viewport width.
  useEffect(() => {
    const calibrate = () => {
      const scene = sceneRef.current;
      const card = cardRefs.current[0];
      if (!scene || !card) return;
      const cw = card.offsetWidth || 600;
      const R = cw * 0.98;
      const persp = 1400;
      const off = Math.min(80, Math.max(36, 0.035 * window.innerWidth));
      const sRect = scene.getBoundingClientRect();
      // perspective-origin now sits on the ring axis (scene centre − off), so the
      // ring projects symmetrically. Model the vanishing point at that same spot.
      const originX = sRect.left + sRect.width * 0.5 - off;
      // Resolve --align-x to pixels. For unregistered custom properties
      // getComputedStyle returns the raw calc()/max() STRING, not a length, so
      // parseFloat yields NaN and the old code silently bailed (cards never got
      // squeezed → they stretched to the viewport edge). Measure it instead off
      // a hidden probe whose width is set to the variable.
      const probe = document.createElement('div');
      probe.style.cssText = 'position:absolute;left:0;top:0;height:0;visibility:hidden;pointer-events:none;width:var(--align-x);';
      document.body.appendChild(probe);
      const guideX = probe.getBoundingClientRect().width;
      probe.remove();
      if (!guideX) return;
      // Match the desktop .fn-scene translateX(200px) so the ring shifts rigidly
      // with the scene instead of the calibration squeezing it back to the guide.
      const sceneShift = window.innerWidth > 960 ? 200 : 0;
      const rightGuide = window.innerWidth - guideX + sceneShift;

      // Furthest-right screen edge over a full rotation, for a given squeeze.
      const edge = (sq) => {
        let max = -1e9;
        for (let rad = 0; rad < Math.PI * 2; rad += 0.015) {
          const cos = Math.cos(rad), sin = Math.sin(rad);
          const z = (cos - 1) * R;
          const sc = 0.28 + 0.72 * Math.exp(-Math.pow(rad / 0.5, 2));
          const ry = -sin * 36 * Math.PI / 180;
          const pf = persp / (persp - z); // perspective scale (z ≤ 0)
          const cx = originX + (sin * R * sq) * pf;
          const half = (cw * sc / 2) * Math.abs(Math.cos(ry)) * pf;
          if (cx + half > max) max = cx + half;
        }
        return max;
      };

      // Bisection: shrink the ring until the rightmost corner kisses the edge.
      let lo = 0, hi = 1.4;
      if (edge(hi) <= rightGuide) { sqRef.current = hi; return; }
      for (let k = 0; k < 34; k++) {
        const mid = (lo + hi) / 2;
        if (edge(mid) > rightGuide) hi = mid; else lo = mid;
      }
      sqRef.current = (lo + hi) / 2;
    };

    calibrate();
    const t1 = setTimeout(calibrate, 400);
    const t2 = setTimeout(calibrate, 1400);
    window.addEventListener('resize', calibrate);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener('resize', calibrate); };
  }, []);

  // Wheel / touch hijack — rotation engages ONLY when the cursor is actually
  // over the visuals (the card scene) AND the section is at its anchored
  // position. Anywhere else — over the title, the side margins, or once the
  // section starts leaving the viewport — the page scrolls normally.
  useEffect(() => {
    const STEP = 0.0002;       // wheel delta → progress (matches the old scroll feel)
    const TOUCH_STEP = 0.0004; // touch delta → progress
    const EPS = 1e-4;

    // Is the pointer DIRECTLY over an actual card image right now?
    // (The .fn-scene box is the whole right column — mostly empty space — so
    // testing its bounding rect counted empty area as "over the visuals" and
    // kept hijacking the scroll. Hit-test the real card under the cursor.)
    const overVisuals = (x, y) => {
      const el = document.elementFromPoint(x, y);
      return !!(el && el.closest && el.closest('.fn-card'));
    };

    const onWheel = (e) => {
      const track = trackRef.current; if (!track) return;
      if (!overVisuals(e.clientX, e.clientY)) return; // cursor off the visuals → page scrolls
      const tar = tarRef.current;
      if (e.deltaY > 0 && tar >= 1 - EPS) return; // past the last → release downward
      if (e.deltaY < 0 && tar <= EPS) return;     // before the first → release upward
      // preventDefault freezes scroll; the CSS sticky keeps the visuals pinned,
      // so we never scrollTo (that was what made the page jump up and down).
      e.preventDefault();
      tarRef.current = Math.min(1, Math.max(0, tar + e.deltaY * STEP));
    };

    let touchOn = false, lastY = 0;
    const onTouchStart = (e) => {
      const t = e.touches[0];
      touchOn = overVisuals(t.clientX, t.clientY); // started over the visuals
      lastY = t.clientY;
    };
    const onTouchMove = (e) => {
      if (!touchOn) return;
      const y = e.touches[0].clientY;
      const dy = lastY - y;                    // swipe up → advance
      const tar = tarRef.current;
      if (dy > 0 && tar >= 1 - EPS) return;
      if (dy < 0 && tar <= EPS) return;
      e.preventDefault();
      tarRef.current = Math.min(1, Math.max(0, tar + dy * TOUCH_STEP));
      lastY = y;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  const scrollToWork = (i) => {
    const track = trackRef.current; if (!track) return;
    const want = window.scrollY + track.getBoundingClientRect().top - 72;
    window.scrollTo({ top: want, behavior: 'smooth' });
    tarRef.current = i / (N - 1);
  };

  const w = works[shown];

  return (
    <div ref={trackRef} className="fn-track" style={{ height: '100vh' }}>
      <div className="fn-sticky">

        {/* Pinned section header — stays visible while scrolling the funnel */}
        <div className="gutter shell vitrin-head fn-head">
          <div>
            <Reveal variant="fade">
              <span className="eyebrow">02</span>
            </Reveal>
            <Reveal variant="mask" delay={0.12} style={{ marginTop: '14px' }}>
              <h2 className="display-l"><KineticText text="Selected Works" /></h2>
            </Reveal>
          </div>
          <Reveal variant="fade" delay={0.25}>
            <ViewAllBtn onClick={() => setView('works')} />
          </Reveal>
        </div>

        <div className="fn-stage gutter">

          {/* Active work info */}
          <div className="fn-text">
            <div className={`fn-text-inner${textVis ? '' : ' is-out'}`}>
              <span style={{
                fontFamily: "'Space Mono', monospace", color: 'var(--orange)',
                fontSize: '11px', letterSpacing: '0.26em', textTransform: 'uppercase'
              }}>{w.cat}</span>
              <h3 className="display-m" style={{ marginTop: '16px' }}>{w.title}</h3>
              <p className="wc-client" style={{ marginTop: '12px' }}>{w.client} — {w.type}</p>
              <p className="body-text" style={{ marginTop: '22px', maxWidth: '400px', lineHeight: 1.7 }}>{w.desc}</p>
            </div>

            {/* Meter */}
            <div className="fn-meter">
              <span className="mono-note" style={{ color: 'var(--orange)' }}>{String(shown + 1).padStart(2, '0')}</span>
              <div className="fn-bar"><div ref={barRef} className="fn-bar-fill"></div></div>
              <span className="mono-note">{String(N).padStart(2, '0')}</span>
            </div>
          </div>

          {/* 3D scene */}
          <div className="fn-scene" ref={sceneRef}>
            {works.map((work, i) =>
            <FunnelCard
              key={work.id}
              work={work}
              isFront={i === active}
              isHov={hovIdx === i}
              cardRef={(el) => {cardRefs.current[i] = el;}}
              onEnter={() => setHovIdx(i)}
              onLeave={() => setHovIdx(-1)}
              onClick={() => i === active ? onOpen(work) : scrollToWork(i)} />

            )}
          </div>

        </div>
      </div>
    </div>);

}

function FunnelCard({ work, isFront, isHov, cardRef, onEnter, onLeave, onClick }) {
  return (
    <div
      ref={cardRef}
      className={`fn-card${isFront ? ' rb-playable' : ''}`}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        background: `linear-gradient(135deg, ${work.color} 0%, #080808 100%)`,
        borderColor: isHov ?
        'rgba(var(--orange-rgb), 0.55)' :
        isFront ? 'rgba(var(--orange-rgb), 0.35)' : 'rgba(255,255,255,0.07)',
        boxShadow: isHov ?
        '0 0 18px rgba(var(--orange-rgb), 0.32), 0 0 56px rgba(var(--orange-rgb), 0.16)' :
        isFront ?
        '0 0 14px rgba(var(--orange-rgb), 0.22), 0 0 44px rgba(var(--orange-rgb), 0.1)' :
        'none',
        transition: 'border-color 0.4s ease, box-shadow 0.6s ease',
        cursor: 'none'
      }}>
      
      {work.cover &&
      <div className="fn-cover" style={{
        background: `url(${work.cover}) ${work.thumbPos || 'center'} / cover no-repeat`,
        transform: isHov ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 1.3s cubic-bezier(0.16,1,0.3,1)'
      }}></div>
      }

      {/* Play glyph */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <svg width="76" height="76" viewBox="0 0 120 120" fill="none" style={{
          opacity: work.cover ? isHov ? 0 : 0.55 : isHov ? 0.9 : 0.4,
          transition: 'opacity 0.4s ease'
        }}>
          <circle cx="60" cy="60" r="56" stroke="rgba(var(--orange-rgb), 0.4)" strokeWidth="1"></circle>
          <circle cx="60" cy="60" r="36" stroke="rgba(var(--orange-rgb), 0.2)" strokeWidth="1"></circle>
          <path d="M50 42l32 18-32 18V42z" fill="var(--orange)" opacity="0.85"></path>
        </svg>
      </div>

      {/* Grid lines decor (non-cover cards) */}
      {!work.cover &&
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }} preserveAspectRatio="none">
          {[...Array(8)].map((_, i) =>
        <line key={i} x1={`${(i + 1) * 12.5}%`} y1="0" x2={`${(i + 1) * 12.5}%`} y2="100%" stroke="var(--orange)" strokeWidth="0.5"></line>
        )}
          {[...Array(5)].map((_, i) =>
        <line key={i} x1="0" y1={`${(i + 1) * 16.67}%`} x2="100%" y2={`${(i + 1) * 16.67}%`} stroke="var(--orange)" strokeWidth="0.5"></line>
        )}
        </svg>
      }

      <div style={{
        position: 'absolute', bottom: '16px', right: '20px',
        fontFamily: "'Space Mono'", fontSize: '10px',
        letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)',
        pointerEvents: 'none'
      }}>{work.year}</div>

      {isHov &&
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(var(--orange-rgb), 0.04) 50%, transparent 100%)',
        animation: 'rb-scan 2.4s linear infinite'
      }}></div>
      }
    </div>);

}

function ViewAllBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  const magRef = useMagnetic(0.18);
  return (
    <button ref={magRef} onClick={onClick}
    onMouseEnter={() => setHov(true)}
    onMouseLeave={() => setHov(false)}
    style={{
      background: 'none',
      border: 'none',
      color: hov ? 'var(--orange-hot)' : 'rgba(255,255,255,0.72)',
      fontFamily: "'Space Grotesk'",
      fontSize: '11px',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      padding: 0,
      cursor: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'color 0.35s cubic-bezier(0.16,1,0.3,1)',
      boxShadow: 'none'
    }}>
      <span>View Full Archive</span>
      <span aria-hidden="true" style={{
        display: 'inline-block',
        transform: hov ? 'translateX(3px)' : 'translateX(0)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)'
      }}>⇀</span>
    </button>);

}

function WorkOverlay({ work, onClose, onChange, big, links, list: navList }) {
  const [vis, setVis] = useState(false);
  // True once the current film reaches its end — swaps Vimeo's own end screen
  // ("More from Robust Film", which links out to vimeo.com) for our own.
  const [ended, setEnded] = useState(false);
  const playerRef = useRef(null);
  // Remembers whether the viewer turned sound on, so an auto-advanced next film
  // keeps playing with sound instead of reverting to muted.
  const soundOnRef = useRef(false);
  // Treat tablet (≤960px) like mobile here: the credits stack downward in a
  // grid instead of a single row that runs off the right edge.
  const isMobile = useIsMobile(960);
  const isPhone = useIsMobile(760);
  const vimeoRef = useRef(null);

  // Films should play WITH SOUND. The iframe requests sound autoplay directly;
  // as soon as the player is ready we (re)assert unmuted + playing. Browsers
  // that block sound-autoplay are covered by a one-shot gesture handler: the
  // user's very first interaction (click / key / touch) force-unmutes, so sound
  // kicks in the instant they do anything, with no lingering muted state.
  useEffect(() => {
    setEnded(false); // reset for the newly-opened film
    if (!work.vimeoId || !vimeoRef.current || !window.Vimeo) return;
    let player;
    let done = false;      // one-shot: only unmute once per film
    let disposed = false;  // set in cleanup — never touch a tearing-down player
    const cleanupListeners = () => {
      window.removeEventListener('pointerdown', onGesture, true);
      window.removeEventListener('keydown', onGesture, true);
      window.removeEventListener('touchstart', onGesture, true);
    };
    const unmute = () => {
      if (!player || done || disposed) return;
      done = true;
      soundOnRef.current = true;
      // Just unmute — do NOT force setVolume(1). Forcing volume to max on a
      // gesture is what made the OUTGOING film's sound spike loud the instant
      // you pressed the arrow. Vimeo keeps its own volume level.
      player.setMuted(false).catch(() => {});
      player.play().catch(() => {});
      cleanupListeners();
    };
    const onGesture = (e) => {
      if (disposed) return;
      // Navigation / close keys switch films — they are not a request to
      // unmute the film you're leaving.
      if (e && e.type === 'keydown' &&
          ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Escape'].includes(e.key)) return;
      // Clicks/taps on the prev/next arrows or the close control likewise must
      // never unmute the outgoing film.
      if (e && (e.type === 'pointerdown' || e.type === 'touchstart') &&
          e.target && e.target.closest && e.target.closest('[data-no-unmute]')) return;
      unmute();
    };
    try {
      player = new window.Vimeo.Player(vimeoRef.current);
      playerRef.current = player;
      // Keep it playing as soon as it's ready. If the viewer already had sound
      // on (e.g. this film was auto-advanced into), unmute right away so sound
      // carries over seamlessly; otherwise stay muted until the first gesture.
      player.ready().then(() => {
        if (soundOnRef.current) {
          player.setMuted(false).catch(() => {});
          done = true;
          cleanupListeners();
        }
        player.play().catch(() => {});
      }).catch(() => {});
      // Our own end screen instead of Vimeo's outbound recommendations.
      player.on('ended', () => { if (!disposed) setEnded(true); });
      window.addEventListener('pointerdown', onGesture, true);
      window.addEventListener('keydown', onGesture, true);
      window.addEventListener('touchstart', onGesture, true);
    } catch (e) { /* API unavailable — native autoplay still runs */ }
    return () => {
      disposed = true;
      cleanupListeners();
      if (player === playerRef.current) playerRef.current = null;
      if (player) { try { player.unload(); } catch (e) {} }
    };
  }, [work.id]);

  const replay = () => {
    const p = playerRef.current;
    setEnded(false);
    if (p) {
      p.setCurrentTime(0).then(() => p.play()).catch(() => {});
      if (soundOnRef.current) p.setMuted(false).catch(() => {});
    }
  };

  const list = navList || SELECTED_WORKS;
  const idx = list.findIndex((x) => x.id === work.id);
  const go = (d) => {
    if (!onChange) return;
    onChange(list[(idx + d + list.length) % list.length]);
  };

  useEffect(() => {
    const id = setTimeout(() => setVis(true), 12);
    // Lock BOTH <html> and <body>: body alone leaves <html> scrollable on
    // touch and keeps the 2px orange native scrollbar visible on the right.
    // Setting overflow:hidden on <html> removes the scrollbar and stops any
    // background pan while the film is open.
    const htmlEl = document.documentElement;
    const prevHtmlOverflow = htmlEl.style.overflow;
    htmlEl.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    // Pause the hero background reel while a film is open — otherwise both
    // Vimeo streams pull bandwidth at once and the film buffers slowly.
    if (window.__rbBgReel) { try { window.__rbBgReel.pause(); } catch (e) {} }
    return () => {
      clearTimeout(id);
      htmlEl.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = '';
      if (window.__rbBgReel) { try { window.__rbBgReel.play(); } catch (e) {} }
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [work.id]);

  const close = () => {setVis(false);setTimeout(onClose, 380);};

  // DESIGN works carrying a `gallery` open a full editorial case-study page
  // instead of the video overlay.
  if (work.gallery && work.gallery.length && window.ProjectCase) {
    const PC = window.ProjectCase;
    return <PC work={work} onClose={onClose} onNav={onChange ? go : null} />;
  }

  return (
    <div onClick={close} className="wo-scroll" style={{
      position: 'fixed', inset: 0,
      background: 'rgba(5,5,5,0.97)',
      zIndex: 10000,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      // Center the whole unit (video + credits + arrows). The credit box has a
      // reserved fixed height, so the block's total height is constant across
      // works — centering keeps the film from shifting when you navigate.
      justifyContent: 'center',
      padding: '24px 0',
      boxSizing: 'border-box',
      overflowY: 'auto',
      opacity: vis ? 1 : 0,
      transition: 'opacity 0.38s ease'
    }}>
      <button data-no-unmute onClick={close} style={{
        position: 'absolute',
        top: isMobile ? '46px' : '28px',
        right: isMobile ? 'auto' : 'var(--gutter)',
        left: isMobile ? '50%' : 'auto',
        transform: isMobile ? 'translateX(-50%)' : 'none',
        background: 'none', border: 'none',
        color: '#ffffff',
        fontFamily: "'Space Grotesk'",
        fontSize: '11px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        cursor: 'none',
        transition: 'color 0.3s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--orange)'}
      onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>
        ESC — Close</button>

      {/* Left / right navigation arrows flanking the video — live INSIDE the
         video wrapper so position:absolute anchors correctly */}

      <div onClick={(e) => e.stopPropagation()} style={{
        width: isMobile ? '100%' : (big ? 'min(94vw, 1860px)' : 'min(97vw, 1760px)'),
        /* The reserve below leaves vertical room so the video sits CENTERED with
           equal gaps top/bottom; the info area hangs into the bottom gap (absolute,
           so it never shifts the video up). Reserve ≈ 2× the info height. */
        maxWidth: isMobile ? '100%' : (big
          ? 'calc((100svh - 280px) * 1.7778 + clamp(140px, 14vw, 208px))'
          : 'calc((100svh - 240px) * 1.7778 + clamp(140px, 14vw, 208px))'),
        /* enough horizontal room so the ±88px arrows never clip */
        padding: isMobile ? '0 var(--gutter)' : '0 clamp(70px, 7vw, 104px)',
        boxSizing: 'border-box',
        position: 'relative',
        flexShrink: 0,
        transform: vis ? 'translateY(0) scale(1)' : 'translateY(18px) scale(0.97)',
        transition: 'transform 0.55s cubic-bezier(0.16,1,0.3,1)'
      }}>
        {/* Video box with arrows anchored to its own midpoint */}
        <div style={{ position: 'relative' }}>
          {onChange && !isMobile && <OverlayNavBtn glyph="↼" title="Previous film" side="left" onClick={() => go(-1)} />}
          {onChange && !isMobile && <OverlayNavBtn glyph="⇀" title="Next film" side="right" onClick={() => go(1)} />}
          <div style={{
            aspectRatio: '16/9',
            background: '#060606',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {work.vimeoId ? (
              <iframe
                key={work.vimeoId}
                ref={vimeoRef}
                className="wo-video"
                src={`https://player.vimeo.com/video/${work.vimeoId}?autoplay=1&muted=1&color=ff4500&title=0&byline=0&portrait=0`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen>
              </iframe>
            ) : (
              <DesignShowcase work={work} />
            )}
            {work.vimeoId && ended && (
              <EndScreen
                list={list}
                idx={idx}
                onPick={(w) => onChange && onChange(w)}
                onReplay={replay}
                isMobile={isMobile}
                isPhone={isPhone} />
            )}
          </div>

          {/* Info area. For the showreel (big) it flows normally so the whole
             video + info block is centered as a single unit — the video sits
             higher with just a little space under the links. For regular work
             overlays it stays absolutely anchored below the centered video. */}
          <div style={(big || isMobile) ? { position: 'static' } : { position: 'absolute', top: '100%', left: 0, right: 0 }}>
            <div style={{
              display: isMobile ? 'grid' : 'flex',
              // Desktop: one single row spanning the full video width — the first
              // credit (Project) sits flush left, the last credit sits flush
              // right, the rest distributed evenly between.
              gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : undefined,
              flexWrap: isMobile ? undefined : 'nowrap',
              justifyContent: isMobile ? undefined : 'space-between',
              alignItems: isMobile ? undefined : 'flex-start',
              width: isMobile ? undefined : '100%',
              gap: isMobile ? '14px 18px' : 'clamp(16px, 2vw, 32px)',
              padding: isMobile ? '16px 0 0' : '22px 0 0',
              borderTop: isMobile ? 'none' : '1px solid rgba(255,255,255,0.05)',
              marginTop: isMobile ? '16px' : '1px',
              // Reserve room for the tallest credit set so the nav arrows below
              // sit at a constant position regardless of how many credits a
              // given work has (no jumping between works).
              alignContent: isMobile ? 'start' : undefined,
              minHeight: isMobile ? '212px' : undefined
            }}>
              {/* Canonical, locked credit order — same sequence for every work:
                  facts (Project · Client · Type · Year), then company credits
                  (Production · Agency), then people (Director · DoP · Role).
                  Names always read last. */}
              {[
              { l: 'Project', v: work.title },
              { l: 'Client', v: work.client },
              { l: 'Type', v: work.type },
              { l: 'Year', v: work.year },
              work.production && { l: 'Production', v: work.production },
              work.agency && { l: 'Agency', v: work.agency },
              work.director && { l: 'Director', v: work.director },
              work.dop && { l: 'DoP', v: work.dop },
              work.role && { l: 'Role', v: work.role }].
              filter(Boolean).map(({ l, v }) =>
              <div key={l} style={{ whiteSpace: isMobile ? undefined : 'nowrap' }}>
                  <div style={{ fontFamily: "'Space Grotesk'", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a3a3a', marginBottom: '7px' }}>{l}</div>
                  <div style={{ fontFamily: "'Syne'", fontWeight: 700, fontSize: '15px', color: '#ffffff' }}>{v}</div>
                </div>
              )}
            </div>

            {links && links.length > 0 &&
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 'clamp(14px, 2vw, 32px)',
              justifyContent: 'center',
              padding: '20px 0 0', marginTop: '36px',
              borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
              {links.map((lk) => <OverlayLink key={lk.label} label={lk.label} onClick={lk.onClick} />)}
            </div>
            }
            {isMobile && onChange && !work.gallery &&
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '54px',
              padding: '18px 0 0', marginTop: '18px',
              borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
              <button aria-label="Previous film" className="wo-nav-arrow" onClick={(e) => { e.stopPropagation(); go(-1); }} style={{
                background: 'none', border: 'none', padding: '4px 10px', cursor: 'pointer',
                color: 'var(--orange)', fontSize: '38px', lineHeight: 1, userSelect: 'none'
              }}>↼</button>
              <button aria-label="Next film" className="wo-nav-arrow" onClick={(e) => { e.stopPropagation(); go(1); }} style={{
                background: 'none', border: 'none', padding: '4px 10px', cursor: 'pointer',
                color: 'var(--orange)', fontSize: '38px', lineHeight: 1, userSelect: 'none'
              }}>⇀</button>
            </div>
            }
          </div>
        </div>
      </div>
    </div>);

}

function OverlayLink({ label, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'none', border: 'none', padding: 0,
        display: 'inline-flex', alignItems: 'center', gap: hov ? '14px' : '10px',
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300,
        fontSize: 'clamp(16px, 1.5vw, 22px)',
        letterSpacing: '-0.01em',
        color: hov ? 'var(--orange)' : '#ffffff',
        cursor: 'none',
        transition: 'color 0.3s ease, gap 0.35s cubic-bezier(0.16,1,0.3,1)',
        textShadow: hov ? '0 0 22px rgba(var(--orange-rgb), 0.45)' : 'none'
      }}>
      {label}
      <span style={{ color: 'var(--orange)', fontSize: '0.78em' }}>⇀</span>
    </button>);

}

function EndScreen({ list, idx, onPick, onReplay, isMobile, isPhone }) {
  const len = list.length;
  const next = list[(idx + 1) % len];
  // The upcoming films shown as thumbnails (immediate next first).
  const ups = [];
  for (let k = 1; k <= 3 && k < len; k++) ups.push(list[(idx + k) % len]);

  const DURATION = 10; // seconds before auto-advance
  const [count, setCount] = useState(DURATION);
  const [bar, setBar] = useState(100);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    setBar(100);
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setBar(0)));
    let c = DURATION;
    setCount(c);
    const iv = setInterval(() => { c -= 1; setCount(Math.max(0, c)); }, 1000);
    const to = setTimeout(() => onPick(next), DURATION * 1000 + 120);
    return () => { cancelAnimationFrame(raf); clearInterval(iv); clearTimeout(to); };
  }, [idx, paused]);

  const label = {
    fontFamily: "'Space Grotesk'", fontSize: '10px', letterSpacing: '0.22em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)'
  };

  return (
    <div
      data-no-unmute
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'absolute', inset: 0, zIndex: 5,
        background: '#060606',
        display: 'flex', flexDirection: 'column',
        padding: isMobile ? '18px' : 'clamp(20px, 3vw, 40px)',
        boxSizing: 'border-box',
        animation: 'esFade 0.45s ease both'
      }}>
      <style>{`@keyframes esFade{from{opacity:0}to{opacity:1}}`}</style>

      {/* Header: replay + next-film info moved up here */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px' }}>
        <button
          data-no-unmute
          onClick={(e) => { e.stopPropagation(); onReplay(); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0,
            background: 'none', border: 'none', padding: 0, cursor: 'none',
            fontFamily: "'Space Grotesk'", fontSize: '11px', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#ffffff', transition: 'color 0.25s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--orange)'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}>
          <span style={{ fontSize: '18px', lineHeight: 1 }}>↺</span> Replay
        </button>
        <span style={{ ...label, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span style={{ color: '#ffffff' }}>{next.title}</span>
          <span style={{ color: 'var(--orange)', marginLeft: '12px' }}>{count} sn</span>
        </span>
      </div>

      {/* Auto-advance progress line (depletes right → left) */}
      <div style={{ height: '2px', background: 'rgba(255,255,255,0.14)', overflow: 'hidden', marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          height: '100%', width: bar + '%',
          background: 'var(--orange)',
          transition: paused ? 'none' : `width ${DURATION}s linear`
        }}></div>
      </div>

      {/* Thumbnail grid — hidden on phones, where it can't fit; there we keep
         just the black screen + replay + countdown + next-film name. */}
      {!isPhone && (
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: `repeat(${ups.length}, 1fr)`,
        gap: isMobile ? '10px' : 'clamp(12px, 1.6vw, 22px)',
        alignContent: 'center',
        margin: isMobile ? '14px 0 0' : 'clamp(16px, 2.5vw, 30px) 0 0'
      }}>
        {ups.map((w, i) => (
          <EndThumb key={w.id} work={w} isNext={i === 0} onPick={onPick} />
        ))}
      </div>
      )}
    </div>
  );
}

function EndThumb({ work, isNext, onPick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      data-no-unmute
      onClick={(e) => { e.stopPropagation(); onPick(work); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'block', textAlign: 'left', padding: 0, cursor: 'none',
        background: 'none', border: 'none'
      }}>
      <div style={{
        aspectRatio: '16/9', width: '100%',
        background: work.cover ? `url(${work.cover}) center / cover no-repeat` : '#111',
        position: 'relative', overflow: 'hidden',
        outline: hov || isNext ? '1px solid var(--orange)' : '1px solid rgba(255,255,255,0.12)',
        transition: 'outline-color 0.25s'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: hov ? 'rgba(255,69,0,0.10)' : 'rgba(0,0,0,0.15)',
          transition: 'background 0.3s'
        }}></div>
      </div>
      <div style={{
        marginTop: '13px', fontFamily: "'Space Grotesk'", fontSize: '18px',
        fontWeight: 500, letterSpacing: '0.01em', color: hov ? 'var(--orange)' : '#ffffff',
        transition: 'color 0.25s', whiteSpace: 'nowrap', overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>{work.title}</div>
      {work.client ? <div style={{
        marginTop: '5px', fontFamily: "'Space Grotesk'", fontSize: '15px',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap',
        overflow: 'hidden', textOverflow: 'ellipsis'
      }}>{work.client}</div> : null}
      {work.cat ? <div style={{
        marginTop: '5px', fontFamily: "'Space Grotesk'", fontSize: '15px',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--orange)', whiteSpace: 'nowrap',
        overflow: 'hidden', textOverflow: 'ellipsis'
      }}>{work.cat}</div> : null}
    </button>
  );
}

function OverlayNavBtn({ glyph, title, side, onClick }) {
  const [hov, setHov] = useState(false);
  const out = side === 'left' ? -1 : 1;
  return (
    <button
      data-no-unmute
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={title}
      style={{
        position: 'absolute',
        top: '50%',
        transform: `translateY(-50%) translateX(${hov ? out * 8 : 0}px) scale(${hov ? 1.55 : 1})`,
        [side]: '-88px',
        width: '72px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        padding: 0,
        color: hov ? 'var(--orange)' : 'rgba(255,255,255,0.4)',
        fontSize: '32px',
        lineHeight: 1,
        cursor: 'none',
        transition: 'color 0.25s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1), text-shadow 0.25s ease',
        textShadow: hov
          ? '0 0 22px rgba(var(--orange-rgb), 1), 0 0 60px rgba(var(--orange-rgb), 0.5)'
          : 'none',
        zIndex: 10,
        userSelect: 'none'
      }}>
      {glyph}
    </button>);

}

/* ── Design-project showcase (non-video works) ─────────────
   For DESIGN-category pieces there's no Vimeo film — show the cover
   (or a labelled placeholder) and link out to the full case study. */
function DesignShowcase({ work }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={work.behance || '#'}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none', cursor: 'none', overflow: 'hidden',
        background: work.cover
          ? `#060606`
          : `repeating-linear-gradient(135deg, #0f0f08 0px, #0f0f08 12px, #0b0b06 12px, #0b0b06 24px)`,
      }}>
      {work.cover &&
        <div style={{
          position: 'absolute', inset: 0,
          background: `url(${work.cover}) center / cover no-repeat`,
          transform: hov ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 1.3s cubic-bezier(0.16,1,0.3,1)',
        }}></div>
      }
      {!work.cover &&
        <span style={{
          position: 'absolute', top: '18px', left: '20px',
          fontFamily: "'Space Mono', monospace", fontSize: '11px',
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.32)',
        }}>cover image — drop here</span>
      }
      <span style={{
        position: 'relative', zIndex: 2,
        display: 'inline-flex', alignItems: 'center', gap: hov ? '16px' : '11px',
        fontFamily: "'Syne'", fontWeight: 700,
        fontSize: 'clamp(18px, 2vw, 28px)', letterSpacing: '-0.01em',
        color: hov ? 'var(--orange)' : '#ffffff',
        padding: '14px 24px',
        background: 'rgba(5,5,5,0.55)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid ${hov ? 'rgba(var(--orange-rgb), 0.55)' : 'rgba(255,255,255,0.12)'}`,
        transition: 'color 0.3s ease, gap 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease',
        textShadow: hov ? '0 0 22px rgba(var(--orange-rgb), 0.45)' : 'none',
      }}>
        View on Behance
        <span style={{ color: 'var(--orange)', fontSize: '0.82em' }}>⇀</span>
      </span>
    </a>);
}

Object.assign(window, { WorksVitrin, WorkOverlay, FEATURED_WORKS });