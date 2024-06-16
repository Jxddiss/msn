import { Message } from "../model/message.model";

const MESSAGES : Message[] = [
    new Message(1, 'Hello :birthday:, I am John Doe :angel_smile:', new Date(), 'John Doe', 'text', 1),
    new Message(2, ':birthday: SAlljipjoirg rettr retrtert:shades_smile::kiss::blaze::devil_smile:terertre etrert ertret:bruh::\(O_O\)::=P:', new Date(), 'John Doe', 'text', 1),
    new Message(3, 'Hello :birthday:, I am John Doe :angel_smile:', new Date(), 'John Doe', 'text', 1),
    new Message(4, 'Hello :birthday:, I am John Doe :angel_smile:', new Date(), 'John Doe', 'text', 1),
    new Message(5, ':birthday: SAlljipjoirg rettr retrtert:shades_smile::kiss::blaze::devil_smile:terertre etrert ertret:bruh::\(O_O\)::=P:', new Date(), 'John Doe', 'text', 1),
    new Message(6, 'Hello :birthday:, I am John Doe :angel_smile:', new Date(), 'John Doe', 'text', 2),
    new Message(7, ':birthday: SAlljipjoirg rettr retrtert:shades_smile::kiss::blaze::devil_smile:terertre etrert ertret:bruh::\(O_O\)::=P:', new Date(), 'John Doe', 'text', 2),
    new Message(8, 'Hello :birthday:, I am John Doe :angel_smile:', new Date(), 'John Doe', 'text', 2),
    new Message(9, 'Hello :birthday:, I am John Doe :angel_smile:', new Date(), 'John Doe', 'text', 2),
    new Message(10, ':birthday: SAlljipjoirg rettr retrtert:shades_smile::kiss::blaze::devil_smile:terertre etrert ertret:bruh::\(O_O\)::=P:', new Date(), 'John Doe', 'text', 2),
    new Message(11, 'Hello :birthday:, I am John Doe :angel_smile:', new Date(), 'John Doe', 'text', 3),
    new Message(12, ':birthday: SAlljipjoirg rettr retrtert:shades_smile::kiss::blaze::devil_smile:terertre etrert ertret:bruh::\(O_O\)::=P:', new Date(), 'John Doe', 'text', 3),
    new Message(13, 'Hello :birthday:, I am John Doe :angel_smile:', new Date(), 'John Doe', 'text', 3),
    new Message(14, 'https://images.pexels.com/photos/7408586/pexels-photo-7408586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', new Date(), 'John Doe', 'image', 1),
    new Message(15, 'https://images.pexels.com/photos/7408586/pexels-photo-7408586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', new Date(), 'John Doe', 'image', 2),
    new Message(16, 'https://images.pexels.com/photos/7408586/pexels-photo-7408586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', new Date(), 'John Doe', 'image', 3),
    new Message(17, '', new Date(), 'John Doe', 'interaction', 1,null,'kiss'),
]

export function getMessages(idConversation : number) : Message[]{
    return MESSAGES.filter(message => message.idConversation == idConversation);
}

export function sendMessage(message : Message) : Message{
    MESSAGES.push(message);
    return message;
}