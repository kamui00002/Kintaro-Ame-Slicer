import UIKit
import WebKit

class ViewController: UIViewController {
    @IBOutlet weak var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        print("🎮 ViewController loaded")
        
        // WebViewの設定を強化
        webView.navigationDelegate = self
        webView.allowsBackForwardNavigationGestures = true
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.isOpaque = true
        webView.backgroundColor = UIColor.white
        webView.alpha = 1.0
        webView.isHidden = false
        
        // JavaScript設定
        webView.configuration.preferences.javaScriptEnabled = true
        webView.configuration.preferences.javaScriptCanOpenWindowsAutomatically = true
        webView.configuration.allowsInlineMediaPlayback = true
        webView.configuration.mediaTypesRequiringUserActionForPlayback = []
        
        // JavaScriptログ機能を追加
        let src = """
        window.addEventListener('error', e => window.webkit.messageHandlers.log.postMessage('JS ERROR: '+e.message));
        window.addEventListener('unhandledrejection', e => window.webkit.messageHandlers.log.postMessage('PROMISE: '+e.reason));
        console.log = (...a)=>window.webkit.messageHandlers.log.postMessage(a.join(' '));
        console.log('entry loaded');
        """
        webView.configuration.userContentController.addUserScript(WKUserScript(source: src, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        webView.configuration.userContentController.add(self, name: "log")
        
        // WebViewのサイズを強制設定
        setupWebViewConstraints()
        
        // 開発サーバーから読み込み
        loadGame()
    }
    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        
        // WebViewのサイズを確認
        print("📐 viewDidLayoutSubviews:")
        print("   - View frame: \(view.frame)")
        print("   - WebView frame: \(webView.frame)")
        print("   - WebView bounds: \(webView.bounds)")
        
        // もしWebViewのサイズが0なら、強制的に設定
        if webView.frame.width == 0 || webView.frame.height == 0 {
            print("⚠️ WebView size is 0, forcing layout...")
            webView.frame = view.bounds
            webView.setNeedsLayout()
            webView.layoutIfNeeded()
        }
    }
    
    private func setupWebViewConstraints() {
        // Auto Layoutを無効化
        webView.translatesAutoresizingMaskIntoConstraints = false
        
        // 既存の制約を削除
        webView.removeFromSuperview()
        view.addSubview(webView)
        
        // 新しい制約を設定
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
        
        // 強制的にレイアウトを更新
        view.setNeedsLayout()
        view.layoutIfNeeded()
        
        print("🔧 WebView constraints set:")
        print("   - Top: safeAreaLayoutGuide.topAnchor")
        print("   - Leading: view.leadingAnchor")
        print("   - Trailing: view.trailingAnchor")
        print("   - Bottom: view.bottomAnchor")
    }
    
    private func loadGame() {
        print("🎮 Loading game from local bundle...")
        
        // ローカルファイルから読み込み


        // 新しい行に変更
        if let url = Bundle.main.url(forResource: "game_final", withExtension: "html")  {
            print("📁 Loading from: \(url.path)")
            print("📁 Base URL: \(url.deletingLastPathComponent())")
            
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        } else {
            print("❌ index.html not found in bundle")
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
                <p>ローカルファイルから読み込んでいます</p>
                <p>しばらくお待ちください...</p>
            </div>
        </body>
        </html>
        """
        webView.loadHTMLString(htmlString, baseURL: nil)
    }
}

// MARK: - WKScriptMessageHandler
extension ViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        print("[WEB]", message.body)
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
        
        // WebViewの状態を確認
        print("🔍 WebView Debug Info:")
        print("   - Frame: \(webView.frame)")
        print("   - Bounds: \(webView.bounds)")
        print("   - Alpha: \(webView.alpha)")
        print("   - Hidden: \(webView.isHidden)")
        print("   - Opaque: \(webView.isOpaque)")
        print("   - Background: \(webView.backgroundColor?.description ?? "nil")")
        
        // デバッグ用：ページのタイトルを取得
        webView.evaluateJavaScript("document.title") { (result, error) in
            if let title = result as? String {
                print("📄 Page title: \(title)")
            }
        }
        
        // デバッグ用：ページの内容を確認
        webView.evaluateJavaScript("document.body.innerHTML.length") { (result, error) in
            if let length = result as? Int {
                print("📏 Page content length: \(length)")
            }
        }
        
        // 追加のデバッグ情報
        webView.evaluateJavaScript("document.getElementById('root').innerHTML") { (result, error) in
            if let rootContent = result as? String {
                print("🔍 Root content: \(rootContent.prefix(100))...")
            }
        }
        
        webView.evaluateJavaScript("document.body.children.length") { (result, error) in
            if let childrenCount = result as? Int {
                print("👶 Body children count: \(childrenCount)")
            }
        }
        
        // デバッグ用：ページの表示状態を確認
        webView.evaluateJavaScript("document.body.style.display") { (result, error) in
            if let display = result as? String {
                print("📱 Body display: \(display)")
            }
        }
        
        // デバッグ用：ページの可視性を確認
        webView.evaluateJavaScript("document.visibilityState") { (result, error) in
            if let visibility = result as? String {
                print("👁️ Visibility state: \(visibility)")
            }
        }
        
        // 強制的にWebViewを再描画
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            // サイズを再確認
            print("🔄 Final WebView check:")
            print("   - Frame: \(webView.frame)")
            print("   - Bounds: \(webView.bounds)")
            
            // 強制的に再描画
            webView.setNeedsDisplay()
            webView.setNeedsLayout()
            webView.frame = self.view.bounds
            print("🔄 WebView refresh triggered")
        }
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
