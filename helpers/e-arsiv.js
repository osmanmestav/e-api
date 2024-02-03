const {v1: uuid} = import("uuid");
/*
const fetch = import("isomorphic-fetch");
const numberToText = import("number-to-text");
import("number-to-text/converters/tr");
*/


const ENV = {
    PROD: {
        BASE_URL: "https://earsivportal.efatura.gov.tr"
    },
    TEST: {
        BASE_URL: "https://earsivportaltest.efatura.gov.tr"
    }
};

let CURRENT_ENV = "TEST";

const COMMANDS = {
    createDraftInvoice: ["EARSIV_PORTAL_FATURA_OLUSTUR", "RG_BASITFATURA"],
    getAllInvoicesByDateRange: [
        "EARSIV_PORTAL_TASLAKLARI_GETIR",
        "RG_BASITTASLAKLAR"
    ],
    getAllInvoicesIssuedToMeByDateRange: [
        "EARSIV_PORTAL_ADIMA_KESILEN_BELGELERI_GETIR",
        "RG_BASITTASLAKLAR"
    ],
    signDraftInvoice: [
        "EARSIV_PORTAL_FATURA_HSM_CIHAZI_ILE_IMZALA",
        "RG_BASITTASLAKLAR"
    ],
    signInvoice: [
        "0lhozfib5410mp",
        "RG_SMSONAY"
    ],
    getItiraz: [
        "EARSIV_PORTAL_GELEN_IPTAL_KIRAZ_TALEPLERINI_GETIR",
        "RG_IPTALITIRAZTASLAKLAR"
    ],
    getInvoiceHTML: ["EARSIV_PORTAL_FATURA_GOSTER", "RG_BASITTASLAKLAR"],
    cancelDraftInvoice: ["EARSIV_PORTAL_FATURA_SIL", "RG_BASITTASLAKLAR"],
    getRecipientDataByTaxIDOrTRID: [
        "SICIL_VEYA_MERNISTEN_BILGILERI_GETIR",
        "RG_BASITFATURA"
    ],
    sendSignSMSCode: ["EARSIV_PORTAL_SMSSIFRE_GONDER", "RG_SMSONAY"],
    verifyPhoneNumber: ["EARSIV_PORTAL_TELEFONNO_SORGULA", "RG_BASITTASLAKLAR"],
    verifySMSCode: ["EARSIV_PORTAL_SMSSIFRE_DOGRULA", "RG_SMSONAY"],
    getUserData: ["EARSIV_PORTAL_KULLANICI_BILGILERI_GETIR", "RG_KULLANICI"],
    updateUserData: ["EARSIV_PORTAL_KULLANICI_BILGILERI_KAYDET", "RG_KULLANICI"]

    // TODO:
    // createProducerReceipt: ['EARSIV_PORTAL_MUSTAHSIL_OLUSTUR', 'RG_MUSTAHSIL'],
    // createSelfEmployedInvoice: ['EARSIV_PORTAL_SERBEST_MESLEK_MAKBUZU_OLUSTUR', 'RG_SERBEST'],
};

const DEFAULT_REQUEST_OPTS = {
    credentials: "omit",
    headers: {
        accept: "*/*",
        "accept-language": "tr,en-US;q=0.9,en;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        pragma: "no-cache",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
    },
    referrer: `${ENV[CURRENT_ENV].BASE_URL}/intragiris.html`,
    referrerPolicy: "no-referrer-when-downgrade",
    method: "POST",
    mode: "cors"
};


// E Arşiv Token Generator
const getToken = async (userName, password) => {
    const response = await fetch(
        `${ENV[CURRENT_ENV].BASE_URL}/earsiv-services/assos-login`,
        {
            ...DEFAULT_REQUEST_OPTS,
            referrer: `${ENV[CURRENT_ENV].BASE_URL}/intragiris.html`,
            body: `assoscmd=${
                CURRENT_ENV === "PROD" ? "anologin" : "login"
            }&rtype=json&userid=${userName}&sifre=${password}&sifre2=${password}&parola=1&`
        }
    );
    const json = await response.json();
    const user = await getUserData(json.token);
    return {token: json.token, user: user};
}


// Logout
const logout = async (token) => {
    const response = await fetch(`${ENV[CURRENT_ENV].BASE_URL}/earsiv-services/assos-login`, {
        ...DEFAULT_REQUEST_OPTS,
        referrer: `${ENV[CURRENT_ENV].BASE_URL}/intragiris.html`,
        body: `assoscmd=${CURRENT_ENV === "PROD" ? "anologin" : "logout"}&rtype=json&token=${token}&`
    });
    const json = await response.json();
    return json.data; // send redirect url
}

const apiLogout = async (token) => {
    const response = await fetch(`${ENV[CURRENT_ENV].BASE_URL}/earsiv-services/assos-login`, {
        ...DEFAULT_REQUEST_OPTS,
        referrer: `${ENV[CURRENT_ENV].BASE_URL}/intragiris.html`,
        body: `assoscmd=logout&rtype=json&token=${token}&`
    });
    const json = await response.json();
    return json.data; // send redirect url
}


const runCommand = async (token, command, pageName, data = {}) => {
    const response = await fetch(
        `${ENV[CURRENT_ENV].BASE_URL}/earsiv-services/dispatch`,
        {
            ...DEFAULT_REQUEST_OPTS,
            referrer: `${ENV[CURRENT_ENV].BASE_URL}/login.jsp`,
            body: `cmd=${command}&callid=${uuid}&pageName=${pageName}&token=${token}&jp=${encodeURIComponent(
                JSON.stringify(data || {})
            )}`
        }
    );
    return response.json();
}


const getUserData = async (token) => {
    const user = await runCommand(token, ...COMMANDS.getUserData);
    return {
        taxIDOrTRID: user.data.vknTckn,
        title: user.data.unvan,
        name: user.data.ad,
        surname: user.data.soyad,
        registryNo: user.data.sicilNo,
        mersisNo: user.data.mersisNo,
        taxOffice: user.data.vergiDairesi,
        fullAddress: user.data.cadde,
        buildingName: user.data.apartmanAdi,
        buildingNumber: user.data.apartmanNo,
        doorNumber: user.data.kapiNo,
        town: user.data.kasaba,
        district: user.data.ilce,
        city: user.data.il,
        zipCode: user.data.postaKodu,
        country: user.data.ulke,
        phoneNumber: user.data.telNo,
        faxNumber: user.data.faksNo,
        email: user.data.ePostaAdresi,
        webSite: user.data.webSitesiAdresi,
        businessCenter: user.data.isMerkezi
    };
}


const createDraftInvoice = async (token, invoiceDetails = {}) => {
    try {

        const invoiceData = {
            ...invoiceDetails,
            faturaUuid: uuid(),
            binaAdi: "",
            binaNo: "",
            kapiNo: "",
            kasabaKoy: "",
            websitesi: "",
            bulvarcaddesokak: "",
            irsaliyeNumarasi: "",
            irsaliyeTarihi: "",
            postaKodu: "",
            fax: "",
            iadeTable: invoiceDetails.iadeTable || [],
            vergiCesidi: invoiceDetails.vergiCesidi || " ",
            tip: invoiceDetails.tip || "İskonto",
            not: invoiceDetails.not || "",
            belgeNumarasi: invoiceDetails.belgeNumarasi || "",
            siparisNumarasi: invoiceDetails.siparisNumarasi || "",
            siparisTarihi: invoiceDetails.siparisTarihi || "",
            fisNo: invoiceDetails.fisNo || "",
            fisTarihi: invoiceDetails.fisTarihi || "",
            fisSaati: invoiceDetails.fisSaati || "",
            fisTipi: invoiceDetails.fisTipi || "",
            zRaporNo: invoiceDetails.zRaporNo || "",
            okcSeriNo: invoiceDetails.okcSeriNo || ""
        };
        const newData = {
            "faturaUuid": uuid,
            "belgeNumarasi": "",
            "faturaTarihi": "19/10/2023",
            "saat": "00:22:29",
            "paraBirimi": "TRY",
            "dovzTLkur": "0",
            "faturaTipi": "TEVKIFAT",
            "hangiTip": "5000/30000",
            "vknTckn": "11111111111",
            "aliciUnvan": "",
            "aliciAdi": "MURAT",
            "aliciSoyadi": "DURAN",
            "binaAdi": "",
            "binaNo": "",
            "kapiNo": "",
            "kasabaKoy": "",
            "vergiDairesi": "",
            "ulke": "Türkiye",
            "bulvarcaddesokak": "",
            "irsaliyeNumarasi": "",
            "irsaliyeTarihi": "",
            "mahalleSemtIlce": "ALSANCAK",
            "sehir": "İzmir",
            "postaKodu": "",
            "tel": "",
            "fax": "",
            "eposta": "",
            "websitesi": "",
            "iadeTable": [],
            "vergiCesidi": " ",
            "malHizmetTable": [
                {
                    "malHizmet": "EKMEK",
                    "miktar": 1,
                    "birim": "C62",
                    "birimFiyat": 10,
                    "fiyat": 10,
                    "iskontoArttm": "İskonto",
                    "iskontoOrani": 0,
                    "iskontoTutari": 0,
                    "iskontoNedeni": "",
                    "malHizmetTutari": 10,
                    "kdvOrani": 1,
                    "kdvTutari": 0.1,
                    "vergininKdvTutari": "0",
                    "hesaplananotvtevkifatakatkisi": "0",
                    "ozelMatrahTutari": "0",
                    "vergiOrani": 0
                },
                {
                    "malHizmet": "PEYNİR",
                    "miktar": 5,
                    "birim": "C62",
                    "birimFiyat": "100",
                    "fiyat": 500,
                    "iskontoArttm": "İskonto",
                    "iskontoOrani": "5",
                    "iskontoTutari": 25,
                    "iskontoNedeni": "",
                    "malHizmetTutari": 475,
                    "kdvOrani": 10,
                    "kdvTutari": 47.5,
                    "vergininKdvTutari": "0",
                    "hesaplananotvtevkifatakatkisi": "0",
                    "ozelMatrahTutari": "0",
                    "vergiOrani": 0
                },
                {
                    "malHizmet": "KONTOR",
                    "miktar": 1,
                    "birim": "C62",
                    "birimFiyat": "100",
                    "fiyat": 100,
                    "iskontoArttm": "İskonto",
                    "iskontoOrani": 0,
                    "iskontoTutari": 0,
                    "iskontoNedeni": "",
                    "malHizmetTutari": 100,
                    "kdvOrani": 10,
                    "kdvTutari": 10,
                    "vergininKdvTutari": "0",
                    "hesaplananotvtevkifatakatkisi": "0",
                    "ozelMatrahTutari": "0",
                    "vergiOrani": 0,
                    "V9015Orani": 50,
                    "V9015Tutari": 5,
                    "V4080Orani": "20",
                    "V4080Tutari": 20
                },
                {
                    "malHizmet": "TELEFON",
                    "miktar": 1,
                    "birim": "C62",
                    "birimFiyat": "10000",
                    "fiyat": "10000",
                    "iskontoArttm": "İskonto",
                    "iskontoOrani": 0,
                    "iskontoTutari": "0",
                    "iskontoNedeni": "",
                    "malHizmetTutari": "10000",
                    "kdvOrani": "20",
                    "vergiOrani": 0,
                    "kdvTutari": "2000",
                    "vergininKdvTutari": "0",
                    "ozelMatrahTutari": "0",
                    "hesaplananotvtevkifatakatkisi": "0",
                    "V4080Orani": 20,
                    "V4080Tutari": "2000",
                    "tevkifatKodu": "603",
                    "V9015Orani": 70,
                    "V9015Tutari": "1400"
                }],
            "tip": "İskonto",
            "matrah": "10585",
            "malhizmetToplamTutari": "10610",
            "toplamIskonto": "25",
            "hesaplanankdv": "2057.6",
            "hesaplananV4080": "2020",
            "tevkifataTabiIslemTutar": "10100",
            "tevkifataTabiIslemKdv": "2010",
            "hesaplananV9015": "1405",
            "vergilerToplami": "4077.6",
            "vergilerDahilToplamTutar": "14662.6",
            "odenecekTutar": "13257.6",
            "not": "",
            "siparisNumarasi": "",
            "siparisTarihi": "",
            "fisNo": "",
            "fisTarihi": "",
            "fisSaati": " ",
            "fisTipi": " ",
            "zRaporNo": "",
            "okcSeriNo": ""
        };

        const invoice = await runCommand(
            token,
            ...COMMANDS.createDraftInvoice,
            invoiceData
        );
        return {
            status: invoice.data === "Faturanız başarıyla oluşturulmuştur. Düzenlenen Belgeler menüsünden faturanıza ulaşabilirsiniz.",
            message: invoice.data,
            uuid: invoiceData.faturaUuid
        };
    } catch (e) {

    }

}


const getAllInvoice = async (token, startDate, endDate, type) => {
    //(token, command, pageName, data = {})
    const invoices = await runCommand(
        token,
        ...COMMANDS.getAllInvoicesByDateRange,
        "RG_TASLAKLAR",
        {
            baslangic: startDate,
            bitis: endDate,
            hangiTip: type
        }
    );
    return invoices.data;
}


// Utils:

function enableTestMode() {
    CURRENT_ENV = "TEST";
}

function convertNumber(number) {
    return numberToText.convertToText(number, {
        language: "tr",
        case: "upperCase"
    });
}

function convertPriceToText(price) {
    let [main, sub] = price.toFixed(2).split(".");
    if (sub === "00") sub = "0";
    return `${convertNumber(main)} LIRA ${convertNumber(sub)} KURUS`;
}


// API


async function getAllInvoicesByDateRange(token, {startDate, endDate, type}) {
    const invoices = await runCommand(
        token,
        ...COMMANDS.getAllInvoicesByDateRange,
        {
            baslangic: startDate,
            bitis: endDate,
            hangiTip: type,
            table: []
        }
    );
    return invoices.data;
}

async function getItiraz(token, {startDate, endDate}) {
    const invoices = await runCommand(
        token,
        ...COMMANDS.getItiraz,
        {
            baslangic: startDate,
            bitis: endDate
        }
    );
    return invoices.data;
}

async function getAllInvoicesIssuedToMeByDateRange(token, {startDate, endDate}) {
    const invoices = await runCommand(
        token,
        ...COMMANDS.getAllInvoicesIssuedToMeByDateRange,
        {
            baslangic: startDate,
            bitis: endDate,
            hangiTip: "5000/30000",
            table: []
        }
    );
    return invoices.data;
}

async function findInvoice(token, draftInvoice) {
    const {date, uuid} = draftInvoice;
    const invoices = await getAllInvoicesByDateRange(token, date, date);
    return invoices.data.find(invoice => invoice.ettn === uuid);
}

async function signInvoice(token, body) {

    return runCommand(token, ...COMMANDS.signInvoice, {
        SIFRE: body.smsCode,
        OID: body.oid,
        OPR: 1,
        DATA: [{
            "faturaOid": "",
            "toplamTutar": "0",
            "belgeNumarasi": body.data.belgeNumarasi,
            "aliciVknTckn": body.data.aliciVknTckn,
            "aliciUnvanAdSoyad": body.data.aliciUnvanAdSoyad,
            "saticiVknTckn": "",
            "saticiUnvanAdSoyad": "",
            "belgeTarihi": body.data.belgeTarihi,
            "belgeTuru": body.data.belgeTuru,
            "onayDurumu": body.data.onayDurumu,
            "ettn": body.data.ettn,
            "talepDurumColumn": "----------",
            "iptalItiraz": "-99",
            "talepDurum": "-99"
        }]
    });
}

async function signDraftInvoice(token, draftInvoice) {
    return runCommand(token, ...COMMANDS.signDraftInvoice, {
        imzalanacaklar: [draftInvoice]
    });
}

async function getInvoiceHTML(token, uuid, {signed}) {
    const invoice = await runCommand(token, ...COMMANDS.getInvoiceHTML, {
        ettn: uuid,
        onayDurumu: signed ? "Onaylandı" : "Onaylanmadı"
    });
    return invoice.data;
}

async function getDownloadURL(token, invoiceUUID, {signed, companiesId}) {

    const url = `${
        ENV[CURRENT_ENV].BASE_URL
    }/earsiv-services/download?token=${token}&ettn=${invoiceUUID}&belgeTip=FATURA&onayDurumu=${encodeURIComponent(
        signed ? "Onaylandı" : "Onaylanmadı"
    )}&cmd=EARSIV_PORTAL_BELGE_INDIR&`;

    const response = await fetch(url);

    const buff = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buff);
    const base64String = Buffer.from(uint8Array).toString("base64");

    const rest = await fetch("https://pdf.muhasip.pro/buffer.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({file: base64String, invoiceUUID, signed, companiesId})
    });
    return await rest.json();

}

async function cancelDraftInvoice(token, reason, draftInvoice) {
    const cancel = await runCommand(token, ...COMMANDS.cancelDraftInvoice, {
        silinecekler: [draftInvoice],
        aciklama: reason
    });
    return cancel.data;
}

async function getRecipientDataByTaxIDOrTRID(token, taxIDOrTRID) {
    const recipient = await runCommand(
        token,
        ...COMMANDS.getRecipientDataByTaxIDOrTRID,
        {
            vknTcknn: taxIDOrTRID
        }
    );
    return recipient.data;
}

/*async function getRecipientDataByTaxIDOrTRID(token, taxIDOrTRID) {
    const recipient = await runCommand(
        token,
        ...COMMANDS.getRecipientDataByTaxIDOrTRID,
        {
            vknTcknn: taxIDOrTRID
        }
    );
    return recipient.data;
}*/

async function sendSignSMSCode(token, phone) {
    const sms = await runCommand(token, ...COMMANDS.sendSignSMSCode, {
        CEPTEL: phone,
        KCEPTEL: false,
        TIP: ""
    });
    return sms.data.oid;
}

async function verifyPhoneNumber(token) {
    try {


        const data = await runCommand(token, ...COMMANDS.verifyPhoneNumber);

        const phone = data.data.telefon;

        const oid = await sendSignSMSCode(token, phone);

        return {
            phone,
            oid
        };
    } catch (e) {
        return {
            phone: null,
            oid: null
        };
    }
}

async function verifySignSMSCode(token, smsCode, operationId) {
    const sms = await runCommand(token, ...COMMANDS.verifySignSMSCode, {
        SIFRE: smsCode,
        OID: operationId
    });
    return sms;
}


async function updateUserData(token, userData) {
    const user = await runCommand(token, ...COMMANDS.updateUserData, {
        vknTckn: userData.taxIDOrTRID,
        unvan: userData.title,
        ad: userData.name,
        soyad: userData.surname,
        sicilNo: userData.registryNo,
        mersisNo: userData.mersisNo,
        vergiDairesi: userData.taxOffice,
        cadde: userData.fullAddress,
        apartmanAdi: userData.buildingName,
        apartmanNo: userData.buildingNumber,
        kapiNo: userData.doorNumber,
        kasaba: userData.town,
        ilce: userData.district,
        il: userData.city,
        postaKodu: userData.zipCode,
        ulke: userData.country,
        telNo: userData.phoneNumber,
        faksNo: userData.faxNumber,
        ePostaAdresi: userData.email,
        webSitesiAdresi: userData.webSite,
        isMerkezi: userData.businessCenter
    });
    return user.data;
}

// Automated Bulk Commands

async function createInvoice(
    userId,
    password,
    invoiceDetails,
    {sign = true} = {}
) {
    const token = await getToken(userId, password);
    const draftInvoice = await createDraftInvoice(token, invoiceDetails);
    const draftInvoiceDetails = await findInvoice(token, draftInvoice);
    if (sign) {
        await signDraftInvoice(token, draftInvoiceDetails);
    }
    return {
        token,
        uuid: draftInvoice.uuid,
        signed: sign
    };
}

async function createInvoiceAndGetDownloadURL(...args) {
    const {token, uuid, signed} = await createInvoice(...args);
    return getDownloadURL(token, uuid, signed);
}

async function createInvoiceAndGetHTML(...args) {
    const {token, uuid, signed} = await createInvoice(...args);
    return getInvoiceHTML(token, uuid, signed);
}

export {
    enableTestMode,
    getToken,
    logout,
    createDraftInvoice,
    getAllInvoicesByDateRange,
    getAllInvoicesIssuedToMeByDateRange,
    findInvoice,
    signDraftInvoice,
    getDownloadURL,
    getInvoiceHTML,
    createInvoiceAndGetHTML,
    createInvoiceAndGetDownloadURL,
    cancelDraftInvoice,
    sendSignSMSCode,
    verifyPhoneNumber,
    verifySignSMSCode,
    getUserData,
    getItiraz,
    updateUserData,
    apiLogout,
    signInvoice,
    getAllInvoice
};