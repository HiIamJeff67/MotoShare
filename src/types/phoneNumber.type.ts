export type PhoneNumberType = 
    "+886"    |   // 台灣
    "+852"    |   // 香港
    "+853"    |   // 澳門
    "+65"     |   // 新加坡
    "+60"     |   // 馬來西亞
    "+1"      |   // 美國、加拿大
    "+44"     |   // 英國
    "+61"     |   // 澳洲
    "+81"     |   // 日本
    "+82"     |   // 韓國
    "+49"     |   // 德國
    "+33"     |   // 法國
    "+86"     |   // 中國
    "+91"     |   // 印度
    "+39"     |   // 義大利
    "+7"      |   // 俄羅斯
    "+34"     |   // 西班牙
    "+63"     |   // 菲律賓
    "+64"     ;   // 紐西蘭

export const PhoneNumberTypeToRegion = {
    "+886": "Taiwan",               // 台灣
    "+852": "Hong Kong",            // 香港
    "+853": "Macau",                // 澳門
    "+65": "Singapore",             // 新加坡
    "+60": "Malaysia",              // 馬來西亞
    "+1": "United States/Canada",   // 美國/加拿大
    "+44": "United Kingdom",        // 英國
    "+61": "Australia",             // 澳洲
    "+81": "Japan",                 // 日本
    "+82": "South Korea",           // 韓國
    "+49": "Germany",               // 德國
    "+33": "France",                // 法國
    "+86": "China",                 // 中國
    "+91": "India",                 // 印度
    "+39": "Italy",                 // 義大利
    "+7": "Russia",                 // 俄羅斯
    "+34": "Spain",                 // 西班牙
    "+63": "Philippines",           // 菲律賓
    "+64": "New Zealand"            // 紐西蘭
};

export const PhoneNumberRegex = {
    "+886": /^(\+886|0)?9\d{8}$/,          // 台灣：09xxxxxxxx
    "+852": /^(\+852)?[569]\d{7}$/,        // 香港：5、6 或 9 開頭的8位數
    "+853": /^(\+853)?6\d{7}$/,            // 澳門：6 開頭的8位數
    "+65": /^(\+65)?[89]\d{7}$/,           // 新加坡：8 或 9 開頭的8位數
    "+60": /^(\+60)?1[0-9]{8,9}$/,         // 馬來西亞：10 或 11 位數
    "+1": /^(\+1)?\d{10}$/,                // 美國/加拿大：10位數
    "+44": /^(\+44|0)?7\d{9}$/,            // 英國：07xxxxxxxxx
    "+61": /^(\+61|0)?4\d{8}$/,            // 澳洲：04xxxxxxxx
    "+81": /^(\+81|0)?[789]\d{8}$/,        // 日本：7、8 或 9 開頭的10位數
    "+82": /^(\+82|0)?1[0-9]{8,9}$/,       // 韓國：10 或 11 位數
    "+49": /^(\+49)?1[5-7]\d{8,9}$/,       // 德國：15x、16x 或 17x 開頭
    "+33": /^(\+33|0)?[67]\d{8}$/,         // 法國：6 或 7 開頭的10位數
    "+86": /^(\+86|0)?1[3-9]\d{9}$/,       // 中國：13-19開頭的11位數
    "+91": /^(\+91|0)?[6-9]\d{9}$/,        // 印度：6-9 開頭的10位數
    "+39": /^(\+39)?3\d{9}$/,              // 義大利：3 開頭的10位數
    "+7": /^(\+7|8)?\d{10}$/,              // 俄羅斯：10位數
    "+34": /^(\+34)?[67]\d{8}$/,           // 西班牙：6 或 7 開頭的9位數
    "+63": /^(\+63|0)?9\d{9}$/,            // 菲律賓：09xxxxxxxxx
    "+64": /^(\+64|0)?2[028]\d{7,8}$/      // 紐西蘭：02xx 開頭的8或9位數
};

export const AllowedPhoneNumberTypes: PhoneNumberType[] = ["+886"];