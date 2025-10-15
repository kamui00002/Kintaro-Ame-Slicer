import UIKit
import WebKit

class ViewController: UIViewController {
    @IBOutlet weak var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // WebViewの設定
        webView.navigationDelegate = self
        webView.allowsBackForwardNavigationGestures = true
        
        // ローカルHTMLファイルを読み込み
        loadLocalHTML()
    }
    
    private func loadLocalHTML() {
        // 開発サーバーから直接読み込み
        let devServerURL = "http://192.168.0.12:3000"
        if let url = URL(string: devServerURL) {
            let request = URLRequest(url: url)
            webView.load(request)
            print("Loading from development server: \(devServerURL)")
            return
        }
        
        // フォールバック: 簡単なHTMLを表示
        print("Using fallback HTML")
        let htmlString = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>金太郎飴スライサー</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 50px;
                    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
                }
                h1 { color: #333; font-size: 2em; }
                p { color: #666; font-size: 1.2em; }
            </style>
        </head>
        <body>
            <h1>金太郎飴スライサー</h1>
            <p>ゲームを読み込み中...</p>
            <p>開発サーバーに接続中...</p>
        </body>
        </html>
        """
        webView.loadHTMLString(htmlString, baseURL: nil)
    }
}

// MARK: - WKNavigationDelegate
extension ViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("WebView loaded successfully")
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("WebView failed to load: \(error.localizedDescription)")
    }
}
