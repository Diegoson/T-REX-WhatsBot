const { commands, Meta } = require('../lib');
const fs = require('fs');
const config = require('../config');
const path = require('path');
const { MessageType } = require('@adiwajshing/baileys');

Meta({
  command: 'setsudo',
  category: 'owner',
  usage: 'prefix/$number',
  handler: async (sock, message, args, author, languages) => {
    const { from } = message;
    if (!author) {
      await sock.sendMessage(from, { text: languages[config.LANGUAGE].OWNER_MSG });
      return;
    }  if (args.length !== 1) {
      await sock.sendMessage(from, { text: '*_provide a valid_number_*' });
      return;
    } const sec_vum = args[0].replace('@s.whatsapp.net', '');
    let mods = process.env.MODS ? JSON.parse(process.env.MODS) : [];
    if (mods.includes(`${sec_vum}@s.whatsapp.net`)) {
      await sock.sendMessage(from, { text: '*_already a mode_*' });
      return;
    }  mods.push(`${sec_vum}@s.whatsapp.net`);
    process.env.MODS = JSON.stringify(mods);
    await sock.sendMessage(from, { text: `${sec_vum} *done*` });
  }
});

Meta({
  command: 'exe',
  category: 'owner',
  filename: __filename,
  handler: async (sock, message, args, author, languages) => {
    const { from } = message;
    if(!author) {
      return sock.sendMessage(from, { text: languages[config.LANGUAGE].OWNER_MSG}, MessageType.text);
    const [Ext] = args;
    if (!Ext) {
      return sock.sendMessage(from, { text: 'Please provide a filename\n naxor.js' }, { quoted: message });
    }   const fileExt = path.extname(Ext);
    if (fileExt !== '.js') {
      return sock.sendMessage(from, { text: '*Only .js files*' }, { quoted: message });
    }   const filePath = path.join(__dirname, Ext);
      try {
      if (!fs.existsSync(filePath)) {
        return sock.sendMessage(from, { text: '*_File not found_*' }, { quoted: message });
      } const code = fs.readFileSync(filePath, 'utf8');
      const sandbox = { sock, from, console, require };
      const func = new Function('sandbox', 'with (sandbox) { ' + code + ' }');
      func(sandbox);
    } catch (error) {
      console.error(error);
          }
  },
});

Meta({
  command: 'lang',
  category: 'owner',
  filename: __filename,
  handler: async (sock, message, args, author, languages) => {
    const { from } = message;
if(!author){
return sock.sendMessage(from,{text: languages[config.LANGUAGE].OWNER_MSG});
    if (!args.length) {
      await sock.sendMessage(from, { text: `languages: en, sn, ml, zu` });
      return;
    }
    const newLang = args[0].toLowerCase();
    if (!['en', 'sn', 'ml', 'zu'].includes(newLang)) {
      await sock.sendMessage(from, { text: 'Please choose from: en, sn, ml, zu' });
      return;
    } config.LANGUAGE = newLang;
    await sock.sendMessage(from, { text: `Language changed:${newLang}` });
  },
});

Meta({
  command: 'cmd',
  category: 'owner',
  filename: __filename,
  handler: async (sock, message, args, author, languages) => {
    
    const { from } = message;
commands.forEach(cmd => {
  if (cmd.enabled === undefined) {
    cmd.enabled = true; 
    cmd.get_time = null;
  }
});
    if (!author) {
      return sock.sendMessage(from, { text: languages[config.LANGUAGE].OWNER_MSG });
    } if (args.length < 2) {
      return sock.sendMessage(from, { text: "*cmd* <enable|disable> <command_name>" });
    } const action = args[0].toLowerCase();
    const cmd_naxor = args[1].toLowerCase();
const toggle_cmd = commands.find(cmd => cmd.command === cmd_naxor);
    if (!toggle_cmd) {
      return sock.sendMessage(from, { text: `"${cmd_naxor}" not found` });
    }
if (action === 'enable') {
      toggle_cmd.enabled = true;
      toggle_cmd.get_time = null;
      sock.sendMessage(from, { text: `"${cmd_naxor}" has been enabled` });
    } else if (action === 'disable') {
      toggle_cmd.enabled = false;
      toggle_cmd.get_time = new Date();
      sock.sendMessage(from, { text: `"${cmd_naxor}" has been disabled` });
    } else {
      sock.sendMessage(from, { text: "*use* 'enable' or 'disable'" });
    }
  }
});
sock.on('message', async message => {
  const { from, body } = message;
  const args = body.trim().split(/\s+/);
  const cmd_naxor = args[0].toLowerCase();
  const command = commands.find(cmd => cmd.command === cmd_naxor);
  if (!command) return; 
  if (!command.enabled) {
    const get_time = command.get_time ? command.get_time.toLocaleString() : "";
    const x_astral_cn = `*Command:* ${command.command}_disabled_\n*Time:* _${get_time}_\n*Category:* _${command.category}_`;
    return sock.sendMessage(from, { text: x_astral_cn });
  }  if (typeof command.handler === 'function') {
    await command.handler(sock, message, args);
  }
});

Meta({
  command: 'status',
  category: 'owner',
  filename: __filename,
  handler: async (sock, message, args, author, languages) => {
    const { from } = message;
    if (!author) {
      return sock.sendMessage(from, { text: languages[config.LANGUAGE].OWNER_MSG });
    }   if (args.length < 1) {
      return sock.sendMessage(from, { text: "*status* <command_name>" });
    }   const naxors = args[0].toLowerCase();
    const command = commands.find(cmd => cmd.command === naxors);
    const str_z = `*CMD:* ${command.command}\n*Status:* ${command.enabled ? 'Enabled' : 'Disabled'}\n${command.get_time ? '*Time:* ' + command.get_time.toLocaleString() : ''}`;
    return sock.sendMessage(from, { text: str_z});
  }
});

Meta({
    command: 'antilink ?(*)',
    category: 'group',
    handler: async (sock, args, message, isGroup, author) => {
        const { from } = message;

      if (!isGroup) {
            await sock.sendMessage(from, { text: 'This command can be used in a group' });
            return;
        } if (!author) {
            await sock.sendMessage(from, { text: 'Youre not allowed' });
            return;
         } if (!config.antilink) {
            config.antilink = {};
        } const enableCmd = ['on', 'enable'];
        const disableCmd = ['off', 'disable'];
        const Cmd = ['info'];
        if (enableCmd.includes(args[0])) {
            if (config.antilink[from]) {
                await sock.sendMessage(from, { text: 'Antilink is already enabled' });
            } else {
                config.antilink[from] = true;
                await sock.sendMessage(from, { text: 'Antilink has been enabled' });
            }
        } else if (disableCmd.includes(args[0])) {
            if (!config.antilink[from]) {
                await sock.sendMessage(from, { text: 'Antilink is already disabled' });
            } else {
                config.antilink[from] = false;
                await sock.sendMessage(from, { text: 'Antilink has been disabled' });
            } } else if (Cmd.includes(args[0])) {
            const status = config.antilink[from] ? 'ON' : 'OFF';
            const footer = `*ANTILINK MANAGER*\nStatus: ${status}`;
            await sock.sendMessage(from, { text: footer });
        } else {
            await sock.sendMessage(from, { text: `${config.PREFIX}antilink "on", "off", "enable", "disable", or "info"` });
        }
    }
});
                                   
