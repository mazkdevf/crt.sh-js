const fetch = require("node-fetch");

class CrtshAPI {
  constructor() {
    this.baseURL = "https://crt.sh/?q={}&output=json";
  }

  async search(domain, wc = true, expired = true) {
    let _defDomain = domain;
    let url = this.baseURL;

    if (!expired) {
      url += "&exclude=expired";
    }

    if (wc && !domain.includes("%")) {
      domain = `%.${domain}`;
    }

    url = url.replace("{}", domain);

    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36, " +
      "(KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36";

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": ua,
        },
      });

      if (response.ok) {
        const content = await response.text();
        let data;

        try {
          data = JSON.parse(content);
        } catch (error) {
          data = JSON.parse(`[${content.replace('}{', '},{')}]`);
        }

        if (data.length != 0) {
          let unique = [];
          let uniquenames = [];
          for (let i = 0; i < data.length; i++) {
            if (!uniquenames.includes(data[i].common_name)) {
              delete data[i].id;
              delete data[i].issuer_ca_id;
              delete data[i].serial_number;
              delete data[i].result_count;

              unique.push(data[i]);
              uniquenames.push(data[i].common_name);
            }
          }
          data = unique;

        }

        data = {
          "domain": _defDomain,
          "certificates": data
        }

        return data;
      } else {
        console.error("Error retrieving information.");
      }
    } catch (error) {
      console.error("Error retrieving information.", error);
    }

    return null;
  }
}

module.exports = CrtshAPI;