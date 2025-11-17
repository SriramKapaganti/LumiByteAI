// In-memory mock data and helpers
const sessions = {
// example: 'sess_1690000000000_0.1234': { id: '...', title: 'New chat', history: [...] }
};


function makeId() {
return 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}


function createNewSession() {
const id = makeId();
const now = new Date().toISOString();
sessions[id] = {
id,
title: `Chat ${now.slice(0, 19).replace('T', ' ')}`,
createdAt: now,
history: [
{
role: 'system',
text: 'This is a mock chat session. Use POST /api/chat/:id to push questions.'
}
]
};
return sessions[id];
}


function listSessions() {
return Object.values(sessions).map(s => ({ id: s.id, title: s.title, createdAt: s.createdAt }));
}


function getSession(id) {
return sessions[id] || null;
}


function addUserMessage(id, message) {
const session = getSession(id);
if (!session) return null;
session.history.push({ role: 'user', text: message, ts: new Date().toISOString() });
return session;
}


function addBotResponse(id, response) {
const session = getSession(id);
if (!session) return null;
session.history.push({ role: 'bot', ...response, ts: new Date().toISOString() });
return session;
}


function generateMockStructuredResponse(question) {
// Returns { text: '...', table: { columns: [...], rows: [...] } }
const text = `Mock answer for: "${question}"`;
// Example structured data for demos — change to fit question
const columns = ['Name', 'Category', 'Price', 'Rating'];
const rows = [
['Alpha Phone', 'Smartphone', '$499', '4.2'],
['Beta Phone', 'Smartphone', '$399', '4.0'],
['Gamma Tab', 'Tablet', '$299', '3.8']
];
return { text, table: { columns, rows } };
}


module.exports = { createNewSession, listSessions, getSession, addUserMessage, addBotResponse, generateMockStructuredResponse };