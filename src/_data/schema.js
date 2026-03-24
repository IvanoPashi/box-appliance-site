const site = require("./site.json");
const schemaBase = require("./schema.base.json");

const BASE_URL = "https://primefixrepair.com";
const BASE_COMPANY = "BOX APPLIANCE";
const BASE_COMPANY_TEAM = "BOX APPLIANCE Team";
const BASE_OWNER_COMPANY = "BOX APPLIANCE LLC";
const BASE_PHONE = "(949) 883-8072";
const BASE_EMAIL = "service@primefixrepair.com";
const BASE_STREET_ADDRESS = "7461 Edinger Ave";

function transformValue(value, key) {
  if (Array.isArray(value)) {
    if (key === "sameAs" && Array.isArray(site.same_as)) {
      return site.same_as;
    }

    return value.map((item) => transformValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        transformValue(childValue, childKey),
      ])
    );
  }

  if (typeof value !== "string") {
    return value;
  }

  if (key === "telephone") {
    return site.phone;
  }

  if (key === "email") {
    return site.email;
  }

  if (key === "streetAddress") {
    return site.street_address;
  }

  if (key === "addressLocality") {
    return site.city;
  }

  if (key === "addressRegion") {
    return site.state;
  }

  if (key === "postalCode") {
    return site.zip;
  }

  return value
    .replaceAll(BASE_URL, site.url)
    .replaceAll(BASE_OWNER_COMPANY, site.owner_company)
    .replaceAll(BASE_COMPANY_TEAM, `${site.company} Team`)
    .replaceAll(BASE_COMPANY, site.company)
    .replaceAll(BASE_PHONE, site.phone)
    .replaceAll(BASE_EMAIL, site.email)
    .replaceAll(BASE_STREET_ADDRESS, site.street_address);
}

module.exports = transformValue(schemaBase);
