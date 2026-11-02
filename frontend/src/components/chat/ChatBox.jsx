import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import apiService from '../../api/apiService';
import { 
  Send, MessageSquare, ArrowLeft, RefreshCw, Sparkles, User, AlertCircle, 
  Search, CheckCheck, Phone, Video, Info, Mic, Image as ImageIcon, Smile, 
  Heart, X, ExternalLink, ShieldCheck, Star, Play, Check, Maximize2, Minimize2, ChevronDown
} from 'lucide-react';

export default function ChatBox() {
  const { user } = useAuth();
  const { influencers } = useData() || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const prevMsgCountRef = useRef(0);
  const fileInputRef = useRef(null);
  const isUserScrolledUpRef = useRef(false);

  const urlConvId = searchParams.get('conversationId') || searchParams.get('conversation');

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  
  // Mobile toggle state
  const [showMobileChat, setShowMobileChat] = useState(false);
  // Info drawer state
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  // Post card modal state
  const [showPostModal, setShowPostModal] = useState(false);
  // Voice note simulation state
  const [isRecording, setIsRecording] = useState(false);
  // True fullscreen view toggle state
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Scroll to bottom button visibility
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

  // Helper to show brief toast notification
  const showToast = (text) => {
    setToastMsg(text);
    setTimeout(() => setToastMsg(''), 2500);
  };

  // Helper to resolve real partner name & profile details
  const resolvePartnerInfo = (c) => {
    if (!c) return { 
      name: 'User', 
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 
      role: 'User', 
      category: 'Member',
      is_online: false,
      active_status: ''
    };

    const partnerId = Number(c.partner_id || (Number(c.participant_one_id) === Number(user?.id) ? c.participant_two_id : c.participant_one_id));
    
    // Check dynamic live status
    const isOnline = Boolean(c.is_online);
    const activeStatus = isOnline ? 'Active now' : '';

    // 1. Match from DataContext influencers list
    const matchedInf = (influencers || []).find(i => Number(i.user_id) === partnerId || Number(i.id) === partnerId);
    if (matchedInf) {
      return {
        id: matchedInf.id,
        partner_id: partnerId,
        name: matchedInf.name,
        username: matchedInf.username || `@${matchedInf.name.toLowerCase().replace(/\s+/g, '_')}`,
        avatar: matchedInf.avatar,
        role: 'Creator',
        category: matchedInf.category || 'Influencer',
        verified: matchedInf.verified,
        rating: matchedInf.rating || 4.9,
        starting_price: matchedInf.starting_price || 15000,
        bio: matchedInf.bio || 'Verified content creator on Collabefy.',
        city: matchedInf.city || 'Mumbai',
        is_online: isOnline,
        active_status: activeStatus
      };
    }

    // 2. Check if partner_name from API response is valid (not generic User #X)
    if (c.partner_name && !c.partner_name.startsWith('User #')) {
      return {
        id: partnerId,
        partner_id: partnerId,
        name: c.partner_name,
        username: `@${c.partner_name.toLowerCase().replace(/\s+/g, '_')}`,
        avatar: c.partner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: c.partner_role || 'User',
        category: c.partner_category || 'Member',
        verified: c.partner_role === 'Creator',
        rating: 4.85,
        starting_price: 15000,
        bio: 'Member on Collabefy creator network.',
        city: 'Mumbai',
        is_online: isOnline,
        active_status: activeStatus
      };
    }

    // 3. Fallback dictionary map for platform users & creators
    const demoMap = {
      1: { name: 'Admin System', username: '@collabefy_admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', role: 'Admin', category: 'Platform', verified: true, rating: 5.0, starting_price: 0, bio: 'Official Collabefy system administrator.', city: 'Bangalore' },
      2: { name: 'Rohan Sharma', username: '@techgear_rohan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'User', category: 'Brand Client', verified: true, rating: 4.9, starting_price: 25000, bio: 'Marketing lead at TechGear Inc.', city: 'Delhi' },
      3: { name: 'Vikram Seth', username: '@fitlife_vikram', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', role: 'User', category: 'Tech Brand', verified: false, rating: 4.8, starting_price: 20000, bio: 'Brand director at FitLife.', city: 'Bengaluru' },
      4: { name: 'Aanya Verma', username: '@aanya_styles', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', role: 'Creator', category: 'Fashion', verified: true, rating: 4.95, starting_price: 25000, bio: 'Fashion & Lifestyle Content Creator. Sustainable chic trends.', city: 'Mumbai' },
      5: { name: 'Kabir Mehta', username: '@kabir_tech', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', role: 'Creator', category: 'Tech', verified: true, rating: 4.88, starting_price: 65000, bio: 'Gadget reviewer & software developer.', city: 'Bengaluru' },
      6: { name: 'Siddharth Rao', username: '@siddharth_fit', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', role: 'Creator', category: 'Fitness', verified: true, rating: 4.92, starting_price: 30000, bio: 'Strength & conditioning coach.', city: 'Delhi' }
    };

    if (demoMap[partnerId]) {
      return {
        id: partnerId,
        partner_id: partnerId,
        ...demoMap[partnerId],
        is_online: isOnline,
        active_status: activeStatus
      };
    }

    return {
      id: partnerId,
      partner_id: partnerId,
      name: c.partner_name || `User #${partnerId}`,
      username: `@user_${partnerId}`,
      avatar: c.partner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: c.partner_role || 'User',
      category: c.partner_category || 'Member',
      verified: false,
      rating: 4.8,
      starting_price: 10000,
      bio: 'Collabefy member.',
      city: 'India',
      is_online: isOnline,
      active_status: activeStatus
    };
  };

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  // Keyboard shortcut: Escape exits fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Mobile full-screen body class management
  useEffect(() => {
    if (window.innerWidth <= 768 && showMobileChat && activeConvId) {
      document.body.classList.add('chat-open-mobile');
    } else {
      document.body.classList.remove('chat-open-mobile');
    }
    return () => {
      document.body.classList.remove('chat-open-mobile');
    };
  }, [showMobileChat, activeConvId]);

  // Scroll to bottom of message thread (using container scroll directly - NEVER scrolls window)
  const scrollToBottom = (instant = false) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (instant) {
      container.scrollTop = container.scrollHeight;
    } else {
      try {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      } catch (e) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  // Detect when user scrolls up so auto-scroll NEVER interrupts reading older messages
  const handleMessagesScroll = (e) => {
    const el = e.currentTarget;
    if (!el) return;
    
    // If messages do not overflow the viewport, user is not scrolled up
    if (el.scrollHeight <= el.clientHeight + 10) {
      isUserScrolledUpRef.current = false;
      setShowScrollBottomBtn(false);
      return;
    }

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    // If user is more than 75px away from bottom, mark user as scrolled up!
    const isUp = distanceFromBottom > 75;
    isUserScrolledUpRef.current = isUp;
    setShowScrollBottomBtn(isUp);
  };

  // 1. Fetch Conversations List
  const fetchConversations = async () => {
    if (!user) return;
    try {
      const res = await apiService.getConversations(user.id);
      if (res && res.status === 'success' && Array.isArray(res.data)) {
        setConversations(res.data);
        return res.data;
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingConvs(false);
    }
    return [];
  };

  // 2. Initial Conversations Load & URL Sync
  useEffect(() => {
    let isMounted = true;

    const initializeChat = async () => {
      setLoadingConvs(true);
      const convList = await fetchConversations();
      
      if (!isMounted) return;

      if (urlConvId) {
        const targetId = Number(urlConvId);
        const match = convList.find(c => Number(c.conversation_id) === targetId || Number(c.id) === targetId);
        if (match) {
          setActiveConvId(Number(match.conversation_id || match.id));
          setShowMobileChat(true);
        } else if (convList.length > 0) {
          setActiveConvId(Number(convList[0].conversation_id || convList[0].id));
          if (window.innerWidth <= 768) {
            setShowMobileChat(false);
          }
        }
      } else if (convList.length > 0) {
        setActiveConvId(Number(convList[0].conversation_id || convList[0].id));
        if (window.innerWidth <= 768) {
          setShowMobileChat(false);
        }
      }
    };

    initializeChat();

    return () => {
      isMounted = false;
    };
  }, [user, urlConvId]);

  // 3. Fetch Messages for Selected Active Conversation
  const fetchMessagesForConv = async (convId, forceScroll = false) => {
    if (!convId || !user) return;
    try {
      const res = await apiService.getMessages({ conversation_id: convId, user_id: user.id });
      if (res && res.status === 'success' && Array.isArray(res.data)) {
        const newCount = res.data.length;
        const oldCount = prevMsgCountRef.current;
        prevMsgCountRef.current = newCount;
        setMessagesList(res.data);
        
        // Update partner online status dynamically from response if present
        if (typeof res.partner_is_online !== 'undefined') {
          setConversations(prev => prev.map(c => {
            if (Number(c.conversation_id || c.id) === convId) {
              return {
                ...c,
                is_online: res.partner_is_online,
                active_status: res.partner_active_status || (res.partner_is_online ? 'Active now' : '')
              };
            }
            return c;
          }));
        }

        // Auto-scroll rules:
        // 1. If forced (initial load of conversation / chat switch): scroll to bottom
        // 2. If new messages arrived AND user is NOT scrolled up: scroll to bottom smoothly
        // 3. If user is scrolled up reading past messages: DO NOT SCROLL (never interrupt user!)
        // 4. If no new messages arrived (newCount === oldCount): DO NOT SCROLL (never poll-scroll!)
        if (forceScroll) {
          isUserScrolledUpRef.current = false;
          setShowScrollBottomBtn(false);
          setTimeout(() => scrollToBottom(true), 40);
        } else if (newCount > oldCount && !isUserScrolledUpRef.current) {
          setTimeout(() => scrollToBottom(false), 40);
        }
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    if (!activeConvId) return;

    setLoadingMsgs(true);
    fetchMessagesForConv(activeConvId, true).finally(() => setLoadingMsgs(false));

    // Dynamic auto-polling interval for live chat updates (every 3.5 seconds)
    const pollInterval = setInterval(() => {
      fetchMessagesForConv(activeConvId, false);
    }, 3500);

    return () => clearInterval(pollInterval);
  }, [activeConvId, user]);

  // Periodic polling for conversations list to catch new incoming messages & active statuses
  useEffect(() => {
    if (!user) return;
    const convPoll = setInterval(() => {
      fetchConversations();
    }, 5000);
    return () => clearInterval(convPoll);
  }, [user]);

  // Handle Selecting Conversation
  const handleSelectConv = (convId) => {
    setActiveConvId(convId);
    setSearchParams({ conversationId: convId });
    setShowMobileChat(true);
    isUserScrolledUpRef.current = false;
    setShowScrollBottomBtn(false);
    prevMsgCountRef.current = 0;

    // Immediately mark unread badge as cleared dynamically in local state
    setConversations(prev => prev.map(c => {
      if (Number(c.conversation_id || c.id) === convId) {
        return { ...c, unread_count: 0 };
      }
      return c;
    }));
  };

  // 4. Send Message Handler (Text or Structured Card/Media)
  const handleSend = async (customPayload = null) => {
    if (!activeConvId || !user) return;

    const activeConv = conversations.find(c => Number(c.conversation_id || c.id) === activeConvId);
    if (!activeConv) return;

    const partnerId = Number(activeConv.partner_id || (Number(activeConv.participant_one_id) === Number(user?.id) ? activeConv.participant_two_id : activeConv.participant_one_id));

    let msgText = '';
    let extraData = {};

    if (customPayload && typeof customPayload === 'object') {
      msgText = customPayload.message || 'Shared a campaign deliverable';
      extraData = customPayload;
    } else {
      msgText = inputText.trim();
      if (!msgText) return;
      setInputText('');
    }

    setSendingMsg(true);
    setErrorMsg('');

    // Dynamic Optimistic UI Message
    const tempId = `opt_${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      conversation_id: activeConvId,
      sender_id: user.id,
      receiver_id: partnerId,
      message: msgText,
      created_at: new Date().toISOString(),
      is_optimistic: true,
      ...extraData
    };
    setMessagesList(prev => [...prev, optimisticMsg]);
    isUserScrolledUpRef.current = false;
    setShowScrollBottomBtn(false);
    setTimeout(() => scrollToBottom(false), 40);

    // Update local conversation preview immediately
    setConversations(prev => prev.map(c => {
      if (Number(c.conversation_id || c.id) === activeConvId) {
        return {
          ...c,
          last_message: msgText,
          last_message_time: new Date().toISOString()
        };
      }
      return c;
    }));

    try {
      const res = await apiService.sendMessage({
        conversation_id: activeConvId,
        sender_id: user.id,
        receiver_id: partnerId,
        message: msgText,
        ...extraData
      });

      if (res && res.status === 'success' && res.data) {
        setMessagesList(prev => prev.map(m => m.id === tempId ? { ...res.data, ...extraData } : m));
        isUserScrolledUpRef.current = false;
        setShowScrollBottomBtn(false);
        setTimeout(() => scrollToBottom(false), 50);
      }
    } catch (err) {
      setErrorMsg('Network error while sending message.');
    } finally {
      setSendingMsg(false);
    }
  };

  // Send Quick Heart Reaction (Instagram DM style)
  const sendHeartReaction = () => {
    handleSend({
      message: '❤️',
      type: 'heart'
    });
  };

  // Simulate Voice Note
  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      showToast('🎙️ Recording voice note...');
    } else {
      setIsRecording(false);
      handleSend({
        message: '🎵 Voice Message (0:14)',
        type: 'voice_note'
      });
      showToast('Voice note sent!');
    }
  };

  // Share Instagram / Collab Post Card (matching devnest.code in screenshot)
  const shareSampleCollabPost = () => {
    setShowPostModal(false);
    handleSend({
      message: 'Collabefy Campaign Post Preview',
      type: 'post_card',
      post_data: {
        account_name: activePartnerInfo.username || 'collabefy.official',
        account_avatar: activePartnerInfo.avatar,
        title: 'Creator Collaboration Brief & Rate Card',
        caption: '50 High-Converting Hook Ideas for Instagram Reels & Shorts 🔥 Save this for your campaign 🚀',
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700',
        author: user?.name || 'Brand Partner'
      }
    });
  };

  // Image file attachment upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fakeUrl = URL.createObjectURL(file);
    handleSend({
      message: `📷 Shared photo: ${file.name}`,
      type: 'image',
      image_url: fakeUrl
    });
    showToast('Photo uploaded successfully');
  };

  const activeConv = conversations.find(c => Number(c.conversation_id || c.id) === activeConvId);
  const activePartnerInfo = resolvePartnerInfo(activeConv);

  // Filtered conversations by user search query
  const filteredConvs = conversations.filter(c => {
    if (!searchQuery.trim()) return true;
    const pInfo = resolvePartnerInfo(c);
    const q = searchQuery.toLowerCase();
    return (
      (pInfo.name && pInfo.name.toLowerCase().includes(q)) ||
      (pInfo.role && pInfo.role.toLowerCase().includes(q)) ||
      (pInfo.category && pInfo.category.toLowerCase().includes(q)) ||
      (c.last_message && c.last_message.toLowerCase().includes(q))
    );
  });

  // Empty State when user has 0 conversations
  if (!loadingConvs && conversations.length === 0 && !urlConvId) {
    return (
      <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '18px', maxWidth: '650px', margin: '40px auto' }}>
        <div style={{ background: 'rgba(99, 102, 241, 0.12)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--primary)' }}>
          <MessageSquare size={36} />
        </div>
        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', fontWeight: 800 }}>No Messages Yet</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '8px', marginBottom: '24px', lineHeight: 1.5 }}>
          You don't have any active direct conversations. Browse verified profiles and click <strong>"Chat Direct"</strong> to start negotiating campaign briefs!
        </p>
        <Link 
          to={user?.role === 'influencer' ? '/creator/requests' : '/explore'} 
          className="btn btn-primary"
          style={{ padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Sparkles size={18} /> {user?.role === 'influencer' ? 'View Campaign Requests' : 'Explore Influencers'}
        </Link>
      </div>
    );
  }

  return (
    <div className={`ig-chat-container ${isFullscreen ? 'ig-chat-fullscreen' : ''} ${showMobileChat && activeConvId ? 'ig-chat-active-mobile' : ''}`}>
      
      {/* FLOATING TOAST ALERT */}
      {toastMsg && (
        <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 120, background: 'rgba(15, 23, 42, 0.92)', color: '#FFF', padding: '8px 18px', borderRadius: '24px', fontSize: '0.82rem', fontWeight: 600, boxShadow: '0 8px 25px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(8px)' }}>
          <Sparkles size={14} color="#A855F7" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ERROR ALERT BANNER */}
      {errorMsg && (
        <div style={{ position: 'absolute', top: '10px', right: '20px', zIndex: 100, background: 'rgba(239, 68, 68, 0.95)', color: '#FFF', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={16} /> <span>{errorMsg}</span>
        </div>
      )}

      {/* HIDDEN FILE INPUT FOR PHOTO SHARING */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      {/* LEFT SIDEBAR: CONVERSATIONS LIST (Mobile Responsive) */}
      <div 
        className={`chat-list-panel ${showMobileChat ? 'mobile-chat-hidden' : ''}`}
        style={{ 
          borderRight: '1px solid var(--border-color)', 
          background: 'var(--bg-card)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ fontSize: '0.96rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
              Direct Messages
            </h4>
            <span className="badge badge-purple" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px' }}>
              {conversations.length}
            </span>
          </div>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={fetchConversations} 
            style={{ padding: '6px 8px', borderRadius: '8px' }} 
            title="Refresh Conversations"
          >
            <RefreshCw size={13} className={loadingConvs ? 'spin' : ''} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Conversations Scroll List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', padding: '8px' }}>
          {loadingConvs ? (
            [1, 2, 3].map(i => (
              <div key={i} style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: '14px', opacity: 0.6, height: '62px', marginBottom: '6px' }} />
            ))
          ) : filteredConvs.length === 0 ? (
            <div style={{ padding: '40px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              {searchQuery ? 'No matching conversations' : 'No conversations found.'}
            </div>
          ) : (
            filteredConvs.map((c) => {
              const cId = Number(c.conversation_id || c.id);
              const isActive = cId === activeConvId;
              const pInfo = resolvePartnerInfo(c);

              return (
                <div
                  key={cId}
                  onClick={() => handleSelectConv(cId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    background: isActive ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid transparent',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  <div className="ig-avatar-wrap">
                    <img src={pInfo.avatar} alt={pInfo.name} className="ig-avatar-img" />
                    {/* Live Online Dot: ONLY IF PARTNER IS ACTIVE */}
                    {pInfo.is_online && (
                      <span className="ig-online-badge" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                        {pInfo.name}
                      </h4>
                      {c.unread_count > 0 && (
                        <span className="badge badge-purple" style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '12px', fontWeight: 800 }}>
                          {c.unread_count}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '3px 0 0 0' }}>
                      {c.last_message || 'Start negotiating campaign briefs...'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT MAIN PANEL: INSTAGRAM DM CHAT INTERFACE (Matching Uploaded Screenshot) */}
      {activeConv ? (
        <div 
          className={`chat-messages-panel ${!showMobileChat ? 'mobile-chat-hidden' : ''}`}
          style={{ 
            background: 'var(--bg-card)', 
            height: '100%', 
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            position: 'relative'
          }}
        >
          
          {/* 1. INSTAGRAM DM TOP HEADER */}
          <div className="ig-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              
              {/* Back Button (Mobile friendly) */}
              <button 
                type="button"
                className="ig-header-icon-btn mobile-only" 
                onClick={() => {
                  setShowMobileChat(false);
                  setSearchParams({});
                }}
                style={{ padding: '6px', marginRight: '2px' }}
                title="Back to conversation list"
              >
                <ArrowLeft size={19} />
              </button>

              {/* Partner Avatar with Online Dot */}
              <div className="ig-avatar-wrap" onClick={() => setShowInfoDrawer(true)} style={{ cursor: 'pointer' }}>
                <img src={activePartnerInfo.avatar} alt={activePartnerInfo.name} className="ig-avatar-img" />
                {activePartnerInfo.is_online && (
                  <span className="ig-online-badge" />
                )}
              </div>

              {/* Partner Title & Live Status */}
              <div style={{ minWidth: 0, cursor: 'pointer' }} onClick={() => setShowInfoDrawer(true)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <h3 style={{ fontSize: '0.94rem', color: 'var(--text-main)', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                    {activePartnerInfo.name}
                  </h3>
                  {activePartnerInfo.verified && (
                    <ShieldCheck size={14} color="#3B82F6" />
                  )}
                </div>

                {/* LIVE STATUS: IF ACTIVE -> SHOW "Active now"; IF NOT ACTIVE -> SHOW EMPTY (as requested!) */}
                {activePartnerInfo.is_online ? (
                  <div className="ig-live-status-active">
                    <span className="ig-live-dot" />
                    <span>Active now</span>
                  </div>
                ) : (
                  /* Empty state when partner is not active */
                  null
                )}
              </div>
            </div>

            {/* Right Action Icons (Phone, Video, Fullscreen, Info) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button 
                type="button" 
                className="ig-header-icon-btn" 
                onClick={() => showToast(`📞 Calling ${activePartnerInfo.name}...`)}
                title="Audio Call"
              >
                <Phone size={18} />
              </button>
              <button 
                type="button" 
                className="ig-header-icon-btn" 
                onClick={() => showToast(`📹 Starting Video Call with ${activePartnerInfo.name}...`)}
                title="Video Call"
              >
                <Video size={19} />
              </button>
              <button 
                type="button" 
                className={`ig-header-icon-btn ${isFullscreen ? 'active-fullscreen' : ''}`}
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Full Screen (Esc)" : "Full Screen View"}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button 
                type="button" 
                className="ig-header-icon-btn" 
                onClick={() => setShowInfoDrawer(!showInfoDrawer)}
                title="Creator Profile & Campaign Info"
              >
                <Info size={19} />
              </button>
            </div>
          </div>

          {/* 2. CHAT MESSAGES FEED (Instagram Style Stream) */}
          <div 
            ref={messagesContainerRef} 
            className="ig-message-feed"
            onScroll={handleMessagesScroll}
          >
            
            {/* Top Date Stamp */}
            <div className="ig-datestamp">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
            </div>

            {loadingMsgs && messagesList.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '8px' }}>
                <RefreshCw size={18} className="spin" /> Loading conversation...
              </div>
            ) : messagesList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: 'var(--primary)' }}>
                  <MessageSquare size={28} />
                </div>
                <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: 700, margin: '0 0 6px 0' }}>
                  Chat with {activePartnerInfo.name}
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                  Send a message or campaign deliverable below to start collaborating!
                </p>
              </div>
            ) : (
              messagesList.map((msg, idx) => {
                const isMe = Number(msg.sender_id) === Number(user?.id);
                const isPostCard = msg.type === 'post_card' || msg.post_data;
                const isVoiceNote = msg.type === 'voice_note';
                const isHeart = msg.type === 'heart' || msg.message === '❤️';
                const isImage = msg.type === 'image' || msg.image_url;

                return (
                  <div
                    key={msg.id || idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                      marginBottom: '4px'
                    }}
                  >
                    {/* Sender Label for Incoming (Matching "Hirendra" in screenshot) */}
                    {!isMe && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '12px', marginBottom: '2px', fontWeight: 600 }}>
                        {activePartnerInfo.name.split(' ')[0]}
                      </span>
                    )}

                    {/* CASE 1: SHARED INSTAGRAM POST / CAMPAIGN CARD (Exact match to devnest.code in screenshot!) */}
                    {isPostCard ? (
                      <div className="ig-shared-post-card">
                        <div className="ig-card-header">
                          <img 
                            src={msg.post_data?.account_avatar || activePartnerInfo.avatar} 
                            alt="avatar" 
                            style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} 
                          />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {msg.post_data?.account_name || 'collabefy.official'}
                          </span>
                        </div>
                        <div className="ig-card-media">
                          <img 
                            src={msg.post_data?.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700'} 
                            alt="post media" 
                          />
                          <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', borderRadius: '6px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Play size={14} color="#FFF" />
                          </div>
                        </div>
                        <div className="ig-card-body">
                          <div style={{ fontWeight: 800, marginBottom: '4px', color: 'var(--text-main)' }}>
                            {msg.post_data?.title || 'Deliverable Brief'}
                          </div>
                          <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                            {msg.post_data?.caption || msg.message}
                          </div>
                        </div>
                      </div>
                    ) : isImage ? (
                      /* CASE 2: PHOTO ATTACHMENT */
                      <div style={{ maxWidth: '280px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                        <img src={msg.image_url} alt="attached media" style={{ width: '100%', display: 'block', maxHeight: '320px', objectFit: 'cover' }} />
                        {msg.message && msg.message !== `📷 Shared photo: ${msg.message}` && (
                          <div style={{ padding: '8px 12px', fontSize: '0.82rem', background: isMe ? 'var(--primary)' : 'var(--bg-input)', color: isMe ? '#FFF' : 'var(--text-main)' }}>
                            {msg.message}
                          </div>
                        )}
                      </div>
                    ) : isVoiceNote ? (
                      /* CASE 3: VOICE NOTE MESSAGE */
                      <div className={isMe ? 'ig-bubble-outgoing' : 'ig-bubble-incoming'} style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '170px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isMe ? 'rgba(255,255,255,0.2)' : 'var(--primary)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Play size={14} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ height: '3px', background: isMe ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.15)', borderRadius: '2px', position: 'relative' }}>
                            <div style={{ width: '45%', height: '100%', background: isMe ? '#FFF' : 'var(--primary)', borderRadius: '2px' }} />
                          </div>
                          <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px', display: 'block' }}>0:14 voice memo</span>
                        </div>
                      </div>
                    ) : isHeart ? (
                      /* CASE 4: HEART REACTION */
                      <div style={{ fontSize: '2.5rem', lineHeight: 1, padding: '4px' }}>
                        ❤️
                      </div>
                    ) : (
                      /* CASE 5: STANDARD TEXT BUBBLE */
                      <div className={isMe ? 'ig-bubble-outgoing' : 'ig-bubble-incoming'}>
                        {msg.message || msg.text}
                      </div>
                    )}

                    {/* Read status & timestamp (Matching "Seen by aditya." in screenshot) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', padding: '0 4px' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                        {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                      {isMe && (
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          • Seen <CheckCheck size={11} color="var(--primary)" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
            {showScrollBottomBtn && (
              <button
                type="button"
                onClick={() => {
                  isUserScrolledUpRef.current = false;
                  setShowScrollBottomBtn(false);
                  scrollToBottom(false);
                }}
                className="ig-scroll-bottom-floating-btn animate-fade-in"
                title="Jump to latest message"
              >
                <ChevronDown size={14} />
                <span>Latest messages</span>
              </button>
            )}
          </div>

          {/* 3. DYNAMIC QUICK CHIPS FOR CAMPAIGN NEGOTIATION */}
          <div style={{ padding: '6px 14px', display: 'flex', gap: '6px', overflowX: 'auto', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', scrollbarWidth: 'none' }}>
            {[
              "What are your turnaround times?",
              "Can we align on launch dates?",
              "I'm interested in an Instagram Reel.",
              "Could you share your media kit?"
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(chip)}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '0.74rem',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {chip}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowPostModal(true)}
              style={{
                whiteSpace: 'nowrap',
                fontSize: '0.74rem',
                padding: '5px 12px',
                borderRadius: '16px',
                border: '1px solid var(--primary)',
                background: 'rgba(124, 58, 237, 0.1)',
                color: 'var(--primary)',
                cursor: 'pointer',
                flexShrink: 0,
                fontWeight: 700
              }}
            >
              + Share Collab Card
            </button>
          </div>

          {/* 4. INSTAGRAM DM BOTTOM PILL INPUT BAR (Exact match to screenshot!) */}
          <div className="ig-input-bar-container">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="ig-pill-input-box"
            >
              {/* Text input with placeholder "Message..." */}
              <input 
                type="text" 
                className="ig-pill-input" 
                placeholder="Message..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={sendingMsg}
              />

              {/* Action Icons matching screenshot: Microphone, Image, Heart / Send */}
              {inputText.trim() ? (
                /* Vibrant Send button when typing */
                <button 
                  type="submit" 
                  className="ig-send-btn"
                  disabled={sendingMsg}
                  title="Send message"
                >
                  {sendingMsg ? <RefreshCw size={15} className="spin" /> : <Send size={15} />}
                </button>
              ) : (
                /* Sleek Instagram action icons */
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  
                  {/* Microphone (Voice note simulation) */}
                  <button 
                    type="button" 
                    className="ig-action-icon-btn" 
                    onClick={toggleVoiceRecording}
                    title={isRecording ? 'Stop Recording' : 'Voice Message'}
                    style={{ color: isRecording ? '#EF4444' : undefined }}
                  >
                    <Mic size={18} className={isRecording ? 'pulse' : ''} />
                  </button>

                  {/* Image Attachment Icon */}
                  <button 
                    type="button" 
                    className="ig-action-icon-btn" 
                    onClick={() => fileInputRef.current?.click()}
                    title="Send Photo"
                  >
                    <ImageIcon size={18} />
                  </button>

                  {/* Heart Icon (Instant Instagram reaction) */}
                  <button 
                    type="button" 
                    className="ig-action-icon-btn" 
                    onClick={sendHeartReaction}
                    title="Send Heart"
                  >
                    <Heart size={18} />
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* 5. SLIDING CREATOR INFO DRAWER (When clicking (i) info icon) */}
          {showInfoDrawer && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '320px',
                maxWidth: '85%',
                height: '100%',
                background: 'var(--bg-card)',
                borderLeft: '1px solid var(--border-color)',
                zIndex: 50,
                boxShadow: '-8px 0 30px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideInRight 0.25s ease'
              }}
            >
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-main)' }}>Details</h4>
                <button 
                  type="button" 
                  onClick={() => setShowInfoDrawer(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '20px 16px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <img 
                  src={activePartnerInfo.avatar} 
                  alt={activePartnerInfo.name} 
                  style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px', border: '2px solid var(--primary)' }} 
                />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 2px 0' }}>
                  {activePartnerInfo.name}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {activePartnerInfo.username} • {activePartnerInfo.category}
                </span>

                {/* Status indicator in Drawer */}
                {activePartnerInfo.is_online ? (
                  <span className="ig-live-status-active" style={{ marginBottom: '14px' }}>
                    <span className="ig-live-dot" /> Active now
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
                    Offline
                  </span>
                )}

                <div style={{ width: '100%', background: 'var(--bg-input)', padding: '12px', borderRadius: '12px', marginBottom: '14px', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Starting Rate</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{activePartnerInfo.starting_price.toLocaleString()}
                  </div>
                </div>

                <div style={{ width: '100%', background: 'var(--bg-input)', padding: '12px', borderRadius: '12px', marginBottom: '18px', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Bio</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.45 }}>
                    {activePartnerInfo.bio}
                  </p>
                </div>

                {activePartnerInfo.id && (
                  <Link 
                    to={`/influencer/${activePartnerInfo.id}`} 
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '10px', borderRadius: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}
                  >
                    <span>View Full Profile</span>
                    <ExternalLink size={14} />
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* 6. POST CARD SHARING MODAL */}
          {showPostModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              <div className="glass-panel" style={{ width: '100%', maxWidth: '360px', padding: '20px', borderRadius: '18px', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>Share Collab Post</h4>
                  <button type="button" onClick={() => setShowPostModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Share an Instagram campaign card preview into this direct thread (matching the IG DM post format).
                </p>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={shareSampleCollabPost}
                  style={{ width: '100%', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Sparkles size={16} /> Share Campaign Post
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Empty Conversation Selection Placeholder */
        <div 
          className={`chat-messages-panel ${!showMobileChat ? 'mobile-chat-hidden' : ''}`}
          style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'var(--text-muted)', 
            gap: '10px', 
            padding: '40px 20px', 
            textAlign: 'center',
            background: 'var(--bg-card)'
          }}
        >
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'rgba(124, 58, 237, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            marginBottom: '4px'
          }}>
            <MessageSquare size={32} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Select a Conversation</h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-dim)', maxWidth: '300px', margin: 0 }}>
            Choose a thread from the list on the left to start direct Instagram-style messaging.
          </p>
        </div>
      )}

    </div>
  );
}
