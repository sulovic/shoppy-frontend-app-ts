const smsTextGenerator = (racun: UploadFRResult | FiscalReceipt) => {
  let smsText: string;
  switch (racun.country) {
    case "CRNA_GORA":
      smsText = `Pošiljka ${racun.shipmentNumber} za ${racun.nameSurname} je poslata Fiskalni račun preuzmite ovde: racuni.shoppy.rs/${racun.receiptNumber} Uslovi kupovine: shoppy-online.me/uslovimne Hvala što kupujete na Shoppy!`;
      break;
    case "SRBIJA":
      smsText = `Porudžbina za ${racun.nameSurname} je poslata. Link za praćenje pošiljke: www.dexpress.rs/rs/pracenje-posiljaka/${racun.shipmentNumber}  Fiskalni račun preuzmite ovde: racuni.shoppy.rs/${racun.receiptNumber} Uslovi kupovine: shoppy.rs/uslovi Hvala što kupujete na Shoppy!`;
      break;
    default:
      smsText = "";
  }
  return smsText;
};

export default smsTextGenerator;
