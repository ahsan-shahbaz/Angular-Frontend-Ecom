import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../core/services/ai.service';
import { animate, style, transition, trigger } from '@angular/animations';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-assistant-wrapper">
      <!-- Floating Button -->
      <button class="chat-toggle-btn" (click)="toggleChat()" [class.active]="isOpen()">
        <i class="fas" [class.fa-robot]="!isOpen()" [class.fa-times]="isOpen()"></i>
      </button>

      <!-- Chat Window -->
      <div class="chat-window" *ngIf="isOpen()" @slideInOut>
        <div class="chat-header">
          <div class="header-info">
            <div class="avatar">
              <i class="fas fa-robot"></i>
              <span class="status-dot"></span>
            </div>
            <div>
              <h3>Shop Assistant</h3>
              <p>Online | Local AI</p>
            </div>
          </div>
        </div>

        <div class="chat-messages" #scrollContainer>
          <div *ngFor="let msg of messages()" 
               [class]="msg.isUser ? 'message user' : 'message bot'"
               [@messageIn]>
            <div class="message-content">
              {{ msg.text }}
            </div>
            <span class="timestamp">{{ msg.timestamp | date:'shortTime' }}</span>
          </div>
          
          <div class="message bot typing" *ngIf="isTyping()">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <input type="text" 
                 [(ngModel)]="userInput" 
                 (keyup.enter)="sendMessage()"
                 placeholder="Ask me anything..."
                 [disabled]="isTyping()">
          <button (click)="sendMessage()" [disabled]="!userInput.trim() || isTyping()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ai-assistant-wrapper {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 1000;
      font-family: 'Inter', sans-serif;
    }

    .chat-toggle-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .chat-toggle-btn:hover {
      transform: scale(1.1) rotate(5deg);
    }

    .chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 380px;
      height: 550px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
    }

    .chat-header {
      padding: 1.5rem;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      color: white;
    }

    .header-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .avatar {
      position: relative;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .status-dot {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 10px;
      height: 10px;
      background: #10b981;
      border: 2px solid white;
      border-radius: 50%;
    }

    .chat-header h3 { margin: 0; font-size: 1.1rem; }
    .chat-header p { margin: 0; font-size: 0.8rem; opacity: 0.8; }

    .chat-messages {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message {
      max-width: 80%;
      padding: 0.8rem 1.2rem;
      border-radius: 18px;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .message.user {
      align-self: flex-end;
      background: #6366f1;
      color: white;
      border-bottom-right-radius: 4px;
    }

    .message.bot {
      align-self: flex-start;
      background: #f3f4f6;
      color: #1f2937;
      border-bottom-left-radius: 4px;
    }

    .timestamp {
      font-size: 0.7rem;
      opacity: 0.5;
      margin-top: 4px;
      display: block;
    }

    .chat-input {
      padding: 1.25rem;
      display: flex;
      gap: 0.75rem;
      background: white;
      border-top: 1px solid #f3f4f6;
    }

    .chat-input input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      outline: none;
      transition: border-color 0.2s;
    }

    .chat-input input:focus { border-color: #6366f1; }

    .chat-input button {
      background: #6366f1;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 12px;
      cursor: pointer;
    }

    /* Typing Indicator Animation */
    .typing-indicator span {
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #9ca3af;
      border-radius: 50%;
      margin: 0 2px;
      animation: bounce 1.4s infinite ease-in-out both;
    }
    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }
  `],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 }))
      ])
    ]),
    trigger('messageIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class AiAssistantComponent implements AfterViewChecked {
  private aiService = inject(AiService);
  
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = signal(false);
  isTyping = signal(false);
  userInput = '';
  messages = signal<Message[]>([
    { text: 'Hello! I am your AI shop assistant. How can I help you today?', isUser: false, timestamp: new Date() }
  ]);

  toggleChat() {
    this.isOpen.update(v => !v);
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMsg = this.userInput;
    this.userInput = '';
    
    this.messages.update(prev => [...prev, {
      text: userMsg,
      isUser: true,
      timestamp: new Date()
    }]);

    this.isTyping.set(true);

    this.aiService.chat(userMsg).subscribe({
      next: (res) => {
        this.messages.update(prev => [...prev, {
          text: res.response,
          isUser: false,
          timestamp: new Date()
        }]);
        this.isTyping.set(false);
      },
      error: () => {
        this.messages.update(prev => [...prev, {
          text: "I'm sorry, I'm having trouble connecting to my brain. Is the Ollama service running?",
          isUser: false,
          timestamp: new Date()
        }]);
        this.isTyping.set(false);
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch(err) {}
    }
  }
}
