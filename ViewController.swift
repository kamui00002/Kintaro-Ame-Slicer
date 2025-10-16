import UIKit
import WebKit

class ViewController: UIViewController {
    @IBOutlet weak var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        print("🎮 ViewController loaded")
        
        // WebViewの設定
        webView.navigationDelegate = self
        webView.allowsBackForwardNavigationGestures = true
        
        // 開発サーバーから読み込み
        loadGame()
    }
    
    private func loadGame() {
        print("🎮 Loading game from local bundle...")

        // ローカルファイルから読み込み
        if let url = Bundle.main.url(forResource: "game_ultimate", withExtension: "html") {
            print("📁 Loading from: \(url.path)")
            print("📁 Base URL: \(url.deletingLastPathComponent())")

            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        } else {
            print("❌ game_complete.html not found in bundle")
            showError()
        }
    }
    
    private func showError() {
        let htmlString = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>金太郎飴スライサー</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    text-align: center; 
                    padding: 20px;
                    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
                    margin: 0;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                h1 { 
                    color: #333; 
                    font-size: 2.5em; 
                    margin-bottom: 30px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                }
                p { 
                    color: #666; 
                    font-size: 1.2em; 
                    margin: 15px 0;
                    line-height: 1.6;
                }
                .error {
                    background: rgba(255,255,255,0.8);
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    max-width: 400px;
                }
                .loading { 
                    width: 60px; 
                    height: 60px; 
                    border: 6px solid #f3f3f3; 
                    border-top: 6px solid #ff6b6b; 
                    border-radius: 50%; 
                    animation: spin 1s linear infinite; 
                    margin: 20px auto;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <div class="error">
                <h1>🍭 金太郎飴スライサー</h1>
                <div class="loading"></div>
                <p>ゲームを読み込み中...</p>
                <p>開発サーバーに接続しています</p>
                <p><strong>URL:</strong> http://localhost:3000</p>
                <p>しばらくお待ちください...</p>
            </div>
        </body>
        </html>
        """
        webView.loadHTMLString(htmlString, baseURL: nil)
    }
}

// MARK: - WKNavigationDelegate
extension ViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("🚀 WebView started loading")
    }
    
    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        print("📝 WebView committed navigation")
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("✅ WebView loaded successfully!")
        print("🎮 Game should be visible now")
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("❌ WebView failed to load: \(error.localizedDescription)")
        showError()
    }
    
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        print("❌ WebView failed provisional navigation: \(error.localizedDescription)")
        showError()
    }
}