'use client'
import EmojiPicker from 'emoji-picker-react';

interface CustomEmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose?: () => void;
}

export default function CustomEmojiPicker({ onSelect }: CustomEmojiPickerProps) {
  return (
    <div className="absolute bottom-20 left-0 z-50">
      <div className="shadow-lg rounded-lg">
        <EmojiPicker
          onEmojiClick={(emojiObject) => {
            onSelect(emojiObject.emoji);
          }}
          width={300}
          height={400}
        />
      </div>
    </div>
  );
}