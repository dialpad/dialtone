/* eslint-disable complexity */
const fs = require('fs');
const iconRegex = /.*@dialpad\/dialtone\/(vue\/.*|.+\.svg)/gim;
const brandIconsList = [
  'IconAirtable',
  'IconAmex',
  'IconAppStoreBadge',
  'IconApple',
  'IconAsana',
  'IconBrandDialpadMeetings',
  'IconBrandDialpad',
  'IconBullhorn',
  'IconClockify',
  'IconCopperCrm',
  'IconDialpadAi',
  'IconDinersClub',
  'IconDiscover',
  'IconEvernote',
  'IconFacebook',
  'IconFreshsalesCrm',
  'IconFront',
  'IconGmail',
  'IconGoogleBusinessMessaging',
  'IconGoogleCalendar',
  'IconGoogleDocs',
  'IconGoogleDrive',
  'IconGoogleGlyph',
  'IconGreenhouse',
  'IconHighfive',
  'IconHubspot',
  'IconInstagram',
  'IconIntercom',
  'IconJcb',
  'IconJiraServiceDesk',
  'IconLineMessenger',
  'IconLinkedin',
  'IconMaestro',
  'IconMastercard',
  'IconMessenger',
  'IconMicrosoftDynamics365',
  'IconMicrosoftTeams',
  'IconMicrosoft',
  'IconMiro',
  'IconMondayCom',
  'IconOffice365',
  'IconPipedrive',
  'IconPlayStoreBadge',
  'IconSalesforceGlyph',
  'IconSalesforceLogo',
  'IconServicenow',
  'IconSlack',
  'IconSnapchat',
  'IconTelegram',
  'IconTiktok',
  'IconToggl',
  'IconTwitter',
  'IconUnionPay',
  'IconViber',
  'IconVisa',
  'IconWeChat',
  'IconWhatsapp',
  'IconZendesk',
  'IconZohoCrm',
  'IconZohoDesk',
  'IconZoho',
  'IconZoom',
];
let totalIconsCount = 0;

function isBrandIcon (source) {
  const iconName = source.split('/').pop().slice(0, -2);
  return brandIconsList.includes(iconName);
}
const main = (files, noLineNumbers) => {
  try {
    for (const file of files) {
      const data = fs.readFileSync(file, 'utf8');
      const lines = data.split('\n');
      let iconCount = 0;

      for (const [lineNumber, line] of lines.entries()) {
        const iconMatch = iconRegex.exec(line);
        // If import doesn't match or is a brand or spot icon, continue
        if (!iconMatch ||
            iconMatch.input.includes('/brand/') ||
            iconMatch.input.includes('/spot/') ||
            isBrandIcon(iconMatch.input)) continue;

        if (!noLineNumbers) {
          console.log(`\tdeprecated icon usage found on line ${lineNumber + 1}: ${iconMatch.input}`);
        }
        iconCount++;
        totalIconsCount++;
      }
      if (iconCount > 0) {
        console.log(`${file}: ${iconCount} Deprecated icons found`);
      }
    }
    console.log(`Found ${totalIconsCount} total deprecated icons usage in this directory.`);
  } catch (err) {
    console.error(err);
  }
};

module.exports = main;
