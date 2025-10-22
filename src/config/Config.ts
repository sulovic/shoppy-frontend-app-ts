export const allowedFileTypes = [
  "application/pdf", // PDF documents
  "image/jpeg", // JPEG images
  "image/jpg", // JPEG images
  "image/png", // PNG images
  "application/msword", // DOC
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "application/vnd.ms-excel", // XLS
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
  "application/vnd.oasis.opendocument.text", // ODT
  "application/vnd.oasis.opendocument.spreadsheet", // ODS
  "video/mp4", // MP4 video files
];
export const allowedExtensions = ".pdf, .jpg, .jpeg, .png, .doc, .docx, .xls, .xslx, .odt, .ods, .mp4";

export const Priviledges = {
  //Home
  "/": 1000,

  //Nabavke
  "/nabavke": 3000,
  "/nabavke/proizvodi": 3000,
  "/nabavke/nov-proizvod": 3000,
  "/nabavke/aktivne-porudzbine": 3000,
  "/nabavke/sve-porudzbine": 3000,
  "/nabavke/nova-porudzbina": 3000,
  "/nabavke/pregled": 3000,

  //Odsustva
  "/odsustva": 1000,
  "/odsustva/evidencija": 1000,
  "/odsustva/resenje-odmor/:id": 1000,
  "/odsustva/stampa": 3000,
  "/odsustva/odobravanje": 3000,
  "/odsustva/dodeljivanje": 3000,
  "/odsustva/novo-dodeljivanje": 3000,
  "/odsustva/administrator": 5000,

  //Otpad
  "/otpad": 1000,
  "/otpad/evidencija": 1000,
  "/otpad/nova-jci": 1000,
  "/otpad/delovodna-knjiga": 1000,
  "/otpad/proizvodi": 3000,
  "/otpad/nov-proizvod": 3000,
  "/otpad/vrste-otpada": 5000,
  "/otpad/nova-vrsta-otpada": 5000,

  //Reklamacije
  "/reklamacije": 1000,
  "/reklamacije/prijem-reklamacija": 1000,
  "/reklamacije/nova-reklamacija": 1000,
  "/reklamacije/obrada-reklamacija": 1000,
  "/reklamacije/slanje-sms": 1000,
  "/reklamacije/delovodnik": 1000,
  "/reklamacije/administrator": 5000,

  //Racuni
  "/racuni": 1000,

  //Users
  "/users": 3000,
  "/users/dashboard": 3000,
  "/users/new-user": 5000,
  "/users/super-admin": 5000,
};

export const AppLinks: AppLink[] = [
  {
    label: "Home",
    image: "../assets/BusinessApss.jpg",
    desc: "Shoppy Business Apps Home",
    href: "/",
    minRole: Priviledges["/"],
  },
  {
    label: "Slanje računa",
    image: "../assets/BusinessApss.jpg",
    desc: "Aplikacija za slanje fiskalnih računa putem SMS poruka",
    href: "/racuni",
    minRole: Priviledges["/racuni"],
  },
  {
    label: "Reklamacije",
    image: "../assets/BusinessApss.jpg",
    desc: "Aplikacija za obradu reklamacija",
    href: "/reklamacije",
    minRole: Priviledges["/reklamacije"],
  },
  {
    label: "Nabavke",
    image: "../assets/BusinessApss.jpg",
    desc: "Aplikacija za praćenje nabavki",
    href: "/nabavke",
    minRole: Priviledges["/nabavke"],
  },
  {
    label: "Odsustva",
    image: "../assets/BusinessApss.jpg",
    desc: "Aplikacija za evidentiranje odsustva",
    href: "/odsustva",
    minRole: Priviledges["/odsustva"],
  },
  {
    label: "Tokovi otpada",
    image: "../assets/BusinessApss.jpg",
    desc: "Aplikacija za praćenje tokova otpada",
    href: "/otpad",
    minRole: Priviledges["/otpad"],
  },
  {
    label: "Korisnici",
    image: "../assets/BusinessApss.jpg",
    desc: "Aplikacija za administraciju korisnika",
    href: "/users",
    minRole: Priviledges["/users"],
  },
];

export const ReklamacijeLinks = [
  {
    label: "Prijem reklamacija",
    image: "../assets/BusinessApss.jpg",
    desc: "Unos, pregled i izmena novih reklamacija",
    href: "/reklamacije/prijem-reklamacija",
    minRole: Priviledges["/reklamacije/prijem-reklamacija"],
  },
  {
    label: "Obrada reklamacija",
    image: "../assets/BusinessApss.jpg",
    desc: "Pregled, izmena, obrada i rešavanje primljenih reklamacija",
    href: "/reklamacije/obrada-reklamacija",
    minRole: Priviledges["/reklamacije/obrada-reklamacija"],
  },
  {
    label: "Slanje SMS",
    image: "../assets/BusinessApss.jpg",
    desc: "Slanje SMS poruka o Potvrdi prijema reklamacije i slanje Odgovora na reklamaciju",
    href: "/reklamacije/slanje-sms",
    minRole: Priviledges["/reklamacije/slanje-sms"],
  },
  {
    label: "Delovodnik reklamacija",
    image: "../assets/BusinessApss.jpg",
    desc: "Delovodnja knjiga primljenih reklamacija",
    href: "/reklamacije/delovodnik",
    minRole: Priviledges["/reklamacije/delovodnik"],
  },
  {
    label: "Administrtator",
    image: "../assets/BusinessApss.jpg",
    desc: "Administrativni pristup svim unetim reklamacijama",
    href: "/reklamacije/administrator",
    minRole: Priviledges["/reklamacije/administrator"],
  },
];

export const UserLinks = [
  {
    label: "Kontrola tabla",
    image: "../assets/BusinessApss.jpg",
    desc: "Kontrolna tabla sa listom svih registrovanih korisnika i opcijama za promenu i brisanje",
    href: "/users/dashboard",
    minRole: Priviledges["/users/dashboard"],
  },
  {
    label: "Dodaj korisnika",
    image: "../assets/BusinessApss.jpg",
    desc: "Dodavanje novih korisnika i određivanje njihovih rola",
    href: "/users/new-user",
    minRole: Priviledges["/users/new-user"],
  },
  {
    label: "Super Admin",
    image: "../assets/BusinessApss.jpg",
    desc: "Aktiviranje i deaktiviranje Super Admin moda",
    href: "/users/super-admin",
    minRole: Priviledges["/users/super-admin"],
  },
];

export const OtpadLinks = [
  {
    label: "Evidencija JCI",
    image: "../assets/BusinessApss.jpg",
    desc: "Evidentiranje novih i izmena Jedinstvenih Carinskih Isprava",
    href: "/otpad/evidencija",
    minRole: Priviledges["/otpad/evidencija"],
  },
  {
    label: "Delovodna knjiga",
    image: "../assets/BusinessApss.jpg",
    desc: "Delovodne knjige tokova otpada po godinama, zemljama i vrstama otpada",
    href: "/otpad/delovodna-knjiga",
    minRole: Priviledges["/otpad/delovodna-knjiga"],
  },
  {
    label: "Proizvodi",
    image: "../assets/BusinessApss.jpg",
    desc: "Unos, izmene i parametrizacija proizvoda i vrsta otpada",
    href: "/otpad/proizvodi",
    minRole: Priviledges["/otpad/proizvodi"],
  },
  {
    label: "Vrste otpada",
    image: "../assets/BusinessApss.jpg",
    desc: "Kreiranje novih i izmena postojećih vrsta otpada",
    href: "/otpad/vrste-otpada",
    minRole: Priviledges["/otpad/vrste-otpada"],
  },
];

export const OdsustvaLinks = [
  {
    label: "Evidencija odsustva",
    image: "../assets/BusinessApss.jpg",
    desc: "Pregled i evidentiranje zahteva za odsustvo",
    href: "/odsustva/evidencija",
    minRole: Priviledges["/odsustva/evidencija"],
  },
  {
    label: "Štampanje rešenja",
    image: "../assets/BusinessApss.jpg",
    desc: "Pregled i štampanje zahteva i rešenja za odsustvo",
    href: "/odsustva/stampa",
    minRole: Priviledges["/odsustva/stampa"],
  },
  {
    label: "Odobravanje odsustva",
    image: "../assets/BusinessApss.jpg",
    desc: "Odobravanje unetih zahteva za odsustvo",
    href: "/odsustva/odobravanje",
    minRole: Priviledges["/odsustva/odobravanje"],
  },
  {
    label: "Dodeljivanje odsustva",
    image: "../assets/BusinessApss.jpg",
    desc: "Dodeljivanje i izmena dodeljenih odsustva",
    href: "/odsustva/dodeljivanje",
    minRole: Priviledges["/odsustva/dodeljivanje"],
  },
  {
    label: "Administrator",
    image: "../assets/BusinessApss.jpg",
    desc: "Odsustva - Administratorski pristup",
    href: "/odsustva/administrator",
    minRole: Priviledges["/odsustva/administrator"],
  },
];

export const NabavkeLinks = [
  {
    label: "Aktivne porudžbine",
    image: "../assets/BusinessApss.jpg",
    desc: "Pregled, dodavanje i izmena aktivnih porudžbina",
    href: "/nabavke/aktivne-porudzbine",
    minRole: Priviledges["/nabavke/aktivne-porudzbine"],
  },
  {
    label: "Sve porudžbine",
    image: "../assets/BusinessApss.jpg",
    desc: "Pregled i izmena svih porudžbina",
    href: "/nabavke/sve-porudzbine",
    minRole: Priviledges["/nabavke/sve-porudzbine"],
  },
  {
    label: "Pregled po proizvodima",
    image: "../assets/BusinessApss.jpg",
    desc: "Pregled porudžbina po proizvodima",
    href: "/nabavke/pregled",
    minRole: Priviledges["/nabavke/pregled"],
  },
  {
    label: "Proizvodi",
    image: "../assets/BusinessApss.jpg",
    desc: "Pregled, dodavanje i izmena proizvoda",
    href: "/nabavke/proizvodi",
    minRole: Priviledges["/nabavke/proizvodi"],
  },
];
