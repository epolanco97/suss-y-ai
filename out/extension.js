"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
function activate(context) {
    console.log('Extensión activada');
    const provider = new ChatSidebarProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("chatView", provider, {
        webviewOptions: {
            retainContextWhenHidden: true
        }
    }));
}
function deactivate() { }
class ChatSidebarProvider {
    _extensionUri;
    _view;
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this.getHtmlContent(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.command) {
                case 'sendMessage':
                    webviewView.webview.postMessage({
                        command: 'receiveMessage',
                        text: data.text,
                        isAi: true
                    });
                    break;
            }
        });
    }
    getHtmlContent(webview) {
        const chatCssPath = path.join(__dirname, '..', 'src', 'presentation', 'css', 'chat.css');
        const chatCssUri = webview.asWebviewUri(vscode.Uri.file(chatCssPath));
        console.log(chatCssUri.path);
        return `
			<!DOCTYPE html>
		<html lang="es">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
				<link rel="stylesheet" href="${chatCssUri.path}">
			</head>
			<body>
				<div id="chat-container">
					<div id="chat-box"></div>
					<div class="input-container">
						<textarea 
							id="user-input" 
							rows="1"
							placeholder="Escribe un mensaje..."
						></textarea>
						<button id="send-button">
							<i class="fas fa-paper-plane"></i>
						</button>
					</div>
				</div>	
				<script src="./presentation/js/chat.js"></script>
			</body>
	</html>
		`;
    }
}
//# sourceMappingURL=extension.js.map