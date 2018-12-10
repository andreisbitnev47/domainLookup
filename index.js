const phantom = require('phantom');
const fs = require('fs');
const nodemailer = require('nodemailer');
const request = require('request');
 
async function checkDomain(domain) {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on('onResourceRequested', function(requestData) {
        console.info('Requesting', requestData.url);
    });

    const status = await page.open(`https://www.zone.ee/et/domeeni-otsing#/preview/${domain}`);
    setTimeout(async () => {
        const content = await page.property('content');
        if (content.indexOf(`${domain} on juba registreeritud.`) !== -1) {
            console.log('not yet free');
        } else {
            // sendMail(`domain ${domain} is avaialble, get it now quick`, domain);
            sendTelegramMessage(`domain ${domain} is avaialble, get it now quick`);
            console.log('available');
        }
        fs.writeFile('resp.html', content, function (err) {
        if (err) throw err;
            console.log('Saved!');
        });
        await instance.exit();
        console.log(new Date());
    }, 5000);
  
//   console.log(content);
};

function sendTelegramMessage(text) {
    request
    .get(`https://api.telegram.org/bot614305519:AAGPtbwfS6ZWav5qqMAvjNVpoCqa4DWmeYM/sendMessage?chat_id=553999286&text="${text}"`)
    .on('response', function(response) {
        console.log(response);
    })
}

function sendMail(text, domain) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'spicynella@gmail.com',
          pass: 'lbd7f3d4h'
        }
      });
      
      var mailOptions = {
        from: 'spicynella@gmail.com',
        to: 'andreisbitnev@gmail.com',
        subject: `domain ${domain}`,
        text,
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

setInterval(() => {
    checkDomain('softedo.ee');
}, (1000 * 60 * 5) + (getRandomInt(5, 55) * 1000));