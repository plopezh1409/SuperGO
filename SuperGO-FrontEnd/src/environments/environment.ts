import { NgxLoggerLevel } from "ngx-logger";

export const environment = {
  production: false,


   urlSuperGo: 'CLJnt8qCx1oTLQMUjKeVRGjnfpLHl3gj1bTkC86zLDY=', //    4LF4 Piso 3
  // urlSuperGo: 'VSDb6LXNsz2SKU+aK/U/+auCF0w6ZUWRlNP6VMGkEeoV95/aFyH0ukmsGkemD5mK', //    4LF4 Piso 7
  // urlSuperGo: 'VSDb6LXNsz2SKU+aK/U/+U6xLg0YYxE8L81zVy8v9TE=', //Javi
  // urlSuperGo: 'VSDb6LXNsz2SKU+aK/U/+VoLmmMRyh3XY8hTT45PK0iWB5fyLVdvHXYgjTlrmxDM',
  // urlSuperGo: 'VSDb6LXNsz2SKU+aK/U/+bXa/1YqZn3lsSwnGfo2m6tccpxIBemhxLwOiH0jEIuy', //Alejandro Piso 7 10.112.69.172:8090/SUPERGO 
  // urlSuperGo: 'CLJnt8qCx1oTLQMUjKeVRNp8iKdSLdJQMML5C6HVhyw=', //Alejandro Piso 10.112.53.80:8090/APIGO-0.0.1/ 
  // urlSuperGo: 'VSDb6LXNsz2SKU+aK/U/+SMQKUXvIxki0MYhIyeNTZe8HOeDBanj4fRBsgnKMN6d', //LOCALHOST J0RG3
  // K1L0

    // urlSuperGo: 'qnuLv7SMRPSjOanKK3t3lYPgkG7DLhZqcC3GwuEeMxo=',                          //8R4V0  (APIGO/)
    //  urlSuperGo: 'qnuLv7SMRPSjOanKK3t3lSLHxyniQWcnPxr2f6KMKCW+JriD5u07KT2x6XBkkzLe',      //8R4V0  (GestorOperaAPI/)
  //  urlSuperGo: 'qnuLv7SMRPSjOanKK3t3lQgiayB5M25RiU11WKAcDx8=',                          //D3LT4  (APIGO/)
   //urlSuperGo: 'qnuLv7SMRPSjOanKK3t3lY311RbMLQjk4O1WLmEhaWEfJ7oXV42HyIQLFaWKzRjP',      //M1K3   (GestorOperaAPI/)
  //  urlSuperGo: 'qnuLv7SMRPSjOanKK3t3lRxMhuxiOJDDP2WDmmBqyHDjcJUAX6M/kSQWVczXJuTn',      //JUL13T (GestorOperaAPI/)
  //  urlSuperGo: 'qnuLv7SMRPSjOanKK3t3lZtW6Ah58ybmJlUYWQqDcSicCW0eP43rHigGwOwDdeQ7',      //L1M4   (APIGO/)
  //  urlSuperGo: 'VSDb6LXNsz2SKU+aK/U/+YOoPWlqsC7LdSrviJY7O/YgEjb8oExGkT6Gtt2Cys0D',      //60L7   (APIGO/)
  // urlSuperGo: 'VSDb6LXNsz2SKU+aK/U/+c8LHShnP0T7CnArANVFAzYAiprr9BUvqFo2TYKaKLSX',


  urlAuthGS: 'https://authns.desadsi.gs/nidp/oauth/nam/authz',
  urlAuthGSLogOut: 'https://authns.desadsi.gs/nidp/jsp/logoutSuccess_latest.jsp',

  // 74N60
  client_id: 'QfaXeFjnLSpZbfR4LJBxbdYtITNm5GQWo8NnlprZM29uyGknDZS+zG/w5wWWWW4D',
  client_secret: 'U03HO+hqrMDDTFnShe7WvFuvOsmiVtBadJd9srCARHCGxz9k05OfpGBXzilrz9QYY9IH3ChJkUHTT5+iSOTqeJoU4ZiSqFwLUCxX17KZeEIFgRzRd/dtXwXKcLTvk9nS',
  // redirect_uri: 'LIypVu/8YZZ2Zfe87MFBdIeXj4+cSfnpNl5O8AulU94=', //localhost
  // redirect_uri:'qnuLv7SMRPSjOanKK3t3lXzW8mdNX45lbxcL6DDk2DfDjlTeJdaj2X7Yys9kBtQH', //8R4V0 PORT 80
   redirect_uri: 'qnuLv7SMRPSjOanKK3t3lYRsuhqMUdhDG3cGzPu1SFQzVRD2rKy/S4wf2zIP4IKu',//L1M4 PORT 8080
  // redirect_uri: 'VSDb6LXNsz2SKU+aK/U/+auCF0w6ZUWRlNP6VMGkEeoV95/aFyH0ukmsGkemD5mK',
  scope: 'N6dUbSZB+8hTTHT0ierTK05E/4TLuzMyuSPoLNjOTAw=',
  acr_values: 'LwWwChy9aHCL8lz7Kh2wQyfuaGjhVu4g0QLnj0s46us=',
  rp: '3L5Q91pQlcjsr8u28kgRfcAZHnuriGeKNPCEQ/McuHw=',

  // CH4RL7
  urlCryptoGS_AES: '2C318999DCB9CC352D1D4A4AE96EF5DFA26FDA3ED5ADC705F044EE3D98FF2365',

  // 3CH0
  urlPublicKeyRSA: '30820122300D06092A864886F70D01010105000382010F003082010A02820101008F7306DCC8DB41CAC63EF7839A47E6295C1A4F93428C2484A9A0A30705FCFE1EEE8C2396014D7CC705C2E5537AF4FE211D69E5042D8FF25CF50F987FAA4F6CA558C668AF3B46E82C6E1A47A84005E740A866B3F1FFE46AB87B8D3F19015B7D09BB52888D9247DEC6CC07921B804B38F88BA1CBA3194ABA8AD33D895E986D27CE6D255E283B40744F647960E94F37995A7235F028EE2916DBFE9A5F1EE57766009DC5A1A339B6EE7511421A7E6F9C1ABCD1789E089DC88F5AF25DDAFA936AD80CB5DA015919C0586CCB8DC2EA44C9925E8DF2C874BB8CA2637317318A26FE363011678875718D1840BB4EB8BECAB3373A0DC37023D90F139C02D1A54241CC5C110203010001',
  urlPrivateKeyRSA: '308204BE020100300D06092A864886F70D0101010500048204A8308204A402010002820101008F7306DCC8DB41CAC63EF7839A47E6295C1A4F93428C2484A9A0A30705FCFE1EEE8C2396014D7CC705C2E5537AF4FE211D69E5042D8FF25CF50F987FAA4F6CA558C668AF3B46E82C6E1A47A84005E740A866B3F1FFE46AB87B8D3F19015B7D09BB52888D9247DEC6CC07921B804B38F88BA1CBA3194ABA8AD33D895E986D27CE6D255E283B40744F647960E94F37995A7235F028EE2916DBFE9A5F1EE57766009DC5A1A339B6EE7511421A7E6F9C1ABCD1789E089DC88F5AF25DDAFA936AD80CB5DA015919C0586CCB8DC2EA44C9925E8DF2C874BB8CA2637317318A26FE363011678875718D1840BB4EB8BECAB3373A0DC37023D90F139C02D1A54241CC5C1102030100010282010029904DA3B93AF654379ED4FEB7BC2F6F3A75912AFCF4383C8C1DB43EFBB83335692F07BC96020AAE6BF7ED9483A2EAE3536F746102869BD5DD57B87AFD30E82CFC8CF8961559D539D26920EC1A28DBB97B51CEBFC6C23B3DDAE6B12AA09F0E9ABC410CB9E0719C9603560A3A97B0B400280D2840C8BA4354A82243643A4C1E651C746A1CF69A73FA756A6AAFB16210C7C5DD22EBD21EB1C2146D65A8165469A306DEA0EDA9FFB6058CC7B111245E6F5BF259BDEE14773518899FFF9B2FF150A9D105894A84CD001964BEE6CB1AEFD596F051B242BD9E84D0E58665710E7A96B29263E608F690FAF1DEB145462AF3F115EC5F2061F2405854DBFA123AA46D720102818100DA2C289DBE4BA091F08D7A96691938DCC06E727A0FB0ADDDA447C1EDB653C8C095A5935451AC5C60D72B4DB881BF6F244511B62B0BF88AC33B42509A6A3B9B9CD31A8B4C2B081BC83F248FE91F6DCB3016CD8824EC5F40863D32D5DB529888EFC01300176C3BD79006699EC4BC3EBDE150AACCF2B1B548412659980A7C752BE102818100A852315B4B11B93C93F486C76E94E0836DCB17E9720F0A5B4739FB72BB37F1DE14F6D87FE9A08663153350B7FF3473B24D5013E97475A166370A28E6E6A58729C5D349C6CCF10926D27BD63CFE7032067E788BA7666FA34FA678D489D2F59DC243BC09AEFEF7E76AF8C5B78E5618192BE813161EE79B39C3FC5712B8DFCDB63102818100D7EE9CC483739698DADD2C5771EDE4B9983BB851D6F5A71F9758EE37B81D74B427689948FB0CFCE15C151FF75D737B2D0AAF5CFD7DFBA05B5A6B681B6CC9525B05156089228E03F14D8D8261D91971E146B065EF2583A0F93BD8F490FE4EBA3990813DB5F109C97062E8669B913507F9D93D335B81474B1C3038BCA2A44BD401028181009E63A9BA44ABCAE96C38BFD34F059D374FCBBB169B93F7A4E92370B007E89F1AE2135EAB0F4754EE4BF6DBD028C04CD6CDD5BAC70625E2D8F29606E330CB36A3625A6EA43A19DF08BF2C74EF3466934C751A2E203A4E7718EE87E94840518C404FC8D43BEE058DA8A5AC380C228BCEB3F8506D926B53304A725BE56C3E7DAF210281801DCF9528712FDF4948DBF00769A2CBEC59F5A90FF2D01A5DDD1B9E414A150B2F316284A28AE69F282CE3010AB217F7335D34A93B1913A6BE23F47B146098F0DFBA42894DF9738B1B2D1E632542717C9E6BAA607336B12CC572BCA5FEC4DB43652DC62E569C4B3E2211BF802E6C94152FC12F0A7EC93C6A52E10EC84F5D092A6A',

  // ZULU
  tamMaxEvidencia: 10,
  tamMaxCargaMasiva: 100,

  // M1K3
  logLevel: NgxLoggerLevel.DEBUG,
  serverLogLevel: NgxLoggerLevel.OFF,
  disableConsoleLogging: false,

  tiempoCierreSession: 900000,
  tiempoInactividad: 840000,
  
  algoritm:'aes-256-cbc',



};
