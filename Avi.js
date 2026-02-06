module.exports = async (Avi, m) => {
    try {
        const from = m.key.remoteJid;
        const body = m.message.conversation || m.message.extendedTextMessage?.text || "";
        const prefix = /^[./!#]/.test(body) ? body[0] : '#'; 
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : "";
        const args = body.trim().split(/ +/).slice(1);

        // --- Switch Statement ---
        switch (command) {
            case 'hi':
            case 'hello':
                await Avi.sendMessage(from, { text: 'Hello there! I am Avi Mini Bot. 🤖' });
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
        console.log('Error in Avi.js: ', err);
    }
}
