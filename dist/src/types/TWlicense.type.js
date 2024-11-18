"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidLicenseLengths = exports.TWLicenseRegex = exports.SuperLargeHeavyMotocycleLicenseRegex = exports.LargeHeavyMotocycleLicenseRegex = exports.TinyLightMotocycleLicenseRegex = exports.LightMotocycleLicenseRegex = exports.NormalHeavyMotocycleLicenseRegex = void 0;
exports.NormalHeavyMotocycleLicenseRegex = /^([MA[Y-Z]|M[B-Z][A-Z]|[N-P][A-Z][A-Z]|J[A-Z]{2}|[X-Z][A-Z]{2}|W[F-Z][A-Z]|Q[N-Z][A-Z]|L[N-Z][A-Z]|H[E-Z][A-Z]|K[U-Z][A-Z]|KQ[E-Z]|S[F-Z][A-Z])-[0-9]{4}$/;
exports.LightMotocycleLicenseRegex = /^(QA[L-Z]|Q[B-M][A-Z])-[0-9]{4}$/;
exports.TinyLightMotocycleLicenseRegex = /^(SA[C-Z]|S[B-E][A-Z])-[0-9]{4}$/;
exports.LargeHeavyMotocycleLicenseRegex = /^(LA[D-Z]|L[B-F][A-Z])-[0-9]{4}$/;
exports.SuperLargeHeavyMotocycleLicenseRegex = /^(L[G-M][A-Z])-[0-9]{4}$/;
exports.TWLicenseRegex = [
    exports.NormalHeavyMotocycleLicenseRegex,
    exports.LightMotocycleLicenseRegex,
    exports.TinyLightMotocycleLicenseRegex,
    exports.LargeHeavyMotocycleLicenseRegex,
    exports.SuperLargeHeavyMotocycleLicenseRegex
];
exports.ValidLicenseLengths = [7, 8];
//# sourceMappingURL=TWLicense.type.js.map