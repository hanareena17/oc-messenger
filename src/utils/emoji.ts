
const EMOJI_MAP: Record<string, string> = {
  ':smile:': '😄',
  ':grinning:': '😀',
  ':joy:': '😂',
  ':wink:': '😉',
  ':heart:': '❤️',
  ':thumbsup:': '👍',
  ':cry:': '😢',
  ':angry:': '😠',
  ':ok_hand:': '👌',
  ':clap:': '👏',
  ':fire:': '🔥',
  ':star:': '⭐',
};

export function parseEmojiShorthand(input: string): string {
  if (!input) return '';
 
  return input.replace(/:[a-zA-Z0-9_+-]+:/g, (match) => EMOJI_MAP[match] ?? match);
}


