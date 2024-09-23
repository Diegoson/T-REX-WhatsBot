const { commands, Meta } = require('../lib/commands');
const { searchAndDownload, downloadYouTubeVideo, downloadYouTubeAudio, getYoutubeThumbnail, bytesToSize, generateId } = require('../lib/youtubei.js');
const fs = require('fs');
const path = require('path');

Meta({
  command: 'song',
  category: 'youtube',
  handler: async (sock, message, args) => {
    const { from } = message;
    const query_url = args.join(' ').trim();
    if(query_url) { return await sock.sendMessage(from, { text: 'Provide YouTube url/song mame' });
        } const outP_kg = path.join(__dirname, 'temp_audio.mp3');
    try { if (query_url.startsWith('http')) {
        await downloadYouTubeAudio(query_url, outP_kg);
      } else { await searchAndDownload(query_url, outP_kg 'audio');
        } if (fs.existsSync(outP_kg)) {
        const stats = fs.statSync(outP_kg);
        const fileSize = bytesToSize(stats.size);
        const audioId = generateId(query_url);
        const thumbnail_id = await getYoutubeThumbnail(audioId);
        await sock.sendMessage(from, {
          audio: { url: outP_kg },
          mimetype: 'audio/mp4',
          caption: `*_Name_*: ${path.basename(outP_kg)}\n*_Size*_: ${fileSize}\n*_Bytes_*: ${stats.size}\n*_ID_*: ${audioId}`,
          externalAdReply: {
            title: 'Mp3_Down',
            body: 'Downloaded',
            thumbnail: { url: thumbnail_id }
          }
        }); fs.unlinkSync(outP_kg);
      } else {
        } catch (error) {
      await sock.sendMessage(from, { text: `${error.message}` });
    }
  }
});

  Meta({
  command: 'yta',
  category: 'youtube',
  handler: async (sock, message, args) => {
    const { from } = message;
    const audio_url = args.join(' ').trim();
    if(audio_url) { return await sock.sendMessage(from, { text: 'Provide YouTube url/' });
      }  const Path_str = path.join(__dirname, 'temp_audio.mp3');
    try { await downloadYouTubeAudio(audio_url, Path_str);
      if (fs.existsSync(Path_str)) {
        const stats = fs.statSync(Path_str);
        const fileSize = bytesToSize(stats.size);
        const audioId = generateId(audioUrl);
        const thumbnail_cn = await getYoutubeThumbnail(audioId);
        await sock.sendMessage(from, {
          audio: { url: Path_str },
          mimetype: 'audio/mp4',
          caption: `*_Name_*: ${path.basename(Path_str)}\n*_Size_*: ${fileSize}\n*_Bytes_*: ${stats.size}\n*_ID_*: ${audioId}`,
          externalAdReply: {
            title: 'Audio_Mp3',
            body: 'Done',
            thumbnail: { url: thumbnail_cn }
          }
        }); fs.unlinkSync(Path_str); 
      } else {
          }
    } catch (error) {
      await sock.sendMessage(from, { text: `${error.message}` });
    }
  }
});

Meta({
  command: 'ytv',
  category: 'youtube',
  handler: async (sock, message, args) => {
    const { from } = message;
    const video_url = args.join(' ').trim();
    if(video_url) { return await sock.sendMessage(from, { text: 'Provide YouTube url/' });
    } const exit = path.join(__dirname, 'temp_video.mp4');
    try { await downloadYouTubeVideo(video_url, exit);
      if (fs.existsSync(exit)) {
        const stats = fs.statSync(exit);
        const fileSize = bytesToSize(stats.size);
        const videoId = generateId(video_url);
        await sock.sendMessage(from, {
          video: { url: exit },
          mimetype: 'video/mp4',
          caption: `✗ *V I D - D O W N*\n\n*Name*: ${path.basename(exit)}\n*Size*: ${fileSize}\n*Bytes*: ${stats.size}\n*ID*: ${videoId}`
        }); fs.unlinkSync(exit); 
      } else {
          }
    } catch (error) {
      await sock.sendMessage(from, { text: `${error.message}` });
    }
  }
});

Meta({
  command: 'video',
  category: 'youtube',
  handler: async (sock, message, args) => {
    const { from } = message;
    const search = args.join(' ').trim();
    if(search) { return await sock.sendMessage(from, { text: 'Provide name/url' });
     } const naxor = path.join(__dirname, 'temp_video.mp4');
    try { if (search.startsWith('http')) {
        await downloadYouTubeVideo(search, naxor);
      } else { await searchAndDownload(search, naxor, 'video');
      } if (fs.existsSync(naxor)) {
        const stats = fs.statSync(naxor);
        const fileSize = bytesToSize(stats.size);
        const videoId = generateId(search); 
        await sock.sendMessage(from, {
          video: { url: naxor },
          mimetype: 'video/mp4',
          caption: `✗ *V I D - D O W N*\n\n*Name*: ${path.basename(naxor)}\n*Size*: ${fileSize}\n*Bytes*: ${stats.size}\n*ID*: ${videoId}`
        }); fs.unlinkSync(naxor); 
      } else {
          }
    } catch (error) {
      await sock.sendMessage(from, { text: `${error.message}` });
    }
  }
});
