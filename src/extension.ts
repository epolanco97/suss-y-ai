import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';


export function activate(context: vscode.ExtensionContext) {
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

class ChatSidebarProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {
    }

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
                case 'createFile':
                    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
                    if (workspaceFolder) {
                        const timestamp = new Date().getTime();
                        const fileName = `generated_code_${timestamp}.${data.language}`;
                        const filePath = vscode.Uri.joinPath(workspaceFolder.uri, fileName);

                        vscode.workspace.fs.writeFile(filePath, Buffer.from(data.content))
                            .then(() => {
                                vscode.window.showInformationMessage(`Archivo creado: ${fileName}`);
                                vscode.workspace.openTextDocument(filePath)
                                    .then(doc => vscode.window.showTextDocument(doc));
                            });
                    }
                    break;
            }
        });
    }

    private getHtmlContent(webview: vscode.Webview): string {
        const htmlPath = path.join(__dirname, '..', 'src', 'features', 'chat', 'presentation','index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');

        const chatCssUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'features', 'chat', 'presentation', 'index.css'));
        const chatJsUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'features', 'chat', 'presentation', 'index.ts'));

        return htmlContent
            .replace('{{CSS_URI}}', chatCssUri.toString())
            .replace('{{JS_URI}}', chatJsUri.toString());
    }

}