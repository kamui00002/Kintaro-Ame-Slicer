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
        guard let htmlPath = Bundle.main.path(forResource: "index", ofType: "html") else {
            print("HTML file not found")
            return
        }
        
        let htmlURL = URL(fileURLWithPath: htmlPath)
        let htmlDirectory = htmlURL.deletingLastPathComponent()
        
        // ローカルファイルを読み込み
        webView.loadFileURL(htmlURL, allowingReadAccessTo: htmlDirectory)
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
