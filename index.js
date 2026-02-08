const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    Browsers, 
    delay, 
    DisconnectReason 
} = require('baileys');
const pino = require('pino');
const readline = require('readline');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');

const color = {
    cyan: '\x1b[36m', green: '\x1b[32m', yellow: '\x1b[33m', 
    red: '\x1b[31m', magenta: '\x1b[35m', reset: '\x1b[0m', bold: '\x1b[1m'
};

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => rl.question(text, (answer) => { rl.close(); resolve(answer); }));
};

async function startAvi() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    
    const Avi = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.ubuntu('Chrome'),
        auth: state
    });

    if (!Avi.authState.creds.registered) {
        let phoneNumber = await question(`${color.cyan}ඔයාගේ නම්බර් එක ඇතුළත් කරන්න (947xxxxxxxxx): ${color.reset}`);
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        console.log(`${color.yellow}🔄 Pairing Code එක ඉල්ලමින් පවතී...${color.reset}`);
        await delay(3000);
        let code = await Avi.requestPairingCode(phoneNumber);
        console.log(`${color.green}${color.bold}✅ ඔයාගේ Pairing Code එක: ${code?.match(/.{1,4}/g)?.join('-')}${color.reset}\n`);
    }

    Avi.ev.on('creds.update', saveCreds);
    
        // --- Auto Status View Logic ---
    Avi.ev.on('messages.upsert', async (chat) => {
        const settings = require('./settings');
        const m = chat.messages[0];
        
        if (settings.AUTO_STATUS_VIEW && m.key.remoteJid === 'status@broadcast') {
            await Avi.readMessages([m.key]);
            const sender = m.pushName || 'Someone';
            console.log(`${color.magenta}👀 [STATUS VIEW]${color.reset} Viewed status from: ${color.bold}${sender}${color.reset}`);
        }
    });
    
    
    
Avi.copyNForward = async (jid, message, forceForward = false, options = {}) => {
    let vtype
    if (options.readViewOnce) {
        message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
        vtype = Object.keys(message.message.viewOnceMessage.message)[0]
        delete(message.message?.viewOnceMessage?.message[vtype].viewOnce)
        message.message = { ...message.message.viewOnceMessage.message }
    }
    let mtype = Object.keys(message.message)[0]
    let content = await Avi.generateForwardMessageContent(message, forceForward)
    let ctype = Object.keys(content)[0]
    let context = {}
    if (mtype != "conversation") context = message.message[mtype].contextInfo
    content[ctype].contextInfo = { ...context, ...content[ctype].contextInfo }
    const waMessage = await Avi.prepareWAMessageMedia(content[ctype], { upload: Avi.waUploadToServer })
    return await Avi.sendMessage(jid, { [ctype]: waMessage.message[ctype], ...content[ctype] }, { ...options })
}


    

    Avi.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            console.log(`
${color.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${color.reset}
${color.green}${color.bold}   🚀 AVI MINI BOT IS NOW ONLINE! 👊😈 ${color.reset}
${color.magenta}   User: ${color.reset}${Avi.user.name || 'Avi Mini'}
${color.magenta}   ID: ${color.reset}${Avi.user.id.split(':')[0]}
${color.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${color.reset}
            `);
        }
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason !== DisconnectReason.loggedOut) { 
                console.log(`${color.yellow}🔄 Reconnecting... (Reason: ${reason})${color.reset}`);
                startAvi(); 
            } else {
                console.log(`${color.red}❌ Logged out! Please delete session folder.${color.reset}`);
            }
        }
    });

    Avi.ev.on('messages.upsert', async (chat) => {
        const { handler } = require('./handler');
        await handler(Avi, chat);
    });

    const watchFile = (filePath) => {
        if (fs.existsSync(filePath)) {
            fs.watchFile(path.resolve(filePath), () => {
                console.log(`${color.yellow}${color.bold}♻️  [UPDATE]${color.reset} ${color.cyan}${filePath}${color.reset} updated!`);
                delete require.cache[require.resolve(filePath)];
            });
        }
    };
    watchFile('./handler.js');
    watchFile('./avi.js');
}

startAvi();
