(function (global) {
  if (!global.SocketSDK) {
    console.error("❌ socket-chat-gui.js requires socket-sdk.js to be loaded first.");
    return;
  }

  class SocketChatGUI {
    constructor(options = {}) {
      this.chatId = options.chatId || "00000000-0000-0000-0000-000000000000";
      this.user = null;
      this.namespace = options.namespace || "/chat";
      this.sdk = new global.SocketSDK(this.namespace, options);
      this.userProfiles = new Map();
      this.connected = false;
      this.visible = false;
      this._createUI();
      this._bindUIEvents();
      this._connect();
    }

    _createUI() {

      this.toggleBtn = document.createElement("button");
      this.toggleBtn.id = `${this.chatId}-toggle`;
      Object.assign(this.toggleBtn.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "#007bff",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontSize: "20px",
        zIndex: 9999,
        boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
      });
      this.toggleBtn.textContent = "💬";
      document.body.appendChild(this.toggleBtn);

      this.container = document.createElement("div");
      this.container.id = this.chatId;
      Object.assign(this.container.style, {
        position: "fixed",
        bottom: "80px",
        right: "20px",
        width: "320px",
        height: "420px",
        background: "#1a1a1a",
        color: "#fff",
        borderRadius: "10px",
        border: "1px solid #333",
        padding: "0 5px",
        display: "none",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
        zIndex: 10000,
      });

      this.container.innerHTML = `
        <div id="${this.chatId}-title" style="background:#222;padding:6px;text-align:center;font-weight:bold;">
        </div>
        <div id="${this.chatId}-messages"
              style="
                flex:1;
                overflow-y:auto;
                padding:8px;
                background:#111;
                scrollbar-width: thin;        
                scrollbar-color: #444 #111; 
              ">
        </div>
        <div style="display:flex;align-items:center;border-top:1px solid #333;position:relative;">
            <button id="${this.chatId}-emoji-btn"
                style="padding:8px;background:none;border:none;color:#ffc107;cursor:pointer;font-size:18px;">😊</button>
      
            <div id="${this.chatId}-emoji-picker"
                style="display:none;position:absolute;bottom:45px;left:10px;background:#222;border:1px solid #333;border-radius:8px;padding:6px;font-size:20px;max-width:220px;flex-wrap:wrap;z-index:20000;">
            </div>
      
            <button id="${this.chatId}-file-btn"
                style="padding:8px;margin-right: 5px;background:none;border:none;color:#0d6efd;cursor:pointer;font-size:18px;">📎</button>
            <input id="${this.chatId}-file" type="file" style="display:none" />
      
            <textarea id="${this.chatId}-input" type="text"
                placeholder="Type a message..."
                style="flex:1;padding:8px;border:none;outline:none;background:#000;color:#fff;"></textarea>
            <button id="${this.chatId}-send"
                style="padding:8px 12px;font-size: 25px;background:none;border:none;color:#0d6efd;cursor:pointer;">➤</button>
        </div>
      `;
    
      document.body.appendChild(this.container);

      this.messagesEl = document.getElementById(`${this.chatId}-messages`);
      this.inputEl = document.getElementById(`${this.chatId}-input`);
      this.sendBtn = document.getElementById(`${this.chatId}-send`);
      this.emojiBtn = document.getElementById(`${this.chatId}-emoji-btn`);
      this.emojiPicker = document.getElementById(`${this.chatId}-emoji-picker`);
      this.fileBtn = document.getElementById(`${this.chatId}-file-btn`);
      this.fileInput = document.getElementById(`${this.chatId}-file`);
      this.roomName = document.getElementById(`${this.chatId}-title`);
    }

    _bindUIEvents() {
      this.toggleBtn.addEventListener("click", () => this._toggle());
      this.sendBtn.addEventListener("click", () => this._send());
      this.inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this._send();
        }
      });
      this.fileBtn.addEventListener("click", () => this.fileInput.click());
      this.fileInput.addEventListener("change", (e) => this._sendFile(e));  
      this.emojiBtn.addEventListener("click", () => this._toggleEmojiPicker());
      this.emojiPicker.addEventListener("click", (e) => {
        if (e.target.tagName === "SPAN") {
          this.inputEl.value += e.target.textContent;
          this.emojiPicker.style.display = "none";
        }
      });
    }

    _toggle() {
      this.visible = !this.visible;
      this.container.style.display = this.visible ? "flex" : "none";
      this.toggleBtn.style.background = this.visible ? "#dc3545" : "#007bff";
      this.toggleBtn.textContent = this.visible ? "✖" : "💬";
    }

    _toggleEmojiPicker() {
      const visible = this.emojiPicker.style.display === "flex";
      if (visible) {
        this.emojiPicker.style.display = "none";
        return;
      }
    
      const emojis = [
        "😀","😁","😂","🤣","😅","😊","😍","😘","😎","😢","😭","😡",
        "👍","👎","🙏","👏","💪","🔥","💯","🎉","❤️","💔","✨","🤔"
      ];
    
      this.emojiPicker.innerHTML = emojis
        .map(e => `<span style="cursor:pointer;padding:4px;">${e}</span>`)
        .join("");
    
      this.emojiPicker.style.display = "flex";
      this.emojiPicker.style.flexWrap = "wrap";
    }

    async _connect() {
      try {
        await this.sdk.connect();
        this.connected = true;
        this._log("✅ Connected to Chat Gateway");

        try {
          const res = await fetch("/api/user-app/auth/profile", { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            this.user = data?.data || null;
          }
        } catch {}

        if (!this.user) {
          this._log("❌ Failed to authenticate. Click 'Reconnect' to retry.");
          this._showReconnectButton();
          return;
        }

        this.sdk.on("joined_chat", async (data) => {
          this.chatId = data.id;
          this._log(`📦 Joined chat room: ${data.title}`);
          this.roomName.textContent = data.title;
          await this._loadMessages(data.id);
        });

        this.sdk.on("new_message", async (msg) => {
          this._message(msg);
        });

        const joinData = { chatId: this.chatId };
        if (this.user) joinData.userId = this.user?.userId;
        await this.sdk.emit("join_chat", joinData);
      } catch (err) {
        this._log(`❌ Connection failed: ${err.message}`);
        this._showReconnectButton();
      }
    }

    async _getUserProfile(userId){
      let profile = this.userProfiles.get(userId);
      if (!profile && userId) {
        try {
          const res = await fetch(`/api/users/${userId}/profile`, {
            method: "GET",
            credentials: "include",
          });
          if (res.ok) {
            const data = await res.json();
            const profiles = data?.data || [];
            if (profiles.length > 0) {
              profile = profiles[0];
              this.userProfiles.set(profile.userId, profile);
            }
          }
        } catch (err) {
          console.warn("⚠️ Failed to fetch user profile:", err.message);
        }
      }
      return profile;
    }

    _showReconnectButton() {

      if (this.reconnectBtn) {
        this.reconnectBtn.remove();
      }

      this.reconnectBtn = document.createElement("button");
      this.reconnectBtn.textContent = "Reconnect";
      Object.assign(this.reconnectBtn.style, {
        position: "fixed",
        bottom: "80px",
        right: "20px",
        zIndex: 10001,
        padding: "8px 16px",
        background: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      });

      this.reconnectBtn.addEventListener("click", () => {
        this.reconnectBtn.remove();
        this._connect();
      });

      document.body.appendChild(this.reconnectBtn);
    }

    // ✉️ Send chat message
    async _send() {
      const message = this.inputEl.value.trim();
      if (!message || !this.chatId) return;
      this.inputEl.value = "";
      try {
        const ack = await this.sdk.emit("send_message", { chatId: this.chatId, content: message }, 5000);
        if (!ack.ok) this._log("⚠️ Failed to deliver message");
      } catch {
        this._log("⚠️ Message send error");
      }
    }

    async _sendFile(event) {
      const file = event.target.files[0];
      if (!file) return;
    
      const formData = new FormData();
      formData.append("file", file);
      formData.append("chatId", this.chatId);
    
      try {
        // 1️⃣ Upload file to your backend
        const res = await fetch("/api/chat-app/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
    
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        const fileUrl = data?.data?.url || null;
    
        // 2️⃣ Send message event
        if (fileUrl) {
          await this.sdk.emit("send_message", {
            chatId: this.chatId,
            content: `[file] ${file.name}`,
            fileUrl,
          });
        }
    
        // 3️⃣ Local preview
        const msg = {
          senderId: this.user.userId,
          senderName: this.user.displayName || "Me",
          content: file.name,
          fileUrl,
        };
        this._message(msg);
    
      } catch (err) {
        this._log(`⚠️ File send failed: ${err.message}`);
      } finally {
        this.fileInput.value = ""; // reset input
      }
    }
  
    async _message(msg) {
      const isMe = msg.senderId === this.user.userId;
      const msgWrapper = document.createElement("div");
      msgWrapper.style.display = "grid";
      msgWrapper.style.gridTemplateColumns = isMe ? "1fr auto" : "auto 1fr";
      msgWrapper.style.alignItems = "start";
      msgWrapper.style.margin = "10px 0";
      msgWrapper.style.gap = "8px";

      const avatar = document.createElement("img");
      avatar.src = "/assets/images/butterfly-5.png";
      avatar.alt = msg.senderName;
      avatar.style.width = "32px";
      avatar.style.height = "32px";
      avatar.style.borderRadius = "50%";
      avatar.style.objectFit = "cover";
      avatar.style.margin = "auto 0 8px 0";
    
      const msgContent = document.createElement("div");
      msgContent.style.display = "flex";
      msgContent.style.flexDirection = "column";
      msgContent.style.alignItems = isMe ? "flex-end" : "flex-start";
      msgContent.style.maxWidth = "100%";
    
      const nameEl = document.createElement("div");
      nameEl.style.fontSize = "0.75rem";
      nameEl.style.fontWeight = "600";
      nameEl.style.color = "#aaa";
      nameEl.style.marginBottom = "2px";
      nameEl.textContent = msg.senderName || "Unknown";

      if (!isMe) {
        msgContent.appendChild(nameEl);
      }

      const bubble = document.createElement("div");
      if (msg.fileUrl) {
        const link = document.createElement("a");
        link.href = msg.fileUrl;
        link.target = "_blank";
        link.textContent = `📎 ${msg.content}`;
        link.style.color = "#0d6efd";
        bubble.appendChild(link);
      
        // optional: image preview
        if (/\.(jpg|jpeg|png|gif|webp)$/i.test(msg.fileUrl)) {
          const img = document.createElement("img");
          img.src = msg.fileUrl;
          img.style.maxWidth = "100%";
          img.style.borderRadius = "8px";
          img.style.marginTop = "4px";
          bubble.appendChild(img);
        }
      } else {
        bubble.textContent = msg.content;
        bubble.style.whiteSpace = "pre-wrap";
      }
      bubble.style.padding = "8px 12px";
      bubble.style.borderRadius = "10px";
      bubble.style.wordBreak = "break-word";
      bubble.style.background = isMe ? "#007bff" : "#333";
      bubble.style.color = "#fff";
      bubble.style.alignSelf = isMe ? "flex-end" : "flex-start";
      msgContent.appendChild(bubble);

      if (isMe) {
        msgWrapper.append(msgContent);
      } else {
        msgWrapper.append(avatar, msgContent);
      }
    
      this.messagesEl.appendChild(msgWrapper);
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;

      // this._getUserProfile(msg.senderId).then(profile =>{
      //   avatar.src = profile?.avatarUrl || "/assets/images/butterfly-5.png";
      //   avatar.alt = profile?.displayName || msg.senderName || "Unknown";
      //   nameEl.textContent = profile?.displayName || msg.senderName || "Unknown";
      // });
    }
    
    _log(text) {
      const html = `<div style="text-align:center;color:#aaa;margin:4px 0;font-size:12px;">${text}</div>`;
      this.messagesEl.insertAdjacentHTML("beforeend", html);
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    }

    async _loadMessages(chatId) {
      try {
        const res = await fetch(`/api/chat-app/chats/${chatId}/messages`, { credentials: "include" });
        if (!res.ok) return;

        const data = await res.json();
        const messages = data?.data || [];

        messages.forEach((msg) => {
          this._message(msg);
        });

      } catch (err) {
        this._log(`⚠️ Failed to load messages: ${err.message}`);
      }
    }
  }

  global.SocketChatGUI = SocketChatGUI;
})(typeof window !== "undefined" ? window : this);
