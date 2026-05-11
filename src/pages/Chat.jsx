import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/Api';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const initialUserId = searchParams.get('userId');

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await api.get('/users'); // Replace with your API endpoint
      setAllUsers(response.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data.conversations || []);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/messages/unread-count');
      setUnreadCount(response.data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  // Fetch messages with a specific user
  const fetchMessagesWithUser = async (otherUserId) => {
    try {
      const response = await api.get(`/messages/with/${otherUserId}`);
      setMessages(response.data.messages || []);
      setSelectedUser(response.data.otherUser);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
    fetchAllUsers();
  }, []);

  // Load messages if initialUserId is provided
  useEffect(() => {
    if (initialUserId) {
      fetchMessagesWithUser(initialUserId);
    }
  }, [initialUserId]);

  // Handle selecting a user to chat with
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessagesWithUser(user._id);
    setShowUserList(false);
    setSearchQuery('');
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setSending(true);
    try {
      await api.post('/messages', {
        receiverId: selectedUser._id,
        content: newMessage,
      });

      setNewMessage('');
      fetchMessagesWithUser(selectedUser._id);
      fetchConversations();
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Filter users for the dropdown
  const filteredUsers = allUsers.filter(
    (user) =>
      user._id !== userId &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return <div className="p-8 text-center">Loading conversations...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[80vh]">
      <div className="flex gap-6 h-full">
        {/* Conversations Sidebar */}
        <div className="w-full md:w-1/3 card overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pt-4 pb-2">
            <h2 className="text-2xl font-bold text-primary">Conversations</h2>
            {/* Start New Conversation Button */}
            <button
              onClick={() => setShowUserList(!showUserList)}
              className="btn-primary text-sm px-3 py-1"
            >
              New Chat
            </button>
          </div>

          {/* User Search Dropdown */}
          {showUserList && (
            <div className="mb-4 bg-white border rounded-lg shadow-lg p-2">
              <input
                type="text"
                placeholder="Search users..."
                className="input-field w-full mb-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="max-h-60 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded"
                    >
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-2">No users found</p>
                )}
              </div>
            </div>
          )}

          {/* Unread Count */}
          {unreadCount > 0 && (
            <div className="text-center mb-2">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                {unreadCount} unread
              </span>
            </div>
          )}

          {/* Conversations List */}
          {conversations.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No conversations yet</p>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => handleSelectUser(conv.user)}
                  className={`w-full text-left p-4 rounded-lg transition ${
                    selectedUser?._id === conv.user._id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{conv.user.name}</p>
                      <p className={`text-sm truncate ${selectedUser?._id === conv.user._id ? 'text-white' : 'text-gray-600'}`}>
                        {conv.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-col w-2/3 card">
          {selectedUser ? (
            <>
              {/* Selected User Header */}
              <div className="border-b pb-4 mb-4">
                <h3 className="text-xl font-bold text-primary">{selectedUser.name}</h3>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Start a conversation with {selectedUser.name}
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${msg.senderId?._id === userId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.senderId?._id === userId
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.senderId?._id === userId ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Type a message..."
                  disabled={sending}
                />
                <button
                  type="submit"
                  className="btn-primary disabled:opacity-50"
                  disabled={sending || !newMessage.trim()}
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">
                {showUserList ? 'Select a user to start chatting' : 'Select a conversation to start messaging'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
