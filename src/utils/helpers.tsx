import moment from 'moment';
import {Message} from './types';

// Check if a message is image
export const checkIfImage = (fileUrl: string): boolean => {
  return (
    fileUrl.endsWith('.jpg') ||
    fileUrl.endsWith('.jpeg') ||
    fileUrl.endsWith('.png')
  );
};

// Check if a message is video
export const checkIfVideo = (fileUrl: string): boolean => {
  return (
    fileUrl.endsWith('.mp4') ||
    fileUrl.endsWith('.mov') ||
    fileUrl.endsWith('.avi')
  );
};

// Show the general date in chat for messages, like today, yesterday and so on
export const preprocessMessages = (messages: Message[]) => {
  let lastMessageDate: any = null;
  return messages.map(message => {
    const currentMessageDate = moment(message.createdAt).format('YYYY-MM-DD');
    const showDate = currentMessageDate !== lastMessageDate;
    lastMessageDate = currentMessageDate;
    return {...message, showDate};
  });
};
