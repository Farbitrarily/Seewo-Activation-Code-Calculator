function md5(str) {
    return CryptoJS.MD5(str).toString();
  }

  const re = {
    a: {
      encrypt: (str, key) => CryptoJS.AES.encrypt(str, key).toString(),
      decrypt: (str, key) => CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8)
    }
  };

  const VwebConfig = {
    activationCodeUnlockTargetUrl: 'https://campus.seewo.com/hugo-mobile/#/offlinelock'
  };

  function generateQRCode() {
    const deviceId = document.getElementById('deviceid').value;

    class ActivationCode {
      constructor() {
        this.password = null;
        this.clearTextKey = new Date().getTime();
        this.ciphertextKey = "";
        this.BOARD_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      }

      newPassword() {
        let password = "";
        for (let i = 0; i < 6; i++) {
          password += Math.floor(10 * Math.random());
        }
        this.password = password;
      }

      newCiphertextKey() {
        this.ciphertextKey = md5(this.clearTextKey + "" + deviceId);
      }

      newQrcode() {
        const password = re.a.encrypt(this.password, this.ciphertextKey.toString());
        const t = VwebConfig.activationCodeUnlockTargetUrl;
        const qrcodeUrl = t + "?_d=" + deviceId + "&_k=" + this.clearTextKey + "&_p=" + encodeURIComponent(password.toString());
        document.getElementById('url').innerHTML = `<div>生成的url: </br><a href="${qrcodeUrl}" target="_blank">${qrcodeUrl}</a></div>`;
      }
    }

    const code = new ActivationCode();
    code.newPassword();
    code.newCiphertextKey();
    code.newQrcode();
  }

  function parseUrl(url) {
    const params = {};
    const urlParts = url.split("?");
    if (urlParts.length > 1) {
      const queryString = urlParts[1];
      const pairs = queryString.split("&");
      pairs.forEach(pair => {
        const keyValue = pair.split("=");
        params[keyValue[0]] = decodeURIComponent(keyValue[1]);
      });
    }
    return params;
  }

  function autofill(){
    const url = document.getElementById("result").value;
    document.getElementById("urlInput").value = url;
  }

  function decryptActivationCode() {
    const url = document.getElementById("urlInput").value;

    const urlParams = parseUrl(url);

    const deviceId = urlParams["_d"]; // Automatically extract deviceId from URL
    document.getElementById("deviceIdInput").value = deviceId; // Set the extracted deviceId in the input field

    const ciphertextKey = md5(urlParams["_k"] + deviceId);
    const decryptedPassword = re.a.decrypt(urlParams["_p"], ciphertextKey);

    document.getElementById("result0").innerText = "激活码: " + decryptedPassword;
  }