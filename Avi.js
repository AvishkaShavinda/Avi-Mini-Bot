const avi = async (Avi, m, { from, isGroup, prefix, command, args, isBotAdmin, isSenderAdmin }) => {
//© 𝙰𝚕𝚙𝚑𝚊 𝚅𝚒𝚜𝚒𝚘𝚗 𝙸𝚗𝚏𝚒𝚗𝚒𝚝𝚢
    const settings = require('./settings'); 
    const text = args.join(" ");

    switch (command) {
        case 'hi':
        case 'hello':
            await Avi.sendMessage(from, { text: 'Hello! I am Avi Mini. How can I help? 🤖' });
            break;
//© 𝙰𝚕𝚙𝚑𝚊 𝚅𝚒𝚜𝚒𝚘𝚗 𝙸𝚗𝚏𝚒𝚗𝚒𝚝𝚢
        case 'alive':
            await Avi.sendMessage(from, { text: '*AVI MINI BOT IS ACTIVE* 🚀\n\nModular System: Online ✅' });
            break;

        case 'kick':
            if (!isGroup) return Avi.sendMessage(from, { text: 'Group එකකදී විතරයි මේක වැඩ!' });
            if (!isBotAdmin) return Avi.sendMessage(from, { text: 'මම Admin නෙවෙයි මචං! 😐' });
            if (!isSenderAdmin) return Avi.sendMessage(from, { text: 'ඔයාට මේකට අවසර නැහැ!' });
            
            let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || m.message.extendedTextMessage?.contextInfo?.participant;
            if (!user) return Avi.sendMessage(from, { text: 'කාවද අයින් කරන්න ඕනේ? කෙනෙක්ව Mention කරන්න.' });
            
            await Avi.groupParticipantsUpdate(from, [user], 'remove');
            await Avi.sendMessage(from, { text: '✅ ඉවත් කිරීම සාර්ථකයි!' });
            break;

        case 'delete':
        case 'del':
            if (!m.message.extendedTextMessage?.contextInfo) return;
            await Avi.sendMessage(from, { delete: m.message.extendedTextMessage.contextInfo });
            break;

             case 'menu':
            let menuText = `*── 「 ${settings.BOT_NAME} 」 ──*\n\n` +
                           `✨ ${prefix}alive\n` +
                           `✨ ${prefix}kick\n` +
                           `✨ ${prefix}del\n` +
                           `✨ ${prefix}ping\n` +
                           `✨ ${prefix}statusview (on/off)\n\n` + // Database command එකත් එකතු කළා
                           `© 2025 AVI MINI SYSTEM`;
            
            // Image එකක් එක්ක Menu එක යැවීම
            await Avi.sendMessage(from, { 
                image: { url: settings.MENU_IMAGE_URL },
                caption: menuText 
            });
            break;

    }
};

module.exports = { avi };
