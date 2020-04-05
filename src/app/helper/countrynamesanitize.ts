let countries = {
    "usa": "us",
    "taiwan": "taiwan*",
    "isle of man": "united kingdom",
    "aruba": "netherlands",
    "sint maarten": "netherlands",
    "st. vincent grenadines": "saint vincent and the grenadines",
    "timor-leste": "East Timor",
    "montserrat": "united kingdom",
    "cayman islands": "united kingdom",
    "bermuda": "united kingdom",
    "greenland": "denmark",
    "st. barth": "saint barthelemy",
    "congo": "congo (brazzaville)",
    "saint martin": "france",
    "gibraltar": "united kingdom",
    "mayotte": "france",
    "french guiana": "france",
    "u.s. virgin islands": "us",
    "curaçao": "netherlands",
    "puerto rico": "us",
    "french polynesia": "france",
    "ivory coast": "Cote d'Ivoire",
    "macao": "china",
    "drc": "congo (kinshasa)",
    "channel islands": "united kingdom",
    "réunion": "france",
    "guadeloupe": "france",
    "faeroe islands": "Denmark",
    "uae": "United Arab Emirates",
    "diamond princess": "australia",
    "hong kong": "china",
    "uk": "united kingdom",
    "car": "central african republic"
};

export default function getCountryNameSanited(name) {
    if (countries.hasOwnProperty(name)) {
        return countries[name];
    } else {
        return name;
    }
  }