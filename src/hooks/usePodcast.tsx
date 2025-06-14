
import { useState, useRef, useCallback } from 'react';

interface PodcastState {
  isPlaying: boolean;
  currentNewsId: string | null;
  isLoading: boolean;
}

export const usePodcast = () => {
  const [state, setState] = useState<PodcastState>({
    isPlaying: false,
    currentNewsId: null,
    isLoading: false
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const stopCurrent = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (currentUtterance.current) {
      speechSynthesis.cancel();
      currentUtterance.current = null;
    }

    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentNewsId: null,
      isLoading: false
    }));
  }, []);

  const playPodcast = useCallback(async (newsId: string, text: string) => {
    // 如果正在播放相同的新闻，则暂停
    if (state.isPlaying && state.currentNewsId === newsId) {
      stopCurrent();
      return;
    }

    // 停止当前播放
    stopCurrent();

    setState(prev => ({
      ...prev,
      isLoading: true,
      currentNewsId: newsId
    }));

    try {
      // 使用Web Speech API进行文本转语音
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // 设置语音参数
        utterance.lang = 'zh-CN';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;

        // 选择中文语音（如果可用）
        const voices = speechSynthesis.getVoices();
        const chineseVoice = voices.find(voice => 
          voice.lang.includes('zh') || 
          voice.name.includes('Chinese') ||
          voice.name.includes('中文')
        );
        
        if (chineseVoice) {
          utterance.voice = chineseVoice;
        }

        utterance.onstart = () => {
          setState(prev => ({
            ...prev,
            isPlaying: true,
            isLoading: false
          }));
        };

        utterance.onend = () => {
          setState(prev => ({
            ...prev,
            isPlaying: false,
            currentNewsId: null,
            isLoading: false
          }));
          currentUtterance.current = null;
        };

        utterance.onerror = (error) => {
          console.error('语音播放错误:', error);
          setState(prev => ({
            ...prev,
            isPlaying: false,
            currentNewsId: null,
            isLoading: false
          }));
          currentUtterance.current = null;
        };

        currentUtterance.current = utterance;
        speechSynthesis.speak(utterance);
      } else {
        console.error('浏览器不支持语音合成');
        setState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('播客播放失败:', error);
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentNewsId: null,
        isLoading: false
      }));
    }
  }, [state.isPlaying, state.currentNewsId, stopCurrent]);

  return {
    ...state,
    playPodcast,
    stopPodcast: stopCurrent,
    isCurrentlyPlaying: (newsId: string) => state.isPlaying && state.currentNewsId === newsId
  };
};
