import { Emoji } from "../model/emoji.model";

export function parseEmoji(message : string) : string{
    const regex = /\:[a-z0-9_\-\+]+\:/g;
    const matches = message.match(regex)
    if(!matches) return message
    let emojiToParse = message
    for(let i = 0; i < matches.length; i++){
        const match = matches[i]
        const emoji = match
        const emojiName = match.slice(1, -1)
        const emojiImage = getEmojiImg(match)
        emojiToParse = emojiToParse.replace(emoji, `<img class="message-emoji" src="assets/images/emojis/${emojiImage}" alt="" title="${emojiName}">`)
    }
    return emojiToParse
}

function getEmojiImg(emojiCode : string) : string{
    let emoji = EMOJIS.find(emoji => emoji.code === emojiCode)
    if(emoji){
        return emoji.img
    }

    return ""
}

export const EMOJIS : Emoji[] = [
  new Emoji(":angel_smile:", "angel_smile.png"),
  new Emoji(":angry_smile:", "angry_smile.png"),
  new Emoji(":confused_smile:", "confused_smile.png"),
  new Emoji(":cry_smile:", "cry_smile.gif"),
  new Emoji(":devil_smile:", "devil_smile.png"),
  new Emoji(":kiss:", "kiss.png"),
  new Emoji(":omg_smile:", "omg_smile.png"),
  new Emoji(":red_smile:", "red_smile.png"),
  new Emoji(":regular_smile:", "regular_smile.png"),
  new Emoji(":sad_smile:", "sad_smile.png"),
  new Emoji(":shades_smile:", "shades_smile.png"),
  new Emoji(":teeth_smile:", "teeth_smile.png"),
  new Emoji(":tongue_smile:", "tongue_smile.png"),
  new Emoji(":what_face:", "what_face.png"),
  new Emoji(":wink_smile:", "wink_smile.gif"),
  new Emoji(":zip:", "zip.png"),
  new Emoji(":side_eye:", "side_eye.png"),
  new Emoji(":multi_confused:", "multi_confused.png"),
  new Emoji(":look_up:", "look_up.png"),
  new Emoji(":glasses_smile:", "glasses_smile.png"),
  new Emoji(":disgusted:", "disgusted.png"),
  new Emoji(":angry:", "angry.png"),
  new Emoji(":birthday:", "birthday.gif"),
  new Emoji(":blaze:", "blaze.png"),
  new Emoji(":confused:", "confused.png"),
]