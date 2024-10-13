import LiteYouTubeEmbed, { LiteYouTubeProps } from 'react-lite-youtube-embed';
import { Component } from '@/types/general';

export const YouTubeEmbed: Component<LiteYouTubeProps> = (props) => {
  return (
    <div className="aspect-[16/9]">
      <LiteYouTubeEmbed
        {...props}
        adNetwork={false}
      />
    </div>
  )
}