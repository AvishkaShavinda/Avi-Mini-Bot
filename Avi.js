const fs = require('fs');
const chalk = require('chalk'); 
const moment = require('moment-timezone');


module.exports = async (Avi, m) => {
    try {
        const from = m.key.remoteJid;
        const body = m.message.conversation || m.message.extendedTextMessage?.text || "";
        const prefix = /^[./!#]/.test(body) ? body[0] : '#'; 
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : "";
        const args = body.trim().split(/ +/).slice(1);



        // --- [ CONSOLE LOGGER ] ---
        const time = moment.tz('Asia/Colombo').format('HH:mm:ss');
        const name = m.pushName || 'Unknown User';
        const groupName = from.endsWith('@g.us') ? 'Group' : 'Private';

        if (isCmd) {
            console.log(chalk.black(chalk.bgGreen(`[ CMD ]`)), chalk.grey(`${time}`), chalk.cyan(`${prefix}${command}`), chalk.blue(`from ${name}`), chalk.yellow(`in ${groupName}`));
        } else if (body) {
            console.log(chalk.black(chalk.bgWhite(`[ MSG ]`)), chalk.grey(`${time}`), chalk.white(body.length > 30 ? body.substring(0, 30) + '...' : body), chalk.blue(`from ${name}`));
        }
        // ---------------------------






        // --- Switch Statement ---
        switch (command) {
            case 'hi':
            case 'hello':
                await Avi.sendMessage(from, { text: 'Hello there! I am Avi Mini Bot. 🤖' });
                break;


case 'hirunews': {
  try {
  const res = await fetch('https://hirunews.vercel.app/api/latest-news?limit=2');
    const json = await res.json();
    if (!json.success || !json.data || json.data.length === 0) {
      return m.reply('🛑 මේ මොහොතේ පුවත් ලබාගත නොහැක.');
    }

    const news = json.data[0]; // පළවෙනි පුවත ලබාගැනීම

    let message = `📰 *HIRU NEWS LATEST*\n\n`;
    message += "🗞️ *ශීර්ෂය:* " + news.headline;
    message += "\n📅 *දිනය:* " + news.date;
    message += "\n📝 *විස්තරය:* " + news.summary;
    message += "\n🔗 *Link:* " + news.url;
    message += "\n\n*𝙰𝚕𝚙𝚑𝚊 𝚅𝚒𝚜𝚒𝚘𝚗 𝙸𝚗𝚏𝚒𝚗𝚒𝚝𝚢* ☑️";

    await Avi.sendMessage(form, {
      image: { url: news.thumbnail }, // 'image' වෙනුවට 'thumbnail'
      caption: message,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: my.ch,
          serverMessageId: null,
          newsletterName: 'PRINCE-AVI-MD'
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('❌ පුවත් ලබාගැනීමේදී සර්වර් දෝෂයක් සිදුවී ඇත.');
  }
}
break;


case 'ali':
                await Avi.sendMessage(from, { text: '*AVI MINI IS ONLINE* 🚀\n\nStatus: Healthy ✅' });
                break;


            case 'alive':
                await Avi.sendMessage(from, { text: '*AVI MINI IS ONLINE* 🚀\n\nStatus: Healthy ✅' });
                break;

            case 'menu':
                let menuText = `*── 「 AVI MINI MENU 」 ──*\n\n` +
                             `✨ ${prefix}hi\n` +
                             `✨ ${prefix}alive\n` +
                             `✨ ${prefix}ping\n\n` +
                             `© 2025 AVI MINI SYSTEM`;
                await Avi.sendMessage(from, { text: menuText });
                break;

            case 'ping':
                await Avi.sendMessage(from, { text: 'Pong! 🏓' });
                break;

            default:
                if (isCmd) {
                    await Avi.sendMessage(from, { text: 'සොරි මචං, ඔය Command එක මම දන්නේ නැහැ. 😐' });
                }
        }
    } catch (err) {
    // {console.log('Error in Avi.js: ', err);  }
    
let msg;
        console.log(e);
		const errorKey = e?.code || e?.name || e?.message?.slice(0, 100) || 'unknown_error';
		const now = Date.now();
		if (!errorCache[errorKey]) errorCache[errorKey] = [];
		errorCache[errorKey] = errorCache[errorKey].filter(ts => now - ts < 600000);
		if (errorCache[errorKey].length >= 3) return;
		errorCache[errorKey].push(now);
		if (e?.status === 404) msg = 'Resource not found (404).'
		else if (e?.status === 403) msg = 'Access restricted (403).'
		else if (e?.code === 'ETIMEDOUT') msg = 'It seems like the server is taking too long to respond. Try checking your internet connection..'
		else if (e?.code === 'ENOTFOUND') msg = 'It looks like the server was not found. Check your internet connection..'
		else if (e?.code === 'ERR_OSSL_BAD_DECRYPT') msg = 'It looks like an error occurred while decrypting the data. Make sure the key is valid.'
		else if (e?.name === 'TypeError') msg = 'There seems to be a problem with the data type being used.'
		else if (e?.name === 'ReferenceError') msg = 'It looks like there is a variable that has not been defined yet.'
		else if (e?.name === 'SessionError') msg = 'There seems to be a problem with the session. Make sure everything is connected properly.'
		else if (e?.name === 'AxiosError') msg = 'There seems to be a problem with data retrieval, please check the connection.'
		else if (e?.message?.includes('not-acceptable') || e?.data === 406) msg = 'The request was not accepted by the server (406 Not Acceptable). Check that the format and content of the request are correct.'
		else if (e?.output?.statusCode === 408 || e?.message?.includes('Timed Out')) msg = 'It looks like the request has exceeded the time limit, please try again later.'
		else if (e?.output?.statusCode === 404 || e?.message?.includes('myAppStateKey')) msg = 'It looks like the state key was not found, please try again later.'
		else if (e?.output?.statusCode === 500 || e?.message?.includes('internal-server-error')) msg = 'It seems there was an error in the server, please try again later.'
		else if (e?.message?.includes('Media upload failed on all hosts')) msg = 'It seems like media upload failed, try checking server settings.'
		else if (e?.message?.includes('No sessions')) msg = 'It looks like the session was not found, maybe the bot will not respond.'
		else if (e?.message?.includes('Cannot find ffmpeg')) msg = 'It seems that ffmpeg is not installed on the system, please install it first.'
		else if (e?.message?.includes('Cannot find module')) msg = 'It seems that there is a module that is not installed in the system, please install it first.'
		if (msg) {
			m.reply(msg + '\n\nError: ' + (e?.name || e?.code || e?.output?.statusCode || e?.status || 'Unknown') + '\nLog Error Telah dikirim ke Owner\n\n')
		}
		return Avishka.sendFromOwner(owner, `Hi dear, it seems like there is an error, don't forget to fix it, okay?\n\nVersion : *${require('./package.json').version}*\n\n*Log error:*\n\n` + util.format(e), m, { contextInfo: { isForwarded: true }})
	}
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
});
