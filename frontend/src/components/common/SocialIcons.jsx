import React from 'react';
import { Camera, Video, Globe, MessageCircle, Share2 } from 'lucide-react';

export function InstagramIcon({ size = 18, color = '#EC4899' }) {
  return <Camera size={size} color={color} />;
}

export function YoutubeIcon({ size = 18, color = '#EF4444' }) {
  return <Video size={size} color={color} />;
}

export function TwitterIcon({ size = 18, color = '#38BDF8' }) {
  return <Share2 size={size} color={color} />;
}

export function LinkedinIcon({ size = 18, color = '#60A5FA' }) {
  return <Globe size={size} color={color} />;
}
