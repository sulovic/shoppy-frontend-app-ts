export const USERROLES = [
  { id: 1001, name: "BASE" },
  { id: 3001, name: "POWER" },
  { id: 5001, name: "ADMIN" },
];

export const allowedFileTypes = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  odt: "application/vnd.oasis.opendocument.text",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  mp4: "video/mp4",
};

export const allowedExtensions = Object.keys(allowedFileTypes)
  .map((ext) => `.${ext}`)
  .join(", ");

import businessImg from "../assets/BusinessApss.jpg";

export const Priviledges = {
  //Home
  "/": 1000,

  //Nabavke
  "/nabavke": 3000,
  "/nabavke/proizvodi": 3000,
  "/nabavke/nov-proizvod": 3000,
  "/nabavke/porudzbine": 3000,
  "/nabavke/nova-porudzbina": 3000,
  "/nabavke/pregled": 3000,

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
    image: businessImg,
    desc: "Shoppy Business Apps Home",
    href: "/",
    minRole: Priviledges["/"],
  },
  {
    label: "Slanje računa",
    image: businessImg,
    desc: "Aplikacija za slanje fiskalnih računa putem SMS poruka",
    href: "/racuni",
    minRole: Priviledges["/racuni"],
  },
  {
    label: "Reklamacije",
    image: businessImg,
    desc: "Aplikacija za obradu reklamacija",
    href: "/reklamacije",
    minRole: Priviledges["/reklamacije"],
  },
  {
    label: "Nabavke",
    image: businessImg,
    desc: "Aplikacija za praćenje nabavki",
    href: "/nabavke",
    minRole: Priviledges["/nabavke"],
  },
  {
    label: "Tokovi otpada",
    image: businessImg,
    desc: "Aplikacija za praćenje tokova otpada",
    href: "/otpad",
    minRole: Priviledges["/otpad"],
  },
  {
    label: "Korisnici",
    image: businessImg,
    desc: "Aplikacija za administraciju korisnika",
    href: "/users",
    minRole: Priviledges["/users"],
  },
];

export const ReklamacijeLinks = [
  {
    label: "Prijem reklamacija",
    image: businessImg,
    desc: "Unos, pregled i izmena novih reklamacija",
    href: "/reklamacije/prijem-reklamacija",
    minRole: Priviledges["/reklamacije/prijem-reklamacija"],
  },
  {
    label: "Obrada reklamacija",
    image: businessImg,
    desc: "Pregled, izmena, obrada i rešavanje primljenih reklamacija",
    href: "/reklamacije/obrada-reklamacija",
    minRole: Priviledges["/reklamacije/obrada-reklamacija"],
  },
  {
    label: "Slanje SMS",
    image: businessImg,
    desc: "Slanje SMS poruka o Potvrdi prijema reklamacije i slanje Odgovora na reklamaciju",
    href: "/reklamacije/slanje-sms",
    minRole: Priviledges["/reklamacije/slanje-sms"],
  },
  {
    label: "Delovodnik reklamacija",
    image: businessImg,
    desc: "Delovodnja knjiga primljenih reklamacija",
    href: "/reklamacije/delovodnik",
    minRole: Priviledges["/reklamacije/delovodnik"],
  },
  {
    label: "Administrtator",
    image: businessImg,
    desc: "Administrativni pristup svim unetim reklamacijama",
    href: "/reklamacije/administrator",
    minRole: Priviledges["/reklamacije/administrator"],
  },
];

export const UserLinks = [
  {
    label: "Kontrola tabla",
    image: businessImg,
    desc: "Kontrolna tabla sa listom svih registrovanih korisnika i opcijama za promenu i brisanje",
    href: "/users/dashboard",
    minRole: Priviledges["/users/dashboard"],
  },
  {
    label: "Dodaj korisnika",
    image: businessImg,
    desc: "Dodavanje novih korisnika i određivanje njihovih rola",
    href: "/users/new-user",
    minRole: Priviledges["/users/new-user"],
  },
  {
    label: "Super Admin",
    image: businessImg,
    desc: "Aktiviranje i deaktiviranje Super Admin moda",
    href: "/users/super-admin",
    minRole: Priviledges["/users/super-admin"],
  },
];

export const OtpadLinks = [
  {
    label: "Evidencija JCI",
    image: businessImg,
    desc: "Evidentiranje novih i izmena Jedinstvenih Carinskih Isprava",
    href: "/otpad/evidencija",
    minRole: Priviledges["/otpad/evidencija"],
  },
  {
    label: "Delovodna knjiga",
    image: businessImg,
    desc: "Delovodne knjige tokova otpada po godinama, zemljama i vrstama otpada",
    href: "/otpad/delovodna-knjiga",
    minRole: Priviledges["/otpad/delovodna-knjiga"],
  },
  {
    label: "Proizvodi",
    image: businessImg,
    desc: "Unos, izmene i parametrizacija proizvoda i vrsta otpada",
    href: "/otpad/proizvodi",
    minRole: Priviledges["/otpad/proizvodi"],
  },
  {
    label: "Vrste otpada",
    image: businessImg,
    desc: "Kreiranje novih i izmena postojećih vrsta otpada",
    href: "/otpad/vrste-otpada",
    minRole: Priviledges["/otpad/vrste-otpada"],
  },
];

export const NabavkeLinks = [
  {
    label: "Porudžbine",
    image: businessImg,
    desc: "Pregled, dodavanje i izmena porudžbina",
    href: "/nabavke/porudzbine",
    minRole: Priviledges["/nabavke/porudzbine"],
  },

  {
    label: "Pregled po proizvodima",
    image: businessImg,
    desc: "Pregled porudžbina po proizvodima",
    href: "/nabavke/pregled",
    minRole: Priviledges["/nabavke/pregled"],
  },
  {
    label: "Proizvodi",
    image: businessImg,
    desc: "Pregled, dodavanje i izmena proizvoda",
    href: "/nabavke/proizvodi",
    minRole: Priviledges["/nabavke/proizvodi"],
  },
];
