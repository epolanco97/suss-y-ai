import * as vscode from 'vscode';
import * as path from 'path'; 

export function activate(context: vscode.ExtensionContext) {
    console.log('Extensión activada');
    
    const provider = new ChatSidebarProvider(context.extensionUri);
    
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            "chatView",
            provider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true
                }
            }
        )
    );
}

export function deactivate() {}

class ChatSidebarProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
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
	private getHtmlContent(webview: vscode.Webview): string {
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