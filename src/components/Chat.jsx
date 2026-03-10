import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const Chat = () => {
    const { targetUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const user = useSelector(store => store.user);
    const userId = user?._id;
    const scrollRef = useRef(null);
    const socketRef = useRef(null); 

    const fetchChatMessages = async () => {
        try {
            const res = await axios.get(BASE_URL + "/chat/" + targetUserId, {
                withCredentials: true,
            });
            const chatMessages = res?.data?.messages.map(msg => ({
                firstName: msg.senderId?.firstName,
                lastName: msg.senderId?.lastName,
                text: msg.text,
            }));
            setMessages(chatMessages);
        } catch (err) {
            console.error("Error fetching messages", err);
        }
    };

    // Auto-scroll to bottom whenever messages change
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        fetchChatMessages();
    }, [targetUserId]);

    useEffect(() => {
        if (!userId) return;

        // Initialize socket once and store in ref
        const socket = createSocketConnection();
        socketRef.current = socket;

        socket.emit("joinChat", { userId, targetUserId });

        socket.on("messageReceived", ({ firstName, lastName, text }) => {
            setMessages((prev) => [...prev, { firstName, lastName, text }]);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId, targetUserId]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        // Use the existing socket connection from the ref
        socketRef.current.emit("sendMessage", {
            firstName: user.firstName,
            lastName: user.lastName,
            userId,
            targetUserId,
            text: newMessage,
        });
        
        setNewMessage(""); // Clear input after sending
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6 h-[85vh] flex flex-col">
            <div className="bg-slate-900 border border-slate-800 rounded-t-3xl p-5">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    Chat
                </h1>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-5 bg-slate-900/40 border-x border-slate-800 space-y-4 custom-scrollbar">
                {messages.map((msg, index) => {
                    const isMe = user.firstName === msg.firstName;
                    return (
                        <div key={index} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                            <div className="chat-header text-slate-500 text-xs mb-1">
                                {msg.firstName} {msg.lastName}
                            </div>
                            <div className={`chat-bubble text-sm font-medium ${isMe ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-200"}`}>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} /> {/* Hidden div to scroll into view */}
            </div>

            {/* Input Area */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-b-3xl flex items-center gap-3">
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-800 border-none text-white rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-500"
                />
                <button 
                    onClick={handleSendMessage} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
    );
};

export default Chat;