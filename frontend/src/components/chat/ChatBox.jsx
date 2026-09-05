import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import apiService from '../../api/apiService';
import { 
  Send, MessageSquare, ArrowLeft, RefreshCw, Sparkles, User, AlertCircle
} from 'lucide-react';

export default function ChatBox() {
  const { user } = useAuth();
  const { influencers } = useData() || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const prevMsgCountRef = useRef(0);

  const urlConvId = searchParams.get('conversationId') || searchParams.get('conversation');

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [inputText, setInputText] = useState('');
  
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Mobile toggle state
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Helper to resolve real partner name & profile details
  const resolvePartnerInfo = (c) => {
    if (!c) return { name: 'User', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', role: 'User', category: 'Member' };

    const partnerId = Number(c.partner_id || (Number(c.participant_one_id) === Number(user?.id) ? c.participant_two_id : c.participant_one_id));
    
    // 1. Match from DataContext influencers list
    const matchedInf = (influencers || []).find(i => Number(i.user_id) === partnerId || Number(i.id) === partnerId);
    if (matchedInf) {
      return {
        name: matchedInf.name,
        avatar: matchedInf.avatar,
        role: 'Creator',
        category: matchedInf.category || 'Influencer'
      };
    }

    // 2. Check if partner_name from API response is valid (not generic User #X)
    if (c.partner_name && !c.partner_name.startsWith('User #')) {
      return {
        name: c.partner_name,
        avatar: c.partner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: c.partner_role || 'User',
        category: c.partner_category || 'Member'
      };
    }

    // 3. Fallback dictionary map for platform users & creators
    const demoMap = {
      1: { name: 'Admin System', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', role: 'Admin', category: 'Platform' },
      2: { name: 'Rohan Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'User', category: 'Brand Client' },
      3: { name: 'Vikram Seth', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', role: 'User', category: 'Tech Brand' },
      4: { name: 'Aanya Verma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', role: 'Creator', category: 'Fashion' },
      5: { name: 'Kabir Mehta', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', role: 'Creator', category: 'Fitness' },
      6: { name: 'Ananya Roy', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', role: 'Creator', category: 'Tech' },
      7: { name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', role: 'Creator', category: 'Beauty' },
      8: { name: 'Dev Patel', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', role: 'Creator', category: 'Gaming' },
      9: { name: 'Neha Kapoor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', role: 'Creator', category: 'Travel' },
      10: { name: 'Rohan Varma', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', role: 'Creator', category: 'Food' },
      11: { name: 'Siddharth Rao', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', role: 'Creator', category: 'Finance' },
      12: { name: 'Meera Nair', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', role: 'Creator', category: 'Lifestyle' },
      13: { name: 'Aarav Gupta', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', role: 'Creator', category: 'Education' }
    };

    if (demoMap[partnerId]) {
      return demoMap[partnerId];
    }

    return {
      name: c.partner_name || `User #${partnerId}`,
      avatar: c.partner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: c.partner_role || 'User',
      category: c.partner_category || 'Member'
    };
  };

  // Scroll to bottom of message thread
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        }
      } else if (convList.length > 0) {
        setActiveConvId(Number(convList[0].conversation_id || convList[0].id));
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
        
        const container = messagesContainerRef.current;
        const isNearBottom = container 
          ? (container.scrollHeight - container.scrollTop - container.clientHeight < 80)
          : true;

        if (forceScroll || newCount > oldCount || isNearBottom) {
          setTimeout(scrollToBottom, 50);
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

    // Auto-polling interval for live chat updates (every 3.5 seconds)
    const pollInterval = setInterval(() => {
      fetchMessagesForConv(activeConvId, false);
    }, 3500);

    return () => clearInterval(pollInterval);
  }, [activeConvId, user]);

  // Handle Selecting Conversation
  const handleSelectConv = (convId) => {
    setActiveConvId(convId);
    setSearchParams({ conversationId: convId });
    setShowMobileChat(true);
  };

  // 4. Send Message Handler
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId || !user) return;

    const activeConv = conversations.find(c => Number(c.conversation_id || c.id) === activeConvId);
    if (!activeConv) return;

    const partnerId = Number(activeConv.partner_id || (Number(activeConv.participant_one_id) === Number(user?.id) ? activeConv.participant_two_id : activeConv.participant_one_id));

    const msgText = inputText.trim();
    setInputText('');
    setSendingMsg(true);
    setErrorMsg('');

    try {
      const res = await apiService.sendMessage({
        conversation_id: activeConvId,
        sender_id: user.id,
        receiver_id: partnerId,
        message: msgText
      });

      if (res && res.status === 'success' && res.data) {
        // Append sent message immediately
        setMessagesList(prev => [...prev, res.data]);
        
        // Update local conversation preview
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

        setTimeout(scrollToBottom, 50);
      } else {
        setErrorMsg(res?.message || 'Failed to send message.');
      }
    } catch (err) {
      setErrorMsg('Network error while sending message.');
    } finally {
      setSendingMsg(false);
    }
  };

  const activeConv = conversations.find(c => Number(c.conversation_id || c.id) === activeConvId);
  const activePartnerInfo = resolvePartnerInfo(activeConv);

  // 5. Empty State when user has 0 conversations
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
    <div className="glass-panel chat-container-layout" style={{ padding: 0 }}>
      
      {/* ERROR ALERT BANNER */}
      {errorMsg && (
        <div style={{ position: 'absolute', top: '10px', right: '20px', zIndex: 100, background: 'rgba(239, 68, 68, 0.95)', color: '#FFF', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={16} /> <span>{errorMsg}</span>
        </div>
      )}

      {/* LEFT SIDEBAR: CONVERSATIONS LIST */}
      <div 
        className="chat-list-panel"
        style={{ 
          borderRight: '1px solid var(--border-color)', 
          flexDirection: 'column', 
          background: 'var(--bg-card)',
          height: '100%',
          display: showMobileChat ? undefined : 'flex'
        }}
      >
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: '0.94rem', color: 'var(--text-main)', fontWeight: 800 }}>
            Direct Threads ({conversations.length})
          </h4>
          <button className="btn btn-secondary btn-sm" onClick={fetchConversations} style={{ padding: '4px 8px' }} title="Refresh Conversations">
            <RefreshCw size={14} className={loadingConvs ? 'spin' : ''} />
          </button>
        </div>

        {/* Conversations Scroll List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px' }}>
          {loadingConvs ? (
            [1, 2, 3].map(i => (
              <div key={i} style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: '12px', opacity: 0.6, height: '60px', marginBottom: '6px' }} />
            ))
          ) : conversations.length === 0 ? (
            <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              No conversations found.
            </div>
          ) : (
            conversations.map((c) => {
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
                    padding: '12px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: isActive ? 'rgba(99, 102, 241, 0.14)' : 'transparent',
                    border: isActive ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img src={pInfo.avatar} alt={pInfo.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', border: '2px solid var(--bg-card)' }} />
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pInfo.name}
                      </h4>
                      {c.unread_count > 0 && (
                        <span className="badge badge-purple" style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '10px' }}>
                          {c.unread_count}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '2px 0 0 0' }}>
                      {c.last_message}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT MAIN PANEL: ACTIVE CHAT THREAD */}
      {activeConv ? (
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', height: '100%', minWidth: 0 }}>
          
          {/* Header */}
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <button 
                className="btn btn-secondary btn-sm mobile-only" 
                onClick={() => setShowMobileChat(false)}
                style={{ padding: '6px', marginRight: '2px', flexShrink: 0 }}
                title="Back to threads"
              >
                <ArrowLeft size={16} />
              </button>
              <img src={activePartnerInfo.avatar} alt={activePartnerInfo.name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activePartnerInfo.name}
                </h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activePartnerInfo.role} • {activePartnerInfo.category}
                </span>
              </div>
            </div>
          </div>

          {/* Message Stream */}
          <div ref={messagesContainerRef} style={{ flex: 1, padding: 'clamp(14px, 3vw, 24px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0, 0, 0, 0.02)' }}>
            {loadingMsgs && messagesList.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '8px' }}>
                <RefreshCw size={18} className="spin" /> Loading messages...
              </div>
            ) : messagesList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Conversation created! Type a message below to start chatting with {activePartnerInfo.name}.
              </div>
            ) : (
              messagesList.map((msg, idx) => {
                const isMe = Number(msg.sender_id) === Number(user?.id);
                return (
                  <div
                    key={msg.id || idx}
                    className="chat-bubble-msg"
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 16px',
                        borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: isMe ? 'linear-gradient(135deg, var(--primary), var(--accent-purple))' : 'var(--bg-input)',
                        color: isMe ? '#FFFFFF' : 'var(--text-main)',
                        fontSize: '0.88rem',
                        lineHeight: '1.45',
                        boxShadow: isMe ? '0 4px 15px var(--primary-glow)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                        border: isMe ? 'none' : '1px solid var(--border-color)',
                        wordBreak: 'break-word'
                      }}
                    >
                      {msg.message || msg.text}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                      {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder={`Message ${activePartnerInfo.name}...`} 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={sendingMsg}
              style={{ flex: 1, borderRadius: '24px', padding: '10px 16px', fontSize: '0.88rem' }}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={sendingMsg || !inputText.trim()}
              style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              {sendingMsg ? <RefreshCw size={16} className="spin" /> : <Send size={16} />}
            </button>
          </form>

        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '10px', padding: '40px 20px', textAlign: 'center' }}>
          <MessageSquare size={36} color="var(--text-dim)" />
          <span style={{ fontSize: '0.9rem' }}>Select a conversation thread to start chatting</span>
        </div>
      )}

    </div>
  );
}
