import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  Plus,
  Star,
  Archive,
  Trash2,
  Paperclip,
  Smile,
  Circle,
  Check,
  CheckCheck,
  Filter,
  Users,
  Settings
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../components/ui';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  read: boolean;
  messageType: 'text' | 'image' | 'file' | 'system';
  attachment?: {
    name: string;
    url: string;
    type: string;
    size: number;
  };
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: 'tenant' | 'owner' | 'contractor' | 'manager';
  lastMessage: Message;
  unreadCount: number;
  isPinned: boolean;
  propertyId?: string;
  propertyName?: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'tenant' | 'owner' | 'contractor' | 'manager';
  avatar?: string;
  isOnline: boolean;
  propertyId?: string;
  propertyName?: string;
}

const MessagesPage: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'pinned' | 'archived'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = 'user-1';

  const sampleConversations: Conversation[] = [
    {
      id: '1',
      participantId: 'tenant-1',
      participantName: 'Sarah Johnson',
      participantAvatar: undefined,
      participantRole: 'tenant',
      propertyId: 'prop-1',
      propertyName: 'Hillpointe Manor #12A',
      isOnline: true,
      unreadCount: 3,
      isPinned: true,
      lastMessage: {
        id: 'msg-1',
        content: 'Hi! The heating system in unit 12A is making strange noises. Could someone take a look?',
        senderId: 'tenant-1',
        receiverId: currentUserId,
        timestamp: '2024-01-24T10:30:00Z',
        read: false,
        messageType: 'text'
      }
    },
    {
      id: '2',
      participantId: 'contractor-1',
      participantName: 'Mike Thompson',
      participantAvatar: undefined,
      participantRole: 'contractor',
      isOnline: false,
      lastSeen: '2024-01-24T09:15:00Z',
      unreadCount: 0,
      isPinned: false,
      lastMessage: {
        id: 'msg-2',
        content: 'Maintenance completed for unit 8B. Invoice attached.',
        senderId: 'contractor-1',
        receiverId: currentUserId,
        timestamp: '2024-01-24T08:45:00Z',
        read: true,
        messageType: 'file',
        attachment: {
          name: 'invoice-8B-plumbing.pdf',
          url: '/documents/invoice-8B-plumbing.pdf',
          type: 'application/pdf',
          size: 245000
        }
      }
    },
    {
      id: '3',
      participantId: 'owner-1',
      participantName: 'Robert Chen',
      participantAvatar: undefined,
      participantRole: 'owner',
      propertyId: 'prop-2',
      propertyName: 'Garden View Apartments',
      isOnline: true,
      unreadCount: 1,
      isPinned: false,
      lastMessage: {
        id: 'msg-3',
        content: 'Please send me the Q4 financial report when you have a chance.',
        senderId: 'owner-1',
        receiverId: currentUserId,
        timestamp: '2024-01-23T16:20:00Z',
        read: false,
        messageType: 'text'
      }
    },
    {
      id: '4',
      participantId: 'tenant-2',
      participantName: 'Jennifer Wilson',
      participantAvatar: undefined,
      participantRole: 'tenant',
      propertyId: 'prop-1',
      propertyName: 'Hillpointe Manor #5C',
      isOnline: false,
      lastSeen: '2024-01-23T14:30:00Z',
      unreadCount: 0,
      isPinned: false,
      lastMessage: {
        id: 'msg-4',
        content: 'Thank you for the quick response! The issue is resolved.',
        senderId: 'tenant-2',
        receiverId: currentUserId,
        timestamp: '2024-01-23T12:10:00Z',
        read: true,
        messageType: 'text'
      }
    }
  ];

  const sampleMessages: Message[] = [
    // Conversation with Sarah Johnson (tenant-1)
    {
      id: 'msg-1a',
      content: 'Hello Sarah! How are things going with the property?',
      senderId: currentUserId,
      receiverId: 'tenant-1',
      timestamp: '2024-01-24T09:00:00Z',
      read: true,
      messageType: 'text'
    },
    {
      id: 'msg-1b',
      content: 'Hi! Things are going well overall. I have one concern though.',
      senderId: 'tenant-1',
      receiverId: currentUserId,
      timestamp: '2024-01-24T09:15:00Z',
      read: true,
      messageType: 'text'
    },
    {
      id: 'msg-1c',
      content: 'The heating system in unit 12A is making strange noises. Could someone take a look?',
      senderId: 'tenant-1',
      receiverId: currentUserId,
      timestamp: '2024-01-24T10:30:00Z',
      read: false,
      messageType: 'text'
    },
    {
      id: 'msg-1d',
      content: 'I\'ll schedule a maintenance visit for this afternoon. Thanks for letting me know!',
      senderId: currentUserId,
      receiverId: 'tenant-1',
      timestamp: '2024-01-24T10:35:00Z',
      read: true,
      messageType: 'text'
    },
    // Conversation with Mike Thompson (contractor-1)
    {
      id: 'msg-2a',
      content: 'Hi Mike, we have a plumbing issue in unit 8B. Are you available this week?',
      senderId: currentUserId,
      receiverId: 'contractor-1',
      timestamp: '2024-01-23T14:00:00Z',
      read: true,
      messageType: 'text'
    },
    {
      id: 'msg-2b',
      content: 'Sure, I can come by tomorrow morning. What\'s the issue?',
      senderId: 'contractor-1',
      receiverId: currentUserId,
      timestamp: '2024-01-23T14:30:00Z',
      read: true,
      messageType: 'text'
    },
    {
      id: 'msg-2c',
      content: 'Leaking pipe under the kitchen sink. The tenant reported it yesterday.',
      senderId: currentUserId,
      receiverId: 'contractor-1',
      timestamp: '2024-01-23T14:35:00Z',
      read: true,
      messageType: 'text'
    },
    {
      id: 'msg-2d',
      content: 'Maintenance completed for unit 8B. Invoice attached.',
      senderId: 'contractor-1',
      receiverId: currentUserId,
      timestamp: '2024-01-24T08:45:00Z',
      read: true,
      messageType: 'file',
      attachment: {
        name: 'invoice-8B-plumbing.pdf',
        url: '/documents/invoice-8B-plumbing.pdf',
        type: 'application/pdf',
        size: 245000
      }
    },
    // Conversation with Robert Chen (owner-1)
    {
      id: 'msg-3a',
      content: 'Good afternoon Robert. The quarterly inspection for Garden View Apartments is complete.',
      senderId: currentUserId,
      receiverId: 'owner-1',
      timestamp: '2024-01-22T10:00:00Z',
      read: true,
      messageType: 'text'
    },
    {
      id: 'msg-3b',
      content: 'Thanks for the update. How did everything look?',
      senderId: 'owner-1',
      receiverId: currentUserId,
      timestamp: '2024-01-22T11:30:00Z',
      read: true,
      messageType: 'text'
    },
    {
      id: 'msg-3c',
      content: 'All units are in good condition. Minor touch-up painting needed in the common areas.',
      senderId: currentUserId,
      receiverId: 'owner-1',
      timestamp: '2024-01-22T11:45:00Z',
      read: true,
      messageType: 'text'
    },
    {
      id: 'msg-3d',
      content: 'Please send me the Q4 financial report when you have a chance.',
      senderId: 'owner-1',
      receiverId: currentUserId,
      timestamp: '2024-01-23T16:20:00Z',
      read: false,
      messageType: 'text'
    },
    // Conversation with Jennifer Wilson (tenant-2)
    {
      id: 'msg-4a',
      content: 'Hi Jennifer, just following up on the maintenance request you submitted for your dishwasher.',
      senderId: currentUserId,
      receiverId: 'tenant-2',
      timestamp: '2024-01-22T09:00:00Z',
      read: true,
      messageType: 'text'
    },
    {
      id: 'msg-4b',
      content: 'Oh great! When can someone come take a look at it?',
      senderId: 'tenant-2',
      receiverId: currentUserId,
      timestamp: '2024-01-22T09:30:00Z',
      read: true,
      messageType: 'text'
    },
    {
      id: 'msg-4c',
      content: 'Our contractor Mike will be there tomorrow between 10-12 AM. Does that work?',
      senderId: currentUserId,
      receiverId: 'tenant-2',
      timestamp: '2024-01-22T10:00:00Z',
      read: true,
      messageType: 'text'
    },
    {
      id: 'msg-4d',
      content: 'Thank you for the quick response! The issue is resolved.',
      senderId: 'tenant-2',
      receiverId: currentUserId,
      timestamp: '2024-01-23T12:10:00Z',
      read: true,
      messageType: 'text'
    }
  ];

  const sampleContacts: Contact[] = [
    {
      id: 'contact-1',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '(555) 123-4567',
      role: 'tenant',
      isOnline: true,
      propertyId: 'prop-1',
      propertyName: 'Hillpointe Manor #3B'
    },
    {
      id: 'contact-2',
      name: 'David Miller',
      email: 'david.miller@email.com',
      phone: '(555) 234-5678',
      role: 'contractor',
      isOnline: false
    },
    {
      id: 'contact-3',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      phone: '(555) 345-6789',
      role: 'owner',
      isOnline: true,
      propertyId: 'prop-3',
      propertyName: 'Sunset Plaza'
    }
  ];

  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [contacts] = useState<Contact[]>(sampleContacts);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const conversationMessages = messages.filter(m =>
    (m.senderId === selectedConversation?.participantId && m.receiverId === currentUserId) ||
    (m.senderId === currentUserId && m.receiverId === selectedConversation?.participantId)
  );

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conversation.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()));

    switch (filterType) {
      case 'unread':
        return matchesSearch && conversation.unreadCount > 0;
      case 'pinned':
        return matchesSearch && conversation.isPinned;
      case 'archived':
        return false;
      default:
        return matchesSearch;
    }
  });

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: messageText.trim(),
      senderId: currentUserId,
      receiverId: selectedConversation.participantId,
      timestamp: new Date().toISOString(),
      read: true,
      messageType: 'text'
    };

    setMessages(prev => [...prev, newMsg]);
    setConversations(prev => prev.map(c =>
      c.id === selectedConversation.id
        ? { ...c, lastMessage: newMsg }
        : c
    ));
    setMessageText('');
  };

  const handleStartConversation = (contact: Contact) => {
    const existingConv = conversations.find(c => c.participantId === contact.id);
    if (existingConv) {
      setSelectedConversationId(existingConv.id);
      setShowNewMessage(false);
      setShowContacts(false);
      return;
    }

    const newConvId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newConvId,
      participantId: contact.id,
      participantName: contact.name,
      participantRole: contact.role,
      propertyId: contact.propertyId,
      propertyName: contact.propertyName,
      isOnline: contact.isOnline,
      unreadCount: 0,
      isPinned: false,
      lastMessage: {
        id: `msg-sys-${Date.now()}`,
        content: 'Conversation started',
        senderId: currentUserId,
        receiverId: contact.id,
        timestamp: new Date().toISOString(),
        read: true,
        messageType: 'system'
      }
    };

    setConversations(prev => [newConv, ...prev]);
    setSelectedConversationId(newConvId);
    setShowNewMessage(false);
    setShowContacts(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'tenant': return '#2563eb';
      case 'owner': return '#2d5a41';
      case 'contractor': return '#b89a7e';
      case 'manager': return '#7c3aed';
      default: return '#6b7280';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'tenant': return 'info';
      case 'owner': return 'success';
      case 'contractor': return 'warning';
      case 'manager': return 'info';
      default: return 'default';
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div style={{
      padding: '30px',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '8px'
        }}>
          Messages
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Communicate with tenants, owners, and contractors
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '24px',
        height: 'calc(100vh - 180px)'
      }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ width: '400px', display: 'flex', flexDirection: 'column' }}
        >
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare size={20} style={{ color: '#2d5a41' }} />
                  Conversations
                  {totalUnread > 0 && (
                    <Badge variant="error" className="ml-2">
                      {totalUnread}
                    </Badge>
                  )}
                </CardTitle>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowContacts(!showContacts)}
                    title="Contacts"
                  >
                    <Users size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setShowNewMessage(!showNewMessage)}
                    title="New Message"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }}
                />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#f9fafb'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '4px',
                backgroundColor: '#f1f5f9',
                padding: '4px',
                borderRadius: '6px'
              }}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread' },
                  { key: 'pinned', label: 'Pinned' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterType(filter.key as any)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '13px',
                      fontWeight: '500',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: filterType === filter.key ? 'white' : 'transparent',
                      color: filterType === filter.key ? '#2d5a41' : '#64748b',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {filter.label}
                    {filter.key === 'unread' && totalUnread > 0 && (
                      <span style={{
                        marginLeft: '6px',
                        padding: '2px 6px',
                        fontSize: '11px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        borderRadius: '10px'
                      }}>
                        {totalUnread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-y-auto">
              <div style={{ padding: '0 16px' }}>
                {filteredConversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginBottom: '8px',
                      backgroundColor: selectedConversationId === conversation.id ? '#f0fdf4' : 'transparent',
                      border: selectedConversationId === conversation.id ? '1px solid #2d5a41' : '1px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedConversationId !== conversation.id) {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedConversationId !== conversation.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: getRoleColor(conversation.participantRole),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600'
                        }}>
                          {conversation.participantAvatar ? (
                            <img
                              src={conversation.participantAvatar}
                              alt={conversation.participantName}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            conversation.participantName.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: conversation.isOnline ? '#22c55e' : '#94a3b8',
                          border: '2px solid white'
                        }} />
                        {conversation.isPinned && (
                          <Star size={12} style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            color: '#f59e0b',
                            fill: '#f59e0b'
                          }} />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '4px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              fontWeight: conversation.unreadCount > 0 ? '600' : '500',
                              color: '#1f2937',
                              fontSize: '14px'
                            }}>
                              {conversation.participantName}
                            </span>
                            <Badge
                              variant={getRoleBadgeVariant(conversation.participantRole)}
                              className="text-[10px]"
                            >
                              {conversation.participantRole}
                            </Badge>
                          </div>
                          <span style={{
                            fontSize: '12px',
                            color: '#6b7280'
                          }}>
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>

                        {conversation.propertyName && (
                          <div style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginBottom: '4px'
                          }}>
                            📍 {conversation.propertyName}
                          </div>
                        )}

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <span style={{
                            fontSize: '13px',
                            color: conversation.unreadCount > 0 ? '#1f2937' : '#6b7280',
                            fontWeight: conversation.unreadCount > 0 ? '500' : '400',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '200px'
                          }}>
                            {conversation.lastMessage.messageType === 'file' && '📎 '}
                            {conversation.lastMessage.content}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <div style={{
                              minWidth: '18px',
                              height: '18px',
                              borderRadius: '9px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              fontSize: '11px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginLeft: '8px'
                            }}>
                              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredConversations.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#6b7280'
                  }}>
                    <MessageSquare size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <p>No conversations found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {selectedConversation ? (
            <Card className="h-full flex flex-col">
              <CardHeader className='border-b border-gray-200'>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: getRoleColor(selectedConversation.participantRole),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {selectedConversation.participantName.substring(0, 2).toUpperCase()}
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: selectedConversation.isOnline ? '#22c55e' : '#94a3b8',
                        border: '2px solid white'
                      }} />
                    </div>
                    <div>
                      <h3 style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937'
                      }}>
                        {selectedConversation.participantName}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Badge variant={getRoleBadgeVariant(selectedConversation.participantRole)}>
                          {selectedConversation.participantRole}
                        </Badge>
                        {selectedConversation.propertyName && (
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>
                            📍 {selectedConversation.propertyName}
                          </span>
                        )}
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {selectedConversation.isOnline ? 'Online' :
                          `Last seen ${formatTime(selectedConversation.lastSeen || '')}`}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button size="sm" variant="outline" iconLeft={<Phone size={16} />} onClick={() => window.open(`tel:+1234567890`, '_self')}>
                      Call
                    </Button>
                    <Button size="sm" variant="outline" iconLeft={<Video size={16} />} onClick={() => window.open(`tel:+1234567890`, '_self')}>
                      Video
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-4 overflow-y-auto flex flex-col">
                <div style={{ flex: 1 }}>
                  {conversationMessages.map((message, index) => {
                    const isOwnMessage = message.senderId === currentUserId;
                    const showAvatar = index === 0 ||
                      conversationMessages[index - 1].senderId !== message.senderId;

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                          display: 'flex',
                          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                          marginBottom: '12px',
                          alignItems: 'flex-end',
                          gap: '8px'
                        }}
                      >
                        {!isOwnMessage && (
                          <div style={{
                            width: '32px',
                            height: '32px',
                            opacity: showAvatar ? 1 : 0,
                            pointerEvents: showAvatar ? 'auto' : 'none'
                          }}>
                            {showAvatar && (
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: getRoleColor(selectedConversation.participantRole),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                {selectedConversation.participantName.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                        )}

                        <div style={{
                          maxWidth: '70%',
                          padding: '10px 14px',
                          borderRadius: '18px',
                          backgroundColor: isOwnMessage ? '#2d5a41' : '#f1f5f9',
                          color: isOwnMessage ? 'white' : '#1f2937',
                          fontSize: '14px',
                          lineHeight: '1.4',
                          wordBreak: 'break-word',
                          position: 'relative'
                        }}>
                          {message.messageType === 'file' && message.attachment && (
                            <div style={{
                              padding: '8px',
                              backgroundColor: isOwnMessage ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <Paperclip size={16} />
                              <div>
                                <div style={{ fontWeight: '500', fontSize: '13px' }}>
                                  {message.attachment.name}
                                </div>
                                <div style={{ fontSize: '11px', opacity: 0.7 }}>
                                  {(message.attachment.size / 1024).toFixed(1)} KB
                                </div>
                              </div>
                            </div>
                          )}

                          {message.content}

                          <div style={{
                            fontSize: '11px',
                            opacity: 0.7,
                            marginTop: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                            gap: '4px'
                          }}>
                            {formatTime(message.timestamp)}
                            {isOwnMessage && (
                              <span>
                                {message.read ? (
                                  <CheckCheck size={12} style={{ color: '#22c55e' }} />
                                ) : (
                                  <Check size={12} />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <div style={{
                padding: '16px 20px',
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '12px'
                }}>
                  <button
                    onClick={() => { setMessageText(prev => prev + ' [Attachment] '); }}
                    style={{
                      padding: '8px',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Paperclip size={18} />
                  </button>

                  <div style={{
                    flex: 1,
                    position: 'relative',
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    border: '1px solid #d1d5db'
                  }}>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      rows={1}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        border: 'none',
                        borderRadius: '20px',
                        outline: 'none',
                        resize: 'none',
                        fontSize: '14px',
                        lineHeight: '1.4',
                        maxHeight: '120px',
                        backgroundColor: 'transparent'
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>

                  <button
                    onClick={() => { setMessageText(prev => prev + '👍'); }}
                    style={{
                      padding: '8px',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Smile size={18} />
                  </button>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    style={{
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      padding: '0',
                      backgroundColor: messageText.trim() ? '#2d5a41' : '#9ca3af'
                    }}
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div style={{ textAlign: 'center', color: '#6b7280' }}>
                <MessageSquare size={64} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Select a conversation</h3>
                <p>Choose a conversation from the sidebar to start messaging</p>
              </div>
            </Card>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showNewMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setShowNewMessage(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '600px',
                overflowY: 'auto'
              }}
            >
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                Start New Conversation
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Search contacts
                </label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="text"
                    placeholder="Search by name, email, or property..."
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Available Contacts
                </h4>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleStartConversation(contact)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginBottom: '8px',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: getRoleColor(contact.role),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {contact.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <span style={{ fontWeight: '500', color: '#1f2937' }}>
                              {contact.name}
                            </span>
                            <Badge variant={getRoleBadgeVariant(contact.role)}>
                              {contact.role}
                            </Badge>
                            {contact.isOnline && (
                              <Circle size={8} style={{ fill: '#22c55e', color: '#22c55e' }} />
                            )}
                          </div>
                          <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                            {contact.email} • {contact.phone}
                          </p>
                          {contact.propertyName && (
                            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                              📍 {contact.propertyName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button variant="outline" onClick={() => setShowNewMessage(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContacts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setShowContacts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '700px'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  All Contacts
                </h3>
                <Button variant="outline" onClick={() => setShowContacts(false)}>
                  Close
                </Button>
              </div>

              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginBottom: '8px',
                      border: '1px solid #e5e7eb',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: getRoleColor(contact.role),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        position: 'relative'
                      }}>
                        {contact.name.substring(0, 2).toUpperCase()}
                        {contact.isOnline && (
                          <div style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#22c55e',
                            border: '2px solid white'
                          }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '16px' }}>
                            {contact.name}
                          </span>
                          <Badge variant={getRoleBadgeVariant(contact.role)}>
                            {contact.role}
                          </Badge>
                          {contact.isOnline ? (
                            <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '500' }}>
                              Online
                            </span>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                              Offline
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>
                          📧 {contact.email}
                        </p>
                        <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>
                          📞 {contact.phone}
                        </p>
                        {contact.propertyName && (
                          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                            📍 {contact.propertyName}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button size="sm" variant="outline" iconLeft={<MessageSquare size={16} />} onClick={() => handleStartConversation(contact)}>
                          Message
                        </Button>
                        <Button size="sm" variant="outline" iconLeft={<Phone size={16} />} onClick={() => window.open(`tel:${contact.phone}`, '_self')}>
                          Call
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessagesPage;
