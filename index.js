const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    Browsers, 
    delay, 
    fetchLatestBaileysVersion
} = require('baileys');
const pino = require('pino');
const readline = require('readline');
const { Boom } = require('@hapi/boom');

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => rl.question(text, (answer) => { rl.close(); resolve(answer); }));
};

async function startAviMini() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const Avi = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.ubuntu('Chrome'),
        auth: state
    });

    // --- Pairing Code Logic ---
    if (!Avi.authState.creds.registered) {
        let phoneNumber = await question('ඔයාගේ නම්බර් එක ඇතුළත් කරන්න (947xxxxxxxxx): ');
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        
        console.log('🔄 Pairing Code එක ඉල්ලමින් පවතී...');
        await delay(3000); 
        let code = await Avi.requestPairingCode(phoneNumber);
        console.log(`\n✅ ඔයාගේ Pairing Code එක: ${code?.match(/.{1,4}/g)?.join('-') || code}\n`);
    }

    Avi.ev.on('creds.update', saveCreds);

    Avi.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            console.log('\n🚀 AVI MINI BOT ONLINE! 👊😈\n');
        }
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            console.log(`❌ Connection closed. Reason: ${reason}`);
            startAviMini();
        }
    });

    // --- Message Handling (External Avi.js) ---
    Avi.ev.on('messages.upsert', async (chat) => {
        try {
            const m = chat.messages[0];
            if (!m.message || m.key.fromMe) return;
            // Avi.js එකට message එක යවනවා
            require('./Avi')(Avi, m);
        } catch (err) {
            console.log(err);
        }
    });
}

startAviMini();
