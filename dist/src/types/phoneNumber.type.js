"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowedPhoneNumberTypes = exports.PhoneNumberRegex = exports.PhoneNumberTypeToRegion = void 0;
exports.PhoneNumberTypeToRegion = {
    "+886": "Taiwan",
    "+852": "Hong Kong",
    "+853": "Macau",
    "+65": "Singapore",
    "+60": "Malaysia",
    "+1": "United States/Canada",
    "+44": "United Kingdom",
    "+61": "Australia",
    "+81": "Japan",
    "+82": "South Korea",
    "+49": "Germany",
    "+33": "France",
    "+86": "China",
    "+91": "India",
    "+39": "Italy",
    "+7": "Russia",
    "+34": "Spain",
    "+63": "Philippines",
    "+64": "New Zealand"
};
exports.PhoneNumberRegex = {
    "+886": /^(\+886|0)?9\d{8}$/,
    "+852": /^(\+852)?[569]\d{7}$/,
    "+853": /^(\+853)?6\d{7}$/,
    "+65": /^(\+65)?[89]\d{7}$/,
    "+60": /^(\+60)?1[0-9]{8,9}$/,
    "+1": /^(\+1)?\d{10}$/,
    "+44": /^(\+44|0)?7\d{9}$/,
    "+61": /^(\+61|0)?4\d{8}$/,
    "+81": /^(\+81|0)?[789]\d{8}$/,
    "+82": /^(\+82|0)?1[0-9]{8,9}$/,
    "+49": /^(\+49)?1[5-7]\d{8,9}$/,
    "+33": /^(\+33|0)?[67]\d{8}$/,
    "+86": /^(\+86|0)?1[3-9]\d{9}$/,
    "+91": /^(\+91|0)?[6-9]\d{9}$/,
    "+39": /^(\+39)?3\d{9}$/,
    "+7": /^(\+7|8)?\d{10}$/,
    "+34": /^(\+34)?[67]\d{8}$/,
    "+63": /^(\+63|0)?9\d{9}$/,
    "+64": /^(\+64|0)?2[028]\d{7,8}$/
};
exports.AllowedPhoneNumberTypes = ["+886"];
//# sourceMappingURL=phoneNumber.type.js.map