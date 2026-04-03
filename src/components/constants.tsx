export const PHONE_SVG = "https://www.svgrepo.com/show/430122/call-contact-phone.svg";
export const PHONE_SVG_WHITE =
  "https://cmsredesign.channeli.in/library/assets/icons/phone.svg";
export const EMAIL_SVG =
  "https://www.svgrepo.com/show/430112/mail-communication-sign.svg";
export const EMAIL_SVG_WHITE =
  "https://cmsredesign.channeli.in/library/assets/icons/email.svg";
export const DEPARTMENT_SVG =
  "https://www.svgrepo.com/show/430111/address-pin-location.svg";
export const DEPARTMENT_SVG_WHITE =
  "https://cmsredesign.channeli.in/library/assets/icons/location.svg";

const isProd = import.meta.env?.PROD;
export const SERVER_URL = isProd ? "/" : `http://${window.location.hostname}:5000/`;
export const PROFILE_PIC_URL = SERVER_URL + "default.png";
