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
        // まず "index" を試す
        if let htmlPath = Bundle.main.path(forResource: "index", ofType: "html") {
            let htmlURL = URL(fileURLWithPath: htmlPath)
            let htmlDirectory = htmlURL.deletingLastPathComponent()
            webView.loadFileURL(htmlURL, allowingReadAccessTo: htmlDirectory)
            print("Loading index.html from: \(htmlPath)")
            return
        }
        
        // "index 2" を試す
        if let htmlPath = Bundle.main.path(forResource: "index 2", ofType: "html") {
            let htmlURL = URL(fileURLWithPath: htmlPath)
            let htmlDirectory = htmlURL.deletingLastPathComponent()
            webView.loadFileURL(htmlURL, allowingReadAccessTo: htmlDirectory)
            print("Loading index 2.html from: \(htmlPath)")
            return
        }
        
        // フォールバック: 簡単なHTMLを表示
        print("HTML file not found, using fallback")
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
            <p>HTMLファイルが見つかりませんでした。</p>
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
