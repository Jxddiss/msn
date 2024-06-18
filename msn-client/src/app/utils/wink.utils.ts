import { Wink } from "../model/wink.model";

export const WINKS : Wink[] = [
    new Wink("Kiss","assets/images/winks/kiss.gif", "assets/images/winks/kiss.png", "assets/sounds/kiss_wink.mp3",2),
    new Wink("Heart","assets/images/winks/heart.gif", "assets/images/winks/heart.png", "assets/sounds/heart.mp3",5),
    new Wink("Laughing Lady","assets/images/winks/laughing_lady.gif", "assets/images/winks/laughing_lady.png", "assets/sounds/laughing_lady.mp3",7),
    new Wink("Crying Child","assets/images/winks/crying_child.gif", "assets/images/winks/crying_child.png", "assets/sounds/crying_child.mp3",6),
    new Wink("Worship","assets/images/winks/worship.gif", "assets/images/winks/worship.png", "assets/sounds/worship.mp3",9),
    new Wink("Toc Toc Toc","assets/images/winks/toc.gif", "assets/images/winks/toc.png", "assets/sounds/toc.mp3",1),
    new Wink("Water Balloon","assets/images/winks/water_balloon.gif", "assets/images/winks/water_balloon.png", "assets/sounds/water_balloon.mp3",2.71),
    new Wink("Idea","assets/images/winks/bulb.gif", "assets/images/winks/bulb.png", "assets/sounds/bulb.mp3",5),
    new Wink("Boy peeking","assets/images/winks/sideway_man.gif", "assets/images/winks/sideway_man.png", "assets/sounds/sideway_man.mp3",6),
    new Wink("Dancing pig","assets/images/winks/dancing_pig.gif", "assets/images/winks/dancing_pig.png", "assets/sounds/dancing_pig.mp3",9),
]

export function getWink(imgWink : string) : Wink | null{
  return WINKS.find(wink => wink.imgPreview === imgWink) ?? null
}