import type { Locale } from '../config/site';

interface CountryInfo {
  flagCode: string;
  names: Record<Locale, string>;
}

const countries: Record<string, CountryInfo> = {
  Algeria: { flagCode: 'DZ', names: { es: 'Argelia', en: 'Algeria' } },
  Argentina: { flagCode: 'AR', names: { es: 'Argentina', en: 'Argentina' } },
  Australia: { flagCode: 'AU', names: { es: 'Australia', en: 'Australia' } },
  Austria: { flagCode: 'AT', names: { es: 'Austria', en: 'Austria' } },
  Belgium: { flagCode: 'BE', names: { es: 'Bélgica', en: 'Belgium' } },
  'Bosnia & Herzegovina': {
    flagCode: 'BA',
    names: { es: 'Bosnia y Herzegovina', en: 'Bosnia & Herzegovina' },
  },
  Brazil: { flagCode: 'BR', names: { es: 'Brasil', en: 'Brazil' } },
  Canada: { flagCode: 'CA', names: { es: 'Canadá', en: 'Canada' } },
  'Cape Verde': { flagCode: 'CV', names: { es: 'Cabo Verde', en: 'Cape Verde' } },
  Colombia: { flagCode: 'CO', names: { es: 'Colombia', en: 'Colombia' } },
  Croatia: { flagCode: 'HR', names: { es: 'Croacia', en: 'Croatia' } },
  Curaçao: { flagCode: 'CW', names: { es: 'Curazao', en: 'Curaçao' } },
  'Czech Republic': { flagCode: 'CZ', names: { es: 'República Checa', en: 'Czech Republic' } },
  'DR Congo': { flagCode: 'CD', names: { es: 'RD del Congo', en: 'DR Congo' } },
  Ecuador: { flagCode: 'EC', names: { es: 'Ecuador', en: 'Ecuador' } },
  Egypt: { flagCode: 'EG', names: { es: 'Egipto', en: 'Egypt' } },
  England: { flagCode: 'GB', names: { es: 'Inglaterra', en: 'England' } },
  France: { flagCode: 'FR', names: { es: 'Francia', en: 'France' } },
  Germany: { flagCode: 'DE', names: { es: 'Alemania', en: 'Germany' } },
  Ghana: { flagCode: 'GH', names: { es: 'Ghana', en: 'Ghana' } },
  Haiti: { flagCode: 'HT', names: { es: 'Haití', en: 'Haiti' } },
  Iran: { flagCode: 'IR', names: { es: 'Irán', en: 'Iran' } },
  Iraq: { flagCode: 'IQ', names: { es: 'Irak', en: 'Iraq' } },
  'Ivory Coast': { flagCode: 'CI', names: { es: 'Costa de Marfil', en: 'Ivory Coast' } },
  Japan: { flagCode: 'JP', names: { es: 'Japón', en: 'Japan' } },
  Jordan: { flagCode: 'JO', names: { es: 'Jordania', en: 'Jordan' } },
  Mexico: { flagCode: 'MX', names: { es: 'México', en: 'Mexico' } },
  Morocco: { flagCode: 'MA', names: { es: 'Marruecos', en: 'Morocco' } },
  Netherlands: { flagCode: 'NL', names: { es: 'Países Bajos', en: 'Netherlands' } },
  'New Zealand': { flagCode: 'NZ', names: { es: 'Nueva Zelanda', en: 'New Zealand' } },
  Norway: { flagCode: 'NO', names: { es: 'Noruega', en: 'Norway' } },
  Panama: { flagCode: 'PA', names: { es: 'Panamá', en: 'Panama' } },
  Paraguay: { flagCode: 'PY', names: { es: 'Paraguay', en: 'Paraguay' } },
  Portugal: { flagCode: 'PT', names: { es: 'Portugal', en: 'Portugal' } },
  Qatar: { flagCode: 'QA', names: { es: 'Catar', en: 'Qatar' } },
  'Saudi Arabia': { flagCode: 'SA', names: { es: 'Arabia Saudí', en: 'Saudi Arabia' } },
  Scotland: { flagCode: 'GB', names: { es: 'Escocia', en: 'Scotland' } },
  Senegal: { flagCode: 'SN', names: { es: 'Senegal', en: 'Senegal' } },
  'South Africa': { flagCode: 'ZA', names: { es: 'Sudáfrica', en: 'South Africa' } },
  'South Korea': { flagCode: 'KR', names: { es: 'Corea del Sur', en: 'South Korea' } },
  Spain: { flagCode: 'ES', names: { es: 'España', en: 'Spain' } },
  Sweden: { flagCode: 'SE', names: { es: 'Suecia', en: 'Sweden' } },
  Switzerland: { flagCode: 'CH', names: { es: 'Suiza', en: 'Switzerland' } },
  Tunisia: { flagCode: 'TN', names: { es: 'Túnez', en: 'Tunisia' } },
  Turkey: { flagCode: 'TR', names: { es: 'Turquía', en: 'Turkey' } },
  USA: { flagCode: 'US', names: { es: 'Estados Unidos', en: 'USA' } },
  Uruguay: { flagCode: 'UY', names: { es: 'Uruguay', en: 'Uruguay' } },
  Uzbekistan: { flagCode: 'UZ', names: { es: 'Uzbekistán', en: 'Uzbekistan' } },
};

export function getCountryName(country: string, locale: Locale) {
  return countries[country]?.names[locale] ?? country;
}

export function getCountryFlagUrl(country: string) {
  const flagCode = countries[country]?.flagCode;

  return flagCode ? `https://flagsapi.com/${flagCode}/flat/64.png` : null;
}

export function isKnownCountry(country: string) {
  return country in countries;
}
