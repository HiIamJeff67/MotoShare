/*
    台灣第八代機車車牌

    普通重型機車(白牌黑字):
    MAY-0001 ~ PZZ-9999 -> MA[Y-Z]|M[B-Z][A-Z]|[N-P][A-Z][A-Z]
    JAA-0001 ~ JZZ-9999 -> J[A-Z]{2}
    XAA-0001 ~ ZZZ-9999 -> [X-Z][A-Z]{2}
    WFA-0001 ~ WZZ-9999 -> W[F-Z][A-Z]
    QNA-0001 ~ QZZ-9999 -> Q[N-Z][A-Z]
    LNA-0001 ~ LZZ-9999 -> L[N-Z][A-Z]
    HEA-0001 ~ HZZ-9999 -> H[E-Z][A-Z]
    KUA-0001 ~ KZZ-9999 -> K[U-Z][A-Z]
    KQE-0001 ~ KQZ-9999 -> KQ[E-Z]
    SFA-0001 ~ SZZ-9999 -> S[F-Z][A-Z]

    輕型機車(綠牌):
    QAL-0001 ~ QMZ-9999

    小型輕型機車(白牌紅字):
    SAC-0001 ~ SEZ-9999

    大型重型機車(黃牌):
    LAD-0001 ~ LFZ-9999

    550cc以上大型重型機車(紅牌):
    LGA-0001 ~ LMZ-9999

    information from wiki picture(.gif file): https://zh.wikipedia.org/zh-tw/%E8%87%BA%E7%81%A3%E8%BB%8A%E8%BC%9B%E7%89%8C%E7%85%A7#/media/File:Taiwan_ROC_2014_license_plates.gif

    其他(非第八代)
    001-AAA ~ 999-ZZZ   -> [0-9]${3}-[A-Z]${3}
*/

export const NormalHeavyMotocycleLicenseRegex = /^([MA[Y-Z]|M[B-Z][A-Z]|[N-P][A-Z][A-Z]|J[A-Z]{2}|[X-Z][A-Z]{2}|W[F-Z][A-Z]|Q[N-Z][A-Z]|L[N-Z][A-Z]|H[E-Z][A-Z]|K[U-Z][A-Z]|KQ[E-Z]|S[F-Z][A-Z])-[0-9]{4}$/

export const LightMotocycleLicenseRegex = /^(QA[L-Z]|Q[B-M][A-Z])-[0-9]{4}$/

export const TinyLightMotocycleLicenseRegex = /^(SA[C-Z]|S[B-E][A-Z])-[0-9]{4}$/

export const LargeHeavyMotocycleLicenseRegex = /^(LA[D-Z]|L[B-F][A-Z])-[0-9]{4}$/

export const SuperLargeHeavyMotocycleLicenseRegex = /^(L[G-M][A-Z])-[0-9]{4}$/

export const TWLicenseRegex = [
    NormalHeavyMotocycleLicenseRegex, 
    LightMotocycleLicenseRegex, 
    TinyLightMotocycleLicenseRegex, 
    LargeHeavyMotocycleLicenseRegex, 
    SuperLargeHeavyMotocycleLicenseRegex
];



export const ValidLicenseLengths = [7, 8];   // include the '-' character

